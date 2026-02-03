import { ReactNode, useRef } from "react";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { getCustomerClousing } from "@services/clousingService";
import {
  CustomerContext,
  CustomerContextType,
  CustomerModel,
} from "@models/customer.model";
import { ResponseModel } from "@models/common.clousing.model";
import { FilterOption } from "@models/reports.model";
import { getCustomers } from "@services/catalogService";

const customerContext = createContext<CustomerContextType>(
  {} as CustomerContextType
);

export const useCustomerContext = () => useContext(customerContext);

export function CustomerClousingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [customer, setCustomer] = useState<CustomerContext>({});
  const [customerList, setCustomerList] = useState<FilterOption[]>([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [error, setError] = useState("");
  const customerRef = useRef<CustomerContext>(customer);

  const updateCustomerData = (newCustomerhData: CustomerContext) => {
    setCustomer(newCustomerhData);
    customerRef.current = newCustomerhData;
  };

  const getCustomerData = useCallback(
    async (clousingId: number, isRefresh: boolean) => {
      setCustomerLoading(true);
      if (customerRef.current[clousingId] && !isRefresh) {
        setCustomerLoading(false);
        const response: ResponseModel = {
          success: true,
          data: customerRef.current[clousingId]
        }
        return response;
      }

      try {
        const data: ResponseModel = await getCustomerClousing(clousingId);

        if (!data.success) {
          setCustomerLoading(false);
          return data as ResponseModel;
        }

        const updateCustomer = {
          ...customerRef.current,
          [clousingId]: data.data,
        };

        updateCustomerData(updateCustomer);

        return data as ResponseModel;
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        return error as ResponseModel
      } finally {
        setCustomerLoading(false);
      }
    },
    [customer]
  );

  const setCustomerData = useCallback(
    (customer: CustomerModel, clousingId: number) => {
      const updateCustomer = { ...customerRef.current, [clousingId]: customer };

      updateCustomerData(updateCustomer);
    },
    []
  );

  const getCustomerList = useCallback(async () => {
    
    if(customerList.length > 0) {
      return customerList;
    }
    
    try {
      const response = await getCustomers(true);

      setCustomerList(response);
      return response;
      
    } catch (error) {
      return [] as FilterOption[];
    }
  }, []);

  const value = useMemo(
    () => ({
      customer,
      customerLoading,
      error,
      getCustomerData,
      setCustomerData,
      customerRef,
      getCustomerList
    }),
    [customer, customerLoading, error, getCustomerData, setCustomerData, customerRef, getCustomerList]
  );

  return (
    <customerContext.Provider value={value}>
      {children}
    </customerContext.Provider>
  );
}
