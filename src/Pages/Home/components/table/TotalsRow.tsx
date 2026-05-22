import { FormatNumber, Table } from "@chakra-ui/react";
import { useClousing } from "@context/home/clousingContext";

function TotalsRow(){
    const { tdcHeader, totals, currHeader } = useClousing();

    return(
      <Table.Row bg="bg.subtle" fontWeight="bold" css={{position:"sticky !important", bottom:0}}>
        <Table.Cell textAlign="center" css={{position:"sticky"}} bg="bg.subtle" left="0"></Table.Cell>
        <Table.Cell textAlign="center" css={{position:"sticky"}} bg="bg.subtle" left="100px">Totales</Table.Cell>
        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.totalPOS}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.totalPhysical}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.difference}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        <Table.Cell />

        {currHeader.length > 0 &&
          totals.currencies != undefined &&
          currHeader.map((currItem) => {
            const currValue = totals.currencies.find(
              (curr) => curr.symbol === currItem.symbol
            );
            return (
              <Table.Cell key={currItem.symbol} textAlign="end">
                <FormatNumber
                  value={currValue ? currValue.total : 0}
                  style="currency"
                  currency="USD"
                />
              </Table.Cell>
            );
          })}
        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.customer}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.specialCustomer}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.prepaid}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.employees}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.intercompany}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        {tdcHeader.length > 0 &&
          totals.tdc != undefined &&
          tdcHeader.map((tdcItem) => {
            const tdcValue = totals.tdc.find(
              (tdc) => tdc.nameBank === tdcItem.nameBank
            );
            return (
              <Table.Cell key={tdcItem.nameBank} textAlign="end">
                <FormatNumber
                  value={tdcValue ? tdcValue.total : 0}
                  style="currency"
                  currency="USD"
                />
              </Table.Cell>
            );
          })}

        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.tips}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        <Table.Cell textAlign="end">
          <FormatNumber
            value={totals.diferenciaCupones || 0}
            style="currency"
            currency="USD"
          />
        </Table.Cell>
        <Table.Cell textAlign="center"></Table.Cell>
      </Table.Row>
    )
}

export default TotalsRow;