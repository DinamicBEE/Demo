import { createListCollection } from "@chakra-ui/react";
import { AprovalsClousureList, AprovalsReason, RequestOpeningForm, RequestUpdateDetails } from "@models/approvals.model";
import api from "../api/index";
import { GETLISTAPPROVALS, GETLISTCLOUSING, GETREASONLIST, SAVE_REQUEST, UPDATE_REQUEST } from "./settings";

export const approvalsServices = {

  //obtiene toda los registros de las solicitudes.
  async getListApprovalsUser(): Promise<any> {

    try {

      const response = await api.get(GETLISTAPPROVALS);
      const result = response.data;

      return result;

    } catch (error) {
      console.log(error);
      return [];
    }

  },

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

      const newType = type === 1 ? "corte" : type === 2 ? "lote": "";

      const filteredData = response.data.filter((item: any) => item.type.toLowerCase() === newType);
      const result: AprovalsClousureList[] = filteredData.map((item: any) => {
       
        return {
          id: item.id,
          name: item.employeeName + " - " +item.date.replace("Fecha: ", ""),
        }
 
      });      

      return result

    } catch (error) {
      console.log(error);
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
      console.log(error)
      return [] as AprovalsReason[];
    }
  }
}