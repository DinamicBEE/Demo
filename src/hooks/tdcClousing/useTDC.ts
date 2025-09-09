import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { useHeaders } from "@context/home/headerContext";
import { CLOUSING_KEY } from "@models/common.const";
import { BankLineModel, TDCModel } from "@models/tdc.model";

export const useTDC = (clousingId: number,) => {
    const { updateTotal } = useHeaders();
    const { tdc, setTDCData } = useTDCContext();

    function updatedPhysicalAmount(index: string | number, value: string,) {

        value = value.replace(/[^\d.]/g, "");

        if (!value || isNaN(parseFloat(value))) return;

        const tdcData = tdc?.[clousingId];
        if (!tdcData) return;

        const updateLines: BankLineModel[] = tdcData?.lines?.map((item, i) =>
            i === index
                ? {
                    ...item,
                    physical: parseFloat(value),
                }
                : item
        );

        const newTotalPhysical : number = updateLines?.reduce((acc, curr) => acc + (curr.physical || 0), 0);

        const newTotal: TDCModel["total"] = {
            ...tdcData.total,
            totalPhysical: newTotalPhysical || 0,
        };


        const updateTDCData: TDCModel = {
            id: tdcData?.id || 0,
            employeId: tdcData?.employeId || 0,
            total: newTotal,
            lines: updateLines || [],
        };

        updateTotal(newTotalPhysical || 0, clousingId, CLOUSING_KEY.TDC);
        
        setTDCData(updateTDCData, clousingId);

    }

    return { updatedPhysicalAmount };
}