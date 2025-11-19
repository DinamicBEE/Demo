import api from "../api/index";
import { ClousingLinesModel, ClousingModel, ReportClousingLinesModel, ReportTotalsModel, TDC, TotalsModel, Currency } from "@models/common.clousing.model";
import { GET_CLOUSINGS } from "./settings";
import { getStatus } from "../utils/getStatus";
import { format } from "date-fns";
import { loadData } from "../indexedDB/localDB";
import { ROLES, ROLES_EDIT } from "@models/const/menu.consts";
import { STATUS } from "@models/const/status.const";

/**
 * This function returns the list of selected
 * store and subsidiary closures and the
 * totalized values
 * @param {number} subsidiary
 * @param {number} store
 * @returns {Promise<ClousingModel>}
 */
export const getGeneralInfo = async (
  store: number,
  page: number,
  startDate: Date,
  endDate: Date,
  isStarbucks: boolean
): Promise<ClousingModel> => {
  const userRole = await loadData.userData.get("userRole");
  try {
    const startDateFormat = format(startDate, "yyyy-MM-dd");
    const endDateFormat = format(endDate, "yyyy-MM-dd");

    const response = await api.get(GET_CLOUSINGS, {
      params: {
        consumeCenter: store,
        startDate: startDateFormat,
        endDate: endDateFormat,
        page: page,
        size: 100,
        serverId: 42,
      },
    });
    //console.log("response", response);
    const totalPOS = response.data.registerClosure.reduce(
      (acc: number, line: any) => acc + line.totalPOS,
      0
    );
    const totalPhysical = response.data.registerClosure.reduce(
      (acc: number, line: any) => acc + line.totalPhysical,
      0
    );

    const transformedData = {
      pagination: {
        totaRegistros: response.data.totaRegistro,
        totalPagina: response.data.totalPagina,
      },
      header: {
        subsidiaryName: "DIVIERTETE",
        storeName: "BAR GGRILL LS CUN T2A",
        date: format(endDate, "dd/MM/yyyy"),
        time: format(new Date(), "HH:mm"),
        totalPOS: totalPOS,
        totalPhysical: totalPhysical,
        difference: totalPhysical - totalPOS,
      },
      clousingLines: response.data.registerClosure.map((line: any) => ({
        ...line,
        currencies: line.currencies.map((curr: any) => curr.symbol === 'MXN' ? { ...curr, total: curr.total - (line.tipsCash || 0) } : curr),
        id: line.crcId,
        employe: line.employe,
        totalPOS: line.totalPOS,
        totalPhysical: line.totalPhysical,
        difference: line.totalPhysical - line.totalPOS,
        status: isStarbucks && line.status === "Cerrado Starbucks" ? STATUS.Open : getStatus(line.status),
        extra: line.exta,
        customer: line.customer,
        specialCustomer: line.specialCustomer,
        prepaid: line.prepaid,
        employees: line.employees,
        intercompany: line.intercompany,
        service: 0,
        discount: 0,
        iva: 150,
        closingConfirmation: false,
        creationDate: format(line.creationDate, "dd/MM/yyyy"),
        closingStartDate: format(line.closingStartDate, "dd/MM/yyyy"),
        closingEndtDate: format(line.closingEndtDate, "dd/MM/yyyy"),
        tips: line.tips || 0,
        tipsCash: line.tipsCash || 0,
        isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      })),
    };

    return transformedData as ClousingModel;
  } catch (error) {
    //console.error("Error fetching general info:", error);
    return {
      header: {
        subsidiaryName: "",
        storeName: "",
        date: "",
        time: "",
        totalPOS: 0,
        totalPhysical: 0,
        difference: 0,
      },
      clousingLines: [] as ClousingLinesModel[],
      pagination: {
        totaRegistros: 0,
        totalPagina: 0,
      },
    };
  }
};

export function exportCSV(data: any, header: any, tdcHeader: TDC[], currHeader: Currency[]) {  
  const csvString = [
    [
      "Zona",
      "Vendedor",
      "Total POS",
      "Total Físico",
      "Diferencia",
      "Estatus",
      "Extras",
      currHeader.map((item) => item.symbol).join(","),
      "Clientes General",
      "Clientes Especiales",
      "Prepago",
      "CXC Empleados",
      "Intercompañia",
      tdcHeader.map((item) => item.nameBank).join(","),
      "Propina electrónica",
    ],
    ...data.map((item: any) => [
      item.zone,
      item.employe,
      item.totalPOS,
      item.totalPhysical,
      Number(item.difference).toFixed(2),
      item.status,
      item.extra,
      ...currHeader.map((currency)=> {
        const currItem = item.currencies.find(
          (itemCurr: Currency) => itemCurr.symbol === currency.symbol
        );
        return currItem ? currItem.total : 0;
      }),
      item.customer,
      item.specialCustomer,
      item.prepaid,
      item.employees,
      item.intercompany,

      ...tdcHeader.map((tdc) => {
        const tdcItem = item.tdc.find(
          (itemTDC: TDC) => itemTDC.nameBank === tdc.nameBank
        );
        return tdcItem ? tdcItem.total : 0;
      }),
      item.tips,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvString], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${header.subsidiaryName}_${header.storeName}_${header.date}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function calculateClousingTotals(clousingLines: ClousingLinesModel[]): TotalsModel
{
  const totals = clousingLines.reduce<TotalsModel>(
    (acc: TotalsModel, curr: ClousingLinesModel) => {
      acc.totalPOS += curr.totalPOS || 0;
          acc.totalPhysical += curr.totalPhysical || 0;
          acc.difference += curr.difference || 0;
          acc.extra += curr.extra || 0;
          acc.customer += curr.customer || 0;
          acc.specialCustomer += curr.specialCustomer || 0;
          acc.prepaid += curr.prepaid || 0;
          acc.employees += curr.employees || 0;
          acc.intercompany += curr.intercompany || 0;
          acc.tips += curr.tips || 0;
          acc.tipsCash += curr.tipsCash || 0;
          curr.currencies.forEach( (currency: Currency) => {
            const currCurrency = acc.currencies.find(
              (c: { symbol: string; }) => c.symbol === currency.symbol
            );
            if (currCurrency) {
              currCurrency.total += currency.total || 0;
            } else {
              acc.currencies.push({
                id: currency.id,
                symbol: currency.symbol,
                total: currency.total || 0
              })
            }
          });
          curr.tdc.forEach((tdcItem: TDC) => {
            const existingTdc = acc.tdc.find(
              (item: { nameBank: string; }) => item.nameBank === tdcItem.nameBank
            );
            if (existingTdc) {
              existingTdc.total += tdcItem.total || 0;
            } else {
              acc.tdc.push({
                nameBank: tdcItem.nameBank,
                total: tdcItem.total || 0,
              });
            }
          });
          // acc.adyenTotal += curr.adyenTotal || 0;
          return acc;
    },
    {
      totalPOS: 0,
      totalPhysical: 0,
      difference: 0,
      extra: 0,
      customer: 0,
      specialCustomer: 0,
      prepaid: 0,
      employees: 0,
      intercompany: 0,
      tips: 0,
      tipsCash: 0,
      tdc: [] as TDC[],
      currencies: [] as Currency[],
    } as TotalsModel
  );

  return totals;
}

export function reportTotals(reportData: ReportClousingLinesModel[]): ReportTotalsModel {
  const totals: ReportTotalsModel = reportData.reduce<ReportTotalsModel>(
    (acc: ReportTotalsModel, curr) => {
      acc.isStarbucks = false;
      acc.totalPOS += curr.totalPOS;
      acc.totalPhysical += curr.totalPhysical;
      acc.difference += curr.difference;
      acc.mxn = (acc.mxn ?? 0) + (curr.mxn ?? 0);
      acc.usd! += curr.usd || 0;
      acc.eur! += curr.eur || 0;
      acc.lib! += curr.lib || 0;
      acc.can! += curr.can || 0;
      acc.customer += curr.customer;
      acc.specialCustomer += curr.specialCustomer;
      acc.prepaid += curr.prepaid;
      acc.employees += curr.employees;
      acc.intercompany += curr.intercompany;
      acc.tips += curr.tips;
      acc.tipsCash += curr.tipsCash || 0;
      acc.generalTotal = (acc.generalTotal ?? 0) + (curr.generalTotal ?? 0);
      acc.tpvBancomerUsd +=curr.tpvBancomerUsd || 0;
      acc.tpvSbdellMxn += curr.tpvSbdellMxn || 0;
      acc.tpvColdpatria += curr.tpvColdpatria || 0;
      acc.tpvAmexcoCop += curr.tpvAmexcoCop || 0;
      acc.tpvBanamexUsd += curr.tpvBanamexUsd || 0;
      acc.tpvBancomer += curr.tpvBancomer || 0;
      acc.tpvAmexco += curr.tpvAmexco || 0;
      acc.tpvBanamex += curr.tpvBanamex || 0;
      acc.tpvBbvaCop += curr.tpvBbvaCop || 0;
      acc.tpvSbdellUsd += curr.tpvSbdellUsd || 0
      acc.tpvBancoColombia += curr.tpvBancoColombia || 0;
      acc.sbdellAmexMxn += curr.sbdellAmexMxn || 0;
      acc.sbdellAmexUsd += curr.sbdellAmexUsd || 0;
      acc.tpvNetpay += curr.tpvNetpay || 0;
      acc.webKiosko += curr.webKiosko || 0;
      acc.tpvSantander += curr.tpvSantander || 0;
      acc.webappUsd += curr.webappUsd || 0;
      acc.tpvDinners += curr.tpvDinners || 0;
      acc.tpvAdyen += curr.tpvAdyen || 0;
      acc.tpvAdyenAmex += curr.tpvAdyenAmex || 0;
      acc.tpvAdyenKiosko += curr.tpvAdyenKiosko || 0;
      acc.tpvKioskoUsd += curr.tpvKioskoUsd || 0;
      return acc;
    },
    {
      isStarbucks: false,
      totalPOS: 0,
      totalPhysical: 0,
      difference: 0,
      mxn: 0,
      usd: 0,
      eur: 0,
      lib: 0,
      can: 0,
      customer: 0,
      specialCustomer: 0,
      prepaid: 0,
      employees: 0,
      intercompany: 0,
      tips: 0,
      tipsCash: 0,
      generalTotal: 0,
      tpvBancomerUsd: 0,
      tpvSbdellMxn:  0,
      tpvColdpatria: 0,
      tpvAmexcoCop: 0,
      tpvBanamexUsd: 0,
      tpvBancomer: 0,
      tpvAmexco: 0,
      tpvBanamex: 0,
      tpvBbvaCop: 0,
      tpvSbdellUsd: 0,
      tpvBancoColombia: 0,
      sbdellAmexMxn: 0,
      sbdellAmexUsd: 0,
      tpvNetpay: 0,
      webKiosko: 0,
      tpvSantander: 0,
      webappUsd: 0,
      tpvDinners: 0,
      tpvAdyen:  0,
      tpvAdyenAmex: 0,
      tpvAdyenKiosko: 0,
      tpvKioskoUsd: 0,
      currencies: [],
      subsidiariaId: 0,
      subsidiariaCurrencyId: 0,
      cdcId: 0,
      zone: "",
      modificationUser: ""
    }
  );

  return totals;  
}