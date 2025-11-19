import { ReactNode } from "react";
import { CashClousingProvider } from "./cashClousingContext";
import { CustomerClousingProvider } from "./customerClousingContext";
import { SpecialcustomerProvider } from "./specialCustClousingContext";
import { TDCClousingProvider } from "./tdcClousingContex";
import { PrepaidClousingProvider } from "./prepaidClousingContext";
import { EmployeeClousingProvider } from "./employeeClousing";
import { IntercompanyClousingProvider } from "./intercompanyContext";
import { TDCAdyenClousingProvider } from "./tdcAdyenContext";
export const ClousingDataProvider = ({ children }: { children: ReactNode }) => {
  return (
    <CashClousingProvider>
      <TDCClousingProvider>
        <TDCAdyenClousingProvider>
          <CustomerClousingProvider>
            <SpecialcustomerProvider>
              <PrepaidClousingProvider>
                <EmployeeClousingProvider>
                  <IntercompanyClousingProvider>
                    {children}
                  </IntercompanyClousingProvider>
                </EmployeeClousingProvider>
              </PrepaidClousingProvider>
            </SpecialcustomerProvider>
          </CustomerClousingProvider>
        </TDCAdyenClousingProvider>
      </TDCClousingProvider>
    </CashClousingProvider>
  );
};
