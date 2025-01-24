import { ReactNode } from 'react';
import { CashClousingProvider } from "./cashClousingContext"
import { CustomerClousingProvider } from "./customerClousingContext"
import { FooterProvider } from "./footerClousingContext"
import { SpecialcustomerProvider } from './specialCustClousingContext';

export const ClousingDataProvider = ({ children }: { children: ReactNode }) => {
    return(
        <CashClousingProvider>
            <CustomerClousingProvider>
                <SpecialcustomerProvider>     
                    <FooterProvider>
                        {children}
                    </FooterProvider>
                </SpecialcustomerProvider>
            </CustomerClousingProvider>
        </CashClousingProvider>
    )
}