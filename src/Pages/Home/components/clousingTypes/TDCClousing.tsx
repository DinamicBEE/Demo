import { useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import { Box, Table, Text, FormatNumber, IconButton, HStack } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import TDCDetails from "./TDCDetails";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { useFooter } from "@context/home/footerClousingContext";
import { Voucher, BankLineModel, TDCModel } from "@models/tdc.model";
import { CLOUSING_KEY } from "@models/constants.model";
import Loading from "@components/Loading";
import { useHeaders } from "@context/home/headerContext";

const pageSize = 5;

function TDCClousing({ data, idCurrency }: any) {
  const [tdcData, setCashData] = useState<TDCModel>();
  const [lineSelected, setLineSeleted] = useState<number | null | string>(null);
  const [details, setDetails] = useState<boolean>(false);
  const [bankSelected, setBankSelected] = useState<BankLineModel>(
    {} as BankLineModel
  );

  const { setFooterData } = useFooter();
  const { getTDCData, tdc, tdcLoading } = useTDCContext();
  const { updateTotal } = useHeaders();
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<BankLineModel[]>([]);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  useEffect(() => {
    async function fetchData() {
      const tdc: TDCModel = await getTDCData(data?.id, idCurrency);   
      if (tdc?.total) {
        setFooterData(tdc.total, data.id, CLOUSING_KEY.TDC);
      }

      setCashData(tdc);
      updateTotal(tdc.total.totalPhysical, data.id, CLOUSING_KEY.TDC);

      const items = tdc?.lines?.slice(startRange, endRange) ?? [];
      setVisibleItems(items);
    }

    fetchData();
  }, [tdc]);

  useEffect(() => {
    setPage(page);
    const items = tdcData?.lines?.slice(startRange, endRange) ?? [];
    setVisibleItems(items);
  }, [page]);

  function formatDate(dateString: string) {
    const hora = dateString.split("T")[1];    
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year} ${hora}`;
  }

  const openDiaolog = (id: number | string, data: BankLineModel) => {
    const newData: Voucher[] = data.vouchers.map((v: Voucher) => ({
      ...v,
     dateDisplay: formatDate(v.date),
    }));
    setBankSelected({
      ...data,
      vouchers: newData,
    });
    setLineSeleted(id);
    setDetails(true);
  };

  const closeDiaolog = () => {
    setLineSeleted(null);
    setBankSelected({} as BankLineModel);
    setDetails(false);
  };

  return (
    <>
      <Box>

        <Table.ScrollArea rounded="md" borderWidth="1px">
          <Table.Root size="sm" variant="outline">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader textAlign="center">
                  Banco
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">POS</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Físico
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Cantidad Vouchers totales
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Cantidad Vouchers seleccionados
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Acciones
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visibleItems.map((item: BankLineModel) => (
                <Table.Row key={item.id}>
                  <Table.Cell textAlign="center">
                    <Text>{item.bank}</Text>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>
                      <FormatNumber
                        value={item.pos}
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

                  <Table.Cell textAlign="center">
                    <Text>
                      <FormatNumber value={item.voucherAmount} />
                    </Text>
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    <Text>
                      <FormatNumber value={item.voucherAmountDisplay} />
                    </Text>
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    <IconButton
                      rounded="full"
                      variant={"ghost"}
                      onClick={() => openDiaolog(item.id, item)}
                    >
                      <LuEye />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
        <PaginationRoot
          count={tdcData?.lines?.length ?? 0}
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

        {tdcLoading && (
          <Box position="fixed" top="50%" left="50%" zIndex={1000}>
            <Loading />
          </Box>
        )}
      </Box>

      <TDCDetails
        clousingId={data?.id}
        lineId={lineSelected}
        isOpen={details}
        onClose={closeDiaolog}
        closingConfirmation={data?.closingConfirmation}
        bankDetails={bankSelected}
      />
    </>
  );
}

export default TDCClousing;
