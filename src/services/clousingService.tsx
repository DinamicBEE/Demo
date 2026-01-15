import { v4 as uuidv4 } from "uuid";
import { EXPECTED_COLUMNS, FIELD_MAPPING, FileResult, ProcessResult } from "@models/adyen.model";
import { CashLines, CashModel } from "@models/cash.model";
import { DataServiceModel, ResponseModel } from "@models/common.clousing.model";
import { CustomerLines, CustomerModel } from "@models/customer.model";
import { EmployeeLine, EmployeeModel, PdfData, PdfRequestNSDto } from "@models/employee.model";
import { IntercompanyLine, IntercompanyModel } from "@models/intercompany.model";
import { CouponCatalogModel, PrepaidLineModel, PrepaidModel } from "@models/prepaid.model";
import { SpecialCustomerLines, SpecialCustomerModel } from "@models/specialCustome.model";
import { BankLineModel, TDCModel, Voucher } from "@models/tdc.model";
import { CASH, TDC, CLIENTS, EMPLOYEE_INSERT, INTERCOMPANY, SP_CLIENTS, GET_COUPONS, GET_PREPAID, SENDCASHCLOUSING, EMPLOYEEPAYROLLDISCOUNT, UPDATE_SALESTICKET, UPDATE_SALESTICKETCDC } from "./settings";
import api from "../api/index";
import { format, isValid, isBefore, startOfDay } from "date-fns";
import Papa from "papaparse";
import { ClousingSave } from "@models/saveClousing.model";
import { loadData } from "../indexedDB/localDB";
import { ROLES, ROLES_EDIT } from "@models/const/menu.consts";
import { AxiosError } from "axios";

/**
 * This function gets the information
 * of the selected box cut cash section
 * @param {number} clousingId
 * @returns {Promise<CashModel>}
 */
export const getCashClousing = async (
  clousingId: number,
  idCurrency: number
): Promise<ResponseModel> => {
  try {
    
    const response = await api.get(CASH, {
      params: {
        crcId: clousingId,
        idCurrency: idCurrency,
      },
    });
    const userRole = await loadData.userData.get("userRole");    
    const cashDataCopy = {
      ...response.data,
      isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      currencies: response.data.lines.map((currency: CashLines) => ({
        ...currency,
        id: currency.id === null ? "cash-" + uuidv4() : currency.id,
        difference: currency.totalPOS < 0 ? Math.abs(currency.totalPOS) : currency.difference,
      })),
    };

    const dummy = cashDataCopy;

    const data = {
      ...dummy,
    };
    const responseData: ResponseModel = {
      success: true,
      data: data,
    };
    
    return responseData;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);

    const responseData: ResponseModel = {
      success: false,
      data: {} as CashModel,
    };

    return responseData;
  }
};

/**
 * This function gets the information
 * of the selected box cut tdc section
 * @param {number} clousingId
 * @returns {Promise<TDCModel>}
 */
export const getTDCClousing = async (
  clousingId: number,
  idCurrency: number
): Promise<TDCModel> => {

  try {
    const response = await api.get(TDC, {
      params: { crcId: clousingId, idCurrency: idCurrency },
    });   
    const userRole = await loadData.userData.get("userRole");
    const newResponse = {
      ...response.data,
      isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      lines: response.data.lines.map((line: any) => ({
        ...line,
        // Generate new UUID for null IDs, otherwise keep existing ID
        id: line.id === null ? "tdc-" + uuidv4() : line.id,
        voucherAmountDisplay: line.vouchers.filter((v: any) => v.status).length,
        vouchers: line.vouchers.map((v: any) => ({
          ...v,
          // Generate new UUID for null IDs, otherwise keep existing ID
          idCustom: "voucher-" + uuidv4(),
          dateDisplay: format(new Date(v.date), "dd/MM/yyyy"),
        })),
        isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      })),
      total:{
        difference: response.data.total.totalPhysical - response.data.total.totalPOS,
        totalPOS: response.data.total.totalPOS,
        totalPhysical: response.data.total.totalPhysical
      }
    };

    const adyenLines: BankLineModel[] = newResponse.lines.filter((line:BankLineModel) => line.bank === "TPV ADYEN")

    if(adyenLines.length >= 2){

      const newAdyenLine: BankLineModel ={
        id: adyenLines[0].id,
        idBank: adyenLines[0].idBank,
        bank: adyenLines[0].bank,
        physical: adyenLines.reduce((acc, curr) => acc + curr.physical, 0 ),
        pos: adyenLines.reduce((acc, curr) => acc + curr.pos, 0),
        voucherAmount: adyenLines.reduce((acc, curr) => acc + curr.voucherAmount, 0),
        voucherAmountDisplay: adyenLines.reduce((acc, curr) => acc + curr.voucherAmountDisplay, 0),
        vouchers: adyenLines.reduce((acc:any, curr) => acc.concat(curr.vouchers), []),
        isRoleEditable: adyenLines[0].isRoleEditable,
      }

      const newLines = newResponse.lines.filter((item:BankLineModel)=> item.bank != "TPV ADYEN")

      newLines.push(newAdyenLine)

      const copy = {
        ...newResponse,
        lines: newLines,
        linesCopy: newResponse.lines
      }

      return copy
    } else {
      return {
        ...newResponse,
        linesCopy: newResponse.lines
      };
    }

  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as TDCModel;
  }
};

/**
 * This feature gets the information
 * of the selected box cut customer section
 * @param {number} clousingId
 * @returns {Promise<CustomerModel>}
 */
export const getCustomerClousing = async (
  clousingId: number
): Promise<ResponseModel> => {
  const userRole = await loadData.userData.get("userRole");
  try {
    const response = await api.get(CLIENTS, {
      params: { idCashRegisterClosure: clousingId },
    });

    //console.log(response)
    const lines = response.data.generalClientResponseList.map((line: any) => {

      const { amountMx, coupons, ...restOfLine } = line;

      // Crear nuevo objeto con las propiedades deseadas
      return {
        ...restOfLine,
        amountMXN: Number(amountMx) ?? 0,
        coupons: Number(coupons) ?? 0,
        amount: Number(line.amount) ?? 0,
        exchangeRate: Number(line.exchangeRate) ?? 0,
        valuePAX: Number(line.pax) ?? 0,
        currencyLabel: line.currency ?? "",
        // Generate new UUID for null IDs, otherwise keep existing ID
        id: line.id === null ? "customer-" + uuidv4() : line.id,
      };
    });

    const newTotalFisico = lines.reduce(
      (acc: number, curr: { amountMXN: number }) => acc + curr.amountMXN,
      0
    );
    const newDifference = newTotalFisico - (response.data.totalPos ?? 0);
    const data: CustomerModel = {
      id: clousingId,
      isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      total: {
        difference: newDifference,//response.data.totalPhysical - response.data.totalPos,
        totalPOS: response.data.totalPos ?? 0,
        totalPhysical: response.data.totalPhysical ?? 0,
        differenceCupons: response.data.diferenciaCupones ?? 0,
      },
      lines: [...lines],
    };
    const responseData: ResponseModel = {
      success: true,
      data: data,
    };

    return responseData;
  } catch (error: any) {
    const responseData: ResponseModel = {
      success: false,
      code: error.response?.status,
      data: {
        id: clousingId,
        total: {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
        lines: [],
        isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      } as CustomerModel,
      error: error as AxiosError,
    };
    return responseData;
  }
};

/**
 * This feature gets the information
 * of the selected box specialcustomer section
 * @param {number} clousingId
 * @returns {Promise<CustomerModel>}
 */
export const getSpecialCustomerClousing = async (
  clousingId: number,
  idCurrency: number
): Promise<ResponseModel> => {
  const userRole = await loadData.userData.get("userRole");
  try {
    const response = await api.get(SP_CLIENTS, {
      params: { idCashRegisterClosure: clousingId, idCurrency },
    });
    const lines = response.data.specialClientResponses.map(
      (line: any) => ({
        ...line,
        id: line.id === null ? "customerSpecial-" + uuidv4() : line.id,
        //couponPrice: 0,
      })
    );

    /* const newTotalPOS = lines
      .map((line: any) => Number(line.bill))
      .reduce((acc: number, curr: number) => acc + curr, 0); */
      
    const newTotalFisico = lines
      .map((line: any) => Number(line.ammountMXN))
      .reduce((acc: number, curr: number) => acc + curr, 0);
    const newDiff = Number(newTotalFisico - response.data.totalPos);

    const data = {
      id: clousingId,
      total: {
        totalPOS: response.data.totalPos ?? 0,
        totalPhysical: newTotalFisico ?? 0,
        difference: newDiff ?? 0,
      },
      lines: [...lines],
      isRoleEditable:userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
    };

    const responseData: ResponseModel = {
      success: true,
      data: data,
    };

    return responseData;
  } catch (error) {
    const responseData: ResponseModel = {
      success: false,
      data: {
        id: clousingId,
        total: {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
        lines: [],
        isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      } as SpecialCustomerModel,
      error: error as AxiosError,
    };
    return responseData;
  }
};

/**
 * This feature gets the information
 * of the selected box prepaid section
 * @param {number} clousingId
 * @returns {Promise<PrepaidModel>}
 */
export const getPrepaidClousing = async (
  clousingId: number,
  dateClousing: string
): Promise<ResponseModel> => {
  // console.log(clousingId)
  const userRole = await loadData.userData.get("userRole");
  try {
    const response = await api.get(GET_PREPAID, {
      params: { idCashRegisterClosure: clousingId },
    });

    const validLines = response.data.prepagoResponse.filter(
      (line: PrepaidLineModel) => typeof line.id === "number" && line.id !== 0
    );
    
    
    const updateLines = validLines.length
      ? validLines.map((item: PrepaidLineModel) => ({
          ...item,
          id: item.id === 0 ? "prepaid-" + uuidv4() : item.id,
          edit: item.supplementsQuantity > 0,
          coupons:
            item.coupons?.map((coupon: CouponCatalogModel) => ({
              ...coupon,
              folioCustom: coupon.folio.split("_")[1],
              validityDateCustom: format(new Date(coupon.validityDate), "dd/MM/yyyy"),
              isExpired: isBefore(
                startOfDay(new Date(coupon.validityDate)),
                startOfDay(new Date(dateClousing))
              ),
            })) ?? [],
        }))
      : [];

    const data: PrepaidModel = {
      employeeId: clousingId,
      id: clousingId,
      total: {
        totalPOS: response.data.totalPos ?? 0,
        totalPhysical: response.data.totalPhysical ?? 0,
        difference: response.data.totalDifference ?? 0,
      },
      lines: updateLines,
      isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
    };

    //console.log(data)
    const responseData: ResponseModel = {
      success: true,
      data: data,
    }

    return responseData;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return {
      success: false,
      data:{
        employeeId: clousingId,
        id: clousingId,
        total: {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
        lines: [],
        isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      } as PrepaidModel}
  }
};

export const getCouponCatalog = async (
  clousingId: number,
  dateClousing: string
): Promise<CouponCatalogModel[]> => {
  // console.log(clousingId)

  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const response = await api.get(GET_COUPONS, {
      params: { consumer: clousingId },
    });    

    const transformedData = response.data.map((item: CouponCatalogModel) => ({
      ...item,
      // Generate new UUID for null IDs, otherwise keep existing ID
      folioCustom: item.folio.split("_")[1],
      clientCustom: item.client
        .replace(/^\d+\s+/, "") // Remove leading numbers and spaces
        .toLowerCase() // Convert all to lowercase
        .replace(/^(.)/, (match) => match.toUpperCase()), // Eliminar números al inicio
      validityDateCustom: format(item.validityDate, "dd/MM/yyyy"),
      isExpired: isBefore(
        // Compare only the date part by setting both dates to start of day
        (new Date(item.validityDate)),
        startOfDay(new Date())
      ),
    }));
    
    return transformedData;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as CouponCatalogModel[];
  }
};

/**
 * This function gets the list of
 * closures from the employees section
 * @param {number} clousingId
 * @returns {Promise<EmployeeModel>}
 */
export const getEmployeeClousing = async (
  clousingId: number
): Promise<EmployeeModel> => {
  // console.log(clousingId)
  if (!clousingId) return [] as unknown as EmployeeModel;
  const userRole = await loadData.userData.get("userRole");
  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const responseAxios = await api.get(EMPLOYEE_INSERT, {
      params: { crcId: clousingId },
    });
        
    const totalPhysical = responseAxios.data.reduce(
      (acc: number, curr: any) => acc + curr.amount,
      0
    );
    const totalPOS = responseAxios.data.totalPos ?? 0;
    const difference = totalPhysical - totalPOS;

    const employeeDataCopyAxios = {
      id: clousingId,
      total: {
        totalPOS: totalPOS,
        totalPhysical: totalPhysical,
        difference: difference,
      },
      lines: responseAxios.data.map((line: any) => ({
        ...line,
        id: line.id === null ? "employee-" + uuidv4() : line.id,
      })),
      isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
    };

    const response = /* employeeDataCopy; */ employeeDataCopyAxios;

    const data = {
      ...response,
    };

    return data;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as EmployeeModel;
  }
};

/**
 * This function gets the list of
 * closures from the inter-company section
 * @param {number} clousingId
 * @param {number} employeeId
 * @returns {Promise<IntercompanyModel>}
 */
export const getIntercompanyClousing = async (
  clousingId: number
): Promise<IntercompanyModel> => {
  // console.log(clousingId)
  if (!clousingId) return {} as IntercompanyModel;
  const userRole = await loadData.userData.get("userRole");
  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const response = await api.get(INTERCOMPANY, {
      params: { idCashRegisterClosure: clousingId },
    });
    const totalPhysical = response.data.response.reduce(
      (acc: number, curr: any) => acc + Number(curr.physicalAmount),
      0
    );
    const totalPOS = response.data.response.reduce(
      (acc: number, curr: any) => acc + Number(curr.amountPos),
      0
    );
    const difference = totalPhysical - totalPOS;    

    const responseCopy = {
      id: clousingId,
      employeeId: response.data.employeeId ?? 0,
      total: {
        totalPOS: totalPOS,
        totalPhysical: totalPhysical,
        difference: difference,
      },
      lines: response.data.response.map((line: any) => ({
        ...line,
        amount: Number(line.amountPos),
        physicalAmount: Number(line.physicalAmount),
        // Generate new UUID for null IDs, otherwise keep existing ID
        id: line.id === null ? "intercompany-" + uuidv4() : line.id,
      })),
      isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
    };

    const data = {
      ...responseCopy,
    };

    return data;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return {
      id: clousingId,
      employeeId: 0,
      total: {
        totalPOS: 0,
        totalPhysical: 0,
        difference: 0,
      },
      lines: [],
      isRoleEditable:userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
    };
  }
};

export const getPDF = async (obj: PdfRequestNSDto): Promise<PdfData | null> => {
  try {
    const response = await api.post(EMPLOYEEPAYROLLDISCOUNT, obj);
    const data: PdfData = response.data;

    if (!data) {
      return null;
    }

    if (obj.pdf === false) {
      return data;
    }

    if (obj.pdf && data.b64) {
      const byteCharacters = atob(data.b64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/pdf;charset=utf-8",
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Descuento_${obj.firstname || "empleado"}.pdf`;
      document.body.appendChild(a);
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 1000);

      return data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};


export const sendCashClousing = async (dataService: DataServiceModel, isConfirm: boolean, isStarbucks: boolean) => {
  try {
    //console.log(dataService)
     const mapCustomerLines = (lines: CustomerLines[]) =>
      lines.map(
        ({
          currencyId,
          pax: valuePAX,
          currency,
          id,
          currencyLabel,
          ...rest
        }) => ({
          ...rest,
          customers: rest.nameClient,
          clientId: rest.idClient,
          valuePAX,
          id: typeof id === "number" ? id : null,
          currency: currencyId,
        })
      );

    const mapIntercompanyLines = (lines: IntercompanyLine[]) =>
      lines.map(({ id, ...rest }) => ({
        ...rest,
        id: typeof id === "number" ? id : null,
        ticket: rest.ticket,
      }));

    const mapSpecialCustomerLines = (lines: SpecialCustomerLines[]) =>
      lines.map(
        ({
          ammountMXN: amountMXN,
          ammountUSD: valueUSD,
          ammount: value,
          bill: consumption,
          guestCheckId: guestCheckId,
          check: Check,
          couponFolio: folioCuopon,
          couponPrice: priceCuopon,
          pax: pax,
          id,
          couponFolioUSD: folioCuoponUSD,
          ...rest
        }) => ({
          ...rest,
          id: typeof id === "number" ? id : null,
          amountMXN,
          valueUSD,
          value,
          consumption,
          guestCheckId,
          Check,
          folioCuopon,
          priceCuopon,
          pax,
          folioCuoponUSD,
        })
      );

    const mapEmployeeLines = (lines: EmployeeLine[]) =>
      lines.map(({ employeeNumber, reason, ticketNumber, ...rest }) => ({
        id: typeof rest.id === "number" ? rest.id : null,
        amount: rest.amount,
        employeeId: rest.employeeId ?? 0,
        reasonId: rest.reasonId ?? 0,
        ticketId: rest.ticketId ?? null,
        externalId: rest?.externalId ?? undefined,
      }));

    const mapPrepaidLines = (lines: PrepaidLineModel[]) =>
      lines.map((line) => ({
        ...line,
        id: typeof line.id === "number" && line.id !== 0 ? line.id : null,
        coupons: line.coupons
          .filter((coupon) => coupon.isExpired === false)
          .map((coupon) => ({
            ...coupon
          })),
      }));

    const mapTdcLines = (lines: BankLineModel[], linesCopy: BankLineModel[]) => {
      const first = linesCopy.map(copy => {
        return {
          ...copy,
          vouchers: copy.vouchers.map(voucher =>{
            let foundVoucher: Voucher | undefined;
            
            for (const line of lines) {
              foundVoucher = line.vouchers.find(linVou => linVou.uniqueIdVoucher === voucher.uniqueIdVoucher);
              if (foundVoucher) break;
            }
            
            return foundVoucher ? foundVoucher : voucher;
          })
        }
      })
      
      return first.map(({ ...rest }) => ({
        ...rest,
        id: typeof rest.id === "number" ? rest.id : null,
        POS: rest.pos,
        physical: rest.vouchers.reduce((acc,current) => current.status===true ? acc + current.amountConversion : acc, 0),
        voucherAmountDisplay: rest.vouchers.reduce((acc,current) => current.status===true ? acc + 1 : acc, 0),
        vouchers: rest.vouchers.map((voucher) => ({
          ...voucher
        })),
      }));
    };

    const mapCurrLines = (lines: CashLines[]) => {
      return lines.map(({...curr}) => ({
        id: curr.idCurrency,
        symbol: curr.currency.toUpperCase(),
        total: curr.totalFisico || 0
      }))
    }
    const body: ClousingSave = {
      id: dataService.clousingId,
      discountPhysical: dataService.discountPhysical || 0,
      cash: {
        idCurrencySub: dataService.idCurrency,
        electronicTips: dataService.cash.electronicTips,
        lines:
          dataService.cash && dataService.cash.currencies
            ? (dataService.cash.currencies as any[]).map(({ id, ...rest }) => ({
                id: typeof id === "number" ? Number(id) : null,
                ...rest,
              }))
            : [],
        tips: dataService.cash.tips ?? 0,
        total: dataService.cash.total ?? { totalPOS: 0, totalPhysical: 0, difference: 0 },
      },
      customer: {
        lines: mapCustomerLines(dataService.customer != undefined ? dataService.customer.lines : []),
        total: dataService.customer != undefined ? {
          ...dataService.customer.total,
          diferenciaCupones: dataService.customer.total.differenceCupons || 0,
        } :
        {
          totalPOS:  0,
          totalPhysical:  0,
          difference:  0,
          diferenciaCupones: 0,
        },
      },
      intercompany: {
        lines: mapIntercompanyLines(dataService.intercompany != undefined ? dataService.intercompany.lines : []),
        total: dataService.intercompany != undefined && dataService.intercompany.total ? dataService.intercompany.total : {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
      },
      specialCustomer: {
        lines: mapSpecialCustomerLines(dataService.specialCustomer != undefined ? dataService.specialCustomer.lines : []),
        total: dataService.specialCustomer != undefined && dataService.specialCustomer.total ? dataService.specialCustomer.total : {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
      },
      employee: {
        total: dataService.employee
          ?.total ?? {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
        lines: mapEmployeeLines(
          dataService.employee.lines ?? []
        ),
      },
      prepaid: {
        lines: mapPrepaidLines(dataService.prepaid != undefined ? dataService.prepaid.lines : []),
        total: dataService.prepaid != undefined && dataService.prepaid.total ? dataService.prepaid.total : {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
      },
      tdc: {
        idCurrencySub: dataService.idCurrency,
        lines: mapTdcLines(dataService.tdc != undefined ? dataService.tdc.lines : [], dataService.tdc.linesCopy ?? []),
        total: dataService.tdc != undefined && dataService.tdc.total ? dataService.tdc.total : {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
      },
      currencies:  mapCurrLines(dataService.cash.currencies ?? []),
    };

    const response = await api.post(
      SENDCASHCLOUSING,
      body,
      {
        params: {
          isPreguardado: isConfirm,
          isStarbucks: isStarbucks
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al enviar los valores generales:", error);
    return [];
  }
};

/**
 * Procesa múltiples archivos CSV y transforma sus datos según el mapeo especificado
 * @param files Array de archivos File para procesar
 * @returns Promesa que resuelve con el resultado del procesamiento
 */
export const processFiles = async (
  files: File[],
): Promise<ProcessResult> => {
  // Validación inicial de archivos
  if (!files?.length) {
    return {
      success: false,
      error: "No se proporcionaron archivos para procesar",
    };
  }

  try {
    // Primera fase: validar todos los archivos antes de procesarlos
    const validationErrors: { fileName: string; error: string }[] = [];

    // Función para validar encabezados
    const validateHeaders = (headers: string[], fileName: string): void => {
      const missingColumns = EXPECTED_COLUMNS.filter(
        (column) =>
          !headers
            .map((h) => h.trim().toLowerCase())
            .includes(column.trim().toLowerCase())
      );

      if (missingColumns.length > 0) {
        throw new Error(`Columnas faltantes: ${missingColumns.join(", ")}`);
      }
    };

    // Configuración de Papa Parse para validación de encabezados
    const validationConfig = {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      preview: 1, // Solo necesitamos validar los encabezados
    };

    // Validar todos los archivos primero
    for (const file of files) {
      try {
        const parseResult = await new Promise<Papa.ParseResult<unknown>>(
          (resolve, reject) => {
            Papa.parse(file, {
              ...validationConfig,
              complete: resolve,
              error: (error) =>
                reject(new Error(`Error de parsing: ${error.message}`)),
            });
          }
        );

        const headers = parseResult.meta.fields || [];
        validateHeaders(headers, file.name);
      } catch (error) {
        validationErrors.push({
          fileName: file.name,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Si hay errores de validación, no continuar con el procesamiento
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: `Errores de validación en archivos: ${validationErrors
          .map((e) => `${e.fileName}: ${e.error}`)
          .join("; ")}`,
      };
    }

    // Si llegamos aquí, todos los archivos pasaron la validación inicial
    let allData: Record<string, unknown>[] = [];
    const processedFileNames: string[] = [];

    // Transformar row optimizada con mejor manejo de tipos
    const transformRow = (
      row: Record<string, unknown>
    ): Record<string, unknown> => {
      const transformedRow: Record<string, unknown> = {};

      // Procesar los campos según el mapeo
      Object.entries(FIELD_MAPPING).forEach(([csvColumn, targetField]) => {
        if (row[csvColumn] !== undefined) {
          // Procesamiento específico para Merchant Reference
          if (
            csvColumn.toLowerCase().trim() ===
              "Merchant Reference".toLowerCase() &&
            typeof row[csvColumn] === "string"
          ) {
            const merchantRef = row[csvColumn] as string;
            const parts = merchantRef.split("-");
            transformedRow[targetField] =
              parts.length >= 2 ? parts[1] : merchantRef;
          }
          else if (
            csvColumn.toLowerCase().trim() === "Creation Date".toLowerCase() &&
            typeof row[csvColumn] === "string"
          ) {
            const dateSplit = (row[csvColumn] as string).split(" ");
            const dateShort = dateSplit[0];

            // Intentar parsear la fecha con cada formato hasta encontrar uno válido
            let fechaParseada = null;
            let fechaFormateada = "";

            // Si ninguno de los formatos funciona, intentar con Date()
            if (!isValid(fechaParseada)) {
              const fallbackDate = new Date(dateShort);
              if (isValid(fallbackDate)) {
                fechaFormateada = format(fallbackDate, "dd/MM/yyyy");
              } else {
                fechaFormateada = dateShort; // mantener el formato original como fallback
              }
            }

            transformedRow[targetField] = fechaFormateada;
          }
          // Transferencia directa para otros campos
          else {
            transformedRow[targetField] = row[csvColumn];
          }
        }
      });

      // Preservar campos sin mapeo
      Object.keys(row).forEach((key) => {
        if (
          !Object.keys(FIELD_MAPPING).includes(key) &&
          row[key] !== undefined
        ) {
          transformedRow[key] = row[key];
        }
      });

      return transformedRow;
    };

    // Configuración de Papa Parse para procesamiento completo
    const config = {
      header: true,
      skipEmptyLines: true,
      worker: true,
      dynamicTyping: true,
    };

    // Procesar archivos en paralelo ahora que sabemos que todos tienen la estructura correcta
    const processingPromises = files.map((file) =>
      new Promise<{ data: Record<string, unknown>[]; fileName: string }>(
        (resolve, reject) => {
          Papa.parse(file, {
            ...config,
            complete: (results) => {
              try {
                if (!Array.isArray(results.data) || results.data.length === 0) {
                  reject(new Error("No se encontraron datos válidos"));
                  return;
                }

                const transformedData = (
                  results.data as Record<string, unknown>[]
                )
                  .map(transformRow)
                  .filter(Boolean); // Filtrar valores nulos o undefined
                resolve({ data: transformedData, fileName: file.name });
              } catch (error) {
                reject(error);
              }
            },
            error: (error) =>
              reject(new Error(`Error de parsing: ${error.message}`)),
          });
        }
      ).catch((error) => {
        // Este bloque no debería ejecutarse si la validación previa fue exitosa
        console.error(`Error inesperado procesando ${file.name}:`, error);
        throw error; // Propagar el error para detener todo el proceso
      })
    );

    // Esperar a que todos los archivos se procesen
    const results = await Promise.all(processingPromises);

    // Consolidar resultados
    results.forEach(({ data, fileName }) => {
      if (data.length > 0) {
        allData = [...allData, ...data];
        processedFileNames.push(fileName);
      }
    });

    // Eliminar duplicados usando Map para mejor rendimiento
    const uniqueMap = new Map<string, Record<string, unknown>>();

    // console.log(allData);

    allData.forEach((record) => {
      const pspReference = record["Psp Reference"]
        ? String(record["Psp Reference"])
        : "";
      // Solo guardar si la clave no existe o está vacía
      if (pspReference && !uniqueMap.has(pspReference)) {
        uniqueMap.set(pspReference, record);
      }
    });

    const uniqueData = Array.from(uniqueMap.values());

    // Resultados detallados por archivo
    const fileResults: FileResult[] = processedFileNames.map((fileName) => {
      const fileData = results.find((r) => r.fileName === fileName)?.data || [];
      return {
        fileName,
        data: fileData,
        rowCount: fileData.length,
      };
    });

    return {
      success: true,
      processedFiles: processedFileNames.length,
      processedFileNames,
      consolidatedData: uniqueData,
      totalRecords: uniqueData.length,
      results: fileResults,
    };
  } catch (error) {
    console.error("Error global en el procesamiento:", error);
    return {
      success: false,
      error: String(error),
    };
  }
};

export const updateSalesTicket = async (startDate: Date, endDate: Date, revenue: number) => {
  try {

    const startDateFormat = format(startDate, "yyyy-MM-dd");
    const endDateFormat = format(endDate, "yyyy-MM-dd");

    const response = await api.get(UPDATE_SALESTICKET,
      {
        params: {
          start:startDateFormat,
          end:endDateFormat,
          revenue:revenue
        }
      }
    )

    if(response.status === 200){
      return true
    } 

  } catch (error) {

    return false;
    
  }
}

export const updateSalesTicketCDC = async (startDate: string, cdc: number, id: number) => {
  try {

    const startDateFormat = startDate.split("/");

    const response = await api.get(UPDATE_SALESTICKETCDC,
      {
        params: {
          date:`${startDateFormat[2]}-${startDateFormat[1]}-${startDateFormat[0]}`,
          employee:id,
          revenue:cdc
        }
      }
    )

    if(response.status === 200){
      return true
    } 

  } catch (error) {

    return false;
    
  }
}
