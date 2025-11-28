import { location } from "@models/common.model";
import { CashStarbucksModel, ClousingSaveStarbucksModel, HeaderDetailsInfoModel, StarbucksBanksModel, StarbucksTableDataModel, StarbucksTableHeader, StarbucksTableModel, StarbucksTableRow, TDCStarbucksModel } from "@models/starbucks.model";
import api from "../api/index";
import { getStatus } from "@utils/getStatus";
import { GET_BANKS, GET_STARBUCKSCDC, GET_STARBUCKSCLOUSING, GET_STARBUCKSDENOMINATIONS, GET_STARBUCKSDETAIL, SENDCASHCLOUSING, SENDCASHCLOUSING_STARBUCKS } from "./settings";
import { formatToYYYYMMDD } from "@utils/dateFormatter";
import { loadData } from "../indexedDB/localDB";
import { TDCModel, Voucher } from "@models/tdc.model";
import { TotalModel } from "@models/common.clousing.model";
import { ROLES, ROLES_EDIT } from "@models/const/menu.consts";

export const getCDCStarbucks = async (): Promise<location[]> => {
  try {
    const response = await api.get(GET_STARBUCKSCDC);
    return response.data;
  } catch (error) {
    console.error("Error fetching Starbucks data:", error);
    return [];
  }
}

export const getBanksStarbucks = async (): Promise<StarbucksBanksModel[]> => {
  try {
    const response = await api.get(GET_BANKS);
    return response.data;
  } catch (error) {
    console.error("Error fetching Starbucks data:", error);
    return [];
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

    if(response.data.registerClosure<=0){
      return {} as StarbucksTableDataModel
    }

    const handleLines = response.data.registerClosure.map((line:any)=> {
      return{
        ...line,
        id:line.crcId,
        employee: line.employe,
        status: getStatus(line.status),
        date: line.closingStartDate,
        total: line.totalPhysical,
        creditCards: line.tdc,
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
    return {} as StarbucksTableDataModel;
  }
}

export const getDetailStarbucks = async (line: StarbucksTableModel, banks: StarbucksBanksModel[], idCurrency: number): Promise<StarbucksTableRow> => {
  try {

    const response = await api.get(GET_STARBUCKSDETAIL, {
      params: {
        crcId: line.id,
        fgUpt: line.fgUpt
      }
    })

    const cashTotal = response.data.cash.lines.reduce((acc:number, curr:any) => acc + curr.totalFisico, 0);
    const creditCardTotal = response.data.tdc.lines
      .filter((item: any) => item.bank !== "No encontrado/No identificado")
      .reduce((acc:number, curr:any) => acc + curr.physical, 0);
    
    const cxcTotal = cxcData.reduce((acc, curr) => acc + curr.originalCurrency, 0); // TODO DATA FALTANTE
    const total =  cashTotal + creditCardTotal + cxcTotal;

    let cashDataDummy: CashStarbucksModel[] = response.data.cash.lines.map((item:any) => {
      return {
        id: item.id,
        currency: item.currency,
        idCurrency: item.idCurrency,
        total: item.totalFisico,
        pos: item.totalPOS,
        exchangeRate: item.exchangeRate,
        originalCurrency: 
          item.exchangeRate !== 0
            ? (item.totalFisico || 0) / (item.exchangeRate || 0)
            : 0,
        isOpen: line.status === "Abierto" ? true : false,
        denominations: item.denominations.map((denomination:any) =>{
          return {
            ...denomination,
            subtotal: denomination.denomination.toLowerCase() === "cambio" ? denomination.amount : denomination.amount * parseFloat(denomination.denomination),
          }
        })
      }
    });

    const denominations = await getSatrbucksDenominations(line.id, idCurrency);

    const cashModified = transformCashData(cashDataDummy, denominations);

    cashModified.push({
      id: cashModified.length + 1,
      currency: "Total (MXN)",
      pos: 0,
      total: cashTotal,
      idCurrency: 0,
      exchangeRate: 0,  
      originalCurrency: 0,
      isOpen: line.status === "Abierto" ? true : false,
      denominations: []
    });

    let creditCardDataDummy: TDCStarbucksModel[] = [];
    if(response.data.tdc.lines && response.data.tdc.lines.length > 2){      
      creditCardDataDummy = response.data.tdc.lines
        .filter((item: any) => item.bank !== "No encontrado/No identificado")
        .sort((a: any, b: any) => a.bank.localeCompare(b.bank))
        .map((item: any) => ({
          id: item.id,
          nameBank: item.idBank === 13 ? "BBVA Bancomer USD" : item.bank,
          idBank: item.idBank,
          total: item.physical,
          pos: item.pos,
          currencyExternalId: item.currencyExternalId,
          exchangeRate: item.exchangeRate,
          isOpen: line.status === "Abierto",
          originalCurrency: item.physical * item.exchangeRate,
          voucher: item.vouchers
        }));

        const isSantanderPresent = creditCardDataDummy.some((card) => card.nameBank === "Santander");
        if (!isSantanderPresent) {
          creditCardDataDummy.push({
            id: 796,
            nameBank: "Santander",
            idBank: 670,
            total: 0,
            pos:0,
            currencyExternalId: 5,
            exchangeRate: 0,
            isOpen: line.status === "Abierto" ? true : false,
            originalCurrency: 0,
            voucher: []
          });
        }

    } else {
      creditCardDataDummy = banks.map((bank) => {
  
        let bankId: number = 0;
        switch (bank.bankName) {
          case "Banamex - CITI":
            bankId = 656;
            break;
          case "BBVA Bancomer":
            bankId = 660;
            break;
          case "BBVA Bancomer USD":
            bankId = 662;
            break;
          case "Santander":
            bankId = 670;
            break;
          case "Amexco":
            bankId = 653;
            break;
        }
        return {
          id: null,
          nameBank: bank.bankName,
          idBank: bankId,
          total: 0,
          pos: 0,
          currencyExternalId: 0,
          exchangeRate: 0,
          isOpen: line.status === "Abierto" ? true : false,
          originalCurrency: 0,
          voucher: []
        }
      })
    }
    
    creditCardDataDummy.push({
      id: creditCardDataDummy.length + 1,
      nameBank: "Total (MXN)",
      idBank: 0,
      total: 0,
      pos: 0,
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
      totalPOSTDC: response.data.tdc.total.totalPOS,
      electronicTips: response.data.cash.electronicTips,
      tips: response.data.cash.tips,
      idCurrencySub: idCurrency
    }

    const starbucksData:StarbucksTableRow = {
      data: header,
      cash: cashModified,
      tdc: creditCardDataDummy,
      cxc: cxcDataDummy
    }

    return starbucksData;
  } catch (error) {
    console.error("Error fetching Starbucks detail data:", error);
    return {} as StarbucksTableRow;
  }

}

export const getTDCByMERA = async(id:number): Promise<TDCModel> => {
  try {
    
    const response = await api.get(GET_STARBUCKSDETAIL, {
      params: {
        crcId: id,
        fgUpt: false
      }
    })
    const userRole = await loadData.userData.get("userRole");
    const creditCardTotalPhysical = response.data.tdc.lines
      .filter((item: any) => item.bank !== "No encontrado/No identificado")
      .reduce((acc:number, curr:any) => acc + curr.physical, 0);
    const creditCardTotalPos = response.data.tdc.lines
      .filter((item: any) => item.bank !== "No encontrado/No identificado")
      .reduce((acc:number, curr:any) => acc + curr.pos, 0);

    const newTotal: TotalModel = {
      totalPOS: creditCardTotalPos,
      totalPhysical: creditCardTotalPhysical,
      difference: creditCardTotalPhysical - creditCardTotalPos
    }

    const linesFormated = response.data.tdc.lines
        .filter((item: any) => item.bank !== "No encontrado/No identificado")
        .map((item: any) => ({
          id: item.id,
          bank: item.bank,
          idBank: item.idBank,
          physical: item.physical,
          pos: item.pos,
          voucherAmount: item.vouchers.length,
          voucherAmountDisplay: item.vouchers.reduce((acc: number,current: Voucher) => current.status===true ? acc + 1 : acc, 0),
          vouchers: item.vouchers
        }));

    const newResponse = {
      ...response.data.tdc,
      isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      total:newTotal,
      lines: linesFormated,
      linesCopy: linesFormated,
    }

    return newResponse
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as TDCModel;
  }

}

export const getSatrbucksDenominations = async (cashClosure: number, idCurrency: number) => {
  try {

    const response = await api.get(GET_STARBUCKSDENOMINATIONS, {
      params: {
        idCashClosure: cashClosure,
        idCurrency: idCurrency
      }
    });
    return response.data;
  }
  catch ( e ) {
    return [];
  }
}

const transformCashData = (lines: CashStarbucksModel[], denominations: any[]): CashStarbucksModel[] => {
  if (!Array.isArray(denominations) || denominations.length === 0) return lines;
  
  const filtered = (denominations || []).filter(
    (base) => base?.currency?.name?.trim()?.toLowerCase() !== "tipo de cambio interno"
  );

  return filtered.map((base) => {
    const found = lines.find((line) => line.idCurrency === base.currency.id);

    if (found) return found;

    return {
      id: null,
      idCurrency: base.currency.id,
      currency: base.currency.symbol,
      pos: 0,
      total: 0,
      denominations: (base.denominationResponses || []).map((d: any) => ({
        id: 0,
        idDenomination: d.denominationId,
        denomination: d.denomination,
        amount: 0,
      })),
      difference: 0,
      exchangeRate: Number(base.currency.exchange) || 0,
      originalCurrency: 0,
      isOpen: lines[0].isOpen,
    };
  });
}

export const saveStarbucksClousing = async (clousingId: number, data:StarbucksTableRow, isConfirm: boolean ): Promise<string> =>{

  const cashPhysical = data.cash.reduce((acc, row) =>(acc+row.total),0);
  const cashPOS = data.cash.reduce((acc, row) =>(acc+row.pos),0);
  const tdcPhysical = data.tdc.reduce((acc, row) =>(acc+row.total),0);
  const tdcPOS = data.data.totalPOSTDC;

  const body: ClousingSaveStarbucksModel ={
    crcId: clousingId,    
    cash: {
      idCurrencySub: data.data.idCurrencySub,
      electronicTips: data.data.electronicTips,
      tips: data.data.tips,
      total:{
        totalPhysical: cashPhysical,
        totalPOS: cashPOS,
        difference: cashPOS - cashPhysical
      },
      lines: data.cash.map(line => {
        return {
          id: line.id,
          idCurrency: line.idCurrency,
          currency: line.currency,
          totalPOS: line.pos,
          totalFisico: line.total,
          difference: line.pos - line.total,
          exchangeRate: line.exchangeRate,
          originalCurrency: line.originalCurrency,
          denominations: line.denominations.map((d:any) => ({
            id: d.id ?? 0,
            idDenomination: d.idDenomination ?? 0,
            denomination: String(d.denomination ?? ''),
            amount: d.amount,
          })),
        }
      })
    },
    tdc:{
      idCurrencySub: data.data.idCurrencySub,
      total:{
        totalPhysical: tdcPhysical,
        totalPOS: tdcPOS,
        difference: tdcPhysical - tdcPOS
      },
      lines: data.tdc.map(line => {
        return {
          id: line.id,
          idBank: line.idBank,
          bank: line.nameBank,
          POS: line.pos,
          physical: line.total,
          voucherAmount: line.voucher.length,
          vouchers: line.voucher,
          totalPosOriginal: line.originalCurrency,
          exchangeRate: line.exchangeRate,
          currencyExternalId: line.currencyExternalId
        }
      })
    },
  }

  const response = await api.post(
    SENDCASHCLOUSING_STARBUCKS,
    body,
    {
      params: {
        isPreSaved: isConfirm
      }
    }
  );

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