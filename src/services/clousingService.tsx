// import axios from 'axios';
// import { API_CATALOG } from "./settings"
import { v4 as uuidv4 } from "uuid";
import {
  EXPECTED_COLUMNS,
  FIELD_MAPPING,
  FileResult,
  ProcessResult,
} from "@models/adyen.model";
import { CashModel } from "@models/cash.model";
import { HeaderData, ResponseModel } from "@models/common.clousing.model";
import { CustomerModel } from "@models/customer.model";
import {
  EmployeeLine,
  EmployeeModel,
  NewEmployeeModel,
} from "@models/employee.model";
import { IntercompanyModel } from "@models/intercompany.model";
import {
  CouponCatalogModel,
  PrepaidLineModel,
  PrepaidModel,
} from "@models/prepaid.model";
import { SpecialCustomerModel } from "@models/specialCustome.model";
import { BankDetails, TDCModel } from "@models/tdc.model";
import axios from "axios";
import { API_LOCAL, CLIENTS, LOCATIONS, SP_CLIENTS } from "./settings";
import Cookies from "js-cookie";
import api from "../api/index";

import Papa from "papaparse";
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

/**
 * This function gets the information
 * of the selected box cut cash section
 * @param {number} clousingId
 * @returns {Promise<CashModel>}
 */
export const getCashClousing = async (
  clousingId: number
): Promise<CashModel> => {
  // console.log(clousingId) //employeeId

  try {
    // Instead of using the actual API endpoint
    // const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);

    // Create a copy of CashData to avoid mutating the original mock data
    const cashDataCopy = {
      ...CashData,
      currencies: CashData.currencies.map((currency) => ({
        ...currency,
        // Generate new UUID for null IDs, otherwise keep existing ID
        id: currency.id === null ? "cash-" + uuidv4() : currency.id,
      })),
    };

    const response = cashDataCopy;

    // const newTotalPOS = response.data.currencies.map(currency => currency.totalPOS).reduce((acc, curr) => acc + curr, 0);
    // const newTotalFisico = response.data.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

    const newTotalPOS = response.currencies
      .map((currency) => currency.totalPOS)
      .reduce((acc, curr) => acc + curr, 0);
    const newTotalFisico = response.currencies
      .map((currency) => currency.totalFisico)
      .reduce((acc, curr) => acc + curr, 0);

    const data = {
      //...response.data,
      ...response,
      total: {
        totalPOS: newTotalPOS,
        totalPhysical: newTotalFisico,
        difference: newTotalPOS - newTotalFisico,
      },
      tips: 0,
    };

    //return data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return {} as CashModel;
  }
};

/**
 * This function gets the information
 * of the selected box cut tdc section
 * @param {number} clousingId
 * @returns {Promise<TDCModel>}
 */
export const getTDCClousing = async (clousingId: number): Promise<TDCModel> => {
  // console.log(clousingId)

  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const response = {
      ...TDCMOCKData,
      lines: TDCMOCKData.lines.map((line) => ({
        ...line,
        // Generate new UUID for null IDs, otherwise keep existing ID
        id: line.id === null ? "tdc-" + uuidv4() : line.id,
      })),
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as TDCModel;
  }
};

/**
 * This feature retrieves the details
 * of card payments from the bank’s
 * consolidated account
 * @param {number} clousingId
 * @param {number} lineId
 * @returns {Promise<BankDetails>}
 */
export const getTDCDetails = async (
  clousingId: number,
  lineId: number
): Promise<BankDetails> => {
  // console.log(clousingId, lineId);

  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const response = TDCDetailsMOCKData.find((item) => item.id === lineId);

    if (!response) {
      return [] as unknown as BankDetails;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(response);
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as BankDetails;
  }
};

export const validateDetails = async (
  clousingId: number,
  lineId: number | string,
  details: BankDetails
): Promise<BankDetails> => {
  // console.log(clousingId, lineId);

  try {
    //const response = await axios.post(`${API_CATALOG}/${clousingId}/${lineId}`, details);
    let data: BankDetails;

    if (lineId == 3) {
      data = {
        ...details,
        details: details.details.map((detial) => {
          return {
            ...detial,
            success: true,
            message: undefined,
          };
        }),
      };
    } else if (details.bankName === "ADYEN") {
      data = {
        ...details,
        details: details.details.map((detial) => {
          return {
            ...detial,
          };
        }),
      };
    } else {
      data = {
        ...details,
        details: details.details.map((detial) => {
          const success = Math.random() < 0.5;

          return {
            ...detial,
            success,
            message: success ? undefined : "cheque caducado",
          };
        }),
      };
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(data);
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as BankDetails;
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
): Promise<CustomerModel> => {
  // console.log(clousingId)

  try {
    const response = await api.get(CLIENTS, {
      params: { idCashRegisterClosure: clousingId },
    });
    console.log(response.data);
    
    const lines = response.data.generalClientResponseList.map((line: any) => ({
      ...line,
      amountMXN: line.amountMx ?? 0,
      currencyLabel: line.currency ?? "",
      // Generate new UUID for null IDs, otherwise keep existing ID
      id: line.id === null ? "customer-" + uuidv4() : line.id,
    }));

    console.log(lines);
    

    //TODO: Validar la estructura de datos que regresara la API
    /* const newTotalPOS = lines.map((line: any) => Number(line.ammount)).reduce((acc: number, curr: number) => acc + curr, 0);
      const newTotalFisico = lines.map((line: any) => Number(line.ammountMXN)).reduce((acc: number, curr: number) => acc + curr, 0);
      const newDiff = Number(newTotalPOS - newTotalFisico);

      const data = {
          id: clousingId,
          total: {
            totalPOS: newTotalPOS,
            totalPhysical: newTotalFisico,
            difference: Number(newDiff)
          },
          lines: [...lines],
      } */

    const data: CustomerModel = {
      id: clousingId,
      total: {
        difference: response.data.totalDifference ?? 0,
        totalPOS: response.data.totalPos ?? 0,
        totalPhysical: response.data.totalPhysical ?? 0,
      },
      lines: [...lines],
    };

    return data;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return {} as CustomerModel;
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
): Promise<SpecialCustomerModel> => {
  console.log(clousingId);

  try {
    const response = await api.get(SP_CLIENTS, {
      params: { idCashRegisterClosure: clousingId, idCurrency },
    });

    console.log(response.data);

    const lines = response.data.specialClientResponses.map((line: any) => ({
      ...line,

      // Generate new UUID for null IDs, otherwise keep existing ID
      id: line.id === null ? "customerSpecial-" + uuidv4() : line.id,
    }));

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

    return data;
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return {} as SpecialCustomerModel;
  }
};

/**
 * This feature gets the information
 * of the selected box prepaid section
 * @param {number} clousingId
 * @returns {Promise<PrepaidModel>}
 */
export const getPrepaidClousing = async (
  clousingId: number
): Promise<PrepaidModel> => {
  // console.log(clousingId)

  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const response = PrepaidMOCKData;

    const updateLines = response.lines.map((item) => {
      return {
        ...item,
        id: item.id === null ? "prepaid-" + uuidv4() : item.id,
        isEdit: false,
      };
    });

    const data = {
      ...response,
      lines: updateLines,
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return {} as PrepaidModel;
  }
};

export const getCouponCatalog = async (
  clousingId: number
): Promise<CouponCatalogModel[]> => {
  // console.log(clousingId)

  try {
    //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
    const response = couponCatalogMocky;

    // const data = {
    //     ...response,
    // }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 1000);
    });
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
    const employeeDataCopy = {
      ...EmployeeData,
      lines: EmployeeData.lines.map((line) => ({
        ...line,
        // Generate new UUID for null IDs, otherwise keep existing ID
        id: line.id === null ? "employee-" + uuidv4() : line.id,
      })),
    };

    const response = employeeDataCopy;

    const data = {
      ...response,
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
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
  console.log(clousingId, newEmployee);

  const mock: EmployeeLine = {
    id: Math.floor(Math.random() * (500 - 11)) + 11,
    name: "mocky user",
    lastName: "mocky user",
    employeeCode: "mocky user" + newEmployee.employeeId,
    amount: newEmployee.amount,
    reason: "mocky reason" + newEmployee.reason,
    ticket: newEmployee.ticket,
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
    const responseCopy = {
      ...intercompanyData,
      lines: intercompanyData.lines.map((line) => ({
        ...line,
        // Generate new UUID for null IDs, otherwise keep existing ID
        id: line.id === null ? "intercompany-" + uuidv4() : line.id,
      })),
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(responseCopy);
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as IntercompanyModel;
  }
};

//TODO: Validar si se usaran endpoints por tipo de cierre o uno con key para indentificar
export const sendCashClousing = async (body: any) => {
  try {
    //const response = await axios.post(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`, body);
    //TODO: Devolver para consulta a back
    const response = await api.post(
      "/crc/cash-register-closure/api/closure/save",
      body
    );

    /*  const response = { success: true }; */

    //return response
    /*  return new Promise((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 1000); // 5 segundos
    }); */

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
        (column) => !headers.includes(column)
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
            csvColumn === "Merchant Reference" &&
            typeof row[csvColumn] === "string"
          ) {
            const merchantRef = row[csvColumn] as string;
            const parts = merchantRef.split("-");
            transformedRow[targetField] =
              parts.length >= 2 ? parts[1] : merchantRef;
          }
          // Procesamiento específico para Account
          else if (
            csvColumn === "Account" &&
            typeof row[csvColumn] === "string"
          ) {
            const account = row[csvColumn] as string;
            transformedRow[targetField] = account.split("_")[0];
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
                  .filter(Boolean) // Filtrar valores nulos o undefined
                  .filter((record) => {
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
                      (!storeName || recordStore === storeName) &&
                      (!location || recordLocation === location)
                    );
                  });

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

    allData.forEach((record) => {
      const pspReference = record["PSP Reference"]
        ? String(record["PSP Reference"])
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
  date: "2021-10-10 10:00",
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

export const CashData = {
  id: 1,
  employeeId: 5,
  electronicTips: 9622.32,
  currencies: [
    {
      id: null as number | null,
      currency: "MXN",
      totalPOS: 1000,
      totalFisico: 1000,
      difference: 0,
      exchangeRate: 1,
      originalCurrency: 20,
    },
    {
      id: null as number | null,
      currency: "USD",
      totalPOS: 1000,
      totalFisico: 1000,
      difference: 0,
      exchangeRate: 1,
      originalCurrency: 10,
    },
    {
      id: null as number | null,
      currency: "GBP",
      totalPOS: 1000,
      totalFisico: 1000,
      difference: 0,
      exchangeRate: 1,
      originalCurrency: 5,
    },
    {
      id: null as number | null,
      currency: "CAD",
      totalPOS: 1000,
      totalFisico: 1000,
      difference: 0,
      exchangeRate: 1,
      originalCurrency: 1,
    },
  ],
};

export const TDCMOCKData = {
  id: 1,
  employeId: 150,
  total: {
    totalPOS: 9622.32,
    totalPhysical: 9622.32,
    difference: 0,
  },
  lines: [
    { id: 1, bank: "BBVA", POS: 2784.56, physical: 0, voucherAmount: 10 },
    { id: 2, bank: "HSBC", POS: 208.69, physical: 150, voucherAmount: 1 },
    { id: 3, bank: "BANREGIO", POS: 856.32, physical: 300, voucherAmount: 5 },
    { id: 4, bank: "ADYEN", POS: 0, physical: 0, voucherAmount: 0 },
  ],
};

export const TDCDetailsMOCKData = [
  {
    id: 1,
    bankName: "BBVA bancomer",
    total: 0,
    details: [
      { id: 101, date: "22/05/2024 11:16", check: "", amount: 386 },
      { id: 102, date: "22/05/2024 11:12", check: "", amount: 491.05 },
      { id: 103, date: "22/05/2024 11:02", check: "", amount: 323 },
      { id: 104, date: "22/05/2024 09:37", check: "", amount: 405.6 },
      { id: 105, date: "22/05/2024 09:26", check: "", amount: 104 },
      { id: 106, date: "22/05/2024 08:57", check: "", amount: 273.9 },
      { id: 107, date: "22/05/2024 08:54", check: "", amount: 203 },
      { id: 108, date: "22/05/2024 08:45", check: "", amount: 228.65 },
      { id: 109, date: "22/05/2024 07:36", check: "", amount: 95 },
      { id: 110, date: "22/05/2024 06:43", check: "", amount: 273.9 },
    ],
  },
  {
    id: 2,
    bankName: "HSBC",
    total: 0,
    details: [
      { id: 101, date: "22/05/2024 11:16", check: "", amount: 386 },
      { id: 102, date: "22/05/2024 11:12", check: "", amount: 491.05 },
      { id: 103, date: "22/05/2024 11:02", check: "", amount: 323 },
      { id: 104, date: "22/05/2024 09:37", check: "", amount: 405.6 },
      { id: 105, date: "22/05/2024 09:26", check: "", amount: 104 },
      { id: 106, date: "22/05/2024 08:57", check: "", amount: 273.9 },
      { id: 107, date: "22/05/2024 08:54", check: "", amount: 203 },
      { id: 108, date: "22/05/2024 08:45", check: "", amount: 228.65 },
      { id: 109, date: "22/05/2024 07:36", check: "", amount: 95 },
      { id: 110, date: "22/05/2024 06:43", check: "", amount: 273.9 },
    ],
  },
  {
    id: 3,
    bankName: "BANREGIO",
    total: 0,
    details: [
      { id: 101, date: "22/05/2024 11:16", check: "", amount: 386 },
      { id: 102, date: "22/05/2024 11:12", check: "", amount: 491.05 },
      { id: 103, date: "22/05/2024 11:02", check: "", amount: 323 },
      { id: 104, date: "22/05/2024 09:37", check: "", amount: 405.6 },
      { id: 105, date: "22/05/2024 09:26", check: "", amount: 104 },
      { id: 106, date: "22/05/2024 08:57", check: "", amount: 273.9 },
      { id: 107, date: "22/05/2024 08:54", check: "", amount: 203 },
      { id: 108, date: "22/05/2024 08:45", check: "", amount: 228.65 },
      { id: 109, date: "22/05/2024 07:36", check: "", amount: 95 },
      { id: 110, date: "22/05/2024 06:43", check: "", amount: 273.9 },
    ],
  },
  {
    id: 4,
    bankName: "ADYEN",
    total: 0,
    details: [
      { id: 101, date: "28/05/24 21:30", check: "1", amount: 386 },
      { id: 102, date: "22/05/24 11:12", check: "2", amount: 491.05 },
      { id: 103, date: "22/05/2024 11:02", check: "4", amount: 323 },
      { id: 104, date: "22/05/2024 09:37", check: "5", amount: 405.6 },
      { id: 105, date: "22/05/2024 09:26", check: "6", amount: 104 },
      { id: 106, date: "22/05/2024 08:57", check: "71", amount: 273.9 },
      { id: 107, date: "22/05/2024 08:54", check: "8", amount: 203 },
      { id: 108, date: "22/05/2024 08:45", check: "788", amount: 228.65 },
      { id: 109, date: "22/05/2024 07:36", check: "9", amount: 95 },
      { id: 110, date: "28/05/24 6:21", check: "7", amount: 273.9 },
    ],
  },
];

export const CustomerMOCKData = {
  id: 1,
  employeeId: 150,
  total: {
    totalPOS: 19622.32,
    totalPhysical: 19622.32,
    difference: 0,
  },
  lines: [
    {
      id: null,
      nameClient: "BRITISH AIRWAYS",
      coupons: 0,
      currency: "",
      pax: 0,
      amount: 0,
      exchangeRate: 0,
      amountMXN: 0,
    },
    {
      id: null,
      nameClient: "SUNWING Airlines",
      coupons: 0,
      currency: "",
      pax: 0,
      amount: 0,
      exchangeRate: 0,
      amountMXN: 0,
    },
    {
      id: null,
      nameClient: "VIVA AEROBUS",
      coupons: 0,
      currency: "",
      pax: 0,
      amount: 0,
      exchangeRate: 0,
      amountMXN: 0,
    },
  ],
};

export const SpecialCustomerMOCKDATA = {
  id: 1,
  employeeId: 150,
  total: {
    totalPOS: 3500,
    totalPhysical: 3500,
    difference: 0,
  },
  lines: [
    {
      id: 1,
      check: 420,
      bill: 258.0,
      couponPrice: 0,
      difference: 0,
      exchangeRate: 1.0,
      client: "AMERICAN AIRLINES",
      pax: 0,
      couponFolio: "0",
      couponFolioUSD: "0",
      ammount: 1,
      ammountUSD: 1,
      flight: "OFCEM",
      passengerName: "JUAN PEREZ",
      passengerNum: "",
      amountMXN: 1,
    },
    {
      id: 2,
      Check: 400,
      consumption: 500.0,
      priceCuopon: 0,
      difference: 0,
      exchangeRate: 1.0,
      client: "AMERICAN AIRLINES",
      PAX: 0,
      folioCuopon: "0",
      folioCuoponUSD: "0",
      value: 1,
      valueUSD: 1,
      flight: "OGCEM",
      passengerName: "JUAN PEREZ",
      amountMXN: 1,
    },
    {
      id: 3,
      Check: 120,
      consumption: 150.0,
      priceCuopon: 0,
      difference: 0,
      exchangeRate: 17.0,
      client: "AMERICAN AIRLINES",
      PAX: 0,
      folioCuopon: "0",
      folioCuoponUSD: "0",
      value: 1,
      valueUSD: 1,
      flight: "OFCIP",
      passengerName: "JUAN PEREZ",
      amountMXN: 1,
    },
    {
      id: 4,
      Check: 150,
      consumption: 200.0,
      priceCuopon: 0,
      difference: 0,
      exchangeRate: 1.0,
      client: "AMERICAN AIRLINES",
      PAX: 0,
      folioCuopon: "0",
      folioCuoponUSD: "0",
      value: 1,
      valueUSD: 1,
      flight: "PFTRE",
      passengerName: "JUAN PEREZ",
      amountMXN: 1,
    },
  ],
};

export const PrepaidMOCKData = {
  id: 1,
  employeeId: 150,
  total: {
    totalPOS: 2955.0,
    totalPhysical: 2955.0,
    difference: 0,
  },
  lines: [
    {
      id: 1,
      client: "Thomas Moore",
      quantity: 0,
      supplementsQuantity: 0,
      unitPrice: 0,
      totalPOS: 750.0,
      physical: 0,
      difference: 0,
    },
    {
      id: 2,
      client: "SSIA",
      quantity: 0,
      supplementsQuantity: 0,
      unitPrice: 0,
      totalPOS: 525.0,
      physical: 0,
      difference: 0,
    },
    {
      id: 3,
      client: "SEASON TOURS",
      quantity: 0,
      supplementsQuantity: 0,
      unitPrice: 0,
      totalPOS: 376.68,
      physical: 0,
      difference: 0,
    },
    {
      id: 4,
      client: "SEEK AND GO",
      quantity: 0,
      supplementsQuantity: 0,
      unitPrice: 0,
      totalPOS: 700.77,
      physical: 0,
      difference: 0,
    },
    {
      id: 5,
      client: "AVENTOUR",
      quantity: 0,
      supplementsQuantity: 0,
      unitPrice: 0,
      totalPOS: 812.7,
      physical: 0,
      difference: 0,
    },
  ],
};

export const EmployeeData = {
  id: 1,
  employeeId: 150,
  total: {
    totalPOS: 2955.0,
    totalPhysical: 2955.0,
    difference: 0,
  },
  lines: [
    {
      id: null,
      name: "Mario",
      lastName: "Vásquez",
      employeeCode: "3",
      amount: 125.0,
      reason: "Diferencia de efectivo",
      ticket: "---",
    },
    {
      id: null,
      name: "Luis",
      lastName: "Castillo",
      employeeCode: "5",
      amount: 150.0,
      reason: "Consumo empelado",
      ticket: "123",
    },
    {
      id: null,
      name: "Ramiro",
      lastName: "Diaz",
      employeeCode: "3",
      amount: 300.0,
      reason: "Mala elaboración del producto",
      ticket: "---",
    },
  ],
};

const intercompanyData = {
  id: 1,
  employeeId: 150,
  total: {
    totalPOS: 2955.0,
    totalPhysical: 2955.0,
    difference: 0,
  },
  lines: [
    {
      id: null,
      employeeId: 0,
      employeeName: "",
      subsidiaryId: 0,
      subsidiaryname: "",
      amount: 125.0,
      ticket: "1",
      physicalAmount: 0,
    },
    {
      id: null,
      employeeId: 0,
      employeeName: "",
      subsidiaryId: 0,
      subsidiaryname: "",
      amount: 150.0,
      ticket: "2",
      physicalAmount: 0,
    },
    {
      id: null,
      employeeId: 0,
      employeeName: "",
      subsidiaryId: 0,
      subsidiaryname: "",
      amount: 300.0,
      ticket: "3",
      physicalAmount: 0,
    },
  ],
};

const couponCatalogMocky = [
  { lineId: 1, folio: "1235", quantity: 5, unitPrice: 150.0, isUsed: false },
  { lineId: 2, folio: "9874", quantity: 3, unitPrice: 175.0, isUsed: true },
  { lineId: 3, folio: "1478", quantity: 3, unitPrice: 125.56, isUsed: false },
  { lineId: 4, folio: "3698", quantity: 2, unitPrice: 233.59, isUsed: true },
  { lineId: 5, folio: "4561", quantity: 6, unitPrice: 135.45, isUsed: false },
];
