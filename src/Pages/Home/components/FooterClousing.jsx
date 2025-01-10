import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { Button } from "@components/ui/button"
import { CurrencyInput } from "@components/NumericInput";

function FooterClousing({data, loading, onChange}) {

  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <Box
      p={4}
      mb={2}
      mt={4}
      gap="4"
      justify="space-between"
      display="flex"
      flexDir={{ base: "column", md: "row" }}
    >
      <Flex gap="4" flexDir={{ base: "column", md: "row" }}>
        
        <CurrencyInput
          name={"Total POS"}
          value={data.globalTotalPOS}
          loading={loading}
        />

        <CurrencyInput
          name={"Total físico"}
          value={data.globalTotalFisico}
          loading={loading}
        />

        <CurrencyInput
          name={"Diferencia"}
          value={data.globalDifference}
          loading={loading}
        />
      </Flex>

      <div>
        <Button loading={buttonLoading}
          className="secondary-button save-button"
          onClick={async () => {
            setButtonLoading(true);
            const response = await onChange()
            setButtonLoading(response);
        }}
        >
          Confirmar Corte
        </Button>
      </div>

    </Box>
  );
}

export default FooterClousing;