import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Text,
  FormatNumber,
  Group,
  InputAddon,
  Input,
  Skeleton,
  HStack,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@components/ui/pagination";
import { toaster, Toaster } from "@components/ui/toaster";
import { usePrepaidContext } from "@context/clousing/prepaidClousingContext";
import { useFooter } from "@context/home/footerClousingContext";
import { useHeaders } from "@context/home/headerContext";
import {
  CouponCatalogModel,
  PrepaidLineModel,
  PrepaidModel,
} from "@models/prepaid.model";
import { CLOUSING_KEY } from "@models/constants.model";
import { TotalModel } from "@models/common.clousing.model";
import { getCustomersPrepaid } from "@services/catalogService";
import { TableInput } from "@components/NumericInput";
import FilterCustomer from "@components/FilterCustomer";
import DialogCoupons from "./DialogCoupons";
import Loading from "@components/Loading";
import { v4 as uuidv4 } from "uuid";


const pageSize = 10;

function PrepaidClousing({ data, subsidiaryId, cdc }: any) {
  const [prepaid, setPrepaid] = useState<PrepaidModel>({} as PrepaidModel);
  const [coupons, setCoupons] = useState<CouponCatalogModel[]>([]);
  const [customers, setCustomers] = useState<{ value: number; label: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [loadingAdded, setLoadingAdded] = useState(false);

  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<PrepaidLineModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponsList, setCouponsList] = useState<CouponCatalogModel[]>([]);
  const [client, setClient] = useState("");

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { getPrepaidData, getCouponData, setPrepaidData } = usePrepaidContext();

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  // Helpers
  const getCouponPhysicalValue = (coupons: CouponCatalogModel[]) =>
    coupons.filter(c => !c.isExpired).reduce((acc, c) => acc + c.amount, 0);

  const handleToast = (message: string, type: "error" | "warning" | "success") => {
    toaster.create({
      title: message,
      description: "",
      type,
      duration: 2500,
    });
    setLoadingAdded(false);
  };

  const updateData = (updatePrepaid: PrepaidLineModel[]) => {
    const newTotalFisico = updatePrepaid.reduce((sum, i) => sum + i.physical, 0);
    const newDifference = prepaid.total.totalPOS - newTotalFisico;

    const newTotal: TotalModel = {
      totalPOS: prepaid.total.totalPOS,
      totalPhysical: newTotalFisico,
      difference: newDifference,
    };

    const updated: PrepaidModel = { ...prepaid, total: newTotal, lines: updatePrepaid };
    setPrepaid(updated);
    setPrepaidData(data.id, updated);

    updateTotal(newDifference >= 0 ? newTotalFisico : prepaid.total.totalPOS, data.id, CLOUSING_KEY.PREPAID);
    setFooterData(newTotal, data.id, CLOUSING_KEY.PREPAID);
    setVisibleItems(updatePrepaid.slice(startRange, endRange));
  };

  // Carga inicial
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const prepaidData = await getPrepaidData(data?.id, data?.closingStartDate);
      const couponsList = await getCouponData(cdc, data?.closingStartDate);
      const customersApi = await getCustomersPrepaid();
      
      setPrepaid(prepaidData);
      setCoupons(couponsList);
      setCustomers(customersApi);

      if (prepaidData?.total) setFooterData(prepaidData.total, data.id, CLOUSING_KEY.PREPAID);

      updateTotal(
        prepaidData.total.difference < 0
          ? prepaidData.total.totalPOS
          : prepaidData.total.totalPhysical,
        data.id,
        CLOUSING_KEY.PREPAID
      );

      setVisibleItems(prepaidData?.lines?.slice(startRange, endRange) || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Paginación
  useEffect(() => {
    setPage(page);
    setVisibleItems(prepaid?.lines?.slice(startRange, endRange) || []);
  }, [page, prepaid]);

  // Ingreso de cupones
  const handleCoupon = (coupon: string) => {
    if (!coupon) return;
    setLoadingAdded(true);

    const couponModel = coupons.find(c => c.barCode === coupon);
    if (!couponModel) return handleToast("Cupón inválido", "error");

    let clientLine = prepaid.lines.find(l =>
      l.client?.toLowerCase() === couponModel.clientCustom.toLowerCase()
    );

    if (!clientLine) {
      clientLine = { 
        id: uuidv4(),
        quantity: 1,
        supplementsQuantity: 0,
        unitPrice: couponModel.amount,
        client: couponModel.clientCustom,
        physical: couponModel.amount,
        totalPOS: couponModel.amount * 1,
        difference: 0,
        coupons: [],
        edit: false,
        ticketId: couponModel.id
      };
      prepaid.lines.push(clientLine);
    }

    clientLine.coupons ??= [];
    if (clientLine.coupons.some(c => c.folioCustom === couponModel.folioCustom)) {
      return handleToast("Cupón duplicado", "warning");
    }

    if (clientLine.coupons.length && clientLine.coupons[0].amount !== couponModel.amount) {
      return handleToast("Monto diferente", "warning");
    }

    clientLine.coupons.push(couponModel);

    const couponPhysicalValue = getCouponPhysicalValue(clientLine.coupons);
    const supplementsValue = (clientLine.supplementsQuantity || 0) * (clientLine.unitPrice || 0);
    const newTotalFisico = couponPhysicalValue + supplementsValue;

    const updatePrepaid = prepaid.lines.map(l =>
      l.id === clientLine!.id
        ? { ...clientLine!,
          quantity: clientLine!.coupons.filter(c => !c.isExpired).length,
          physical: newTotalFisico,
          totalPOS: clientLine!.coupons.filter(c => !c.isExpired).length * (clientLine?.totalPOS || 0),
          difference: (clientLine!.totalPOS || 0) - newTotalFisico,
          edit: clientLine!.coupons.some(c => c.isExpired) || (clientLine!.supplementsQuantity ?? 0) > 0 }
        : l
    );

    handleToast(couponModel.isExpired ? "Cupón vencido" : "Cupón válido", couponModel.isExpired ? "warning" : "success");
    updateData(updatePrepaid);
    setLoadingAdded(false);
  };

  function handleInputTextData(
    id: number | string,
    value: string,
    key?: string
  ) {
    value = value.replace(/[^\d.]/g, "");

    // Find the item that needs to be updated
    const itemToUpdate = prepaid.lines.find((item) => item.id === id);
    if (!itemToUpdate) return;

    // Get the numeric value from the input
    const numericValue = parseFloat(value) || 0;

    // Calculate the new physical value - adding existing physical value from coupons
    // plus the value from supplements * unitPrice
    const couponPhysicalValue =
      itemToUpdate.coupons
        ?.filter((coupon) => coupon.isExpired === false)
        ?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    const updatePrepaid = prepaid.lines.map((item: PrepaidLineModel) =>
      item.id === id
        ? {
            ...item,
            [key!]: numericValue,
            supplementsQuantity:
              key === "supplementsQuantity"
                ? numericValue
                : item.supplementsQuantity,
            unitPrice: key === "unitPrice" ? numericValue : item.unitPrice,
            physical:
              couponPhysicalValue +
              (key === "unitPrice"
                ? item.supplementsQuantity * numericValue
                : numericValue * item.unitPrice),
            difference:
              item.totalPOS -
              (couponPhysicalValue +
                (key === "unitPrice"
                  ? item.supplementsQuantity * numericValue
                  : numericValue * item.unitPrice)),
          }
        : item
    );

    updateData(updatePrepaid);
  }

  return (
    <Box>
      <Toaster />
      <Group attached mb={4}>
        <InputAddon>Código de Barras</InputAddon>
        <Skeleton loading={loadingAdded}>
          <Input
            placeholder="Código de Barras"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCoupon(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
            disabled={data?.closingConfirmation}
          />
        </Skeleton>
      </Group>

      {/* Tabla */}
      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              {["Cliente","Cantidad","Cant. Complementos","Precio unitario","Total POS","Total físico","Diferencia"].map(h => (
                <Table.ColumnHeader key={h} textAlign="center">{h}</Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleItems.map(item => (
              <Table.Row key={item.id}>
                {/* Cliente */}
                <Table.Cell textAlign="center">
                  <FilterCustomer
                    disabled={data?.closingConfirmation || item.coupons.length > 0}
                    customers={customers}
                    customerSelect={item.client ?? ""}
                    label={false}
                    onSelect={(customer) => {
                      const updated = prepaid.lines.map(l => l.id === item.id
                        ? { ...l, client: customer.label, clientId: customer.value, unitPrice: 0, supplementsQuantity: 0, physical: 0, difference: 0, quantity: 0, coupons: [], edit: false }
                        : l
                      );
                      updateData(updated);
                    }}
                  />
                </Table.Cell>

                {/* Cantidad */}
                <Table.Cell textAlign="center">
                  {item.coupons.some(c => !c.isExpired)
                    ? <Text as="span" cursor="pointer" textDecoration="underline" color="blue.500" onClick={() => { setIsOpen(true); setClient(item.client ?? ""); setCouponsList(item.coupons.filter(c => !c.isExpired)); }}>
                        <FormatNumber value={item.quantity} />
                      </Text>
                    : <FormatNumber value={item.quantity} />}
                </Table.Cell>

                {/* Complementos */}
                <Table.Cell textAlign="center">
                  {!item.edit
                    ? <FormatNumber value={item.supplementsQuantity} />
                    : <TableInput value={item.supplementsQuantity} id={item.id} currency={false} keyValue="supplementsQuantity" onChange={() => {handleInputTextData}} disabled={data?.closingConfirmation} />}
                </Table.Cell>

                {/* Precio */}
                <Table.Cell textAlign="end"><FormatNumber value={item.unitPrice} style="currency" currency="USD" /></Table.Cell>

                {/* Totales */}
                {[item.totalPOS, item.physical, item.difference].map((val, idx) => (
                  <Table.Cell key={idx} textAlign="end"><FormatNumber value={val} style="currency" currency="USD" /></Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Paginación */}
      <PaginationRoot count={prepaid?.lines?.length ?? 0} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)}>
        <HStack><PaginationPrevTrigger /><PaginationItems /><PaginationNextTrigger /></HStack>
      </PaginationRoot>

      {/* Diálogo */}
      <DialogCoupons coupons={couponsList} isOpen={isOpen} onClose={() => setIsOpen(false)} client={client} />

      {loading && <Box position="fixed" top="50%" left="50%" zIndex={1000}><Loading /></Box>}
    </Box>
  );
}

export default PrepaidClousing;
