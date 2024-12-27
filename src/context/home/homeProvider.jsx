import { ListProvider } from "./listsContext";

export const HomeProvider = ({ children}) => {
    
    return (
        <ListProvider>
            { children }
        </ListProvider>
    );

};