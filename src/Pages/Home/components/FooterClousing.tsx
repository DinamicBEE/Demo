import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@components/ui/button"
import { CurrencyInput } from "@components/NumericInput";
import { useFooter } from "@context/clousing/footerClousingContext";
import type { FooterClousing, TotalModel } from "@models/common.clousing.model";

function FooterClousing({clousingType, clousingId, data, loading, onChange}: FooterClousing) {

  const [buttonLoading, setButtonLoading] = useState(false);
  const [footer, setFooter] = useState<TotalModel | null>(null);

  const footerContext = useFooter();
  if (!footerContext) {
    throw new Error("FooterContext is undefined");
  }
  const { getFooterData } = footerContext;


  useEffect(() => {
    async function fetchFooterData() {
      const data: TotalModel = await getFooterData(clousingId, clousingType);
      setFooter(data);
    }
    fetchFooterData();
  }, [clousingId, clousingType, getFooterData]);

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
        //   onClick={async () => {
        //     setButtonLoading(true);
        //     const response = await onChange()
        //     setButtonLoading(response);
        // }}
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