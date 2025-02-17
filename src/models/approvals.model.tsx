import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface Approval {
  id: number;
  date: string;
  state: string;
  typeRequest: string;
  reasons: string;
  comment: string; //en esta atributo se guardaria el comentario del supervisor
  commentSupervisor?: string;
  status: boolean
}

export interface RequestOpeningForm {
  name: string;
  reason: string;
  comment: string;
}

export interface EditRequestForm {
  comment: string;
  status: boolean;
}

export interface EditStatusApprovalsProps {
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
  state: string
}


export interface ClosingListSelectProps {
  register: UseFormRegister<any>; // Tipo genérico para `useForm`
  errors: FieldErrors<any>; // Manejo de errores de `useForm`
}