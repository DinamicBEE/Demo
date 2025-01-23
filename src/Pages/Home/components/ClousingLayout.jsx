import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { Tabs, Box } from "@chakra-ui/react"
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"
import HeaderClousing from "./HeaderClousing"
import { lazy, useState, Suspense } from "react";
import FooterClousing from "./FooterClousing";
const CashClousing = lazy(() => import("./clousingTypes/CashClousing"));
const TDCClousing = lazy(() => import("./clousingTypes/TDCClousing"));
const CustomersClousing = lazy(() => import("./clousingTypes/CustomersClousing"));
const SpecialCustomersClousing = lazy(() => import("./clousingTypes/specialCustomers"));
//const PrepaidClousing = lazy(() => import("./clousingTypes/PrepaidClousing"));
//const EmployeesClousing = lazy(() => import("./clousingTypes/EmployeesClousing"));
//const IntercompanyClousing = lazy (() => import("./clousingTypes/intercompanyClousing"))

function ClousingLayout({ isOpen, onClose, employee}) {
    const [value, setValue] = useState("")

    return (
        <DialogRoot scrollBehavior="inside" size="cover"  open={isOpen} onOpenChange={() => onClose()} closeOnEscape={false} closeOnInteractOutside={false}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Corte de Caja {employee?.employe} </DialogTitle>
                    <Box>
                        <HeaderClousing id={employee?.id} employe={employee?.employeId}></HeaderClousing>
                    </Box>
                </DialogHeader>

                <DialogBody>                   
                    
                    <Tabs.Root onValueChange={(e) => {
                            setValue(e.value)
                        }} variant="outline" defaultValue="members" unmountOnExit colorPalette="green" justify="center" size="lg">
                        <Tabs.List>
                            <Tabs.Trigger value="cash">
                                <LuUser />
                                Efectivo
                            </Tabs.Trigger>
                            <Tabs.Trigger value="tdc">
                                <LuFolder />
                                TDC
                            </Tabs.Trigger>
                            <Tabs.Trigger value="customer">
                                <LuSquareCheck />
                                Clientes
                            </Tabs.Trigger>
                            <Tabs.Trigger value="specialCustomer">
                                <LuUser />
                                Clientes especiales
                            </Tabs.Trigger>
                            <Tabs.Trigger value="prepaid">
                                <LuFolder />
                                Prepago
                            </Tabs.Trigger>
                            <Tabs.Trigger value="employees">
                                <LuSquareCheck />
                                empleados
                            </Tabs.Trigger>
                            <Tabs.Trigger value="inter-company">
                                <LuSquareCheck />
                                Intercompañias
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Tabs.Content value="cash">
                            {value === "cash" && (
                                <Suspense fallback={<div>Cargando Efectivo...</div>}>
                                    <CashClousing data={employee} />
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value="tdc">
                            {value === "tdc" && (
                                <Suspense fallback={<div>Cargando TDC...</div>}>
                                  <TDCClousing />
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value="customer">
                            {value === "customer" && (
                                <Suspense fallback={<div>Cargando Clientes...</div>}>
                                    <CustomersClousing data={employee} />
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value="specialCustomer">
                            {value === "specialCustomer" && (
                                <Suspense fallback={<div>Cargando Clientes Especiales...</div>}>
                                    <SpecialCustomersClousing data={employee}/>
                                </Suspense>
                            )}
                        </Tabs.Content>

                        <Tabs.Content value="prepaid">
                            {/* <PrepaidClousing /> */}
                        </Tabs.Content>

                        <Tabs.Content value="employees">
                            {/* <EmployeesClousing /> */}
                        </Tabs.Content>

                        <Tabs.Content value="inter-company">
                            {/* <IntercompanyClousing /> */}
                        </Tabs.Content>

                    </Tabs.Root>

                </DialogBody>

                <DialogFooter>
                   <FooterClousing clousingType={value} clousingId={employee?.id} />
                </DialogFooter>

                <DialogCloseTrigger />

            </DialogContent>

        </DialogRoot>
    );
};

export default ClousingLayout;