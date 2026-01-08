import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Text,
  FormatNumber,
  Input,
  HStack,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@components/ui/pagination";
import { TableInput } from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext";
import { useHandleSpecialCustomer } from "@hooks/SpecialCustomerClousing/useHandleSpecialCustomerData";
import {
  SpecialCustomerLines,
  SpecialCustomerModel,
} from "@models/specialCustome.model";
import { CLOUSING_KEY } from "@models/common.const";
import Loading from "@components/Loading";
import FilterCustomer from "@components/FilterCustomer";
import { getCustomers } from "@services/catalogService";
import { ResponseModel } from "@models/common.clousing.model";
import { handleErrorMessage } from "@utils/getValidationsError";

const pageSize = 10;

function SpecialCustomersClousing({ data, subsidiary }: any) {
  const [specialCustomer, setSpecialCustomer] =
    useState<SpecialCustomerModel>();
  const [customers, setCustomers] = useState<{ value: number; label: string }[]>(
    []
  );
  const { setFooterData } = useFooter();
  const { getSpecialCustData, specialCustLoading } = useSpecialCustContext();
  const { handleInputTextData, handleUpdateAmountMXN } =
    useHandleSpecialCustomer(
      specialCustomer || ({} as SpecialCustomerModel),
      setSpecialCustomer,
      data?.id
    );
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<SpecialCustomerLines[]>([]);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  useEffect(() => {
    async function fetchData() {
  
      const specialCustomer: ResponseModel = await getSpecialCustData(
        data?.id,
        subsidiary.idCurrency
      );
      const customersApi = await getCustomers(false);
      if(!specialCustomer.success){
        handleErrorMessage(specialCustomer.error)
      }
      if (specialCustomer)
        setFooterData(
          specialCustomer.data.total,
          data.id,
          CLOUSING_KEY.SPECIALCUSTOMER
        );
      setSpecialCustomer(specialCustomer.data);
      setCustomers(customersApi);
      const items = specialCustomer?.data.lines?.slice(startRange, endRange);
      setVisibleItems(items);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setPage(page);
    const items = specialCustomer?.lines?.slice(startRange, endRange) || [];
    setVisibleItems(items);
  }, [specialCustomer, page]);

  return (
    <Box>
      {/* <Toaster /> */}

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">Cheque</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Consumo
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Precio cupón
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Diferencia
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Tipo de cambio
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" minW="200px">
                Cliente
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" minW="100px">PAX</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Folio cupones
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Folio cupones USD
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" minW="100px">
                Valor
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Valor USD
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" minW="120px">
                Vuelo
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Nombre pasajero
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Monto MXN
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleItems?.map((item: SpecialCustomerLines) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center">
                  <Text>{item.check}</Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      //value={item.couponPrice}
                      value={item.bill}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Input
                    textAlign="center"
                    value={item.couponPrice}
                    onChange={(e) =>
                        handleInputTextData(e.target.value, item.id, "couponPrice")
                      }
                    disabled={data?.closingConfirmation || specialCustomer?.isRoleEditable === false}
                  />
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

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.exchangeRate}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  {/*  <Text>
                    {item.client}
                  </Text> */}
                  <FilterCustomer
                    customers={customers}
                    customerSelect={item.client}
                    label={false}
                    onSelect={(customer: { value: number; label: string }) => {
                      handleInputTextData(
                        customer.label,
                        item.id,
                        "client", 
                        customer.value
                      );
                    }}
                    disabled={data?.closingConfirmation}
                  ></FilterCustomer>
                </Table.Cell>

                <Table.Cell textAlign="center">
                    <Input
                      textAlign="center"
                      value={item.pax}
                      type="number"
                      onChange={(e) =>
                        handleInputTextData(e.target.value, item.id, "pax")
                      }
                      disabled={data?.closingConfirmation || specialCustomer?.isRoleEditable === false}
                    />
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <Input
                      textAlign="center"
                      value={item.couponFolio}
                      onChange={(e) =>
                        handleInputTextData(
                          e.target.value,
                          item.id,
                          "couponFolio"
                        )
                      }
                      disabled={data?.closingConfirmation || specialCustomer?.isRoleEditable === false}
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <Input
                      textAlign="center"
                      value={item.couponFolioUSD}
                      onChange={(e) =>
                        handleInputTextData(
                          e.target.value,
                          item.id,
                          "couponFolioUSD"
                        )
                      }
                      disabled={data?.closingConfirmation || specialCustomer?.isRoleEditable === false}
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <TableInput
                      value={item.ammount}
                      id={item.id}
                      currency={true}
                      keyValue={"ammount"}
                      onChange={handleUpdateAmountMXN}
                      disabled={data?.closingConfirmation || !specialCustomer?.isRoleEditable}
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <TableInput
                      value={item.ammountUSD}
                      id={item.id}
                      currency={true}
                      keyValue={"ammountUSD"}
                      onChange={handleUpdateAmountMXN}
                      disabled={data?.closingConfirmation || !specialCustomer?.isRoleEditable}
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <Input
                      textAlign="center"
                      value={item.flight}
                      onChange={(e) =>
                        handleInputTextData(e.target.value, item.id, "flight")
                      }
                      disabled={data?.closingConfirmation || specialCustomer?.isRoleEditable === false}
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <Input
                      textAlign="center"
                      value={item.passengerName}
                      onChange={(e) =>
                        handleInputTextData(
                          e.target.value,
                          item.id,
                          "passengerName"
                        )
                      }
                      disabled={data?.closingConfirmation || specialCustomer?.isRoleEditable === false}
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.ammountMXN}
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
        count={specialCustomer?.lines?.length ?? 0}
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

      {specialCustLoading && (
        <Box position="fixed" top="50%" left="50%" zIndex={1000}>
          <Loading />
        </Box>
      )}
    </Box>
  );
}

export default SpecialCustomersClousing;
