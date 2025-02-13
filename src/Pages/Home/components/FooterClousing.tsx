import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@components/ui/button"
import { CurrencyInput } from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import type { FooterClousing, TotalModel } from "@models/common.clousing.model";
import { sendCashClousing } from "@services/clousingService";
import { CLOUSING_KEY } from "@models/constants.model";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext";
import { useEmployeeContext } from "@context/clousing/employeeClousing";

function FooterClousing({clousingType, clousingId}: FooterClousing) {

  const [buttonLoading, setButtonLoading] = useState(false);
  const [footer, setFooter] = useState<TotalModel | null>(null);

  const { getFooterData } = useFooter();
  const { getCashData } = useCashClousing();
  //const {}
  const { getCustomerData } = useCustomerContext();
  const { getSpecialCustData } = useSpecialCustContext();
  const { getEmployeetData } = useEmployeeContext();

  useEffect(() => {
    async function fetchFooterData() {
      const data: TotalModel = await getFooterData(clousingId, clousingType);

      setFooter(data);
    }
    fetchFooterData();
  }, [clousingId, clousingType, getFooterData]);

  async function sendClousing() {
    
    let body;

    switch (clousingType) {
      case CLOUSING_KEY.CASH:

        body = await getCashData(clousingId);

        break;
      
      case CLOUSING_KEY.TDC:
        //Validar que se envia 
        body = await getCashData(clousingId);

        break;

      case CLOUSING_KEY.CUSTOMER:

        body = await getCustomerData(clousingId);

        break;
      
      case CLOUSING_KEY.SPECIALCUSTOMER:

        body = await getSpecialCustData(clousingId);

        break;

      case CLOUSING_KEY.EMPLOYEE:

        body = await getEmployeetData(clousingId);

        break;

      case CLOUSING_KEY.PREPAID:

        body = await getCashData(clousingId);

        break;
      
      case CLOUSING_KEY.INTERCOMPANY:

        body = await getCashData(clousingId);

        break;
      default:
        break;
    }
    console.log(body)

    const response: any = await sendCashClousing(body);//, clousingId

    if (response.success) {
      console.log("Corte de caja enviado correctamente");
      //showToast(ALERTCLOUSING_MODEL.SUCCESS, null);
    } else {
      console.log("Error al enviar el corte de caja");
      //showToast(ALERTCLOUSING_MODEL.ERROR, response.error);
    }

    return false;
  }

  return (
    <Box
      p={4}
      mb={2}
      mt={4}
      gap="4"
      flexDir={{ base: "column", md: "row" }}
    >
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

        <Button loading={buttonLoading}
          className="secondary-button save-button"
          onClick={async () => {
            setButtonLoading(true);
            const response = await sendClousing()
            setButtonLoading(response);
        }}
        >
          Confirmar Corte
        </Button>
        
      </Flex>

      <Flex>
      </Flex>

    </Box>
  );
}

export default FooterClousing;