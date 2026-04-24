import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Table,
  Text,
  FormatNumber,
  Input,
  HStack,
  useDisclosure
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
  SpecialCustomersClousingProps,
} from "@models/specialCustome.model";
import { CLOUSING_KEY, CUSTOMER_TYPES } from "@models/common.const";
import Loading from "@components/Loading";
import FilterCustomer from "@components/FilterCustomer";
import { getCustomers } from "@services/catalogService";
import { ResponseModel } from "@models/common.clousing.model";
import { handleErrorMessage } from "@utils/getValidationsError";
import { Button } from "@components/ui/button";
import ChangeCustomerTickets from "./ChangeCustomerTickets";

const pageSize = 10;

function SpecialCustomersClousing({ data, subsidiary, tabs }: SpecialCustomersClousingProps) {
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
  const { open, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<SpecialCustomerLines[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const specialCustomer: ResponseModel = await getSpecialCustData(
          data?.id,
          subsidiary.idCurrency,
          false
        );
  
        if(customers.length === 0){
          const customersApi = await getCustomers(CUSTOMER_TYPES.CUST_ESP, data.zoneId);
          setCustomers(customersApi);
        }
  
        
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
        
        const items = specialCustomer?.data.lines?.slice(startRange, endRange);
        setVisibleItems(items);
      } catch (error) {
        
      } finally {
        setLoading(false)
      }
    }

    if(tabs.value === CLOUSING_KEY.SPECIALCUSTOMER && !specialCustomer && !loading){ //TODO: agrgar un estado para validar que se esta ejecutando solo una vez
      fetchData();
    }
  }, [tabs]);

  useEffect(() => {
    setPage(page);
    const items = specialCustomer?.lines?.slice(startRange, endRange) || [];
    setVisibleItems(items);
  }, [specialCustomer, page]);


  const renderRows = useMemo(() => {
    return visibleItems?.map((item: SpecialCustomerLines) => (
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
          <Text>
            <FormatNumber
              //value={item.couponPrice}
              value={item.couponPrice}
              style="currency"
              currency="USD"
            />
          </Text>
          {/* <Input
            textAlign="center"
            value={item.couponPrice}
            onChange={(e) =>
                handleInputTextData(e.target.value, item.id, "couponPrice")
              }
            disabled={data?.closingConfirmation || specialCustomer?.isRoleEditable === false}
          /> */}
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
    ));
  }, [visibleItems, handleUpdateAmountMXN, handleInputTextData, data?.closingConfirmation, specialCustomer?.isRoleEditable]);

  return (
    <Box>
      <Button mb={2} onClick={() => onOpen()} disabled={data.closingConfirmation || specialCustomer?.isRoleEditable === false}>
        Agregar
      </Button>
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
            {renderRows}
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

      <ChangeCustomerTickets
        crcId={specialCustomer?.id ?? 0} 
        isOpen={open}
        onClose={onClose}
      />
    </Box>
  );
}

export default SpecialCustomersClousing;
