import { ReactNode, useCallback, useRef } from 'react';
import { createContext, useContext, useState } from 'react';
import { ClousingLinesModel, ExtraInfo, HeaderContext, HeaderContextType, HeaderData } from '@models/common.clousing.model'
import { CLOUSING_KEY } from '@models/common.const';
import { getExtraInfo } from '@services/catalogService';

const headersContext = createContext<HeaderContextType>({} as HeaderContextType);

export const useHeaders = () => useContext(headersContext)

export function HeadersProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<HeaderContext>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const headerRef = useRef(header);

  const updateHeaderState = (newHeader: any) => {
    setHeader(newHeader);
    headerRef.current = newHeader;
  };

  const getHeader = async (clousingData: ClousingLinesModel): Promise<HeaderData> => {
    setLoading(true);

    if (headerRef.current[clousingData.id]) {
      setLoading(false);
      return headerRef.current[clousingData.id];
    }

    try {
      const extraInfo = await getExtraInfo(clousingData.id);
      const data = createObjectHeader(clousingData, extraInfo, headerRef.current[clousingData.id]);
      const updatedHeader = { ...headerRef.current, [clousingData.id]: data, }

      updateHeaderState(updatedHeader);

      return data;

    } catch (error) {

      setError(error instanceof Error ? error.message : String(error));
      return {} as HeaderData

    } finally {
      setLoading(false);
    }

  }

  const updateTotal = useCallback((newTotal: number, clousingId: number, clousingType: CLOUSING_KEY, differenceCupons?: number) => {
    const currentHeader = structuredClone(headerRef.current || {});
    const currentClousing = currentHeader[clousingId]?.closures[clousingType] || {};
    
    const lastCashTotal = currentClousing.totalPOS || 0;
    const lastCashPhysicalTotal = currentClousing.totalPhysical || 0;
    
    const lastTotalPOS = (currentHeader[clousingId]?.totalPOS || 0);
    
    const allValues = Object.values(currentHeader[clousingId]?.closures || {}).every((value) => value.totalPhysical == 0);
    const lastTotalClousing = !allValues ? 
    (currentHeader[clousingId]?.totalClousing || 0) - lastCashPhysicalTotal : 0;
    
    const newDifference = lastCashTotal - newTotal
    const newTotalClousing = lastTotalClousing + newTotal;
    
    const actualDiffCupons = currentHeader[clousingId]?.differenceCupons || 0;

    const differenceCuponsValue = actualDiffCupons != 0 ?
      (actualDiffCupons - (currentClousing.differenceCupons || 0)) + (differenceCupons || 0) : differenceCupons
   
    const updatedHeader = {
      ...currentHeader,
      [clousingId]: {
        ...(currentHeader[clousingId] || {}),
        closures: {
          ...(currentHeader[clousingId]?.closures || {}),
          [clousingType]: {
            totalPhysical: newTotal,
            difference: newDifference,
            totalPOS: lastCashTotal,
            differenceCupons: differenceCupons
          },
        },
        difference: newTotalClousing - lastTotalPOS,
        totalClousing: newTotalClousing,
        differenceCupons: differenceCuponsValue
      },
    };

    updateHeaderState(updatedHeader);

  },[]);

  const value = {
    header,
    updateHeaderState,
    updateTotal,
    loading,
    error,
    getHeader,
    headerRef,
  }

  return (
    <headersContext.Provider value={value}>
      {children}
    </headersContext.Provider>
  );
}

const createObjectHeader = (dataRow: ClousingLinesModel, extraInfo: ExtraInfo, prevHeader?: HeaderData) => {
  return {
    ...prevHeader,
    cdc: prevHeader?.cdc || "No seleccionada",
    location: prevHeader?.location || "No seleccionado",
    subsidiary: prevHeader?.subsidiary || "No seleccionado",
    date: dataRow.closingStartDate,
    totalPOS: dataRow.totalPOS,
    totalClousing: dataRow.totalPhysical,
    difference: dataRow.difference,
    differenceCupons: 0,
    service: dataRow.service || 0,
    discountPhysical: extraInfo.discountPhysical || 0,
    discountClousing: Math.abs(extraInfo.totalDiscount) || 0,
    closures: {
      cash: prevHeader?.closures?.cash || { totalPOS: 0, totalPhysical: 0, difference: 0 },
      customer: prevHeader?.closures?.customer || { totalPOS: 0, totalPhysical: 0, difference: 0 },
      specialCustomer: prevHeader?.closures?.specialCustomer || { totalPOS: 0, totalPhysical: 0, difference: 0 },
      tdc: prevHeader?.closures?.tdc || { totalPOS: 0, totalPhysical: 0, difference: 0 },
      employee: prevHeader?.closures?.employee || { totalPOS: 0, totalPhysical: 0, difference: 0 },
      prepaid: prevHeader?.closures?.prepaid || { totalPOS: 0, totalPhysical: 0, difference: 0 },
      intercompany: prevHeader?.closures?.intercompany || { totalPOS: 0, totalPhysical: 0, difference: 0 },
    },
  };
}