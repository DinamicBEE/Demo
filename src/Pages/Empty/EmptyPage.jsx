import { List, HStack } from "@chakra-ui/react"
import { EmptyState } from "../../components/ui/empty-state"
import { HiShieldExclamation } from "react-icons/hi";

function EmptyPage(){
    return(
        <HStack>
            <EmptyState 
                icon={<HiShieldExclamation />}
                title="Roles no encontrados"
                description="El usuario no cuenta con roles asignados"
            >

                <List.Root variant="marker">
                    <List.Item>Try to log in again</List.Item>
                    <List.Item>Contact internal support</List.Item>
                </List.Root>

            </EmptyState>
        </HStack>
    );

}

export default EmptyPage;