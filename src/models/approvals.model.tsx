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
