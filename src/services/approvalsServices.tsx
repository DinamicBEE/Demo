import { Approval } from "@models/approvals.model";

export const approvalsServices = {

  async getListApprovals(): Promise<any> {

    try {
      
      const response = listApprovals

      return response;
      
    } catch (error) {

      console.log(error);
      return [];

    }

  }

}

const listApprovals: Approval[] = [
  {
    id: 1,
    date: "10/02/2025, 1:00 PM",
    state: "Abierto",
    typeRequest: "CORTE DE CAJA",
    reasons: "Diferencia/ajustes en algún importe",
    comment: "Revisar diferencias en caja principal."
  },
  {
    id: 2,
    date: "10/02/2025, 1:00 PM",
    state: "Con diferencia",
    typeRequest: "CIERRE DE LOTE",
    reasons: "Forma de pago",
    comment: "Ajuste necesario en método de pago registrado."
  },
  {
    id: 3,
    date: "10/02/2025, 1:00 PM",
    state: "Cerrado",
    typeRequest: "CORTE DE CAJA",
    reasons: "Ajustes en cupones",
    comment: "Cupones no aplicados correctamente."
  },
  {
    id: 4,
    date: "11/02/2025, 1:00 PM",
    state: "Reabierto",
    typeRequest: "CIERRE DE LOTE",
    reasons: "Diferencia en última actualización",
    comment: "Revisión urgente por actualización incorrecta."
  },
  {
    id: 5,
    date: "11/02/2025, 1:00 PM",
    state: "Abierto",
    typeRequest: "CORTE DE CAJA",
    reasons: "Forma de pago",
    comment: "Error en la asignación del pago con tarjeta."
  }
]