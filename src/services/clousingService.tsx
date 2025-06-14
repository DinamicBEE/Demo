import { v4 as uuidv4 } from "uuid";
import {
  EXPECTED_COLUMNS,
  FIELD_MAPPING,
  FileResult,
  ProcessResult,
} from "@models/adyen.model";
import { CashLines, CashModel } from "@models/cash.model";
import { HeaderData, ResponseModel } from "@models/common.clousing.model";
import { CustomerModel } from "@models/customer.model";
import {
  EmployeeLine,
  EmployeeModel,
  NewEmployeeModel,
} from "@models/employee.model";
import {
  IntercompanyModel,
} from "@models/intercompany.model";
import {
  CouponCatalogModel,
  PrepaidLineModel,
  PrepaidModel,
} from "@models/prepaid.model";
import { SpecialCustomerModel } from "@models/specialCustome.model";
import { BankLineModel, Voucher, TDCModel } from "@models/tdc.model";
import {
  CASH,
  TDC,
  CLIENTS,
  EMPLOYEE_INSERT,
  INTERCOMPANY,
  SP_CLIENTS,
  GET_COUPONS,
  GET_PREPAID,
} from "./settings";
import api from "../api/index";
import { format, isValid, isBefore, startOfDay } from "date-fns";
import Papa from "papaparse";
import axios from "axios";
/**
 * This function gets the totals
 * of the selected closure and the
 * totals by section of the box cut
 * @param {number} clousingId
 * @returns {Promise<HeaderData>}
 */
export const getHeaders = async (clousingId: number): Promise<HeaderData> => {
  // console.log(clousingId)
  try {
    //const response = await axios.get(`${API_CATALOG}/e9c9e0f7-28a7-41e5-96a5-f5b65488b840`);
    const response = HeaderDataMocky;
    const data = {
      ...response,
    };
    //return response.data
    //return response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return {} as HeaderData;
  }
};

export const getInfoColumn = async (clousingId: number): Promise<ResponseModel> => {
  try {
    const response = await axios.get("https://localhost:8080/cash-register-closure/api/registerclosure/info-colum", {
      params: {
        cashId: clousingId
      }
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return {
        success: false,
        data: [],
        message: "Error al obtener info de taxes y descuentos",
      };
    }
  } catch (error) {
    console.error("Error en la ejecución", error);
    return {
      success: false,
      data: [],
      message: "Error en la ejecución",
    };
  }
}

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
    console.log("clousingId", clousingId);
    
    const response = await api.get(CASH, {
      params: {
        crcId: clousingId,
        idCurrency: idCurrency,
      },
    });

    // console.log("Response from getCashClousing:", response.data);
    const cashDataCopy = {
      ...response.data,
      currencies: response.data.lines.map((currency: CashLines) => ({
        ...currency,
        id: currency.id === null ? "cash-" + uuidv4() : currency.id,
        totalFisico: currency.totalPOS < 0 ? currency.totalPOS : currency.totalFisico,
      })),
    };

    const dummy = cashDataCopy;

    const newTotalPOS = dummy.lines
      .map((currency: CashLines) => currency.totalPOS)
      .reduce((acc: number, curr: number) => acc + curr, 0);

    const newTotalFisico = dummy.currencies
      .map((currency: CashLines) => currency.totalFisico)
      .reduce((acc: number, curr: number) => acc + curr, 0);

    const data = {
      ...dummy,
      total: {
        totalPOS: newTotalPOS,
        totalPhysical: newTotalFisico,
        difference: newTotalPOS - newTotalFisico,
      },
      // tips: dummy.,
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
  // console.log(clousingId)

  try {
    const response = await api.get(TDC, {
      params: { crcId: clousingId, idCurrency: idCurrency },
    });    
    const newResponse = {
      ...response.data,
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
      })),
    };

    /* return new Promise((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 1000);
    }); */
    return newResponse;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as TDCModel;
  }
};

export const validateDetails = async (
  clousingId: number,
  lineId: number | string,
  BankLineDetails: Voucher[],
  details: BankLineModel
): Promise<BankLineModel> => {
  // console.log(clousingId, lineId);

  try {
    //const response = await axios.post(`${API_CATALOG}/${clousingId}/${lineId}`, details);
    let data: BankLineModel;

    if (details.bank === "TPV ADYEN") {
      data = {
        ...details,
        vouchers: BankLineDetails,
      };
    } /* else {
      data = {
        ...details,
        vouchers: BankLineDetails.map((detial) => {
          return {
            ...detial,
            success,
            message: success ? undefined : "cheque caducado",
          };
        }),
      };
    } */

    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(data);
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as BankLineModel;
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
  try {
    const response = await api.get(CLIENTS, {
      params: { idCashRegisterClosure: clousingId },
    });

    const lines = response.data.generalClientResponseList.map((line: any) => {
      // Desestructurar el objeto para separar amountMx del resto de propiedades
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

    const data: CustomerModel = {
      id: clousingId,
      total: {
        difference: response.data.totalDifference ?? 0,
        totalPOS: response.data.totalPos ?? 0,
        totalPhysical: response.data.totalPhysical ?? 0,
      },
      lines: [...lines],
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
      data: {
        id: clousingId,
        total: {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
        },
        lines: [],
      } as CustomerModel,
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
  try {
    const response = await api.get(SP_CLIENTS, {
      params: { idCashRegisterClosure: clousingId, idCurrency },
    });

    const lines = response.data.specialClientResponses.map(
      (line: any, index: number) => ({
        // ! Eliminar INDEX
        ...line,

        // Generate new UUID for null IDs, otherwise keep existing ID
        id: line.id === null ? "customerSpecial-" + uuidv4() : line.id,
        couponPrice: 0,
        // exchangeRate: index + 1 === 1 ? 1 : 17, // ! Eliminar
      })
    );

    const newTotalPOS = lines
      .map((line: any) => Number(line.bill))
      .reduce((acc: number, curr: number) => acc + curr, 0);
    const newTotalFisico = lines
      .map((line: any) => Number(line.ammountMXN))
      .reduce((acc: number, curr: number) => acc + curr, 0);
    const newDiff = Number(newTotalPOS - newTotalFisico);

    const data = {
      id: clousingId,
      total: {
        totalPOS: response.data.totalPos ?? 0,
        totalPhysical: response.data.totalPhysical ?? 0,
        difference: response.data.totalDifference ?? 0,
      },
      lines: [...lines],
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
      } as SpecialCustomerModel,
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
): Promise<PrepaidModel> => {
  // console.log(clousingId)

  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const response = await api.get(GET_PREPAID, {
      params: { idCashRegisterClosure: clousingId },
    });
    //PrepaidMOCKData;

    const updateLines = response.data.prepagoResponse.map(
      (item: PrepaidLineModel) => {
        return {
          ...item,
          id: item.id === 0 ? "prepaid-" + uuidv4() : item.id,
          edit: item.supplementsQuantity > 0 ? true : false,
          coupons: item.coupons
            ? item.coupons.map((coupon: CouponCatalogModel) => ({
                ...coupon,
                // Generate new UUID for null IDs, otherwise keep existing ID
                folioCustom: coupon.folio.split("_")[1], // Eliminar números al inicio
                validityDateCustom: format(
                  new Date(coupon.validityDate),
                  "dd/MM/yyyy"
                ),
                isExpired: isBefore(
                  // Compare only the date part by setting both dates to start of day
                  startOfDay(new Date(coupon.validityDate)),
                  startOfDay(new Date(dateClousing))
                ),
              }))
            : [],
        };
      }
    );

    const data: PrepaidModel = {
      employeeId: clousingId,
      id: clousingId,
      total: {
        totalPOS: response.data.totalPos ?? 0,
        totalPhysical: response.data.totalPhysical ?? 0,
        difference: response.data.totalDifference ?? 0,
      },
      lines: updateLines,
    };

    return data;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return {
      employeeId: clousingId,
      id: clousingId,
      total: {
        totalPOS: 0,
        totalPhysical: 0,
        difference: 0,
      },
      lines: [],
    } as PrepaidModel;
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
    //couponCatalogMocky;

    // const data = {
    //     ...response,

    // }
    /*     response.data[0].validityDate = "2025-09-28T00:00:00";
    response.data[1].validityDate = "2025-05-14T00:00:00";
    response.data[2].validityDate = "2025-05-13T00:00:00";
    response.data[3].amount = 50; */
    if (response.data.length >= 0) {
      response.data[0].validityDate = "2025-01-01T00:00:00";
    }
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
        startOfDay(new Date(item.validityDate)),
        startOfDay(new Date(dateClousing))
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

  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const responseAxios = await api.get(EMPLOYEE_INSERT, {
      params: { crcId: clousingId },
    });

    /*  const employeeDataCopy = {
      ...EmployeeData,
      lines: EmployeeData.lines.map((line) => ({
        ...line,
        id: line.id === null ? "employee-" + uuidv4() : line.id,
      })),
    }; */
    const totalPhysical = responseAxios.data.reduce(
      (acc: number, curr: any) => acc + curr.amount,
      0
    );
    const totalPOS = responseAxios.data.totalPos ?? 0;
    const difference = totalPOS - totalPhysical;

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
    };

    const response = /* employeeDataCopy; */ employeeDataCopyAxios;

    const data = {
      ...response,
    };

    /*  return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    }); */
    return data;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as EmployeeModel;
  }
};

/**
 * ! DEPRECATED
 * This function sends the log
 * information of closing a new
 * employee for the employees section
 * @param {number} clousingId
 * @param {number} newEmployee
 * @returns {Promise<ResponseModel>}
 */
export const sendNewEmployeeRegister = async (
  clousingId: number,
  newEmployee: NewEmployeeModel
): Promise<ResponseModel> => {
  const mock: EmployeeLine = {
    id: Math.floor(Math.random() * (500 - 11)) + 11,
    employeeName: "mocky user" + newEmployee.employeeId,
    employeeNumber: "mocky user" + newEmployee.employeeId,
    amount: newEmployee.amount,
    reason: "mocky reason" + newEmployee.reason,
    ticketNumber: newEmployee.ticket,
  };

  const success = Math.random() < 0.5;

  // ! cambiar el if else por try catch
  if (success) {
    //try
    const response: ResponseModel = { success: true, data: mock };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 1000);
    });
  } else {
    //catch (error)
    const response: ResponseModel = {
      success: false,
      error: "Codigo de error",
      message: "Detalle del error => Error al registrar nueva linea: ",
    };
    //console.error('Error al registrar nueva linea:', error);
    return response;
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

  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const response = await api.get(INTERCOMPANY, {
      params: { idCashRegisterClosure: clousingId },
    });

    const totalPhysical = response.data.reduce(
      (acc: number, curr: any) => acc + Number(curr.physicalAmount),
      0
    );
    const totalPOS = response.data.reduce(
      (acc: number, curr: any) => acc + Number(curr.amount),
      0
    );
    const difference = totalPOS - totalPhysical;

    const responseCopy = {
      id: clousingId,
      employeeId: response.data.employeeId ?? 0,
      total: {
        totalPOS: totalPOS,
        totalPhysical: totalPhysical,
        difference: difference,
      },
      lines: response.data.map((line: any) => ({
        ...line,
        amount: Number(line.amount),
        physicalAmount: Number(line.physicalAmount),
        // Generate new UUID for null IDs, otherwise keep existing ID
        id: line.id === null ? "intercompany-" + uuidv4() : line.id,
      })),
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
    };
  }
};

//TODO: Validar si se usaran endpoints por tipo de cierre o uno con key para indentificar
export const sendCashClousing = async (body: any, isConfirm: boolean) => {
  try {
    //const response = await axios.post(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`, body);
    //TODO: Devolver para consulta a back

    const response = await api.post(
      "/crc/cash-register-closure/api/closure/save?isPreguardado=" + isConfirm,
      body
    );
    //TODO: Devolver para consulta a back
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
  storeName: string,
  location: string
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
          // Procesamiento específico para Account
          /*  else if (
            csvColumn === "Account" &&
            typeof row[csvColumn] === "string"
          ) {
            const account = row[csvColumn] as string;
            transformedRow[targetField] = account.split("_")[0];
          }  */
          else if (
            csvColumn.toLowerCase().trim() === "Creation Date".toLowerCase() &&
            typeof row[csvColumn] === "string"
          ) {
            const dateSplit = (row[csvColumn] as string).split(" ");
            const dateShort = dateSplit[0];
            // Definir los formatos posibles de fecha

            const possibleFormats = [
              "dd/MM/yyyy", // formato europeo
              "MM/dd/yyyy", // formato americano
              "yyyy/MM/dd", // formato ISO
              "dd-MM-yyyy", // con guiones
              "MM-dd-yyyy", // con guiones formato americano
              "yyyy-MM-dd", // formato ISO con guiones
              "dd/MM/yy",
              // con puntos
            ];

            // Intentar parsear la fecha con cada formato hasta encontrar uno válido
            let fechaParseada = null;
            let fechaFormateada = "";

            /* for (const formatPattern of possibleFormats) {
              fechaParseada = parse(dateShort, formatPattern, "dd/MM/yy");
              if (isValid(fechaParseada)) {
                // Si el formato funciona, salir del bucle
                fechaFormateada = format(fechaParseada, "dd/MM/yyyy");
                break;
              }
            } */

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
                /*   .filter((record) => {
                    // Filtrar por storeName y location si están presentes
                    const recordStore = String(
                      record["Centro de consumo"] ||
                        record["StoreName"] ||
                        record["store"] ||
                        ""
                    ).trim();
                    const recordLocation = String(
                      record["Subsidiaria"] ||
                        record["StoreLocation"] ||
                        record["location"] ||
                        ""
                    ).trim();

                    // Validar si ambos valores coinciden con los proporcionados
                    // Solo filtramos si los valores de storeName y location no están vacíos

                    return (
                      (!storeName ||
                        recordStore.toLowerCase() ===
                          storeName.toLowerCase()) &&
                      (!location ||
                        recordLocation.toLowerCase() === location.toLowerCase())
                    );
                  }); */

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

export const HeaderDataMocky = {
  cdc: "No seleccionada",
  location: "No seleccionado",
  subsidiary: "No seleccionado",
  date: "27/04/2025",
  totalPOS: 3500,
  totalClousing: 3500,
  difference: 0,
  service: 1000,
  discountPOS: 1000,
  discountClousing: 2000,
  closures: {
    cash: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    customer: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    specialCustomer: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    tdc: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    employee: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    prepaid: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    intercompany: { totalPOS: 500, totalPhysical: 500, difference: 0 },
  },
};