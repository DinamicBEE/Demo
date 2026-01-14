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
import { toast } from "@utils/Toast";
import { Tooltip } from "@components/ui/tooltip";
import { TiDelete } from "react-icons/ti";

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
  const [couponsSelectedList, setCouponsSelectedList] = useState<CouponCatalogModel[]>([]);
  const [client, setClient] = useState("");

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { getPrepaidData, getCouponData, setPrepaidData } = usePrepaidContext();

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  // Helpers
  const getCouponPhysicalValue = (coupons: CouponCatalogModel[]) =>
    coupons.filter((c) => !c.isExpired).reduce((acc, c) => acc + c.amount, 0);

  const updateData = (updatePrepaid: PrepaidLineModel[]) => {
    const newTotalComp = updatePrepaid.reduce(
      (sum, i) => sum + ((i.supplementsQuantity || 0) * (i.unitPrice || 0)),
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
      newDifference >= 0 ? prepaid.total.totalPOS : (newTotalFisico + newTotalComp),
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

      const response = await getPrepaidData(
        data?.id,
        data?.closingStartDate
      );

      if (!response.success) {
        toast("No se encotraron datos", "warning")
      }

      const prepaidData = response.data as PrepaidModel;

      const couponsList = await getCouponData(cdc, data?.closingStartDate);

      // //TODO: Filtro para test cupones 

      // const cupfilt = couponsList.filter(c => c.clientCustom.toLowerCase().includes("mobility")).map(c => c )
      // console.log("Cupones filtrados: ", cupfilt);
      // const red = couponsList.reduce((acc, c) => acc + c.amount, 0);
      // console.log("Total cupones filtrados: ", red);

      // //TODO: Filtro para test cupones 

      setPrepaid(prepaidData);
      setCoupons(couponsList);

      if (prepaidData?.total)
        setFooterData(prepaidData.total, data.id, CLOUSING_KEY.PREPAID);

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
  const handleCoupon = (rawCode: string) => {
    if (!rawCode) return;
    
    const coupon = rawCode.trim().replace(/^\*|\*$/g, '');
    
    setLoadingAdded(true);

    const couponModel = coupons.find((c) => c.barCode === coupon && !c.isExpired);
    if (!couponModel) {
      setLoadingAdded(false)
      return toast("Cupón inválido o expirado", "error")
    };

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
        idClient: couponModel.clientId || 0,
        physical: couponModel.amount,
        totalPOS: couponModel.amount * 1,
        difference: 0,
        coupons: [],
        couponsSelected:[],
        isEdit: false,
        ticketId: couponModel.id,
      };
      prepaid.lines.push(clientLine);
    }

    
    clientLine.coupons ??= [];
    if (
      clientLine.coupons.some((c) => c.folioCustom === couponModel.folioCustom)
    ) {
      setLoadingAdded(false);
      return toast("Cupón duplicado", "warning");
    }

    if (
      clientLine.coupons.length &&
      clientLine.coupons[0].amount !== couponModel.amount
    ) {
      setLoadingAdded(false);
      return toast("Monto diferente", "warning");
    }

    clientLine.coupons.push(couponModel);
    clientLine.couponsSelected?.push(couponModel);
    //console.log("linea", clientLine)

    const couponPhysicalValue = getCouponPhysicalValue(clientLine.coupons);
    //console.log("suma de cupone", couponPhysicalValue)
    const supplementsValue =
      (clientLine.supplementsQuantity || 0) * (clientLine.unitPrice || 0);
    const newTotalFisico = couponPhysicalValue + supplementsValue;
    //console.log("Total fisico + complementos",newTotalFisico)
    //console.log("totalpos guardado", clientLine!.totalPOS )
    //console.log("largo", clientLine!.coupons.filter((c) => !c.isExpired).length)

    const updatePrepaid: PrepaidLineModel[] = prepaid.lines.map((item) =>
      item.id === clientLine!.id
        ? {
            ...clientLine!,
            idClient: item.idClient,
            quantity: clientLine!.coupons.filter((c) => !c.isExpired).length,
            physical: newTotalFisico,
            totalPOS:
              clientLine!.coupons.filter((c) => !c.isExpired).length *
              (clientLine?.unitPrice || 0),
            difference:  newTotalFisico - (clientLine!.totalPOS || 0),
            edit:
              clientLine!.coupons.some((c) => c.isExpired) ||
              (clientLine!.supplementsQuantity ?? 0) > 0,
          }
        : item
    );

    toast(
      couponModel.isExpired ? "Cupón vencido" : "Cupón válido",
      couponModel.isExpired ? "warning" : "success"
    );
    //console.log(updatePrepaid)
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

  const onDelete = (index: number) => {
    const newArray = prepaid.lines.filter((_, i) => i !== index);
    updateData(newArray);
    toast(
      "Guardar o Confirmar corte para que los cambios se apliquen correctamente.",
      "warning",
      "Cliente eliminado"
    );
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
              disabled={data?.closingConfirmation || prepaid?.isRoleEditable === false}
            />
          </Skeleton>
        </Group>

        <Button
          colorPalette="green.400"
          onClick={() => setIsNewCustomerOpen(true)}
          disabled={data?.closingConfirmation || prepaid?.isRoleEditable === false}
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
                // "Total POS",
                "Total físico",
                "Diferencia",
              ].map((h) => (
                <Table.ColumnHeader key={h} textAlign="center">
                  {h}
                </Table.ColumnHeader>
              ))}
              {(!data.closingConfirmation || prepaid?.isRoleEditable === false) && <Table.ColumnHeader textAlign="center">

              </Table.ColumnHeader>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleItems.map((item, index) => (
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
                        setClient(item.client ?? "");
                        setCouponsSelectedList(
                          item.coupons.filter((c) => !c.isExpired)
                        );
                        setIsOpen(true);
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
                      disabled={data?.closingConfirmation || prepaid?.isRoleEditable === false}
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
                {[
                  //item.totalPOS, 
                  item.physical, item.difference].map(
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
                {/* Botón de eliminado */}
                {(!data.closingConfirmation || prepaid?.isRoleEditable === false) && <Table.Cell textAlign="center">
                  <Box color="red.500"  textStyle="lg" >
                    
                    <Tooltip
                      content={`Eliminar cupones de ${item.client}`}
                      positioning={{ placement: "right-end" }}
                    >
                      <TiDelete cursor="pointer" onClick={() => onDelete(index)}/>
                      
                    </Tooltip>
                  </Box>
                </Table.Cell>}
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
        coupons={couponsSelectedList}
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
