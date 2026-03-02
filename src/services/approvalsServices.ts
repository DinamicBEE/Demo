import { Approval, AprovalsClousureList, AprovalsReason, filterOptionsProps, RequestOpeningForm, RequestUpdateDetails } from "@models/approvals.model";
import { GETLISTAPPROVALS, GETLISTCLOUSING, GETREASONLIST, SAVE_REQUEST, UPDATE_REQUEST } from "./settings";
import { STATUSLABELS } from "@models/const/approvals.const";
import { location } from "@models/common.model";
import api from "../api/index";

export const getRequestList = async (filterOptions: filterOptionsProps): Promise<Approval[]> => {

  try {

    const response = await api.get(GETLISTAPPROVALS,{
      params: {
        fSoliIni: filterOptions.requestDateStart,
        fSoliFin: filterOptions.requestDateEnd,
        fCorteIni: filterOptions.closingDateStart,
        fCorteFin: filterOptions.closingDateEnd,
        empleadoId: filterOptions.employeeId,
        status: filterOptions.status,
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
    
    const status = STATUSLABELS.map((stat: any) => ({
      id: stat.id,
      name: stat.label,
    }));

    return status;
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    return [];
  }
}

export const approvalsServices = {

  //obtiene toda los registros de las solicitudes.
  // async getListApprovalsUser(): Promise<any> {

  //   try {

  //     const response = await api.get(GETLISTAPPROVALS);
  //     const list = response.data.sort((a: any, b: any) => b.idRequest - a.idRequest);
  //     //TODO: Validar entidades nuevas para requerimiento REQ-SLAPR-004
  //     return list;

  //   } catch (error) {
  //     console.error(error);
  //     return [];
  //   }

  // },

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
  async updateStatusRequest(data: RequestUpdateDetails): Promise<any> {
    try {

      const response = await api.post(UPDATE_REQUEST, data);

      return response.data;

    } catch (error: any) {
      throw new Error(error);
    }
  },

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