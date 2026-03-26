export const STATUSLABELS =  [
    { id: 1, label: "Rechazada" },
    { id: 2, label: "Aceptada" },
    { id: 3, label: "En espera" }
];

export const REQUEST_TYPE = [
    { key: "CASH_CLOSURE", label: 'Corte de Caja'}, 
    { key: 'LOTE', label: 'Cierre de Lote' }
];

export const STATE_LABELS =  [
    { key: "Open", label: 'Abierta'}, 
    { key: 'Close', label: 'Cerrado' }
];

export const ApprovalsReasons = [
    {label: "Corte de caja", value: 1},
    {label: "Cierre de lote", value: 2},
];

export enum APPROVALS_TYPE {
  APPROVALS = 1,
  REQUEST = 2,
}