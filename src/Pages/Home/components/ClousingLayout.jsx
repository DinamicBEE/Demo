import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogCloseTrigger } from "@components/ui/dialog";
import { Tabs, Box } from "@chakra-ui/react"
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu"
import { Button } from "@components/ui/button"
import HeaderClousing from "./HeaderClousing"
//import { lazy } from "react";
//const CashClousing = lazy(() => import("./CashClousing"));

const ClousingLayout = ({ isOpen, onClose, employee}) => {

    return (
        <DialogRoot size="cover" open={isOpen} onOpenChange={() => onClose()} closeOnEscape={false} closeOnInteractOutside={false} scrollBehavior="outside">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Corte de Caja {employee?.employe} </DialogTitle>
                </DialogHeader>

                <DialogBody>

                    <Box>
                        <HeaderClousing data={employee}></HeaderClousing>
                    </Box>
                    
                    
                    <Tabs.Root variant="outline" defaultValue="members" unmountOnExit colorPalette="green" justify="center" size="lg">
                        <Tabs.List>
                            <Tabs.Trigger value="cash">
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

                        <Tabs.Content value="cash">
                            {/* <CashClousing></CashClousing> */}
                        </Tabs.Content>

                        <Tabs.Content value="tdc">
                            Tab 2: Content TDC
                        </Tabs.Content>

                        <Tabs.Content value="customers">
                            Tab 3: Content Clientes
                        </Tabs.Content>

                        <Tabs.Content value="special-customers">
                            Tab 4: Content Clientes especiales
                        </Tabs.Content>

                        <Tabs.Content value="prepaid">
                            Tab 5: Content Prepago
                        </Tabs.Content>

                        <Tabs.Content value="employees">
                            Tab 6: Content Empleados
                        </Tabs.Content>

                        <Tabs.Content value="inter-company">
                            Tab 7: Content Intercompañias
                        </Tabs.Content>

                    </Tabs.Root>

                </DialogBody>

                <DialogFooter>
                   <Button>Save</Button>
                </DialogFooter>

                <DialogCloseTrigger />

            </DialogContent>

        </DialogRoot>
    );
};

export default ClousingLayout;