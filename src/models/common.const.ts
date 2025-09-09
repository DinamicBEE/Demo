
import { createListCollection } from "@chakra-ui/react";

export const ALERTCLOUSING_MODEL = {
    SUCCESS: { title: 'Envio exitoso', description: 'Corte de caja enviado correctamente', type: 'success' },
    ERROR: { title: 'Error al enviar el corte de caja', type: 'error' },
    CONFIRM: { title: 'Confirmación de envio', description: '¿Estás seguro de enviar el corte de caja?', type: 'warning' },
  };

export enum CLOUSING_TYPE {
  CASH = 1,
  TDC = 2,
  CUSTOMER = 3,
  SPECIALCUSTOMER = 4,
  EMPLOYEE = 5,
  PREPAID = 6,
  INTERCOMPANY = 7
}

export enum CLOUSING_KEY {
  CASH = "cash",
  TDC = "tdc",
  CUSTOMER = "customer",
  SPECIALCUSTOMER = "specialCustomer",
  EMPLOYEE = "employee",
  PREPAID = "prepaid",
  INTERCOMPANY = "intercompany"
}

export const ApprovalsReasons = createListCollection({
  items: [
    {label: "Corte de caja", value: 1},
    {label: "Cierre de lote", value: 2},
  ]
})

export const PaginatorSize = createListCollection({
  items: [
    {label: "10", value: 10},
    {label: "25", value: 25},
    {label: "50", value: 50},
    {label: "100", value: 100},
  ]
})
