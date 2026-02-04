import { ReactNode, useRef } from "react";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  getCouponCatalog,
  getPrepaidClousing,
} from "@services/clousingService";
import {
  CouponCatalogModel,
  CouponContext,
  PrepaidContext,
  PrepaidContextType,
  PrepaidModel,
} from "@models/prepaid.model";
import { ResponseModel } from "@models/common.clousing.model";

const prepaidContext = createContext<PrepaidContextType>(
  {} as PrepaidContextType
);

export const usePrepaidContext = () => useContext(prepaidContext);

export function PrepaidClousingProvider({ children }: { children: ReactNode }) {
  const [prepaid, setPrepaid] = useState<PrepaidContext>({});
  const [coupons, setCoupons] = useState<CouponContext>({});
  const [prepaidLoading, setPrepaidLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const prepaidRef = useRef<PrepaidContext>(prepaid);

  const updatePrepaidData = (newPrepaidData: PrepaidContext) => {
    setPrepaid(newPrepaidData);
    prepaidRef.current = newPrepaidData;
  };

  const getPrepaidData = useCallback(
    async (clousingId: number, dateClousing: string, isRefresh:  boolean) => {
      setPrepaidLoading(true);
      
      if (prepaidRef.current[clousingId] && !isRefresh) {
        setPrepaidLoading(false);
        return {
          success: true,
          data:prepaidRef.current[clousingId]
        } as ResponseModel;
      }

      try {
        const response = await getPrepaidClousing(clousingId, dateClousing);
        if (!response.success) {
          setPrepaidLoading(false);
          return response as ResponseModel;
      }
        
        const updatePrepaid = {
          ...prepaidRef.current,
          [clousingId]: response.data,
        };

        updatePrepaidData(updatePrepaid);
        return response as ResponseModel;
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));

        return error as ResponseModel;
      } finally {
        setPrepaidLoading(false);
      }
    },
    [prepaid]
  );

  const getCouponData = useCallback(
    async (clousingId: number, dateClousing: string) => {
      /* if (coupons[clousingId]) {
        return coupons[clousingId];
      } */

      try {
        const datetocompare = await getCouponCatalog(clousingId, dateClousing);
        
        /* const updatePrepaid = {
          coupons,
          [clousingId]: data,
        };

        setCoupons(updatePrepaid); */

        return datetocompare;
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));

        return [] as CouponCatalogModel[];
      }
    },
    [coupons]
  );

  const setPrepaidData = useCallback(
    (clousingId: number, prepaid: PrepaidModel) => {
      const updateData: PrepaidContext = {
        ...prepaidRef.current,
        [clousingId]: prepaid,
      };

      updatePrepaidData(updateData);
    },
    []
  );

  const value = useMemo(
    () => ({
      prepaid,
      prepaidLoading,
      error,
      getPrepaidData,
      getCouponData,
      setPrepaidData,
      setCoupons,
      prepaidRef,
    }),
    [
      prepaid,
      prepaidLoading,
      error,
      getPrepaidData,
      getCouponData,
      setPrepaidData,
      prepaidRef,
      setCoupons,
    ]
  );

  return (
    <prepaidContext.Provider value={value}>{children}</prepaidContext.Provider>
  );
}
