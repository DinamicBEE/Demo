import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { Tabs, Box } from "@chakra-ui/react"
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"
import HeaderClousing from "./HeaderClousing"
import { lazy, useState, Suspense } from "react";
import FooterClousing from "./FooterClousing";
import { CLOUSING_KEY } from "@models/constants.model";
import { ClousingLayoutProps } from "@models/common.clousing.model";
import IntercompanyClousing from "./clousingTypes/IntercompanyClousing";
import SpecialCustomersClousing from "./clousingTypes/SpecialCustomers";
const CashClousing = lazy(() => import("./clousingTypes/CashClousing"));
const TDCClousing = lazy(() => import("./clousingTypes/TDCClousing"));
const CustomersClousing = lazy(() => import("./clousingTypes/CustomersClousing"));//const SpecialCustomersClousing = lazy(() => import("./clousingTypes/specialCustomers"));
const PrepaidClousing = lazy(() => import("./clousingTypes/PrepaidClousing"));
const EmployeesClousing = lazy(() => import("./clousingTypes/EmployeesClousing"));

function ClousingLayout({ isOpen, onClose, employee }: ClousingLayoutProps) {
    const [value, setValue] = useState<CLOUSING_KEY>(CLOUSING_KEY.CASH)

    return (
        <DialogRoot scrollBehavior="inside" size="cover" open={isOpen} onOpenChange={() => onClose()} closeOnEscape={false} closeOnInteractOutside={false}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Corte de Caja {employee?.employe} </DialogTitle>
                    <Box>
                        <HeaderClousing id={employee?.id ?? 0} closingConfirmation={employee?.closingConfirmation ?? false}></HeaderClousing>
                    </Box>
                </DialogHeader>

                <DialogBody>

                    <Tabs.Root onValueChange={(e) => {
                        setValue(e.value as CLOUSING_KEY)
                    }} variant="outline" defaultValue={value} unmountOnExit colorPalette="green" justify="center" size="lg">
                        <Tabs.List>
                            <Tabs.Trigger value={CLOUSING_KEY.CASH}>
                                <LuUser />
                                Efectivo
                            </Tabs.Trigger>
                            <Tabs.Trigger value={CLOUSING_KEY.TDC}>
                                <LuFolder />
                                TDC
                            </Tabs.Trigger>
                            <Tabs.Trigger value={CLOUSING_KEY.CUSTOMER}>
                                <LuSquareCheck />
                                Clientes
                            </Tabs.Trigger>
                            <Tabs.Trigger value={CLOUSING_KEY.SPECIALCUSTOMER}>
                                <LuUser />
                                Clientes especiales
                            </Tabs.Trigger>
                            <Tabs.Trigger value={CLOUSING_KEY.PREPAID}>
                                <LuFolder />
                                Prepago
                            </Tabs.Trigger>
                            <Tabs.Trigger value={CLOUSING_KEY.EMPLOYEE}>
                                <LuSquareCheck />
                                Empleados
                            </Tabs.Trigger>
                            <Tabs.Trigger value={CLOUSING_KEY.INTERCOMPANY}>
                                <LuSquareCheck />
                                Intercompañias
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value={CLOUSING_KEY.CASH}>
                            {value === CLOUSING_KEY.CASH && (
                                <Suspense fallback={<div>Cargando Efectivo...</div>}>
                                    <CashClousing data={employee} />
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value={CLOUSING_KEY.TDC}>
                            {value === CLOUSING_KEY.TDC && (
                                <Suspense fallback={<div>Cargando TDC...</div>}>
                                    <TDCClousing data={employee} />
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value={CLOUSING_KEY.CUSTOMER}>
                            {value === CLOUSING_KEY.CUSTOMER && (
                                <Suspense fallback={<div>Cargando Clientes...</div>}>
                                    <CustomersClousing data={employee} />
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value={CLOUSING_KEY.SPECIALCUSTOMER}>
                            {value === CLOUSING_KEY.SPECIALCUSTOMER && (
                                <Suspense fallback={<div>Cargando Clientes Especiales...</div>}>
                                    <SpecialCustomersClousing data={employee} />
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value={CLOUSING_KEY.PREPAID}>
                            {value === CLOUSING_KEY.PREPAID && (
                                <Suspense fallback={<div>Cargando Clientes Especiales...</div>}>
                                    <PrepaidClousing data={employee} />
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value={CLOUSING_KEY.EMPLOYEE}>
                            {value === CLOUSING_KEY.EMPLOYEE && (
                                <Suspense fallback={<div>Cargando Clientes Especiales...</div>}>
                                    <EmployeesClousing data={employee} />
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value={CLOUSING_KEY.INTERCOMPANY}>
                            {value === CLOUSING_KEY.INTERCOMPANY && (
                                <Suspense fallback={<div>Cargando Clientes Especiales...</div>}>
                                    <IntercompanyClousing data={employee} />
                                </Suspense>
                            )}
                        </Tabs.Content>

                    </Tabs.Root>

                </DialogBody>

                <DialogFooter>
                    <FooterClousing clousingType={value} clousingId={employee?.id ?? 0} closeDialog={() => onClose()}
                        closingConfirmation={employee?.closingConfirmation ?? false} />
                </DialogFooter>

                <DialogCloseTrigger />

            </DialogContent>

        </DialogRoot>
    );
};

export default ClousingLayout;