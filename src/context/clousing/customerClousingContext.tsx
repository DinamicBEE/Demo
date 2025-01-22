import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getCustomerClousing } from '@services/clousingService';
import { CustomerContext, CustomerContextType } from '@models/customer.model';


const customerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomerContext = () => useContext(customerContext);


export function CustomerClousingProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<CustomerContext>({});
    const [customerLoading, setCustomerLoading] = useState(false);
    const [error, setError] = useState("");
    const customerRef = useRef<CustomerContext>(customer);

    const updateCustomerData = (newCustomerhData: CustomerContext) => {
        setCustomer(newCustomerhData);
        customerRef.current = newCustomerhData;
    };

    const getCustomerData = useCallback( async(clousingId:number, employeeId:number) => {
        setCustomerLoading(true);

        if(customerRef.current[clousingId]){
            setCustomerLoading(false);
            return customerRef.current[clousingId][employeeId];
        }

        try {
            
            const data = await getCustomerClousing(clousingId, employeeId);

            const currentClousingData = customerRef.current[clousingId] || {};
            
            const updateCustomer = {
                ...customerRef.current,
                [clousingId]:{
                    ...(typeof currentClousingData === 'object' ? currentClousingData : {}),
                    [employeeId]: data
                }
            }
            
            setCustomer(updateCustomer);
            
            return data;

        } catch (error) {
            
            setError(error instanceof Error ? error.message : String(error));
            
            throw error;

        } finally {
            setCustomerLoading(false);
        }

    }, [customer]);

    const setCustomerData = useCallback((customer: any, employeeId: number, clousingId: number) => {
        
        const currentClousingData = customerRef.current[clousingId] || {};

        const updateCustomer = {
            ...customerRef.current,
            [clousingId]: {
                ...currentClousingData,
                [employeeId]: customer
            }
        }

        updateCustomerData(updateCustomer)
        
    }, []);

    const value = useMemo(
        () => ({
            customer,
            customerLoading,
            error,
            getCustomerData,
            setCustomerData
        }), 
        [customer, customerLoading, error, getCustomerData, setCustomerData]
    );

    return (
        <customerContext.Provider value={value}>
            {children}
        </customerContext.Provider>
    );
};