import { CashClousingProvider } from "./cashClousingContext"
import { CustomerClousingProvider } from "./customerClousingContext"
import { FooterProvider } from "./footerClousingContext"

export const ClousingDataProvider = ({ children }) => {
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