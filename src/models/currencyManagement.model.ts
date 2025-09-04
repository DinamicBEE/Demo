import { CurrencyModel } from "./common.clousing.model";

export interface ExchangeRateData {
    totalSale: number; 
    exchangeRate: number;
}

export interface NewExchangeRate extends ExchangeRateData {
    newTotalSale: number;
    newExchangeRate: number;
    userId: number;
    currencyId: number;
}

export interface AddExchangeRateProps {
    isOpen:boolean; 
    onClose: () => void;
    curriesProps: CurrencyModel[] | [];
}

export interface CurrenciesDataModel {
    id: number; 
    date: string; 
    currency: string; 
    employee: string; 
    exchangeRate: number; 
    newExchangeRate: number; 
    totalSales: number; 
    newTotalSales: number;
}