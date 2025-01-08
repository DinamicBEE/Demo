import { ListProvider } from "./listsContext";
import { ClousingProvider } from "./clousingContext";
import { HeadersProvider } from "../clousing/headerContext";

export const HomeProvider = ({ children}) => {
    
    return (
        <ListProvider>
            <ClousingProvider>
                <HeadersProvider>
                { children }
                </HeadersProvider>
            </ClousingProvider>
        </ListProvider>
    );

};