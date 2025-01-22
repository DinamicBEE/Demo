import { ReactNode } from 'react';
import { ListProvider } from "./listsContext";
import { ClousingProvider } from "./clousingContext";
import { HeadersProvider } from "../clousing/headerContext";
import { ClousingDataProvider } from "../clousing/clousingProvider";

export const HomeProvider = ({ children }: { children: ReactNode }) => {
    
    return (
        <ListProvider>
            <ClousingProvider>
                <HeadersProvider>
                    <ClousingDataProvider>
                        { children }
                    </ClousingDataProvider>
                </HeadersProvider>
            </ClousingProvider>
        </ListProvider>
    );

};