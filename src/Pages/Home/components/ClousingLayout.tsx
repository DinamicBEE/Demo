import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
} from "@components/ui/dialog";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import { usePrepaidContext } from "@context/clousing/prepaidClousingContext";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { Tabs, Box, useTabs, Flex, Text } from "@chakra-ui/react";
import { IoCashOutline, IoCardOutline } from "react-icons/io5";
import { BsPersonLinesFill, BsPersonVcard } from "react-icons/bs";
import { RiUserStarFill, RiCoupon3Line } from "react-icons/ri";
import { LiaUsersSolid } from "react-icons/lia";
import HeaderClousing from "./HeaderClousing";
import { lazy, useState, Suspense, useEffect, useContext } from "react";
import FooterClousing from "./FooterClousing";
import { CLOUSING_KEY } from "@models/constants.model";
import { ClousingLayoutProps } from "@models/common.clousing.model";
import IntercompanyClousing from "./clousingTypes/IntercompanyClousing";
import SpecialCustomersClousing from "./clousingTypes/SpecialCustomers";
import ExitDialog from "./ExitDialog";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext";
const CashClousing = lazy(() => import("./clousingTypes/CashClousing"));
const TDCClousing = lazy(() => import("./clousingTypes/TDCClousing"));
const CustomersClousing = lazy(
  () => import("./clousingTypes/CustomersClousing")
); //const SpecialCustomersClousing = lazy(() => import("./clousingTypes/specialCustomers"));
const PrepaidClousing = lazy(() => import("./clousingTypes/PrepaidClousing"));
const EmployeesClousing = lazy(
  () => import("./clousingTypes/EmployeesClousing")
);
import { useHeaders } from "@context/home/headerContext";
import { CashContext } from "@models/cash.model";

function ClousingLayout({
  isOpen,
  onClose,
  employee,
  location,
  subsidiary,
  isEdit,
}: ClousingLayoutProps) {
  const [value, setValue] = useState<CLOUSING_KEY>(CLOUSING_KEY.CASH);

  const tabs = useTabs({
    defaultValue: CLOUSING_KEY.CASH,
    onValueChange: (e) => {
      setValue(e.value as CLOUSING_KEY);
    },
  });

  useEffect(() => {
    if (isOpen) {
      tabs.setValue(CLOUSING_KEY.CASH);
    }
  }, [isOpen]);

  const [openDialogExit, setOpenDialogExit] = useState(false);
  const { cashRef } = useCashClousing();
  const { customerRef } = useCustomerContext();
  const { specialCustRef } = useSpecialCustContext();
  const { setEmployee, employeeRef } = useEmployeeContext();
  const { prepaidRef } = usePrepaidContext();
  const { tdcRef } = useTDCContext();
  const { setIntercompany, intercompanyRef } = useIntercompanyContext();
  const { headerRef } = useHeaders();

  console.log("employee", cashRef);

  return (
    <>
      <DialogRoot
        scrollBehavior="inside"
        size="full"
        open={isOpen}
        onOpenChange={() => setOpenDialogExit(true)}
        closeOnEscape={false}
        closeOnInteractOutside={false}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Corte de Caja {employee?.employe} </DialogTitle>
            <Box>
              <HeaderClousing
                location={location.name}
                subsidiary={subsidiary.name}
                id={employee?.id ?? 0}
                closingConfirmation={employee?.closingConfirmation ?? false}
              ></HeaderClousing>
            </Box>
          </DialogHeader>

          <DialogBody>
            <Tabs.RootProvider
              /* onValueChange={(e: any) => {
              setValue(e.value as CLOUSING_KEY);
            }} */
              variant="outline"
              defaultValue={value}
              unmountOnExit
              colorPalette="green"
              justify="center"
              size="lg"
              value={tabs}
            >
              <Tabs.List>
                <Tabs.Trigger value={CLOUSING_KEY.CASH}>
                  <Flex direction="column">
                    <Flex gap="4" align="center">
                      <IoCashOutline />
                      Efectivo              
                    </Flex>

                    <Text color="fg.muted">
                      {employee?.id !== undefined && cashRef.current[employee.id]?.total?.totalPOS !== undefined
                        ? "$ " + cashRef.current[employee.id].total?.totalPOS
                        : "$ " + 0}

                    </Text>
                    
                  </Flex>
                </Tabs.Trigger>
                <Tabs.Trigger value={CLOUSING_KEY.TDC}>
                  <Flex direction="column">
                    <Flex gap="4" align="center">
                      <IoCardOutline />
                      TDC              
                    </Flex>

                    <Text color="fg.muted">
                      {employee?.id !== undefined && tdcRef.current[employee.id]?.total?.totalPOS !== undefined
                        ? "$ " + tdcRef.current[employee.id].total?.totalPOS
                        : "$ " + 0}

                    </Text>
                    
                  </Flex>
                </Tabs.Trigger>
                <Tabs.Trigger value={CLOUSING_KEY.CUSTOMER}>
                  <Flex direction="column">
                    <Flex gap="4" align="center">
                      <BsPersonLinesFill />
                      Clientes              
                    </Flex>

                    <Text color="fg.muted">
                      {employee?.id !== undefined && customerRef.current[employee.id]?.total?.totalPOS !== undefined
                        ? "$ " + customerRef.current[employee.id].total?.totalPOS
                        : "$ " + 0}

                    </Text>
                    
                  </Flex>
                </Tabs.Trigger>
                <Tabs.Trigger value={CLOUSING_KEY.SPECIALCUSTOMER}>
                  <Flex direction="column">
                    <Flex gap="4" align="center">
                      <RiUserStarFill />
                      Clientes especiales              
                    </Flex>

                    <Text color="fg.muted">
                      {employee?.id !== undefined && specialCustRef.current[employee.id]?.total?.totalPOS !== undefined
                        ? "$ " + specialCustRef.current[employee.id].total?.totalPOS
                        : "$ " + 0}

                    </Text>
                    
                  </Flex>
                </Tabs.Trigger>
                <Tabs.Trigger value={CLOUSING_KEY.PREPAID}>
                  <Flex direction="column">
                    <Flex gap="4" align="center">
                      <RiCoupon3Line />
                      Prepago              
                    </Flex>

                    <Text color="fg.muted">
                      {employee?.id !== undefined && prepaidRef.current[employee.id]?.total?.totalPOS !== undefined
                        ? "$ " + prepaidRef.current[employee.id].total?.totalPOS
                        : "$ " + 0}

                    </Text>
                    
                  </Flex>
                </Tabs.Trigger>
                <Tabs.Trigger value={CLOUSING_KEY.EMPLOYEE}>
                  <Flex direction="column">
                    <Flex gap="4" align="center">
                      <BsPersonVcard />
                      Empleados              
                    </Flex>

                    <Text color="fg.muted">
                      {employee?.id !== undefined && employeeRef.current[employee.id]?.total?.totalPOS !== undefined
                        ? "$ " + employeeRef.current[employee.id].total?.totalPOS
                        : "$ " + 0}

                    </Text>
                    
                  </Flex>
                  
                </Tabs.Trigger>
                <Tabs.Trigger value={CLOUSING_KEY.INTERCOMPANY}>
                  <Flex direction="column">
                    <Flex gap="4" align="center">
                      <LiaUsersSolid />
                      Intercompañias              
                    </Flex>

                    <Text color="fg.muted">
                      {employee?.id !== undefined && intercompanyRef.current[employee.id]?.total?.totalPOS !== undefined
                        ? "$ " + intercompanyRef.current[employee.id].total?.totalPOS
                        : "$ " + 0}

                    </Text>
                    
                  </Flex>

                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value={CLOUSING_KEY.CASH}>
                {value === CLOUSING_KEY.CASH && (
                  <Suspense fallback={<div>Cargando Efectivo...</div>}>
                    <CashClousing
                      data={employee}
                      idCurrency={subsidiary.idCurrency}
                    />
                  </Suspense>
                )}
              </Tabs.Content>

              <Tabs.Content value={CLOUSING_KEY.TDC}>
                {value === CLOUSING_KEY.TDC && (
                  <Suspense fallback={<div>Cargando TDC...</div>}>
                    <TDCClousing
                      data={employee}
                      location={location}
                      subsidiary={subsidiary}
                      idCurrency={subsidiary.idCurrency}
                    />
                  </Suspense>
                )}
              </Tabs.Content>

              <Tabs.Content value={CLOUSING_KEY.CUSTOMER}>
                {value === CLOUSING_KEY.CUSTOMER && (
                  <Suspense fallback={<div>Cargando Clientes...</div>}>
                    <CustomersClousing
                      data={employee}
                      subsidiary={subsidiary}
                    />
                  </Suspense>
                )}
              </Tabs.Content>

              <Tabs.Content value={CLOUSING_KEY.SPECIALCUSTOMER}>
                {value === CLOUSING_KEY.SPECIALCUSTOMER && (
                  <Suspense
                    fallback={<div>Cargando Clientes Especiales...</div>}
                  >
                    <SpecialCustomersClousing
                      data={employee}
                      subsidiary={subsidiary}
                    />
                  </Suspense>
                )}
              </Tabs.Content>

              <Tabs.Content value={CLOUSING_KEY.PREPAID}>
                {value === CLOUSING_KEY.PREPAID && (
                  <Suspense
                    fallback={<div>Cargando Clientes Especiales...</div>}
                  >
                    <PrepaidClousing data={employee} />
                  </Suspense>
                )}
              </Tabs.Content>

              <Tabs.Content value={CLOUSING_KEY.EMPLOYEE}>
                {value === CLOUSING_KEY.EMPLOYEE && (
                  <Suspense
                    fallback={<div>Cargando Clientes Especiales...</div>}
                  >
                    <EmployeesClousing
                      data={employee}
                      subsidiaryId={subsidiary.id}
                      cdc={location.id}
                    />
                  </Suspense>
                )}
              </Tabs.Content>

              <Tabs.Content value={CLOUSING_KEY.INTERCOMPANY}>
                {value === CLOUSING_KEY.INTERCOMPANY && (
                  <Suspense
                    fallback={<div>Cargando Clientes Especiales...</div>}
                  >
                    <IntercompanyClousing
                      data={employee}
                      subsidiaryId={subsidiary.id}
                      cdc={location.id}
                    />
                  </Suspense>
                )}
              </Tabs.Content>
            </Tabs.RootProvider>
          </DialogBody>

          <DialogFooter>
            <FooterClousing
              clousingType={value}
              clousingId={employee?.id ?? 0}
              currencyId={subsidiary.idCurrency}
              closeDialog={() => onClose()}
              closingConfirmation={employee?.closingConfirmation ?? false}
              idCurrency={subsidiary.idCurrency}
            />
          </DialogFooter>

          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
      <ExitDialog
        closeDialog={() => {
          setOpenDialogExit(false);

          //onClose();
        }}
        closeOnExit={() => {
          onClose();
          if (employee && employee.id) {
            console.log(cashRef.current);
            console.log(employee.id);
            
            delete cashRef.current[employee.id];
            delete customerRef.current[employee.id];
            delete specialCustRef.current[employee.id];
            delete prepaidRef.current[employee.id];
            delete tdcRef.current[employee.id];
            delete headerRef.current[employee.id];

            setEmployee({} as any);
            setIntercompany({} as any);
            //delete headerRef.current[employee.id];
          }

          // headerRef.current = {};
        }}
        isOpen={openDialogExit}
      ></ExitDialog>
    </>
  );
}

export default ClousingLayout;
