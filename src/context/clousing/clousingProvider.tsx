import { ReactNode } from 'react';
import { CashClousingProvider } from "./cashClousingContext"
import { CustomerClousingProvider } from "./customerClousingContext"
import { SpecialcustomerProvider } from './specialCustClousingContext';
import { TDCClousingProvider } from './tdcClousingContex';
import { PrepaidClousingProvider } from './prepaidClousingContext';
import { EmployeeClousingProvider } from './employeeClousing';

export const ClousingDataProvider = ({ children }: { children: ReactNode }) => {
    return(
        <CashClousingProvider>
            <TDCClousingProvider>
                <CustomerClousingProvider>
                    <SpecialcustomerProvider>
                        <PrepaidClousingProvider>                       
                            <EmployeeClousingProvider>
                                {children}
                            </EmployeeClousingProvider>
                        </PrepaidClousingProvider>     
                    </SpecialcustomerProvider>
                </CustomerClousingProvider>
            </TDCClousingProvider>
        </CashClousingProvider>
    )
}