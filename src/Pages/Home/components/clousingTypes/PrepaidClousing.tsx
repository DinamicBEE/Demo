import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Group, InputAddon, Input, Skeleton, HStack  } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { toaster, Toaster } from "@components/ui/toaster";
import { usePrepaidContext } from "@context/clousing/prepaidClousingContext";
import { useFooter } from "@context/home/footerClousingContext";
import { CouponCatalogModel, PrepaidLineModel, PrepaidModel } from "@models/prepaid.model";
import { CLOUSING_KEY } from "@models/constants.model";
import Loading from "@components/Loading";
import { TotalModel } from "@models/common.clousing.model";
import { useHeaders } from "@context/home/headerContext";
import { TableInput } from "@components/NumericInput";

const pageSize = 10;

function PrepaidClousing({data}: any) {
  const [prepaid, setPrepaid] = useState<PrepaidModel>({} as PrepaidModel);
  const [coupons, setCoupons] = useState<CouponCatalogModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { getPrepaidData, getCouponData, setPrepaidData } = usePrepaidContext();

  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<PrepaidLineModel[]>([])

  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize
  
  useEffect(()=>{
    async function fetchData(){
      setLoading(true);
      const prepaid: PrepaidModel = await getPrepaidData(data?.id);
      const couponsList: CouponCatalogModel[] = await getCouponData(data?.id)

      setPrepaid(prepaid);
      setCoupons(couponsList);

      if (prepaid?.total)  setFooterData(prepaid.total, data.id, CLOUSING_KEY.PREPAID);
      
      setLoading(false);
      updateTotal(prepaid.total.totalPhysical, data.id, CLOUSING_KEY.PREPAID);
    
      const items = prepaid?.lines?.slice(startRange, endRange);
      setVisibleItems(items);
    }

    fetchData();

  },[])

  useEffect(() => {
    setPage(page);
    const items = prepaid?.lines?.slice(startRange, endRange);
    setVisibleItems(items);
  }, [page])

  function updateData(updatePrepaid: PrepaidLineModel[]) {

    const newTotalFisico = updatePrepaid.reduce(
      (acc: number, curr: { physical: number }) => acc + curr.physical,
      0
    );

    const newDifference = prepaid.total.totalPOS - newTotalFisico;

    const newTotal: TotalModel = {
      totalPOS: prepaid.total.totalPOS,
      totalPhysical: newTotalFisico,
      difference: newDifference,
    };

    const prepaidData: PrepaidModel = {
      ...prepaid,
      total: newTotal,
      lines: updatePrepaid,
    };
    
    setPrepaid(prepaidData);

    setPrepaidData(data.id, prepaidData);

    updateTotal(newTotalFisico, data.id, CLOUSING_KEY.PREPAID);

    setFooterData(newTotal, data.id, CLOUSING_KEY.PREPAID);

  }

  function handleCoupon(coupon: string) {
    if (coupon.length < 4) return;

    const couponModel = coupons.find((item) => item.folio === coupon);

    if(couponModel===undefined){ 
      
      toastContoller(couponModel);
      return

    }
   
    const updatePrepaid = prepaid.lines.map((item: PrepaidLineModel) =>
      item.id === couponModel?.lineId
        ? !couponModel.isUsed
          ? {
              ...item,
              unitPrice: couponModel.unitPrice,
              quantity: couponModel.quantity,
              physical: couponModel.unitPrice * couponModel.quantity,
              difference:
                item.totalPOS - (couponModel.unitPrice * couponModel.quantity),
            }
          : {
              ...item,
              isEdit: true,
            }
        : item
    );
    
    toastContoller(couponModel);

    updateData(updatePrepaid);

  }

  function handleInputTextData(id: number | string, value: string, key?: string) {

    value = value.replace(/[^\d.]/g, "");

    const updatePrepaid = prepaid.lines.map(
      (item: PrepaidLineModel) =>
        item.id === id
          ? {
              ...item,
              [key!]: parseFloat(value),
              physical: key==="unitPrice" ? 
                item.supplementsQuantity * parseFloat(value) 
                : parseFloat(value) * item.unitPrice,
              difference: key==="unitPrice" ?
                item.totalPOS - (parseFloat(value) * item.supplementsQuantity) 
                : item.totalPOS - (item.unitPrice * parseFloat(value)),
            }
          : item
    );

    updateData(updatePrepaid);

  }

  function toastContoller(couponModel: CouponCatalogModel | undefined){

    let title: string = '', description: string = '', type: string = '';

    if(couponModel === undefined){

      title = "Cupón invalido";
      description = "El cupón no se encuentra registrado en la base de datos";
      type = "error";

    } else if(couponModel.isUsed) {

      title = "Cupón vencido";
      description = "El cupón se encuentra vencido, ingrese manualmente los valores de Cantidad complementaria y Precio unitario";
      type = "warning";

    } else if(!couponModel.isUsed) {

      title = "Cupón válido";
      description = "El registro relacionado al cupón ingresado se ha actualizado de forma correcta";
      type = "success";

    }

    toaster.create({
      title: title,
      description: description,
      type: type,
      duration: 2500,
    });

  }
  
  return (
    <Box>
      <Toaster />

      <Group attached mb={4}>
        <InputAddon>Código de Barras</InputAddon>
        <Skeleton loading={loading}>
          <Input placeholder="Código de Barras" onChange={(e) => handleCoupon(e.target.value)} disabled={data?.closingConfirmation}/>
        </Skeleton>
      </Group>

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">Cliente</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Cantidad</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Cantidad Complementos</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Precio unitario</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Total POS</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Total físico</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Diferencia</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleItems?.map((item: PrepaidLineModel) => (
              <Table.Row key={item.id}>
                
                <Table.Cell textAlign="center">
                  <Text>{item.client}</Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <FormatNumber value={item.quantity} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    {!item.isEdit && <FormatNumber value={item.supplementsQuantity} />}
                    {item.isEdit && <TableInput value={item.supplementsQuantity} id={item.id} currency={false} keyValue="supplementsQuantity" onChange={handleInputTextData} />}
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    {!item.isEdit && <FormatNumber value={item.unitPrice} style="currency" currency="USD" />}
                    {item.isEdit && <TableInput value={item.unitPrice} id={item.id} currency={true} keyValue="unitPrice" onChange={handleInputTextData} />}
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber value={item.totalPOS} style="currency" currency="USD" />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber value={item.physical} style="currency" currency="USD" />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber value={item.difference} style="currency" currency="USD" />
                  </Text>
                </Table.Cell>
            

              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <PaginationRoot count={prepaid?.lines?.length??0} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)}>
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>

      {loading && (
        <Box position="fixed" top="50%" left="50%"  zIndex="1">
          <Loading />
        </Box>
      )}

    </Box>
  );
}

export default PrepaidClousing;