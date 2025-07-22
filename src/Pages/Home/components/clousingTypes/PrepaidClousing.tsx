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
import { getCustomersPrepaid } from "@services/catalogService";
import DialogCoupons from "./DialogCoupons";

const pageSize = 10;

function PrepaidClousing({ data, subsidiaryId, cdc }: any) {
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
  const [isOpen, setIsOpen] = useState(false);
  const [couponsList, setCouponsList] = useState<CouponCatalogModel[]>([]);
  const [client, setClient] = useState<string>("");
  const [loadingAdded, setLoadingAdded] = useState<boolean>(false);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const prepaid: PrepaidModel = await getPrepaidData(
        data?.id,
        data?.closingStartDate
      );      
      if (prepaid.lines.length > 0) {
        const couponsList: CouponCatalogModel[] = await getCouponData(
          cdc,
          data?.closingStartDate
        );
        const customersApi = await getCustomersPrepaid();
        setPrepaid(prepaid);
        setCoupons(couponsList);
        /*    if (couponsList.length > 0) {
          const uniqueClients = getUniqueClients(couponsList);
          customersApi.push(...uniqueClients);
        } */

        setCustomers(customersApi);
        // console.log(prepaid.total);

        if (prepaid?.total)
          setFooterData(prepaid.total, data.id, CLOUSING_KEY.PREPAID);

        if (prepaid.total.difference < 0) {
          updateTotal(prepaid.total.totalPOS, data.id, CLOUSING_KEY.PREPAID);
        } else {
          updateTotal(
            prepaid.total.totalPhysical,
            data.id,
            CLOUSING_KEY.PREPAID
          );
        }

        //updateTotal(prepaid.total.totalPhysical, data.id, CLOUSING_KEY.PREPAID);

        const items = prepaid?.lines?.slice(startRange, endRange);
        setVisibleItems(items);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setPage(page);
    const items = prepaid?.lines?.slice(startRange, endRange);
    setVisibleItems(items);
  }, [page]);

  const getUniqueClients = (lines: CouponCatalogModel[]) => {
    const uniqueClients = new Set<string>();
    lines.forEach((line) => {
      if (line.clientCustom) {
        uniqueClients.add(line.clientCustom);
      }
    });

    let idCounter = 9000;
    return Array.from(uniqueClients).map((client) => ({
      value: idCounter++, // Start from 9000 and increment for each client
      label: client,
    }));
  };

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

    if (newDifference >= 0) {
      updateTotal(newTotalFisico, data.id, CLOUSING_KEY.PREPAID);
    } else {
      updateTotal(prepaid.total.totalPOS, data.id, CLOUSING_KEY.PREPAID);
    }

    setFooterData(newTotal, data.id, CLOUSING_KEY.PREPAID);
    setVisibleItems(updatePrepaid.slice(startRange, endRange));
  }

  function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;

    return function (...args: Parameters<T>): void {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  }

  const debouncedHandleCoupon = debounce(handleCoupon, 0);

  function handleCoupon(coupon: string) {
    if (coupon.length < 1) return;
    setLoadingAdded(true);

    const couponModel = coupons.find((item) => item.barCode === coupon);

    if (couponModel === undefined) {
      toastContoller(couponModel);
      return;
    }

    const findClient = prepaid.lines.find(
      (item: PrepaidLineModel) =>
        item.client?.toLowerCase() === couponModel.clientCustom.toLowerCase()
    );

    if (findClient === undefined) {
      toastContoller("client not found");
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
      toastContoller("duplicate coupon");
      return;
    }

    // check if coupon has same amount
    if (findClient.coupons.length > 0) {
      const firstCouponAmount = findClient.coupons[0].amount;
      if (couponModel.amount !== firstCouponAmount) {
        toastContoller("different amount");
        return;
      }
    }

    // If coupon doesn't exist, add it
    findClient.coupons.push(couponModel);

    // Calculate coupon physical value (from non-expired coupons)
    const couponPhysicalValue = findClient.coupons
      .filter((coupon) => coupon.isExpired === false)
      .reduce((acc: number, curr: CouponCatalogModel) => acc + curr.amount, 0);

    // Calculate supplement physical value
    const supplementPhysicalValue =
      findClient.supplementsQuantity * findClient.unitPrice || 0;

    // Calculate total physical value (coupons + supplements)
    const newTotalFisico = couponPhysicalValue + supplementPhysicalValue;

    const newDifference = findClient.totalPOS - newTotalFisico;

    const hasCouponExpired = findClient.coupons.some(
      (coupon) => coupon.isExpired
    );

    const quantity = findClient.coupons.filter(
      (coupon) => coupon.isExpired === false
    ).length;

    // Create a new prepaid lines array with the updated client
    const updatePrepaid = prepaid.lines.map((item: PrepaidLineModel) =>
      item.id === findClient.id
        ? {
            ...findClient,
            quantity: quantity,
            physical: newTotalFisico,
            difference: newDifference,
            edit: hasCouponExpired || findClient.supplementsQuantity > 0,
            unitPrice: couponModel.amount,
          }
        : item
    );

    if (couponModel.isExpired) {
      toastContoller("coupon expired");
    } else {
      toastContoller(couponModel);
    }

    // Update the data with the new prepaid lines
    updateData(updatePrepaid);
    setLoadingAdded(false);
    // console.log(updatePrepaid);
  }

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

  function toastContoller(
    couponModel:
      | CouponCatalogModel
      | undefined
      | "client not found"
      | "coupon expired"
      | "duplicate coupon"
      | "different amount"
  ) {
    let title: string = "",
      description: string = "",
      type: string = "";

    if (couponModel === undefined) {
      title = "Cupón invalido";
      description = "El cupón no se encuentra registrado en la base de datos";
      type = "error";
    } else if (couponModel === "client not found") {
      title = "No hay clientes relacionado al cupón";
      description = "No hay clientes relacionado al cupón";
      type = "warning";
    } else if (couponModel === "coupon expired") {
      title = "Cupón vencido";
      description =
        "El cupón se encuentra vencido, ingrese manualmente los valores de Cantidad complementaria y Precio unitario";
      type = "warning";
    } else if (couponModel === "duplicate coupon") {
      title = "Cupón duplicado";
      description = "Este cupón ya ha sido agregado a este cliente";
      type = "warning";
    } else if (couponModel === "different amount") {
      title = "Monto diferente";
      description =
        "El monto del cupón es diferente al monto de los cupones ya ingresados";
      type = "warning";
    } else if (couponModel) {
      title = "Cupón válido";
      description =
        "El registro relacionado al cupón ingresado se ha actualizado de forma correcta";
      type = "success";
    }
    /* else if (couponModel.isUsed) {
      title = "Cupón vencido";
      description =
        "El cupón se encuentra vencido, ingrese manualmente los valores de Cantidad complementaria y Precio unitario";
      type = "warning";
    } else if (!couponModel.isUsed) {
      title = "Cupón válido";
      description =
        "El registro relacionado al cupón ingresado se ha actualizado de forma correcta";
      type = "success";
    } */

    toaster.create({
      title: title,
      description: description,
      type: type,
      duration: 2500,
    });
    setLoadingAdded(false);
  }

  const openDialog = (
    coupons: CouponCatalogModel[] | undefined,
    client: string
  ) => {
    setIsOpen(true);
    setClient(client);
    if (coupons) {
      setCouponsList(coupons.filter((item) => item.isExpired === false));
    }
  };

  return (
    <Box>
      <Toaster />

      <Group attached mb={4}>
        <InputAddon>Código de Barras</InputAddon>
        <Skeleton loading={loadingAdded}>
          <Input
            placeholder="Código de Barras"
            //onChange={(e) => debouncedHandleCoupon(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                debouncedHandleCoupon(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
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
                    disabled={
                      data?.closingConfirmation || item.coupons.length > 0
                    }
                    customers={customers}
                    customerSelect={item.client ?? ""}
                    label={false}
                    onSelect={(customer: { value: number; label: string }) => {
                      const updatePrepaid = prepaid.lines.map(
                        (itemPrepaid: PrepaidLineModel) => {
                          return itemPrepaid.id === item.id
                            ? {
                                ...itemPrepaid,
                                client: customer.label,
                                clientId: customer.value,
                                unitPrice:
                                  itemPrepaid.client !== customer.label
                                    ? 0
                                    : itemPrepaid.unitPrice,
                                supplementsQuantity:
                                  itemPrepaid.client !== customer.label
                                    ? 0
                                    : itemPrepaid.supplementsQuantity,
                                physical:
                                  itemPrepaid.client !== customer.label
                                    ? 0
                                    : itemPrepaid.physical,
                                difference:
                                  itemPrepaid.client !== customer.label
                                    ? 0
                                    : itemPrepaid.difference,
                                quantity:
                                  itemPrepaid.client !== customer.label
                                    ? 0
                                    : itemPrepaid.quantity,
                                coupons:
                                  itemPrepaid.client !== customer.label
                                    ? []
                                    : itemPrepaid.coupons,
                                edit:
                                  itemPrepaid.client !== customer.label
                                    ? false
                                    : itemPrepaid.edit,
                              }
                            : itemPrepaid;
                        }
                      );
                      updateData(updatePrepaid);
                    }}
                  ></FilterCustomer>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  {item.coupons.filter((coupon) => coupon.isExpired === false)
                    .length > 0 && (
                    <Text
                      as="span"
                      cursor="pointer"
                      textDecoration="underline"
                      color="blue.500"
                      onClick={() =>
                        openDialog(item.coupons, item.client ?? "")
                      }
                    >
                      <FormatNumber value={item.quantity} />
                    </Text>
                  )}
                  {item.coupons.filter((coupon) => coupon.isExpired === false)
                    .length === 0 && (
                    <Text>
                      <FormatNumber value={item.quantity} />
                    </Text>
                  )}
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
                        disabled={data?.closingConfirmation}
                      />
                    )}
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.unitPrice}
                      style="currency"
                      currency="USD"
                    />
                    {/*      {!item.edit && (
                      <FormatNumber
                        value={item.unitPrice}
                        style="currency"
                        currency="USD"
                      />
                    )} */}
                    {/*     {item.edit && (
                      <TableInput
                        value={item.unitPrice}
                        id={item.id}
                        currency={true}
                        keyValue="unitPrice"
                        onChange={handleInputTextData}
                      />
                    )} */}
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
      <DialogCoupons
        coupons={couponsList}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        client={client}
      ></DialogCoupons>

      {loading && (
        <Box position="fixed" top="50%" left="50%" zIndex={1000}>
          <Loading />
        </Box>
      )}
    </Box>
  );
}

export default PrepaidClousing;
