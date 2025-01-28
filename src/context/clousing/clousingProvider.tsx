import { ReactNode } from 'react';
import { CashClousingProvider } from "./cashClousingContext"
import { CustomerClousingProvider } from "./customerClousingContext"
import { FooterProvider } from "../home/footerClousingContext"
import { SpecialcustomerProvider } from './specialCustClousingContext';
import { TDCClousingProvider } from './tdcClousingContex';
import { PrepaidClousingProvider } from './prepaidClousingContext';

export const ClousingDataProvider = ({ children }: { children: ReactNode }) => {
    return(
        <CashClousingProvider>
            <TDCClousingProvider>
                <CustomerClousingProvider>
                    <SpecialcustomerProvider>
                        <PrepaidClousingProvider>                       
                            {/* <FooterProvider> */}
                                {children}
                            {/* </FooterProvider> */}
                        </PrepaidClousingProvider>     
                    </SpecialcustomerProvider>
                </CustomerClousingProvider>
            </TDCClousingProvider>
        </CashClousingProvider>
    )
}