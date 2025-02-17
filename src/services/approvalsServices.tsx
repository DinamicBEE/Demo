import { createListCollection } from "@chakra-ui/react";
import { Approval } from "@models/approvals.model";
import { resolve } from "path";

export const approvalsServices = {

  async getListApprovals(): Promise<any> {

    try {

      const response = listApprovals

      return new Promise((resolve) => {
        setTimeout(() => { 
          resolve(response);
        }, 2000)
      });

    } catch (error) {

      console.log(error);
      return [];

    }

  },

  async getRequestApproval(id: number): Promise<any> {
    try {

      const response = listApprovals.find((item) => item.id === id);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(response);
        }, 1000)
      });

    } catch (error) {
      console.log(error)
      return {}
    }
  },

  async getClosingList(): Promise<any> {
    try {
      const response = closingList;

      const collection = createListCollection({
        items: response
      });

      return collection

    } catch (error) {

      console.log(error);
      return [];

    }
  },

  async getReasonsList(): Promise<any> {
    try {

      const response = reasonsList;
      const collection = createListCollection({
        items: response
      })

      return collection

    } catch (error) {
      console.log(error)
      return {}
    }
  },

}

const listApprovals: Approval[] = [
  {
    id: 1,
    date: "10/02/2025, 1:00 PM",
    state: "Abierto",
    typeRequest: "CORTE DE CAJA",
    reasons: "Diferencia/ajustes en algún importe",
    comment: "Revisar diferencias en caja principal.",
    status: 2
  },
  {
    id: 2,
    date: "10/02/2025, 1:00 PM",
    state: "Con diferencia",
    typeRequest: "CIERRE DE LOTE",
    reasons: "Forma de pago",
    comment: "Ajuste necesario en método de pago registrado.",
    status: 2
  },
  {
    id: 3,
    date: "10/02/2025, 1:00 PM",
    state: "Cerrado",
    typeRequest: "CORTE DE CAJA",
    reasons: "Ajustes en cupones",
    comment: "Cupones no aplicados correctamente.",
    status: 2
  },
  {
    id: 4,
    date: "11/02/2025, 1:00 PM",
    state: "Reabierto",
    typeRequest: "CIERRE DE LOTE",
    reasons: "Diferencia en última actualización",
    comment: "Revisión urgente por actualización incorrecta.",
    status: 2
  },
  {
    id: 5,
    date: "11/02/2025, 1:00 PM",
    state: "Abierto",
    typeRequest: "CORTE DE CAJA",
    reasons: "Forma de pago",
    comment: "Error en la asignación del pago con tarjeta.",
    status: 2
  }
];

const closingList = [
  { label: "Corte caja 10/02/25 12:00 am", value: "Corte caja 10/02/25 12:00 am" },
  { label: "Corte lote 12/02/25 10:00 am", value: "Corte lote 12/02/25 10:00 am" },
  { label: "Corte caja 11/02/25 11:00 am", value: "Corte caja 11/02/25 11:00 am" },
  { label: "Corte caja 14/02/25 1:00 pm", value: "Corte caja 14/02/25 1:00 pm" },
];

const reasonsList = [
  { label: "Diferencia/ajustes en algún importe", value: "Diferencia/ajustes en algún importe" },
  { label: "Ajustes en cupones", value: "Ajustes en cupones" },
  { label: "Forma de pago", value: "Forma de pago" },
  { label: "Diferencia en última actualización", value: "Diferencia en última actualización" },
];