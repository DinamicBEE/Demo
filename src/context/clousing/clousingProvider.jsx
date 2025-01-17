import { CashClousingProvider } from "./cashClousingContext"
import { CustomerClousingProvider } from "./customerClousingContext"

export const ClousingDataProvider = ({ children }) => {
    return(
        <CashClousingProvider>
            <CustomerClousingProvider>
                {children}
            </CustomerClousingProvider>
        </CashClousingProvider>
    )
}