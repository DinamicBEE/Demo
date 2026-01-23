import { Box, Drawer, Heading, HStack, Portal, Separator, Text, VStack } from "@chakra-ui/react"
import { useColorModeValue } from "@components/ui/color-mode";
import { ReportsPropsModel } from "@models/reports.model";
import { MENU_CONFIG } from "@models/const/reports.const";
import { MdChevronRight } from "react-icons/md";
import { RiMenuUnfold3Line, RiCloseLargeFill } from "react-icons/ri";
import { useEffect, useState } from "react";
import { loadData } from "../../../indexedDB/localDB";
import { ROLES } from "@models/const/menu.consts";


function LateralMenu({ open, setOpen, currentReport, onReportClick  }: ReportsPropsModel) {
  const activeBg = useColorModeValue('green.50', 'green.900');
  const activeColor = useColorModeValue('green.700', 'green.200');
  const inactiveColor = useColorModeValue('rgb(45, 55, 72)', 'gray.200');
  const [localMenu, setLocalMenu] = useState(MENU_CONFIG)

  const handleClick = (reportCode: number) => {
    onReportClick(reportCode);
    setOpen(false);
  };

  const isActive = (reportCode: number | null) => {
    return reportCode !== null && reportCode === currentReport;
  };

  useEffect(() => {
    
    async function filterMenu(){
      const userRole = await loadData.userData.get("userRole");
      if(userRole){
        const filteredMenu = MENU_CONFIG.filter(item => item.roles.includes(userRole.value as ROLES))
        setLocalMenu(filteredMenu);
      }
    }

    filterMenu();

  },[])

  return (
    <Drawer.Root
      key={"start"}
      placement={"start"}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Drawer.Trigger >
        <HStack cursor="pointer" _hover={{textDecoration:"underline"}}
            color="green.500" fontWeight={400}>
          <Box >
                <RiMenuUnfold3Line />
          </Box>
          <Box>
            <Text >
            Abrir menú de reportes
            </Text>
        </Box>
        </HStack>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.CloseTrigger
              display="block"
              position={"absolute"}
              top={"2%"} right={"5%"}
              justifyContent="flex-end"
              fontWeight={400} cursor="pointer"
              _hover={{textDecoration:"underline"}}
            >
                <RiCloseLargeFill  />
              
            </Drawer.CloseTrigger>
            <Drawer.Header>
              <Drawer.Title>Menú de Reportes</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack p={4} align={"flex-start"} width={"full"} gap={4}>
                {localMenu.map((item) => (
                  <Box key={item.id} width="full">
                    {item.subCategories === null ? (
                      <HStack 
                        as="a" 
                        onClick={() => item.reportCode && handleClick(item.reportCode)}
                        fontWeight="bold"
                        fontSize={"16px"}
                        mb={"8px"}
                        color={isActive(item.reportCode) ? activeColor : inactiveColor}
                        bg={isActive(item.reportCode) ? activeBg : 'transparent'}
                        _hover={{ color: "green.500", cursor: "pointer" }}
                        justifyContent="space-between"
                        textAlign="left"
                        px={3}
                        py={2}
                        borderRadius="md"
                      >
                        <Text>{item.categoryName}</Text>
                        <MdChevronRight/>
                      </HStack>
                    ) : (
                      <>
                        <Heading size="md" mb={2} textAlign="left" width={"full"} px={3}>
                          {item.categoryName}
                        </Heading>
                        <VStack pl={4} align="flex-start" width={"full"} gap={2}>
                          {item.subCategories.map((subItem) => (
                            <HStack
                              key={subItem.id}
                              as="a"
                              onClick={() => handleClick(subItem.reportCode)}
                              width="full"
                              justifyContent="space-between"
                              color={isActive(subItem.reportCode) ? activeColor : inactiveColor}
                              bg={isActive(subItem.reportCode) ? activeBg : 'transparent'}
                              _hover={{ color: "green.500", cursor: "pointer" }}
                              px={3}
                              py={2}
                              borderRadius="md"
                            >
                              <Text>{subItem.name}</Text>
                              <MdChevronRight />
                            </HStack>
                          ))}
                        </VStack>
                      </>
                    )}
                    <Separator />
                  </Box>
                ))}
              </VStack>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

export default LateralMenu;