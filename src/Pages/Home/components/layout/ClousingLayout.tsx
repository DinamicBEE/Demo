import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody,
  DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
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
import { lazy, useState, Suspense, useEffect, useLayoutEffect } from "react";
import FooterClousing from "./FooterClousing";
import { CLOUSING_KEY } from "@models/common.const";
import { ClousingLayoutProps } from "@models/common.clousing.model";
import IntercompanyClousing from "../clousingTypes/IntercompanyClousing";
import SpecialCustomersClousing from "../clousingTypes/SpecialCustomers";
import ExitDialog from "../notifications/ExitDialog";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext";
const CashClousing = lazy(() => import("../clousingTypes/CashClousing"));
const TDCClousing = lazy(() => import("../clousingTypes/TDCClousing"));
const CustomersClousing = lazy(
  () => import("../clousingTypes/CustomersClousing")
); 
const PrepaidClousing = lazy(() => import("../clousingTypes/PrepaidClousing"));
const EmployeesClousing = lazy(
  () => import("../clousingTypes/EmployeesClousing")
);
import { useHeaders } from "@context/home/headerContext";

function ClousingLayout({
  isOpen,
  onClose,
  employee,
  location,
  subsidiary,
}: ClousingLayoutProps) {
  const [value, setValue] = useState<CLOUSING_KEY>(CLOUSING_KEY.CASH);
  const [openDialogExit, setOpenDialogExit] = useState(false);
  const { cashRef } = useCashClousing();
  const { getCustomerData, customerRef } = useCustomerContext();
  const { getSpecialCustData, specialCustRef } = useSpecialCustContext();
  const { setEmployee, employeeRef, getEmployeetData } = useEmployeeContext();
  const { getPrepaidData, prepaidRef,setCoupons } = usePrepaidContext();
  const { getTDCData, tdcRef } = useTDCContext();
  const { getIntercompanyData, setIntercompany, intercompanyRef } = useIntercompanyContext();
  const { headerRef } = useHeaders();

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

  useLayoutEffect(() => {
    if (isOpen && !employee?.closingConfirmation) {
      getCustomerData(employee?.id ?? 0);
      getSpecialCustData(employee?.id ?? 0, subsidiary.idCurrency);
      getPrepaidData(employee?.id ?? 0, employee?.closingStartDate ?? "");
      getTDCData(employee?.id ?? 0, subsidiary.idCurrency);
      getIntercompanyData(employee?.id ?? 0);
      getEmployeetData(employee?.id ?? 0);
      
    }
  }, [isOpen])
  

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
                      {employee?.id !== undefined &&
                      cashRef !== undefined &&
                      cashRef.current[employee.id]?.total?.totalPhysical !==
                        undefined
                        ? "$ " + cashRef.current[employee.id].total?.totalPhysical
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
                      {employee?.id !== undefined &&
                      tdcRef != undefined &&
                      tdcRef.current[employee.id]?.total?.totalPhysical !== undefined
                        ? "$ " + tdcRef.current[employee.id].total?.totalPhysical
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
                      {employee?.id !== undefined &&
                      customerRef !== undefined &&
                      customerRef.current[employee.id]?.total?.totalPhysical !==
                        undefined
                        ? "$ " +
                          customerRef.current[employee.id].total?.totalPhysical
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
                      {employee?.id !== undefined &&
                      specialCustRef !== undefined &&
                      specialCustRef.current[employee.id]?.total?.totalPhysical !==
                        undefined
                        ? "$ " +
                          specialCustRef.current[employee.id].total?.totalPhysical
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
                      {employee?.id !== undefined &&
                      prepaidRef !== undefined &&
                      prepaidRef.current[employee.id]?.total?.totalPhysical !==
                        undefined
                        ? "$ " + prepaidRef.current[employee.id].total?.totalPhysical
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
                      {employee?.id !== undefined &&
                      employeeRef !== undefined &&
                      employeeRef.current[employee.id]?.total?.totalPhysical !==
                        undefined
                        ? "$ " +
                          employeeRef.current[employee.id].total?.totalPhysical
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
                      {employee?.id !== undefined &&
                      intercompanyRef !== undefined &&
                      intercompanyRef.current[employee.id]?.total?.totalPhysical !==
                        undefined
                        ? "$ " +
                          intercompanyRef.current[employee.id].total?.totalPhysical
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
                    <PrepaidClousing
                      data={employee}
                      subsidiaryId={subsidiary.id}
                      cdc={location.id}
                    />
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
              closeDialog={onClose}
              closingConfirmation={employee?.closingConfirmation ?? false}
              idCurrency={subsidiary.idCurrency}
            />
          </DialogFooter>

          <DialogCloseTrigger onClick={() => employee?.closingConfirmation && onClose(false)}/>
        </DialogContent>
      </DialogRoot>
      {employee?.closingConfirmation == false && (<ExitDialog
        closeDialog={() => {
          setOpenDialogExit(false);
        }}
        closeOnExit={() => {
          onClose(false);
          if (employee && employee.id) {
            delete cashRef.current[employee.id];
            delete customerRef.current[employee.id];
            delete specialCustRef.current[employee.id];
            delete prepaidRef.current[employee.id];
            delete tdcRef.current[employee.id];
            delete headerRef.current[employee.id];
            setCoupons({} as any);
            setEmployee({} as any);
            setIntercompany({} as any);
          }

        }}
        isOpen={openDialogExit}
      ></ExitDialog>)}
    </>
  );
}

export default ClousingLayout;
