import { useCashClousing } from '@context/clousing/cashClousingContext';
import { useCustomerContext } from '@context/clousing/customerClousingContext';
import { useEmployeeContext } from '@context/clousing/employeeClousing';
import { useIntercompanyContext } from '@context/clousing/intercompanyContext';
import { usePrepaidContext } from '@context/clousing/prepaidClousingContext';
import { useSpecialCustContext } from '@context/clousing/specialCustClousingContext';
import { useTDCContext } from '@context/clousing/tdcClousingContex';
import { useHeaders } from '@context/home/headerContext';
import { CLOUSING_KEY } from '@models/common.const';
import { useCallback } from 'react';

interface ClosingUpdate {
  newTotal: number;
  clousingId: number;
  clousingType: CLOUSING_KEY;
  differenceCupons: number;
}

export const useClosing = () => {
  const { getCashData } = useCashClousing();
  const { getCustomerData } = useCustomerContext();
  const { getSpecialCustData } = useSpecialCustContext();
  const { getEmployeetData } = useEmployeeContext();
  const { getPrepaidData } = usePrepaidContext();
  const { getTDCData } = useTDCContext();
  const { getIntercompanyData } = useIntercompanyContext();
  const { updateTotal } = useHeaders();

  const prepareUpdate = useCallback((
    data: any, 
    key: string, 
    employeeId: number
  ): ClosingUpdate | null => {
    if (!data?.total) return null;
    
    const total = data.total.totalPhysical;
    const differenceCupons = data.total.differenceCupons || 0;
    
    return {
      newTotal: total,
      clousingId: employeeId,
      clousingType: key as CLOUSING_KEY,
      differenceCupons: differenceCupons
    };
  }, []);

  const executeUpdateSections = useCallback(async (
    employeeId: number,
    closingStartDate: string,
    idCurrency: number,
    isStarbucks: boolean,
    isRefresh: boolean
  ): Promise<void> => {
    if (!employeeId || !idCurrency) {
      throw new Error('Employee or subsidiary data is missing');
    }

    try {

      const [customer, specialCustomer, prepaid, tdc, intercompany, employeeT, cash] = await Promise.all([
        getCustomerData(employeeId, isRefresh),
        getSpecialCustData(employeeId, idCurrency),
        getPrepaidData(employeeId, closingStartDate ?? ""),
        getTDCData(employeeId, idCurrency, isStarbucks, isRefresh),
        getIntercompanyData(employeeId, isRefresh),
        getEmployeetData(employeeId, isRefresh),
        getCashData(employeeId, idCurrency, isRefresh),
      ]);

      const updates = [
        prepareUpdate(cash, CLOUSING_KEY.CASH, employeeId),
        prepareUpdate(customer.data, CLOUSING_KEY.CUSTOMER, employeeId),
        prepareUpdate(specialCustomer.data, CLOUSING_KEY.SPECIALCUSTOMER, employeeId),
        prepareUpdate(prepaid.data, CLOUSING_KEY.PREPAID, employeeId),
        prepareUpdate(tdc, CLOUSING_KEY.TDC, employeeId),
        prepareUpdate(intercompany, CLOUSING_KEY.INTERCOMPANY, employeeId),
        prepareUpdate(employeeT, CLOUSING_KEY.EMPLOYEE, employeeId),
      ].filter(Boolean) as ClosingUpdate[];

      for (const update of updates) {
        await updateTotal(
          update.newTotal,
          update.clousingId,
          update.clousingType,
          update.differenceCupons
        );
      }

    } catch (error) {
      console.error("Error executing closing operations:", error);
      throw error; 
    }
  }, [
    getCashData,
    getCustomerData,
    getSpecialCustData,
    getEmployeetData,
    getPrepaidData,
    getTDCData,
    getIntercompanyData,
    prepareUpdate
  ]);

  return {
    executeUpdateSections,
  };
};
