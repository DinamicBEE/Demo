import { createListCollection } from "@chakra-ui/react";
import { AprovalsClousureCash, AprovalsReason, RequestOpeningForm, RequestUpdateDetails } from "@models/approvals.model";
import api from "../api/index";

export const approvalsServices = {

  //obtiene toda los registros de las solicitudes.
  async getListApprovalsUser(): Promise<any> {

    try {

      const response = await api.get(`/crc/cash-register-closure/api/request`);
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

      const response = await api.post(`/crc/cash-register-closure/api/reason/save`, data);

      return response.data

    } catch (error: any) {
      throw new Error(error);
    }
  },

  //Actualiza la solicitud.
  async updateStatusRequest(data: RequestUpdateDetails): Promise<any> {
    try {

      const response = await api.post(`/crc/cash-register-closure/api/supervisor/request`, data);

      return response.data;

    } catch (error: any) {
      throw new Error(error);
    }
  },

  //obtiene el listado de las cajas y lotes.
  async getClosingList(idConsumerCenter: number): Promise<any> {
    try {
      const response = await api.get(`/crc/cash-register-closure/api/reason/listClosing?idConsumerCenter=${idConsumerCenter}`);
      const result: AprovalsClousureCash[] = response.data;

      return result

    } catch (error) {
      console.log(error);
      return [];
    }
  },

  // obtiene el listado de los motivos.
  async getReasonsList(): Promise<any> {
    try {

      const response = await api.get(`/crc/cash-register-closure/api/reason/list`);
      const result: AprovalsReason[] = response.data;

      const collection = createListCollection({
        items: result
      });

      return collection;

    } catch (error) {
      console.log(error)
      return [];
    }
  }
}