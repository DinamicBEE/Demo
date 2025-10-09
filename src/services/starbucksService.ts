import { location } from "@models/common.model";
import { CashStarbucksModel, HeaderDetailsInfoModel, StarbucksTableDataModel, StarbucksTableHeader, StarbucksTableModel, StarbucksTableRow, TDCStarbucksModel } from "@models/starbucks.model";
import api from "../api/index";
import { getStatus } from "@utils/getStatus";
import { GET_STARBUCKSCDC, GET_STARBUCKSCLOUSING, GET_STARBUCKSDETAIL, SENDCASHCLOUSING } from "./settings";
import { formatToYYYYMMDD } from "@utils/dateFormatter";
import { ClousingSave } from "@models/saveClousing.model";

export const getCDCStarbucks = async (): Promise<location[]> => {
  try {
    // Simulate an API call to fetch Starbucks data
    const response = await api.get(GET_STARBUCKSCDC);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching Starbucks data:", error);
    throw error;
  }
}

export const getStarbucksData = async (cdcId: number, startDate: Date, endDate: Date): Promise<StarbucksTableDataModel> => {
  try {
    const startFormatDate = formatToYYYYMMDD(startDate)
    const endFormatDate = formatToYYYYMMDD(endDate)
    
    const response = await api.get(GET_STARBUCKSCLOUSING, {
      params: {
        consumeCenter:cdcId,
        startDate: startFormatDate,
        endDate: endFormatDate
      }
    })
    console.log(response)

    if(response.data.registerClosure<=0){
      return {} as StarbucksTableDataModel
    }

    const handleLines = response.data.registerClosure.map((line:any)=> {
      return{
        id:line.crcId,
        employee: line.employe,
        status: getStatus(line.status),
        date: line.closingStartDate,
        total: line.totalPhysical,
        currencies: line.currencies,
        creditCards: line.tdc,
        cxc: line.cxc
      }
    })
        
    const allData:StarbucksTableDataModel = {
      lines:handleLines,
      headers:{
        currencies: handleLines[0].currencies || [],
        creditCards: handleLines[0].creditCards || []
      }
    }

    return allData as StarbucksTableDataModel;
  } catch (error) {
    console.error("Error fetching Starbucks data:", error);
    throw error;
  }
}

export const getDetailStarbucks = async (line: StarbucksTableModel): Promise<StarbucksTableRow> => {
  try {

    const response = await api.get(GET_STARBUCKSDETAIL, {
      params: {
        crcId: line.id
      }
    })
    console.log(response)
    const cashTotal = response.data.cash.lines.reduce((acc:number, curr:any) => acc + curr.totalFisico, 0);
    const creditCardTotal = response.data.tdc.lines.reduce((acc:number, curr:any) => acc + curr.physical, 0);
    
    const cxcTotal = cxcData.reduce((acc, curr) => acc + curr.originalCurrency, 0); // TODO DATA FALTANTE
    const total =  cashTotal + creditCardTotal + cxcTotal;

    let cashDataDummy: CashStarbucksModel[] = response.data.cash.lines.map((item:any) => {
      return {
        id: item.id,
        currency: item.currency,
        idCurrency: item.idCurrency,
        total: item.totalFisico,
        exchangeRate: item.exchangeRate,
        originalCurrency: item.originalCurrency,
        isOpen: line.status === "Abierto" ? true : false,
        denominations: item.denominations.map((denomination:any) =>{
          return {
            ...denomination,
            subtotal: denomination.denomination.toLowerCase() === "cambio" ? denomination.amount : denomination.amount * parseFloat(denomination.denomination),
          }
        })
      }
    });
    cashDataDummy.push({
      id: cashDataDummy.length + 1,
      currency: "Total (MXN)",
      total: cashTotal,
      idCurrency: 0,
      exchangeRate: 0,  
      originalCurrency: 0,
      isOpen: line.status === "Abierto" ? true : false,
      denominations: []
    });

    let creditCardDataDummy: TDCStarbucksModel[] = response.data.tdc.lines.map((item:any) => {
      return {
        id: item.id,
        nameBank: item.bank,
        idBank: item.idBank,
        total: item.physical,
        exchangeRate: item.exchangeRate,
        isOpen: line.status === "Abierto" ? true : false,
        originalCurrency: item.physical * item.exchangeRate,
        voucher: item.vouchers
      }
    });
    creditCardDataDummy.push({
      id: creditCardDataDummy.length + 1,
      nameBank: "Total (MXN)",
      idBank: 0,
      total: 0,
      exchangeRate: 0,
      isOpen: line.status === "Abierto" ? true : false,
      originalCurrency: creditCardTotal,
      voucher: []
    });

    let cxcDataDummy = [...cxcData];
    cxcDataDummy.push({
      id: 3,
      currency: "Total (MXN)",
      total: 0,
      exchangeRate: 0,
      isOpen: line.status === "Abierto" ? true : false,
      originalCurrency: cxcTotal,
    });
    const header: HeaderDetailsInfoModel = {
      date: line.date,
      cdc: line.cdc,
      total: total,
      totalPOS: response.data.total,
    }

    const starbucksData:StarbucksTableRow = {
      data: header,
      cash: cashDataDummy,
      tdc: creditCardDataDummy,
      cxc: cxcDataDummy
    }

    return starbucksData;
  } catch (error) {
    console.error("Error fetching Starbucks detail data:", error);
    throw error;
  }

}

export const saveStarbucksClousing = async (clousingId: number, data:StarbucksTableRow, isConfirm: boolean ): Promise<string> =>{

  const totals = {
    totalPOS: 0,
    totalPhysical: 0,
    difference: 0,
  }

  const body: ClousingSave ={
    id: clousingId,
    discountPhysical: 0,
    prepaid: {
      lines:[],
      total: totals
    },
    employee: {
      lines:[],
      total: totals
    },
    specialCustomer: {
      lines:[],
      total: totals
    },
    intercompany: {
      lines:[],
      total: totals
    },
    customer: {
      lines:[],
      total: totals
    },
    cash: {
      idCurrencySub: 5,
      electronicTips: 0,
      tips: 0,
      total:{
        totalPhysical: data.cash.reduce((acc, row) =>(acc+row.total),0),
        totalPOS: data.cash.reduce((acc, row) =>(acc+row.total),0),
        difference: 0
      },
      lines: data.cash.map(line => {
        return {
          id: line.id,
          currency: line.currency,
          exchangeRate: line.exchangeRate,
          originalCurrency: line.originalCurrency,
          denominations: line.denominations.map((d:any) => ({
            id: d.id ?? 0,
            idDenomination: d.idDenomination ?? 0,
            denomination: isNaN(Number(d.denomination)) ? 0 : Number(d.denomination),
            amount: d.amount,
            //subtotal: d.subtotal
          })),
          idCurrency: 1,
          totalFisico: line.total,
          totalPOS: line.total,
          difference: 0
        }
      })
    },
    tdc:{
      idCurrencySub: 5,
      total:{
        totalPhysical: data.tdc.reduce((acc, row) =>(acc+row.total),0),
        totalPOS: data.tdc.reduce((acc, row) =>(acc+row.total),0),
        difference: 0
      },
      lines: data.tdc.map(line => {
        return {
          id: line.id,
          bank: line.nameBank,
          idBank: line.idBank,
          POS: line.total,
          physical: line.total,
          voucherAmount: line.voucher.length,
          vouchers: line.voucher
        }
      })
    },
    currencies: data.cash.map(line => ({
      id: line.idCurrency,
      symbol: line.currency,
      total: line.total,
    })),
  }

  const response = await api.post(
    SENDCASHCLOUSING,
    body,
    {
      params: {
        isPreguardado: isConfirm
      }
    }
  );

  // Simulate async response and ensure the function returns a Promise<string>
  // return await new Promise<string>((resolve) => {
  //   setTimeout(() => resolve("response"), 2000);
  // });

  return response.data;

}

export const cxcData = [
  {
    id: 1,
    currency: "MXN",
    total: 0,
    exchangeRate: 1,
    isOpen: false,
    originalCurrency: 0,
  },
  {
    id: 2,
    currency: "USD",
    total: 0,
    exchangeRate: 18,
    isOpen: false,
    originalCurrency: 0,
  }
]