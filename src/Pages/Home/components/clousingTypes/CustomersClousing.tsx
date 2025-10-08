import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Text,
  FormatNumber,
  createListCollection,
  ListCollection,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@components/ui/pagination";
import {
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { TableInput } from "@components/NumericInput";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { useFooter } from "@context/home/footerClousingContext";
import { useHandleCustomer } from "@hooks/customerClousing/useHandleCustomerData";
import { getCurrencies } from "@services/catalogService";
import { CurrencyModel } from "@models/common.clousing.model";
import {
  CustomerLines,
  CustomerModel,
  CustomersClousingProps,
} from "@models/customer.model";
import { CLOUSING_KEY } from "@models/common.const";
import { useHeaders } from "@context/home/headerContext";
import { Button } from "@components/ui/button";
import { CustomerClousingForm } from "./CustomerClousingForm";
import Loading from "@components/Loading";
import { getCustomers } from "@services/catalogService";
import { selectOption } from "@models/common.model";


const pageSize = 10;

function CustomersClousing({ data, subsidiary }: CustomersClousingProps) {
  const [currenciesForSelect, setcurrenciesForSelect] =
    useState<ListCollection>();
  const [currencies, setCurrencies] = useState<CurrencyModel[]>();
  const [CustomersData, setCustomersData] = useState<CustomerModel>(
    {} as CustomerModel
  );
  const [customers, setCustomers] = useState<ListCollection>();
  const { setFooterData } = useFooter();
  const { getCustomerData, customerLoading } = useCustomerContext();
  const { handleCoupons, selectCurrency, handleAmountPAX, handleChangeCustomer } = useHandleCustomer(
    CustomersData || ({} as CustomerModel),
    setCustomersData,
    data?.id ?? 0
  );
  const { updateTotal } = useHeaders();
  const { open, onOpen, onClose } = useDisclosure();

  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<CustomerLines[]>([]);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  useEffect(() => {
    async function fetchData() {
      if (!data) return;
      const customers: CustomerModel = await getCustomerData(data.id);

      if (customers?.total)
        setFooterData(customers.total, data.id, CLOUSING_KEY.CUSTOMER);

      const currencies = await getCurrencies(subsidiary.idCurrency, data.id);

      if (!currencies) {
        setcurrenciesForSelect(
          createListCollection<CurrencyModel>({ items: [] })
        );
      } else {
        let createCurrenciList = createListCollection({ items: currencies });
        setcurrenciesForSelect(createCurrenciList);
      }


      setCustomersData(customers);
      setCurrencies(currencies);
      
      if (customers?.total?.difference < 0) {
        updateTotal(customers.total.totalPOS, data.id, CLOUSING_KEY.CUSTOMER);
      } else {
        updateTotal(
          customers.total.totalPhysical,
          data.id,
          CLOUSING_KEY.CUSTOMER
        );
      }

      const items = customers?.lines?.slice(startRange, endRange);      
      setVisibleItems(items);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchCustomers() {
      const customersList = await getCustomers(true);

      if (customersList) {
        setCustomers(createListCollection<selectOption>({items: customersList}));
        
      } else {
        setCustomers(createListCollection<selectOption>({ items: [] }));
      }

    }
    fetchCustomers();
  }, []);
  

  useEffect(() => {
    setPage(page);
    const items = CustomersData?.lines?.slice(startRange, endRange);
    setVisibleItems(items);
  }, [page, CustomersData]);

  const openDialog = () => {
    onOpen();
  };
  
  return (
    <>
      <Box>
        <Button mb={2} onClick={() => openDialog()} disabled={data?.closingConfirmation || CustomersData?.isRoleEditable === false}>
          Agregar cliente
        </Button>
        <Table.ScrollArea rounded="md" borderWidth="1px">
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader textAlign="center">
                  Clientes
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">PAX</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Moneda
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Valor PAX
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Monto
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Tasa de cambio
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Monto MXN
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleItems?.map((item: CustomerLines, index: number) => (
                <Table.Row key={item.id}>
                  <Table.Cell textAlign="center">
                    <SelectRoot
                      collection={customers || createListCollection<selectOption>({ items: [] })}
                      onValueChange={(e) => handleChangeCustomer(e, item.id)}
                      disabled={data?.closingConfirmation || CustomersData?.isRoleEditable === false}
                    >
                      <SelectTrigger>
                        <SelectValueText
                          placeholder={item.nameClient || "Seleccionar cliente"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {customers && 
                          customers.items.map((item) => (
                          <SelectItem key={item.value} item={item}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </SelectRoot>
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    <Text>
                      <TableInput
                        value={item.coupons}
                        id={item.id}
                        currency={false}
                        onChange={handleCoupons}
                        disabled={data?.closingConfirmation  || CustomersData?.isRoleEditable === false}
                      />
                    </Text>
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    <SelectRoot
                      collection={
                        currenciesForSelect ||
                        createListCollection<CurrencyModel>({ items: [] })
                      }
                      onValueChange={(e) =>
                        selectCurrency(e.value, item.id, currencies)
                      }
                      disabled={data?.closingConfirmation  || CustomersData?.isRoleEditable === false}
                    >
                      <SelectTrigger>
                        <SelectValueText
                          placeholder={
                            item.currencyLabel || "Seleccionar moneda"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {currenciesForSelect &&
                          Array.from(currenciesForSelect).map((item) => (
                            <SelectItem item={item} key={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </SelectRoot>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>
                      <TableInput
                        value={item.pax}
                        id={item.id}
                        currency={false}
                        onChange={handleAmountPAX}
                        disabled={data?.closingConfirmation  || CustomersData?.isRoleEditable === false}
                      />
                    </Text>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>
                      <FormatNumber
                        value={item.amount}
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

                  <Table.Cell textAlign="end">
                    <Text>
                      <FormatNumber
                        value={item.amountMXN}
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
        .
        <PaginationRoot
          count={CustomersData?.lines?.length ?? 0}
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
        {customerLoading && (
          <Box position="fixed" top="50%" left="50%" zIndex={1000}>
            <Loading />
          </Box>
        )}
      </Box>

      <CustomerClousingForm
        isOpen={open}
        onClose={onClose}
        dataCustomer={CustomersData}
        setCustomersData={setCustomersData}
        idCurrency={subsidiary.idCurrency}
        idClousing={data?.id ?? 0}
      />
    </>
  );
}

export default CustomersClousing;
