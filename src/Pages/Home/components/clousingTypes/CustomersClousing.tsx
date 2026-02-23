import { useCallback, useEffect, useMemo, useState } from "react";
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
import { CurrencyModel, ResponseModel } from "@models/common.clousing.model";
import {
  CustomerLines,
  CustomerModel,
  CustomersClousingProps,
} from "@models/customer.model";
import { CLOUSING_KEY } from "@models/common.const";
import { Button } from "@components/ui/button";
import { CustomerClousingForm } from "./CustomerClousingForm";
import Loading from "@components/Loading";
import { handleErrorMessage } from "@utils/getValidationsError";
import FilterCustomer from "@components/FilterCustomer";
import { FilterOption } from "@models/reports.model";
import { toast } from "@utils/Toast";
import { Tooltip } from "@components/ui/tooltip";
import { TiDelete } from "react-icons/ti";


const pageSize = 10;

function CustomersClousing({ data, subsidiary, isStarbucks }: CustomersClousingProps) {
  const [currenciesForSelect, setcurrenciesForSelect] =
    useState<ListCollection>();
  const [currencies, setCurrencies] = useState<CurrencyModel[]>();
  const [CustomersData, setCustomersData] = useState<CustomerModel>(
    {} as CustomerModel
  );
  const [customersItems, setCustomersItems] = useState<FilterOption[]>([]);
  const { setFooterData } = useFooter();
  const { getCustomerData, customerLoading, getCustomerList, customer } = useCustomerContext();
  const { handleCoupons, selectCurrency, handleAmountPAX, handleChangeCustomer, updateContext, handleDeleteCustomer } = useHandleCustomer(
    CustomersData || ({} as CustomerModel),
    setCustomersData,
    data?.id ?? 0
  );

  const { open, onOpen, onClose } = useDisclosure();

  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<CustomerLines[]>([]);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const fetchCustomerData = useCallback(async () => {
    if (!data) return;
    
    const customers: ResponseModel = await getCustomerData(data.id, false);

    if(!customers.success){
      handleErrorMessage(customers.error);
      return;
    }

    if (customers?.data.total) {
      setFooterData(customers.data.total, data.id, CLOUSING_KEY.CUSTOMER);
    }
    
    setCustomersData(customers.data);

    const items = customers?.data.lines?.slice(startRange, endRange) || [];      
    setVisibleItems(items);
    
    const currencies = await getCurrencies(subsidiary.idCurrency, data.id);

    if (!currencies) {
      setcurrenciesForSelect(
        createListCollection<CurrencyModel>({ items: [] })
      );
    } else {
      let createCurrenciList = createListCollection({ items: currencies });
      setcurrenciesForSelect(createCurrenciList);
    }

    setCurrencies(currencies);
  }, [data, subsidiary.idCurrency, getCustomerData, setFooterData, startRange, endRange]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomersList = useCallback(async () => {
    if (data?.closingConfirmation) return;
    
    const customersList = await getCustomerList();
    if (customersList) {
      setCustomersItems(customersList);
    }
  }, [data?.closingConfirmation, getCustomerList]);

  useEffect(() => {
    fetchCustomersList();
  }, []);


  useEffect(() => {
    setPage(page);
    const items = CustomersData?.lines?.slice(startRange, endRange);
    setVisibleItems(items);
  }, [page, CustomersData]);

  const openDialog = () => {
    onOpen();
  };

  const onDelete = (index: number) => {
    handleDeleteCustomer(index);
    // updateContext(); //TODO: Validar metodo de guradado de cambio => Por endpoint o Por preguardado
    toast(
      "Guardar o Confirmar corte para que los cambios se apliquen correctamente.",
      "warning",
      "Cliente eliminado"
    );
  }
  
  const selectItems = useMemo(() => {
    if (!currenciesForSelect) return [];
    
    return Array.from(currenciesForSelect).map((item) => (
      <SelectItem item={item} key={item.value}>
        {item.label}
      </SelectItem>
    ));
  }, []);

  const renderRows = useMemo(() => {
    if (!visibleItems || visibleItems.length === 0) {
      return null;
    }

    return  visibleItems?.map((item: CustomerLines, index: number) => (
      <Table.Row key={item.id}>
        <Table.Cell textAlign="center">
          <FilterCustomer
            key={`${item.id}-${customersItems.length}`}
            customers={customersItems}
            label={false}
            customerSelect={item.nameClient}
            onSelect={(e) => handleChangeCustomer(e, item.id)}
            disabled={data?.closingConfirmation || CustomersData?.isRoleEditable === false}
          ></FilterCustomer>
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
              {/* {currenciesForSelect &&
                Array.from(currenciesForSelect).map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))} */}
              {selectItems}
            </SelectContent>
          </SelectRoot>
        </Table.Cell>

        <Table.Cell textAlign="end">
          <Text>
            <TableInput
              value={item.pax}
              id={item.id}
              currency={true}
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
        {(!data?.closingConfirmation || CustomersData?.isRoleEditable === false) && <Table.Cell textAlign="center">
          <Box color="red.500"  textStyle="lg" >
            
            <Tooltip
              content={`Eliminar cliente: ${item.nameClient}`}
              positioning={{ placement: "right-end" }}
            >
              <TiDelete cursor="pointer" onClick={() => onDelete(index)}/>
              
            </Tooltip>
          </Box>
        </Table.Cell>}
      </Table.Row>
    ))
  }, [    visibleItems, 
    customersItems,
    handleChangeCustomer,
    handleCoupons,
    selectCurrency,
    handleAmountPAX,
    data?.closingConfirmation,
    CustomersData?.isRoleEditable,
    ])
  
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
                { (!data?.closingConfirmation || CustomersData?.isRoleEditable === false) && <Table.ColumnHeader textAlign="center">
                  </Table.ColumnHeader>
                }
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {renderRows}
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
        isStarbucks={isStarbucks}
      />
    </>
  );
}

export default CustomersClousing;
