export interface RequestOpening {
  name: string;
  reason: string;
  comment: string;
}

export interface Approval {
  id: number;
  date: string;
  state: string;
  typeRequest: string;
  reasons: string;
  comment: string;
}