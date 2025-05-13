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
import {
  CouponCatalogModel,
  PrepaidLineModel,
  PrepaidModel,
} from "@models/prepaid.model";
import { CLOUSING_KEY } from "@models/constants.model";
import Loading from "@components/Loading";
import { TotalModel } from "@models/common.clousing.model";
import { useHeaders } from "@context/home/headerContext";
import { TableInput } from "@components/NumericInput";
import FilterCustomer from "@components/FilterCustomer";
import { getCustomers } from "@services/catalogService";

const pageSize = 10;

function PrepaidClousing({ data }: any) {
  const [prepaid, setPrepaid] = useState<PrepaidModel>({} as PrepaidModel);
  const [coupons, setCoupons] = useState<CouponCatalogModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<
    { value: number; label: string }[]
  >([]);
  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { getPrepaidData, getCouponData, setPrepaidData } = usePrepaidContext();

  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<PrepaidLineModel[]>([]);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const prepaid: PrepaidModel = await getPrepaidData(data?.id);
      const couponsList: CouponCatalogModel[] = await getCouponData(data?.id);
      const customersApi = await getCustomers();
      setPrepaid(prepaid);
      setCoupons(couponsList);
      customersApi.push({
        value: 9000000,
        label: "8 AEROVIAS DE MEXICO S.A DE C.V",
      });
      setCustomers(customersApi);
      if (prepaid?.total)
        setFooterData(prepaid.total, data.id, CLOUSING_KEY.PREPAID);

      setLoading(false);
      updateTotal(prepaid.total.totalPhysical, data.id, CLOUSING_KEY.PREPAID);

      const items = prepaid?.lines?.slice(startRange, endRange);
      setVisibleItems(items);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setPage(page);
    const items = prepaid?.lines?.slice(startRange, endRange);
    setVisibleItems(items);
  }, [page]);

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
    console.log("prepaidDataaaaa", prepaidData);

    setPrepaid(prepaidData);

    setPrepaidData(data.id, prepaidData);
    setVisibleItems(updatePrepaid.slice(startRange, endRange));

    updateTotal(newTotalFisico, data.id, CLOUSING_KEY.PREPAID);

    setFooterData(newTotal, data.id, CLOUSING_KEY.PREPAID);
  }

  function handleCoupon(coupon: string) {

    if (coupon.length < 6) return;

    const couponModel = coupons.find((item) => item.folioCustom === coupon);

    if (couponModel === undefined) {
      toastContoller(couponModel);
      return;
    }

    const findClient = prepaid.lines.find(
      (item: PrepaidLineModel) =>
        item.client?.toLowerCase() === couponModel.client.toLowerCase()
    );

    if (findClient === undefined) {
      toastContoller("other");
      return;
    }

    // Initialize coupons array if it doesn't exist
    if (!findClient.coupons) {
      findClient.coupons = [];
    }

    // Check if the coupon already exists in the client's coupons array
    const couponExists = findClient.coupons.some(
      (existingCoupon) => existingCoupon.folioCustom === couponModel.folioCustom
    );

    if (couponExists) {
      // You might want to add a specific toast message for duplicate coupons
      toaster.create({
        title: "Cupón duplicado",
        description: "Este cupón ya ha sido agregado a este cliente",
        type: "warning",
        duration: 2500,
      });
      return;
    }

    // If coupon doesn't exist, add it
    findClient.coupons.push(couponModel);
console.log("findClient", findClient);

    // Create a new prepaid lines array with the updated client
    const updatePrepaid = prepaid.lines.map((item: PrepaidLineModel) =>
      item.id === findClient.id ? {
        ...findClient,
        quantity: findClient.coupons?.length ?? 0,
        physical: findClient.coupons?.reduce(
          (acc: number, curr: CouponCatalogModel) => acc + curr.amount,
          0
        ) ?? 0,
      } : item
    );
console.log("updatewekfjnwkjefnwkjefPrepaid", updatePrepaid);

    toastContoller(couponModel);

    // Update the data with the new prepaid lines
    updateData(updatePrepaid);
  }

  function handleInputTextData(
    id: number | string,
    value: string,
    key?: string
  ) {
    value = value.replace(/[^\d.]/g, "");

    const updatePrepaid = prepaid.lines.map((item: PrepaidLineModel) =>
      item.id === id
        ? {
            ...item,
            [key!]: parseFloat(value),
            physical:
              key === "unitPrice"
                ? item.supplementsQuantity * parseFloat(value)
                : parseFloat(value) * item.unitPrice,
            difference:
              key === "unitPrice"
                ? item.totalPOS - parseFloat(value) * item.supplementsQuantity
                : item.totalPOS - item.unitPrice * parseFloat(value),
          }
        : item
    );

    updateData(updatePrepaid);
  }

  function toastContoller(
    couponModel: CouponCatalogModel | undefined | "other"
  ) {
    let title: string = "",
      description: string = "",
      type: string = "";

    if (couponModel === undefined) {
      title = "Cupón invalido";
      description = "El cupón no se encuentra registrado en la base de datos";
      type = "error";
    } else if (couponModel === "other") {
      title = "No hay clientes relacionado al cupón";
      description = "No hay clientes relacionado al cupón";
      type = "warning";
    } else if (couponModel.isUsed) {
      title = "Cupón vencido";
      description =
        "El cupón se encuentra vencido, ingrese manualmente los valores de Cantidad complementaria y Precio unitario";
      type = "warning";
    } else if (!couponModel.isUsed) {
      title = "Cupón válido";
      description =
        "El registro relacionado al cupón ingresado se ha actualizado de forma correcta";
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
          <Input
            placeholder="Código de Barras"
            onChange={(e) => handleCoupon(e.target.value)}
            disabled={data?.closingConfirmation}
          />
        </Skeleton>
      </Group>

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">
                Cliente
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Cantidad
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Cantidad Complementos
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Precio unitario
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Total POS
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Total físico
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Diferencia
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleItems?.map((item: PrepaidLineModel) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center">
                  <FilterCustomer
                    customers={customers}
                    customerSelect={item.client ?? ""}
                    label={false}
                    onSelect={(customer: { value: number; label: string }) => {
                      const updatePrepaid = prepaid.lines.map(
                        (itemPrepaid: PrepaidLineModel) => {
                          console.log("itemPrepaid", itemPrepaid);
                          console.log("itemPrepaid.id", itemPrepaid.id);
                          console.log("item.id", item.id);
                          console.log("customer", customer);

                          return itemPrepaid.id === item.id
                            ? {
                                ...itemPrepaid,
                                client: customer.label,
                                clientId: customer.value,
                              }
                            : itemPrepaid;
                        }
                      );

                      console.log("updatePrepaid", updatePrepaid);
                   /*    setPrepaid({
                        ...prepaid,
                        lines: updatePrepaid,
                      });
                      setPrepaidData(data.id, {
                        ...prepaid,
                        lines: updatePrepaid,
                      }); */
                      updateData(updatePrepaid);

                      //handleInputTextData(customer.label, item.id, "client");
                    }}
                    disabled={false}
                  ></FilterCustomer>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <FormatNumber value={item.quantity} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    {!item.edit && (
                      <FormatNumber value={item.supplementsQuantity} />
                    )}
                    {item.edit && (
                      <TableInput
                        value={item.supplementsQuantity}
                        id={item.id}
                        currency={false}
                        keyValue="supplementsQuantity"
                        onChange={handleInputTextData}
                      />
                    )}
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    {!item.edit && (
                      <FormatNumber
                        value={item.unitPrice}
                        style="currency"
                        currency="USD"
                      />
                    )}
                    {item.edit && (
                      <TableInput
                        value={item.unitPrice}
                        id={item.id}
                        currency={true}
                        keyValue="unitPrice"
                        onChange={handleInputTextData}
                      />
                    )}
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.totalPOS}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.physical}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.difference}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
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

      {loading && (
        <Box position="fixed" top="50%" left="50%" zIndex="1">
          <Loading />
        </Box>
      )}
    </Box>
  );
}

export default PrepaidClousing;
