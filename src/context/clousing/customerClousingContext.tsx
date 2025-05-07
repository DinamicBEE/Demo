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
  const [customerLoading, setCustomerLoading] = useState(false);
  const [error, setError] = useState("");
  const customerRef = useRef<CustomerContext>(customer);

  const updateCustomerData = (newCustomerhData: CustomerContext) => {
    setCustomer(newCustomerhData);
    customerRef.current = newCustomerhData;
  };

  const getCustomerData = useCallback(
    async (clousingId: number) => {
      setCustomerLoading(true);

      if (customerRef.current[clousingId]) {
        setCustomerLoading(false);
        return customerRef.current[clousingId];
      }

      try {
        const data = await getCustomerClousing(clousingId);

        if (!data.success) {
          setCustomerLoading(false);
          return data.data;
        }

        const updateCustomer = {
          ...customerRef.current,
          [clousingId]: data.data,
        };

        updateCustomerData(updateCustomer);

        return data.data as CustomerModel;
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));

        return {} as CustomerModel;
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

  const value = useMemo(
    () => ({
      customer,
      customerLoading,
      error,
      getCustomerData,
      setCustomerData,
      customerRef,
    }),
    [customer, customerLoading, error, getCustomerData, setCustomerData, customerRef]
  );

  return (
    <customerContext.Provider value={value}>
      {children}
    </customerContext.Provider>
  );
}
