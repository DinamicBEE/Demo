import { CashClousingProvider } from "./cashClousingContext"

export const ClousingDataProvider = ({ children }) => {
    return(
        <CashClousingProvider>
            {children}
        </CashClousingProvider>
    )
}