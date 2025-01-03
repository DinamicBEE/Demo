import { ListProvider } from "./listsContext";
import { ClousingProvider } from "./clousingContext";

export const HomeProvider = ({ children}) => {
    
    return (
        <ListProvider>
            <ClousingProvider>
                { children }
            </ClousingProvider>
        </ListProvider>
    );

};