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
import { CustomerLines } from "@models/customer.model";
import { IntercompanyLine } from "@models/intercompany.model";
import { PrepaidLineModel } from "@models/prepaid.model";
import { EmployeeLine } from "@models/employee.model";
import { SpecialCustomerLines } from "@models/specialCustome.model";
import ErrorDialog from "./ErrorDialog";

function FooterClousing({
  clousingType,
  clousingId,
  closeDialog,
  closingConfirmation,
  currencyId,
}: FooterClousing) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openDialogDifference, setOpenDialogDifference] = useState(false);

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

    const cash = await getCashData(clousingId, currencyId);
    const tdc = await getTDCData(clousingId, currencyId);
    const customer = await getCustomerData(clousingId);
    const specialCustomer = await getSpecialCustData(clousingId, currencyId);
    const employee = await getEmployeetData(clousingId);
    const prepaid = await getPrepaidData(clousingId);
    const intercompany = await getIntercompanyData(clousingId);
console.log(employee);

    const mapCustomerLines = (lines: CustomerLines[]) =>
      lines.map(({ pax: valuePAX, currency, id, currencyLabel, ...rest }) => ({
        ...rest,
        customers: rest.nameClient,
        valuePAX,
        id: typeof id === "number" ? id : null,
        currency: Number(currency),
      }));

    const mapIntercompanyLines = (lines: IntercompanyLine[]) =>
      lines.map(({ id, ...rest }) => ({
        ...rest,
        id: typeof id === "number" ? id : null,
        ticket: rest.ticket,
      }));

    const mapSpecialCustomerLines = (lines: SpecialCustomerLines[]) =>
      lines.map(
        ({
          ammountMXN: amountMXN,
          ammountUSD: valueUSD,
          ammount: value,
          bill: consumption,
          check: Check,
          couponFolio: folioCuopon,
          couponPrice: priceCuopon,
          pax: PAX,
          id,
          couponFolioUSD: folioCuoponUSD,
          ...rest
        }) => ({
          ...rest,
          id: typeof id === "number" ? id : null,
          amountMXN,
          valueUSD,
          value,
          consumption,
          Check,
          folioCuopon,
          priceCuopon,
          PAX,
          folioCuoponUSD,
        })
      );

    const mapEmployeeLines = (lines: EmployeeLine[]) =>
      lines.map(({ employeeNumber, reason, ticketNumber, ...rest }) => ({
        // id: typeof rest.id === "number" ? rest.id : null,
        id: typeof rest.id === "number" ? rest.id : null,
        amount: rest.amount,
        employeeId: rest.employeeId ?? 0,
        reasonId: rest.reasonId ?? 0,
        ticketId: rest.ticketId ?? null,
        externalId: rest?.externalId ?? undefined,
      }));

    const mapPrepaidLines = (lines: PrepaidLineModel[]) =>
      lines.map((line) => ({
        ...line,
        id: typeof line.id === "number" ? line.id : null,
        isEdit: line.isEdit ?? false,
      }));

    const mapTdcLines = (lines: any[]) =>
      lines.map(({ id, ...rest }) => ({
        ...rest,
        id: typeof id === "number" ? id : null,
        idBank: 1001,
        vouchers: [
          {
            id: 1,
            date: "2025-03-20 17:54:43.0",
            check: "1",
            amount: 6.25,
            status: false,
          },
        ],
      }));

    const body: ClousingSave = {
      id: clousingId,
      cash: {
        idCurrencySub: currencyId,
        electronicTips: cash.electronicTips,
        lines: cash.currencies.map(({ id, ...rest }) => ({
          id: typeof id === "number" ? Number(id) : null,
          idCurrency: 5, //Todo cambiar por el id de la moneda
          ...rest,
        })),
        tips: cash.tips ?? 0,
        total: cash.total ?? { totalPOS: 0, totalPhysical: 0, difference: 0 },
      },
      customer: {
        lines: mapCustomerLines(customer.lines),
        total: customer.total,
      },
      intercompany: {
        total: intercompany.total,
        lines: mapIntercompanyLines(intercompany.lines),
      },
      specialCustomer: {
        total: specialCustomer.total ?? {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
        lines: mapSpecialCustomerLines(specialCustomer.lines ?? []),
      },
      employee: {
        total: employee.total,
        lines: mapEmployeeLines(employee.lines.filter((line) => typeof line.id === "string")),
      },
      prepaid: {
        total: prepaid.total,
        lines: mapPrepaidLines(prepaid.lines),
      },
      tdc: {
        idCurrencySub: currencyId,
        total: tdc.total,
        lines: mapTdcLines(tdc.lines),
      },
    };
console.log("body", body.intercompany);

    const response: any = await sendCashClousing(body);

    if (response === "response") {
      //TODO: DEvolver para el back
      // if (response === "response") {
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

  const handleDialogConfirm = () => {
    console.log(header[clousingId]?.difference);

    if (header[clousingId]?.difference && header[clousingId]?.difference <= 0) {
      console.log("error");

      setOpenDialogDifference(true);
      return;
    }
    setButtonLoading(true);
  };

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
              handleDialogConfirm();
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
      <ErrorDialog
        isOpen={openDialogDifference}
        closeDialog={() => setOpenDialogDifference(false)}
      />
    </>
  );
}

export default FooterClousing;
