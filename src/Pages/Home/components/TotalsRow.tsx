import { FormatNumber, Table } from "@chakra-ui/react";
import { useClousing } from "@context/home/clousingContext";

function TotalsRow(){
    const { tdcHeader, totals } = useClousing();

    return(
        <Table.Row bg="gray.100" fontWeight="bold">
            <Table.Cell textAlign="center"></Table.Cell>
            <Table.Cell textAlign="center">Totales</Table.Cell>
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
            <Table.Cell textAlign="end">
                <FormatNumber
                value={totals.extra}
                style="currency"
                currency="USD"
                />
            </Table.Cell>
            <Table.Cell textAlign="end">
                <FormatNumber
                value={totals.mxm}
                style="currency"
                currency="USD"
                />
            </Table.Cell>
            <Table.Cell textAlign="end">
                <FormatNumber
                value={totals.usd}
                style="currency"
                currency="USD"
                />
            </Table.Cell>
            <Table.Cell textAlign="end">
                <FormatNumber
                value={totals.eur}
                style="currency"
                currency="USD"
                />
            </Table.Cell>
            <Table.Cell textAlign="end">
                <FormatNumber
                value={totals.lib}
                style="currency"
                currency="USD"
                />
            </Table.Cell>
            <Table.Cell textAlign="end">
                <FormatNumber
                value={totals.can}
                style="currency"
                currency="USD"
                />
            </Table.Cell>
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
        </Table.Row>
    )
}

export default TotalsRow;