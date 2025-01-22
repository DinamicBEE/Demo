import { FooterContextType, TotalModel } from '@models/common.clousing.model';
import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const footerContext = createContext<FooterContextType | undefined>(undefined);

export const useFooter = () => useContext(footerContext);

export function FooterProvider({ children }: { children: ReactNode }){
    const [footer, setFooter] = useState<any>({});
    const footerRef = useRef(footer);

    const setFooterData = (footerData: TotalModel, clousingId: number, clousingType: string) => {
        
        const currentClousingData = footerRef.current[clousingId] || {};

        const updatedFooterr  = {
            ...footerRef.current,
            [clousingId]: {
                ...currentClousingData,
                [clousingType]: footerData
            }
          }
            
        setFooter(updatedFooterr);
        footerRef.current = updatedFooterr;

    }

    const getFooterData = (clousingId: number, clousingType: string) => {

        if (footerRef.current[clousingId]) {

            const data = footerRef.current[clousingId][clousingType]

            return data
            
        } else {
            return {}
        }

    }

    const value = {
        getFooterData,
        setFooterData,
    }

    return (
        <footerContext.Provider value={value}>
            {children}
        </footerContext.Provider>
    );
}