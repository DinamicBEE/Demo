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
  Button,
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
import { CLOUSING_KEY } from "@models/common.const";
import { TotalModel } from "@models/common.clousing.model";
import { TableInput } from "@components/NumericInput";
import DialogCoupons from "./DialogCoupons";
import Loading from "@components/Loading";
import { v4 as uuidv4 } from "uuid";
import PrepaidNewCustomer from "./PrepaidNewCustomer";

const pageSize = 10;

function PrepaidClousing({ data, subsidiaryId, cdc }: any) {
  const [prepaid, setPrepaid] = useState<PrepaidModel>({} as PrepaidModel);
  const [coupons, setCoupons] = useState<CouponCatalogModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingAdded, setLoadingAdded] = useState(false);

  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<PrepaidLineModel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [couponsList, setCouponsList] = useState<CouponCatalogModel[]>([]);
  const [client, setClient] = useState("");

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { getPrepaidData, getCouponData, setPrepaidData } = usePrepaidContext();

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  // Helpers
  const getCouponPhysicalValue = (coupons: CouponCatalogModel[]) =>
    coupons.filter((c) => !c.isExpired).reduce((acc, c) => acc + c.amount, 0);

  const handleToast = (
    message: string,
    type: "error" | "warning" | "success"
  ) => {
    toaster.create({
      title: message,
      description: "",
      type,
      duration: 2500,
    });
    setLoadingAdded(false);
  };

  const updateData = (updatePrepaid: PrepaidLineModel[]) => {
    const newTotalComp = updatePrepaid.reduce(
      (sum, i) => sum + (i.supplementsQuantity || 0) * (i.unitPrice || 0),
      0
    );
    const newTotalFisico = updatePrepaid.reduce(
      (sum, i) => sum + i.physical,
      0
    );
    const newDifference =
      (newTotalFisico + newTotalComp) - prepaid.total.totalPOS;
    const newTotal: TotalModel = {
      totalPOS: prepaid.total.totalPOS,
      totalPhysical: newTotalFisico + newTotalComp,
      difference: newDifference,
    };

    const updated: PrepaidModel = {
      ...prepaid,
      total: newTotal,
      lines: updatePrepaid,
    };
    setPrepaid(updated);
    setPrepaidData(data.id, updated);

    updateTotal(
      newDifference >= 0 ? newTotalFisico : prepaid.total.totalPOS,
      data.id,
      CLOUSING_KEY.PREPAID
    );
    setFooterData(newTotal, data.id, CLOUSING_KEY.PREPAID);
    setVisibleItems(updatePrepaid.slice(startRange, endRange));
  };

  // Carga inicial
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const prepaidData = await getPrepaidData(
        data?.id,
        data?.closingStartDate
      );
      const couponsList = await getCouponData(cdc, data?.closingStartDate);

      setPrepaid(prepaidData);
      setCoupons(couponsList);

      if (prepaidData?.total)
        setFooterData(prepaidData.total, data.id, CLOUSING_KEY.PREPAID);

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

    const couponModel = coupons.find((c) => c.barCode === coupon);
    if (!couponModel) return handleToast("Cupón inválido", "error");

    let clientLine = prepaid.lines.find(
      (l) =>
        l.client?.toLowerCase() === couponModel.clientCustom.toLowerCase() &&
        l.isEdit === false
    );

    if (!clientLine) {
      clientLine = {
        id: uuidv4(),
        quantity: 1,
        supplementsQuantity: 0,
        unitPrice: couponModel.amount,
        client: couponModel.clientCustom.toLocaleUpperCase(),
        physical: couponModel.amount,
        totalPOS: couponModel.amount * 1,
        difference: 0,
        coupons: [],
        isEdit: false,
        ticketId: couponModel.id,
      };
      prepaid.lines.push(clientLine);
    }

    clientLine.coupons ??= [];
    if (
      clientLine.coupons.some((c) => c.folioCustom === couponModel.folioCustom)
    ) {
      return handleToast("Cupón duplicado", "warning");
    }

    if (
      clientLine.coupons.length &&
      clientLine.coupons[0].amount !== couponModel.amount
    ) {
      return handleToast("Monto diferente", "warning");
    }

    clientLine.coupons.push(couponModel);

    const couponPhysicalValue = getCouponPhysicalValue(clientLine.coupons);
    const supplementsValue =
      (clientLine.supplementsQuantity || 0) * (clientLine.unitPrice || 0);
    const newTotalFisico = couponPhysicalValue + supplementsValue;

    const updatePrepaid = prepaid.lines.map((l) =>
      l.id === clientLine!.id
        ? {
            ...clientLine!,
            quantity: clientLine!.coupons.filter((c) => !c.isExpired).length,
            physical: newTotalFisico,
            totalPOS:
              clientLine!.coupons.filter((c) => !c.isExpired).length *
              (clientLine?.totalPOS || 0),
            difference:  newTotalFisico - (clientLine!.totalPOS || 0),
            edit:
              clientLine!.coupons.some((c) => c.isExpired) ||
              (clientLine!.supplementsQuantity ?? 0) > 0,
          }
        : l
    );

    handleToast(
      couponModel.isExpired ? "Cupón vencido" : "Cupón válido",
      couponModel.isExpired ? "warning" : "success"
    );
    updateData(updatePrepaid);
    setLoadingAdded(false);
  };

  function handleNewCustomer(line: PrepaidLineModel) {
    const updatePrepaid = [...prepaid.lines, line];
    updateData(updatePrepaid);
    setIsNewCustomerOpen(false);
  }

  /* refactor */
  function handleInputTextData(
    id: number | string,
    value: string,
    key?: string
  ) {
    value = value.replace(/[^\d.]/g, "");

    const itemToUpdate = prepaid.lines.find((item) => item.id === id);
    if (!itemToUpdate) return;

    const numericValue = parseFloat(value) || 0;

    const updatePrepaid = prepaid.lines.map((item: PrepaidLineModel) =>
      item.id === id
        ? {
            ...item,
            [key!]: numericValue,
            supplementsQuantity: numericValue,
          }
        : item
    );

    updateData(updatePrepaid);
  }

  return (
    <Box>
      <Toaster />
      <HStack justifyContent={"space-between"}>
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

        <Button
          colorPalette="green.400"
          onClick={() => setIsNewCustomerOpen(true)}
          disabled={data?.closingConfirmation}
        >
          Agregar Complementario
        </Button>
      </HStack>

      {/* Tabla */}
      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              {[
                "Cliente",
                "Cantidad",
                "Cant. Complementos",
                "Precio unitario",
                "Total POS",
                "Total físico",
                "Diferencia",
              ].map((h) => (
                <Table.ColumnHeader key={h} textAlign="center">
                  {h}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleItems.map((item) => (
              <Table.Row key={item.id}>
                {/* Cliente */}
                <Table.Cell textAlign="center">
                  <Text>
                    {item.client} {item.isEdit && "(Complementario)"}{" "}
                  </Text>
                </Table.Cell>

                {/* Cantidad */}
                <Table.Cell textAlign="center">
                  {item.coupons.some((c) => !c.isExpired) ? (
                    <Text
                      as="span"
                      cursor="pointer"
                      textDecoration="underline"
                      color="blue.500"
                      onClick={() => {
                        setIsOpen(true);
                        setClient(item.client ?? "");
                        setCouponsList(
                          item.coupons.filter((c) => !c.isExpired)
                        );
                      }}
                    >
                      <FormatNumber value={item.quantity} />
                    </Text>
                  ) : (
                    <FormatNumber value={item.quantity} />
                  )}
                </Table.Cell>

                {/* Complementos */}
                <Table.Cell textAlign="center">
                  {!item.isEdit ? (
                    <FormatNumber value={item.supplementsQuantity} />
                  ) : (
                    <TableInput
                      value={item.supplementsQuantity}
                      id={item.id}
                      currency={false}
                      keyValue="supplementsQuantity"
                      onChange={handleInputTextData}
                      disabled={data?.closingConfirmation}
                    />
                  )}
                </Table.Cell>

                {/* Precio */}
                <Table.Cell textAlign="end">
                  <FormatNumber
                    value={item.unitPrice}
                    style="currency"
                    currency="USD"
                  />
                </Table.Cell>

                {/* Totales */}
                {[item.totalPOS, item.physical, item.difference].map(
                  (val, idx) => (
                    <Table.Cell key={idx} textAlign="end">
                      <FormatNumber
                        value={val}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                  )
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Paginación */}
      <PaginationRoot
        count={prepaid?.lines?.length ?? 0}
        pageSize={pageSize}
        page={page}
        onPageChange={(e) => setPage(e.page)}
      >
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>

      {/* Diálogo */}
      <DialogCoupons
        coupons={couponsList}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        client={client}
      />
      <PrepaidNewCustomer
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        onSave={handleNewCustomer}
      />
      {loading && (
        <Box position="fixed" top="50%" left="50%" zIndex={1000}>
          <Loading />
        </Box>
      )}
    </Box>
  );
}

export default PrepaidClousing;
