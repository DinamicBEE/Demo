import { createListCollection } from "@chakra-ui/react";
import { Temporal } from "@js-temporal/polyfill";
import { Approval, AprovalsClousureCash, AprovalsReason, RequestOpeningForm } from "@models/approvals.model";
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

  //obtiene solo un registro por id
  // async getRequestApproval(id: number): Promise<any> {
  //   try {

  //     const response = listApprovals.find((item) => item.id === id);

  //     return new Promise((resolve) => {
  //       setTimeout(() => resolve(response), 1000);
  //     });

  //   } catch (error) {
  //     console.log(error)
  //     return {}
  //   }
  // },

  //Guarda un nueva solicitud
  async saveDataRequest(data: RequestOpeningForm): Promise<any> {
    try {

    
      const response = await api.post(`/crc/cash-register-closure/api/reason/save`, data);

      return response.data

    } catch (error) {
      console.log(error)
      return {}
    }
  },

  //Actualiza la solicitud.
  async updateStatusRequest(data: Approval): Promise<any> {
    try {

      const response = data;

      return new Promise((resolve) => {
        setTimeout(() => resolve(response), 1000);
      });

    } catch (error) {

    }
  },

  //obtiene el listado de las cajas y lotes.
  async getClosingList(idConsumerCenter: number): Promise<any> {
    try {
      const response = await api.get(`/crc/cash-register-closure/api/reason/listClosing?idConsumerCenter=${idConsumerCenter}`);
      const result: AprovalsClousureCash[] = response.data;

      console.log(result)

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
  },

}

//   const now = Temporal.Now.plainDateTimeISO();

//   return now.toLocaleString("en-US", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,  // Para formato AM/PM
//   }); // Eliminar la coma entre fecha y hora
// };

// const listApprovals: Approval[] = [
//   {
//     id: 1,
//     date: "10/02/2025, 1:00 PM",
//     state: "Abierto",
//     typeRequest: "CORTE DE CAJA",
//     reasons: "Diferencia/ajustes en algún importe",
//     comment: "Revisar diferencias en caja principal.",
//     status: 2
//   },
//   {
//     id: 2,
//     date: "10/02/2025, 1:00 PM",
//     state: "Con diferencia",
//     typeRequest: "CORTE  LOTE",
//     reasons: "Forma de pago",
//     comment: "Ajuste necesario en método de pago registrado.",
//     status: 2
//   },
//   {
//     id: 3,
//     date: "10/02/2025, 1:00 PM",
//     state: "Cerrado",
//     typeRequest: "CORTE CAJA",
//     reasons: "Ajustes en cupones",
//     comment: "Cupones no aplicados correctamente.",
//     status: 2
//   },
//   {
//     id: 4,
//     date: "11/02/2025, 1:00 PM",
//     state: "Reabierto",
//     typeRequest: "CIERRE LOTE",
//     reasons: "Diferencia en última actualización",
//     comment: "Revisión urgente por actualización incorrecta.",
//     status: 2
//   },
//   {
//     id: 5,
//     date: "11/02/2025, 1:00 PM",
//     state: "Abierto",
//     typeRequest: "CORTE CAJA",
//     reasons: "Forma de pago",
//     comment: "Error en la asignación del pago con tarjeta.",
//     status: 2
//   }
// ];