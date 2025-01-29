import { useRef } from "react";
import { useHeaders } from "@context/home/headerContext";
import { useFooter } from "@context/home/footerClousingContext";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { TDCModel } from "@models/tdc.model";

export const useHandleTDC = (tdcData: TDCModel, setSpecialCustomer: any, clousingId: number, employeId: number) => {

    const tdcRef = useRef(tdcData);

    const headerContext = useHeaders();
    const footerContext = useFooter();
    const tdcContext = useTDCContext();
    if (!headerContext) {
        return null;
      }
      if (!footerContext) {
        return null;
      }
      if(!tdcContext){
        return null;
      }
      const { updateTotal } = headerContext;
      const { setFooterData } = footerContext;
      //const { setSpecialCustData } = tdcContext;

      function handleInputTextData(value: string, id: number, key: string){
        // const updateLines = TDCDetailsMOCKData.details.map((item:any) =>
        //     item.id === id
        //     ? {
        //     ...item,
        //     check: value
        //     }
        //     : item
        // );

        // setDetails({
        //     ...details,
        //     details: updateLines
        // })
      }

      return {handleInputTextData}
}