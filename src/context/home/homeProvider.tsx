import { ReactNode } from 'react';
import { ListProvider } from "./listsContext";
import { ClousingProvider } from "./clousingContext";
import { HeadersProvider } from "./headerContext";
import { ClousingDataProvider } from "../clousing/clousingProvider";
import { FooterProvider } from './footerClousingContext';

export const HomeProvider = ({ children }: { children: ReactNode }) => {
    
    return (
        <ListProvider>
            <ClousingProvider>
                <HeadersProvider>
                    <FooterProvider>
                        <ClousingDataProvider>
                            { children }
                        </ClousingDataProvider>
                    </FooterProvider>
                </HeadersProvider>
            </ClousingProvider>
        </ListProvider>
    );

};