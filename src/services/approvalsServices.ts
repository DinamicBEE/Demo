import { Approval, AprovalsClousureList, AprovalsReason, filterOptionsProps, RequestOpeningForm, RequestUpdateDetails } from "@models/approvals.model";
import { GETLISTAPPROVALS, GETLISTCLOUSING, GETLISTEMPLOYEES, GETLISTSTATUS, GETREASONLIST, SAVE_REQUEST, UPDATE_REQUEST } from "./settings";
import { location } from "@models/common.model";
import api from "../api/index";
import { Employee } from "@models/employee.model";
import { format } from "date-fns";

export const getRequestList = async (filterOptions: filterOptionsProps): Promise<Approval[]> => {

  try {

    const response = await api.get(GETLISTAPPROVALS,{
      params: {
        fSoliIni: filterOptions.requestDateStart !== null ? format(filterOptions.requestDateStart,"yyyy-MM-dd") : null,
        fSoliFin: filterOptions.requestDateEnd !== null ? format(filterOptions.requestDateEnd,"yyyy-MM-dd") : null,
        fCorteIni: filterOptions.closingDateStart !== null ? format(filterOptions.closingDateStart,"yyyy-MM-dd") : null,
        fCorteFin: filterOptions.closingDateEnd !== null ? format(filterOptions.closingDateEnd,"yyyy-MM-dd") : null,
        empleadoId: filterOptions.employeeId,
        status: filterOptions.status?.join(","),
        cdcId: filterOptions.cdc,
      }
    });
    const listPipe = response.data.map((item: any) => {
      return {
        ...item,
        zone: item.zona,
        closingEmployee: item.empleadoCorte
      }
    })
    const list = listPipe.sort((a: any, b: any) => b.idRequest - a.idRequest);

    return list;

  } catch (error) {
    console.error(error);
    return [] as Approval[];
  }

}

export const getStatus = async (): Promise<location[]> => {
  try {
    
    const response = await api.get(GETLISTSTATUS);

    const status = response.data.map((stat: any) => ({
      id: stat.id,
      name: stat.statusName,
    }));

    return status;
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    return [];
  }
}

export const getEmployees = async (): Promise<Employee[]> => {
  try {

    const response = await api.get(GETLISTEMPLOYEES);

    const employees = response.data.map((emp: any) => ({
      id: emp.id,
      name: emp.employee,
      employeeNumber: emp.id
    }));

    return employees;
  } catch (error) {
    console.error("Error al obtener la lista de empleados:", error);
    return [] as unknown as Employee[];
  }
};

export const updateStatusRequest = async(data: RequestUpdateDetails): Promise<boolean> => {
  try {

    const response = await api.post(UPDATE_REQUEST, data);

    const dataResponse =response.data === "OK" ? true : false;
    
    return dataResponse;

  } catch (error: any) {
    console.error("Error al actualizar el estado de la solicitud:", error);
    return false;
  }
}

export const approvalsServices = {

  //Guarda un nueva solicitud
  async saveDataRequest(data: RequestOpeningForm): Promise<any> {
    try {

      const response = await api.post(SAVE_REQUEST, data);

      return response.data

    } catch (error: any) {
      throw new Error(error);
    }
  },

  //Actualiza la solicitud.


  //obtiene el listado de las cajas y lotes.
  async getClosingList(idConsumerCenter: number, date: string, type:number): Promise<AprovalsClousureList[]> {
    try {      
      const response = await api.get(GETLISTCLOUSING, {
        params: {
          idConsumerCenter: idConsumerCenter,
          date: date,
        }
      });

      const newType = type === 1 ? "corte" : type === 2 ? "batch": "";

      const filteredData = response.data.filter((item: any) => item.type.toLowerCase() === newType);
      const result: AprovalsClousureList[] = filteredData.map((item: any) => {
       
        return {
          id: item.id,
          name: item.employeeName + " - " +item.date.replace("Fecha: ", ""),
        }
 
      });      

      return result

    } catch (error) {
      console.error(error);
      return [] as AprovalsClousureList[];
    }
  },

  // obtiene el listado de los motivos.
  async getReasonsList(type: Number): Promise<AprovalsReason[]> {
    try {

      const response = await api.get(GETREASONLIST);
      
      const newType = type === 1 ? "cash_closure" : type === 2 ? "lote": "";

      const filteredData = response.data.filter((item: any) => item.type.toLowerCase() === newType);
      
      const result: AprovalsReason[] = filteredData.map((item: any) => {
        return {
          id: item.id,
          name: item.reason, 
        }
      });

      return result;

    } catch (error) {
      console.error(error)
      return [] as AprovalsReason[];
    }
  }
}