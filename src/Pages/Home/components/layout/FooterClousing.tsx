import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import { CurrencyInput } from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import type { AlertClousing, FooterClousing, TotalModel } from "@models/common.clousing.model";
import { sendCashClousing } from "@services/clousingService";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { usePrepaidContext } from "@context/clousing/prepaidClousingContext";
import { useHeaders } from "@context/home/headerContext";
import ConfirmDialog from "../notifications/ConfirmDialog";
import Loading from "@components/Loading";
import { PrepaidModel } from "@models/prepaid.model";
import ErrorDialog from "../notifications/ErrorDialog";
import { toaster } from "@components/ui/toaster";

function FooterClousing({
  clousingType,
  clousingId,
  closeDialog,
  closingConfirmation,
  idCurrency,
  isRoleEditable
}: FooterClousing) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [openDialogDifference, setOpenDialogDifference] = useState(false);
  const [USDmenssage, setUSDmenssage] = useState(false);

  const [loading, setloading] = useState(false);
  const [footer, setFooter] = useState<TotalModel | null>(null);
  const [isConfirm, setIsConfirm] = useState(false);

  const { getFooterData } = useFooter();
  const { cashRef } = useCashClousing();
  const { tdcRef } = useTDCContext();
  const { customerRef } = useCustomerContext();
  const { specialCustRef } = useSpecialCustContext();
  const { setEmployee, employeeRef } = useEmployeeContext();
  const { setIntercompany, intercompanyRef } = useIntercompanyContext();
  const { prepaidRef, setCoupons } = usePrepaidContext();
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

    const cash = cashRef.current[clousingId];
    const tdc = tdcRef.current[clousingId];
    const customer = customerRef.current[clousingId];
    const specialCustomer = specialCustRef.current[clousingId];
    const prepaid = prepaidRef.current[clousingId];
    const intercompany = intercompanyRef.current[clousingId];
    const employee = employeeRef.current[clousingId];

    const dataService = {
      cash,
      tdc,
      customer,
      specialCustomer,
      prepaid,
      intercompany,
      clousingId,
      idCurrency,
      discountPhysical: headerRef.current[clousingId]?.discountPhysical || 0,
      employee
    }

    const response: any = await sendCashClousing(dataService, isConfirm);

    if (response === "response") {

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
      }
      closeDialog(true);
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

    const isUSD = cashRef.current[clousingId].currencies.some((line) => line.currency === "USD");

    if (isUSD && isConfirm === false) {
      const totalPos = cashRef.current[clousingId].currencies.find(
        (line) => line.currency === "USD"
      )?.totalPOS;
      const totalPhysical = cashRef.current[clousingId].currencies.find(
        (line) => line.currency === "USD"
      )?.totalFisico;

      const difference =
        (totalPos ?? 0) - (totalPhysical ?? 0) != 0 ? true : false;

      setOpenDialogDifference(difference);
      setUSDmenssage(difference);
      if (difference === true) return;
    }

    const ref: PrepaidModel = prepaidRef.current[clousingId];
    const clientNull = ref?.lines.some(
      (line) => line.client === null || line.client === ""
    );

    if (clientNull && ref.lines.length > 0) {
      showToast({
        title: "Error",
        description: "Falta agregar clientes a prepago",
        type: "error",
      });
      return;
    }

    const allHaveCoupons = ref != undefined ? ref.lines.every(
      (line) => line.coupons.length > 0 || line.isEdit
    ) : false;

    if (!allHaveCoupons && isConfirm === false && ref != undefined && ref.lines.length > 0) {
      showToast({
        title: "Error",
        description:
          "Todos los clientes no complementarios de prepago deben tener al menos un cupón",
        type: "error",
      });
      return;
    }

    if (header[clousingId]?.difference && header[clousingId]?.difference <= 0 && isConfirm === false) {

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
            disabled={closingConfirmation || (!isRoleEditable)}
          >
            Guardar Corte
          </Button>

          <Button
            loading={loading}
            colorPalette="meraPrimary"
            onClick={async () => {
              handleDialogConfirm(false);
            }}
            disabled={closingConfirmation || (!isRoleEditable)}
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
        isConfirm={isConfirm}
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