import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ROLES } from "./const/menu.consts";

export interface Approval {
  idRequest: number;
  employee: string,
  idCashBatch?: number;
  date: string;
  dateCdc:string;
  state: string;
  typeRequest: string;
  reason: string;
  comment: string; //en esta atributo se guardaria el comentario del supervisor
  commentSupervisor?: string;
  status: number;
  zone?: string;
  cdc?: string;
  closingEmployee?:string;
}

export interface RequestOpeningForm {
  id: string;
  comment: string;
  commentSupervisor?: '',
  reason: number
}

export interface RequestUpdateDetails { 
  comment: string;
  idCashLote: number;
  idRequest: number;
  typeRequest: string;
  status: boolean
}

export interface AprovalsReason {
  id: number;
  name: string;
}

export interface AprovalsClousureList {
  id: number;
  name: string;
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
  role: ROLES;
}

export interface StateApprovalsProps {
  state: number
}

export interface ClosingListSelectProps {
  register: UseFormRegister<any>; // Tipo genérico para `useForm`
  errors: FieldErrors<any>; // Manejo de errores de `useForm`
}

export interface filterOptionsProps {
  cdc: number[];
  employeeId: number;
  requestDateStart: Date;
  requestDateEnd: Date;
  closingDateStart: Date;
  closingDateEnd: Date;
  status: string[];
}