import { ReactNode } from 'react';
import { CashClousingProvider } from "./cashClousingContext"
import { CustomerClousingProvider } from "./customerClousingContext"
import { FooterProvider } from "./footerClousingContext"

export const ClousingDataProvider = ({ children }: { children: ReactNode }) => {
    return(
        <CashClousingProvider>
            <CustomerClousingProvider>
                <FooterProvider>
                    {children}
                </FooterProvider>
            </CustomerClousingProvider>
        </CashClousingProvider>
    )
}