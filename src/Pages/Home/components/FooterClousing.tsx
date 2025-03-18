import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { CurrencyInput } from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import type { FooterClousing, TotalModel } from "@models/common.clousing.model";
import { sendCashClousing } from "@services/clousingService";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { usePrepaidContext } from "@context/clousing/prepaidClousingContext";
import { useClousing } from "@context/home/clousingContext";
import { useHeaders } from "@context/home/headerContext";
import ConfirmDialog from "./ConfirmDialog";
import Loading from "@components/Loading";
import { ClousingSave } from "@models/saveClousing.model";

function FooterClousing({
  clousingType,
  clousingId,
  closeDialog,
  closingConfirmation,
}: FooterClousing) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loading, setloading] = useState(false);
  const [footer, setFooter] = useState<TotalModel | null>(null);

  const { getFooterData } = useFooter();
  const { getCashData } = useCashClousing();
  const { getTDCData } = useTDCContext();
  const { getCustomerData } = useCustomerContext();
  const { getSpecialCustData } = useSpecialCustContext();
  const { getEmployeetData } = useEmployeeContext();
  const { getIntercompanyData } = useIntercompanyContext();
  const { getPrepaidData } = usePrepaidContext();
  const { setDataClousing } = useClousing();
  const { header } = useHeaders();

  useEffect(() => {
    async function fetchFooterData() {
      const data: TotalModel = await getFooterData(clousingId, clousingType);
      setFooter(data);
    }

    fetchFooterData();
  }, [clousingId, clousingType, getFooterData]);

  async function sendClousing() {
    setloading(true);

    const cash = await getCashData(clousingId);
    const tdc = await getTDCData(clousingId);
    const customer = await getCustomerData(clousingId);
    const specialCustomer = await getSpecialCustData(clousingId);
    const employee = await getEmployeetData(clousingId);
    const prepaid = await getPrepaidData(clousingId);
    const intercompany = await getIntercompanyData(clousingId);

    const body: ClousingSave = {
      id: clousingId,
      cash: {
        electronicTips: cash.electronicTips,
        lines: cash.currencies,
        tips: cash.tips ?? 0,
        total: cash.total ?? { totalPOS: 0, totalPhysical: 0, difference: 0 },
      },
      customer: {
        lines: customer.lines.map((line) => ({
          amount: line.amount,
          currency: Number(line.currency),
          exchangeRate: line.exchangeRate,
          id: line.id,
          amountMXN: line.amountMXN,
          coupons: line.coupons,
          customers: line.nameClient,
          valuePAX: line.pax,
        })),
        total: customer.total,
      },
      intercompany: {
        total: intercompany.total,
        lines: intercompany.lines.map((line) => ({
          amount: line.amount,
          employeeId: line.employeeId,
          employeeName: line.employeeName,
          id: line.id,
          physicalAmount: line.physicalAmount,
          subsidiaryId: line.subsidiaryId,
          subsidiaryname: line.subsidiaryname,
          ticket: line.ticket,
        })),
      },
      specialCustomer: {
        total: specialCustomer.total,
        lines: specialCustomer.lines.map((line) => ({
          amountMXN: line.ammountMXN,
          Check: line.check,
          client: line.client,
          consumption: line.bill,
          difference: line.difference,
          exchangeRate: line.exchangeRate,
          passengerName: line.passengerName,
          valueUSD: line.ammountUSD,
          flight: line.flight,
          id: line.id,
          PAX: line.pax,
          priceCuopon: line.couponPrice,
          folioCuopon: line.couponFolio,
          folio: line.couponFolio,
          folioCuoponUSD: line.couponFolioUSD,
          value: line.ammount,
        })),
      },
      employee: {
        total: employee.total,
        lines: employee.lines.map((line) => ({
          amount: line.amount,
          employeeId: Number(line.employeeCode),
          reasonId: Number(line.reason),
          ticketId: line.ticket ? Number(line.ticket) : null,
          id: line.id,
          //         externalId: line.externalId,
        })),
      },
      prepaid: {
        total: prepaid.total,
        lines: prepaid.lines.map((line) => ({
          client: line.client,
          difference: line.difference,
          id: line.id,
          physical: line.physical,
          unitPrice: line.unitPrice,
          totalPOS: line.totalPOS,
          quantity: line.quantity,
          supplementsQuantity: line.supplementsQuantity,
          isEdit: line.isEdit ?? false,
        })),
      },
      tdc:{
        total: tdc.total,
        lines: tdc.lines.map((line) => ({
          bank: line.bank,
          id: line.id,
          physical: line.physical,
          POS: line.POS,
          voucherAmount: line.voucherAmount,
        })),
      }
    };

    //console.log(body)
    const response: any = await sendCashClousing(body);

    if (response.success) {
      //console.log("Corte de caja enviado correctamente");
      //showToast(ALERTCLOUSING_MODEL.SUCCESS, null);
      //se guardan los datos del corte para poder actualiza la tabla principal
      setDataClousing({
        id: body.id,
        date: header[body.id].totalClousing,
        difference: header[body.id].difference,
        totalClousing: header[body.id].totalClousing,
        customer: body.customer.total.totalPhysical,
        specialCustomer: body.specialCustomer.total.totalPhysical,
        employee: body.specialCustomer.total.totalPhysical,
        prepaid: body.prepaid.total.totalPhysical,
        intercompany: body.intercompany.total.totalPhysical,
      });

      closeDialog();
    } else {
      console.log("Error al enviar el corte de caja");
      //showToast(ALERTCLOUSING_MODEL.ERROR, response.error);
    }

    setloading(false);
    setButtonLoading(false);
  }

  return (
    <>
      <Box p={4} mb={2} mt={4} gap="4" flexDir={{ base: "column", md: "row" }}>
        <Flex gap="4" flexDir={{ base: "column", md: "row" }}>
          <CurrencyInput
            name={"Total POS"}
            value={footer?.totalPOS ?? 0}
            loading={false}
          />

          <CurrencyInput
            name={"Total físico"}
            value={footer?.totalPhysical ?? 0}
            loading={false}
          />

          <CurrencyInput
            name={"Diferencia"}
            value={footer?.difference ?? 0}
            loading={false}
          />

          <Button
            loading={loading}
            colorPalette="meraPrimary"
            onClick={async () => {
              setButtonLoading(true);
            }}
            disabled={closingConfirmation}
          >
            Confirmar Corte
          </Button>
        </Flex>

        <Flex></Flex>
      </Box>

      <ConfirmDialog
        isOpen={buttonLoading}
        closeDialog={() => setButtonLoading(false)}
        sendData={sendClousing}
      />

      {loading && <Loading />}
    </>
  );
}

export default FooterClousing;
