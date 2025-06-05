import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { CurrencyInput } from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import type {
  AlertClousing,
  FooterClousing,
  TotalModel,
} from "@models/common.clousing.model";
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
import { EmployeeLine, EmployeeModel } from "@models/employee.model";
import { SpecialCustomerLines } from "@models/specialCustome.model";
import ErrorDialog from "./ErrorDialog";
import { STATUS } from "@models/status.model";
import { BankLineModel } from "@models/tdc.model";
import { toaster } from "@components/ui/toaster";

function FooterClousing({
  clousingType,
  clousingId,
  closeDialog,
  closingConfirmation,
  idCurrency,
  dateClousing,
  propStatus,
}: FooterClousing) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openDialogDifference, setOpenDialogDifference] = useState(false);
  const [USDmenssage, setUSDmenssage] = useState(false);

  const [loading, setloading] = useState(false);
  const [footer, setFooter] = useState<TotalModel | null>(null);
  const [isConfirm, setIsConfirm] = useState(false);

  const { getFooterData } = useFooter();
  const { getCashData, cashRef } = useCashClousing();
  const { getTDCData, tdcRef } = useTDCContext();
  const { getCustomerData, customerRef } = useCustomerContext();
  const { getSpecialCustData, specialCustRef } = useSpecialCustContext();
  const { setEmployee, employee } = useEmployeeContext();
  const { getIntercompanyData, setIntercompany } = useIntercompanyContext();
  const { getPrepaidData, prepaidRef, setCoupons } = usePrepaidContext();
  const { setDataClousing, tdcHeader } = useClousing();
  const { header, headerRef } = useHeaders();

  useEffect(() => {
    async function fetchFooterData() {
      const data: TotalModel = await getFooterData(clousingId, clousingType);

      if (clousingType === "employee") {
        data.difference = 0;
      }

      setFooter(data);
    }

    fetchFooterData();
  }, [clousingId, clousingType, getFooterData]);

  async function sendClousing(isConfirm: boolean) {
    setloading(true);

    const cash = await getCashData(clousingId, idCurrency);
    const tdc = await getTDCData(clousingId, idCurrency);
    const customer = await getCustomerData(clousingId);
    const specialCustomer = await getSpecialCustData(clousingId, idCurrency);
    // const employee = await getEmployeetData(clousingId);
    const prepaid = await getPrepaidData(clousingId, dateClousing);
    const intercompany = await getIntercompanyData(clousingId);

    const mapCustomerLines = (lines: CustomerLines[]) =>
      lines.map(
        ({
          currencyId,
          pax: valuePAX,
          currency,
          id,
          currencyLabel,
          ...rest
        }) => ({
          ...rest,
          customers: rest.nameClient,
          valuePAX,
          id: typeof id === "number" ? id : null,
          currency: currencyId,
        })
      );

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
          pax: pax,
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
          pax,
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
        id: typeof line.id === "number" && line.id !== 0 ? line.id : null,
        coupons: line.coupons
          .filter((coupon) => coupon.isExpired === false)
          .map((coupon) => ({
            id: coupon.id,
            barCode: coupon.barCode,
            folio: coupon.folio,
            amount: coupon.amount,
            validityDate: coupon.validityDate,
            consumeCenterId: coupon.consumeCenterId,
            consumeCenter: coupon.consumeCenter,
            client: coupon.client,
            clientId: coupon.clientId,
            isExpired: coupon.isExpired,
          })),
      }));

    const mapTdcLines = (lines: BankLineModel[]) => {
      return lines.map(({ ...rest }) => ({
        ...rest,
        id: typeof rest.id === "number" ? rest.id : null,
        POS: rest.pos,
        vouchers: rest.vouchers.map((voucher) => ({
          id: voucher.id,
          date: voucher.date,
          check: voucher.check,
          amount: voucher.amount,
          status: voucher.status, // Convert string to boolean
          voucherId: voucher.voucherId,
          amountConversion: voucher.amountConversion,
          uniqueIdVoucher: voucher.uniqueIdVoucher,
        })),
      }));
    };

    const body: ClousingSave = {
      id: clousingId,
      cash: {
        idCurrencySub: idCurrency,
        electronicTips: cash.electronicTips,
        lines:
          cash && cash.currencies
            ? (cash.currencies as any[]).map(({ id, ...rest }) => ({
                id: typeof id === "number" ? Number(id) : null,
                ...rest,
              }))
            : [],
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
        total: (employee as Record<number, EmployeeModel>)[clousingId]
          ?.total ?? {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
        lines: mapEmployeeLines(
          (employee as Record<number, EmployeeModel>)[clousingId]?.lines ?? []
        ),
      },
      prepaid: {
        total: prepaid.total,
        lines: mapPrepaidLines(prepaid.lines),
      },
      tdc: {
        idCurrencySub: idCurrency,
        total: tdc.total,
        lines: mapTdcLines(tdc.lines),
      },
    };

    const response: any = await sendCashClousing(body, isConfirm);

    if (response === "response") {
      const statusNew =
        isConfirm === true
          ? STATUS.Open
          : body.prepaid.lines.length > 0 && prepaid.total?.difference !== 0
            ? STATUS.Close
            : header[body.id] &&
                Number(header[body.id].difference?.toFixed(2)) !== 0
              ? STATUS.WITH_DIFFERENCE // Still mark as "with difference" regardless of previous status
              : propStatus === STATUS.REOPENED
                ? STATUS.RECLOSED // Preserve reopened/reclosed status only if there's no difference
                : STATUS.Close;

      const mxm =
        body.cash.lines.find((line) => line.currency === "MXN")?.totalFisico ??
        0;
      let newMxm = 0;
      if (mxm > 0) {
        newMxm =
          body.cash.electronicTips === 0 ? mxm : mxm - body.cash.electronicTips;
      }

      const newTotalphysical =
        (cash.total?.totalPhysical ?? 0) +
        (tdc.total?.totalPhysical ?? 0) +
        (customer.total?.totalPhysical ?? 0) +
        (specialCustomer.total?.totalPhysical ?? 0) +
        ((employee && "total" in employee
          ? employee.total?.totalPhysical
          : 0) ?? 0) +
        (prepaid.total?.totalPhysical ?? 0) +
        (intercompany.total?.totalPhysical ?? 0);

      setDataClousing({
        id: body.id,
        date: header[body.id].totalClousing,
        difference: (header[body.id]?.totalPOS ?? 0) - newTotalphysical,
        totalClousing: newTotalphysical,
        customer: body.customer.total.totalPhysical,
        specialCustomer: body.specialCustomer.total.totalPhysical,
        employee: body.specialCustomer.total.totalPhysical,
        prepaid: body.prepaid.total.totalPhysical,
        intercompany: body.intercompany.total.totalPhysical,
        mxm: newMxm,
        /* body.cash.lines.find((line) => line.currency === "MXN")
            ?.totalFisico ?? 0, */
        usd:
          body.cash.lines.find((line) => line.currency === "USD")
            ?.totalFisico ?? 0,
        eur:
          body.cash.lines.find((line) => line.currency === "EUR")
            ?.totalFisico ?? 0,
        lib:
          body.cash.lines.find((line) => line.currency === "LIB")
            ?.totalFisico ?? 0,
        can:
          body.cash.lines.find((line) => line.currency === "CAD")
            ?.totalFisico ?? 0,
        status: isConfirm === true ? propStatus : statusNew,
        closingConfirmation: !isConfirm,
        //tips: body.cash.electronicTips,
        tdc: tdcHeader.map((item) => ({
          nameBank: item.nameBank,
          total:
            body.tdc.lines.find((line) => line.bank === item.nameBank)
              ?.physical ?? 0,
        })),
      });

      if (isConfirm === true) {
        delete cashRef.current[clousingId];
        delete customerRef.current[clousingId];
        delete specialCustRef.current[clousingId];
        delete prepaidRef.current[clousingId];
        delete tdcRef.current[clousingId];
        delete headerRef.current[clousingId];
        setCoupons({} as any);
        setEmployee({} as any);
        setIntercompany({} as any);
        // delete headerRef.current[employee.id];
      }
      closeDialog();
    } else {
    }
    setloading(false);
    setButtonLoading(false);
  }

  function showToast(alertModel: AlertClousing) {
    toaster.create({
      title: alertModel.title,
      type: alertModel.type,
      description: alertModel.description,
      duration: 3000,
    });
  }

  const handleDialogConfirm = async (isConfirm: boolean) => {
    const cash = await getCashData(clousingId, idCurrency);

    const isUSD = cash.currencies.some((line) => line.currency === "USD");

    if (isUSD && isConfirm === false) {
      const totalPos = cash.currencies.find(
        (line) => line.currency === "USD"
      )?.totalPOS;
      const totalPhysical = cash.currencies.find(
        (line) => line.currency === "USD"
      )?.totalFisico;

      const difference =
        (totalPos ?? 0) - (totalPhysical ?? 0) != 0 ? true : false;

      setOpenDialogDifference(difference);
      setUSDmenssage(difference);
      if (difference === true) return;
    }

    const prepaid = await getPrepaidData(clousingId, dateClousing);
    const ref = prepaidRef.current[clousingId];
    const clientNull = ref?.lines.some(
      (line) => line.client === null || line.client === ""
    );

    if (clientNull && prepaid.lines.length > 0) {
      showToast({
        title: "Error",
        description: "Falta agregar clientes a prepago",
        type: "error",
      });
      return;
    }

    const allHaveCoupons = prepaid.lines.every(
      (line) => line.coupons.length > 0
    );

    if (!allHaveCoupons && isConfirm === false && prepaid.lines.length > 0) {
      showToast({
        title: "Error",
        description:
          "Todos los clientes de prepago deben tener al menos un cupón",
        type: "error",
      });
      return;
    }

    if (header[clousingId]?.difference && header[clousingId]?.difference <= 0 && isConfirm === false) {
      console.log("error");

      setOpenDialogDifference(true);
      return;
    }

    setButtonLoading(true);
    setIsConfirm(isConfirm);
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
            colorPalette="meraWarning"
            onClick={async () => {
              handleDialogConfirm(true);
            }}
            disabled={closingConfirmation}
          >
            Guardar Corte
          </Button>

          <Button
            loading={loading}
            colorPalette="meraPrimary"
            onClick={async () => {
              handleDialogConfirm(false);
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
        isConfrim={isConfirm}
      />
      {loading && <Loading />}
      <ErrorDialog
        isOpen={openDialogDifference}
        usdMessage={USDmenssage}
        closeDialog={() => setOpenDialogDifference(false)}
      />
    </>
  );
}

export default FooterClousing;
