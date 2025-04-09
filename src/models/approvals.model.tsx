import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface Approval {
  idRequest: number;
  idCashBatch?: number;
  date: string;
  state: string;
  typeRequest: string;
  reason: string;
  comment: string; //en esta atributo se guardaria el comentario del supervisor
  commentSupervisor?: string;
  status: number
}

export interface RequestOpeningForm {
  idCash: string;
  comment: string;
  commentSupervisor?: '',
  reason: number
}

export interface AprovalsReason {
  id: number;
  reason: string;
  type: string
}

export interface AprovalsClousureCash {
  id: number;
  date: string;
}

export interface EditRequestForm {
  comment: string;
  status: boolean;
}

export interface DetailApprovalsProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface RegisterApprovalsProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TableApprovalsProps {
  openEditDialog: (dataApproval: Approval) => void;
}

export interface StateApprovalsProps {
  state: number
}


export interface ClosingListSelectProps {
  register: UseFormRegister<any>; // Tipo genérico para `useForm`
  errors: FieldErrors<any>; // Manejo de errores de `useForm`
}