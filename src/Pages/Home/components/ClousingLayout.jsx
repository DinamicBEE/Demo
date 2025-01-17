import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger } from "@components/ui/dialog";
import { Tabs, Box } from "@chakra-ui/react"
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"
//import { Button } from "@components/ui/button"
import HeaderClousing from "./HeaderClousing"
import { lazy } from "react";
const CashClousing = lazy(() => import("./clousingTypes/CashClousing"));
const TDCClousing = lazy(() => import("./clousingTypes/TDCClousing"));
const CustomersClousing = lazy(() => import("./clousingTypes/CustomersClousing"));
const SpecialCustomersClousing = lazy(() => import("./clousingTypes/specialCustomers"));
const PrepaidClousing = lazy(() => import("./clousingTypes/PrepaidClousing"));
const EmployeesClousing = lazy(() => import("./clousingTypes/EmployeesClousing"));
const IntercompanyClousing = lazy (() => import("./clousingTypes/intercompanyClousing"))

function ClousingLayout({ isOpen, onClose, employee}) {

    return (
        <DialogRoot scrollBehavior="inside" size="cover"  open={isOpen} onOpenChange={() => onClose()} closeOnEscape={false} closeOnInteractOutside={false}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Corte de Caja {employee?.Id} </DialogTitle>
                </DialogHeader>

                <DialogBody>

                    <Box>
                        <HeaderClousing id={employee?.id} employe={employee?.employeId}></HeaderClousing>
                    </Box>
                    
                    
                    <Tabs.Root variant="outline" defaultValue="members" unmountOnExit colorPalette="green" justify="center" size="lg">
                        <Tabs.List>
                            <Tabs.Trigger >
                                <LuUser />
                                Efectivo
                            </Tabs.Trigger>
                            <Tabs.Trigger value="tdc">
                                <LuFolder />
                                TDC
                            </Tabs.Trigger>
                            <Tabs.Trigger value="customers">
                                <LuSquareCheck />
                                Clientes
                            </Tabs.Trigger>
                            <Tabs.Trigger value="special-customers">
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

                        <Tabs.Content>
                            <CashClousing data={employee} />
                        </Tabs.Content>

                        <Tabs.Content value="tdc">
                            <TDCClousing />
                        </Tabs.Content>

                        <Tabs.Content value="customers">
                            <CustomersClousing data={employee} />
                        </Tabs.Content>

                        <Tabs.Content value="special-customers">
                            <SpecialCustomersClousing />
                        </Tabs.Content>

                        <Tabs.Content value="prepaid">
                            <PrepaidClousing />
                        </Tabs.Content>

                        <Tabs.Content value="employees">
                            <EmployeesClousing />
                        </Tabs.Content>

                        <Tabs.Content value="inter-company">
                            <IntercompanyClousing />
                        </Tabs.Content>

                    </Tabs.Root>

                </DialogBody>

                {/* <DialogFooter>
                   <Button>Save</Button>
                </DialogFooter> */}

                <DialogCloseTrigger />

            </DialogContent>

        </DialogRoot>
    );
};

export default ClousingLayout;