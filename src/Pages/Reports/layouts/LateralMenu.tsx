import { Box, Button, CloseButton, Drawer, Heading, Portal, Separator } from "@chakra-ui/react"
import { ReportsPropsModel } from "@models/reports.model";
import { useState } from "react"
import { MdOutlineMenu, MdChevronRight  } from "react-icons/md";

function LateralMenu({open, setOpen}: ReportsPropsModel): JSX.Element {
  return (
    <Drawer.Root
      key={"start"}
      placement={"start"}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Drawer.Trigger asChild>
        <Button variant="outline" size="sm">
          <MdOutlineMenu />
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content >
            <Drawer.CloseTrigger
              display="block"
              position={"absolute"}
              top={"1%"} right={"5%"}
              justifyContent="flex-end"
            >
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
            <Drawer.Header >
              <Drawer.Title>Componente de Menú</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              

              <Box paddingBottom={"15px"}>
                <Heading size="lg" display={"flex"} flexDirection={"row"} alignItems={"center"}>Descuentos <MdChevronRight /></Heading>
                
              </Box>
              <Separator />
              <Box paddingBottom={"15px"}>
                <Heading size="lg" >P-MIX</Heading>
                <Heading size="md" paddingLeft={"30px"} display={"flex"} flexDirection={"row"} alignItems={"center"}>General<MdChevronRight/></Heading>
                <Heading size="md" paddingLeft={"30px"} display={"flex"} flexDirection={"row"} alignItems={"center"}>Empleados <MdChevronRight /></Heading>
              </Box>
              <Separator />
              <Box paddingBottom={"15px"}>
                <Heading size="lg">Ventas</Heading>
                <Heading size="md" paddingLeft={"30px"} display={"flex"} flexDirection={"row"} alignItems={"center"}>Empleados <MdChevronRight /></Heading>
                <Heading size="md" paddingLeft={"30px"} display={"flex"} flexDirection={"row"} alignItems={"center"}>Categorías y Familias <MdChevronRight /></Heading>
                <Heading size="md" paddingLeft={"30px"} display={"flex"} flexDirection={"row"} alignItems={"center"}>Formas de Pago <MdChevronRight /></Heading>
                <Heading size="md" paddingLeft={"30px"} display={"flex"} flexDirection={"row"} alignItems={"center"}>Ventas vs Descuentos <MdChevronRight /></Heading>
              </Box>
              <Separator />
              <Box paddingBottom={"15px"}>
                <Heading size="lg" display={"flex"} flexDirection={"row"} alignItems={"center"}>Voids <MdChevronRight /></Heading>
              </Box>
              <Separator />
              <Box paddingBottom={"15px"}>
                <Heading size="lg" display={"flex"} flexDirection={"row"} alignItems={"center"}>Cupones <MdChevronRight /></Heading>
              </Box>
              <Separator />


            </Drawer.Body>
            {/* <Drawer.Footer>
              <Button variant="outline">Cancel</Button>
              <Button>Save</Button>
            </Drawer.Footer> */}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
  
}

export default LateralMenu;