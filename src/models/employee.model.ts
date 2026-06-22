import { ClousingLinesModel, TotalModel } from "./common.clousing.model";

export interface EmployeeClousingProps {
  data: ClousingLinesModel | null;
  subsidiaryId: number;
  cdc: number;
}

export interface EmployeeContextType {
    employee: EmployeeModel | {};
    employeeLoading: boolean;
    error: string;
    getEmployeetData: ( clousingId: number, isRefresh: boolean ) => Promise<EmployeeModel>;
    getEmployeeList: ( subsidiary: number, cdc: number ) => Promise<Employee[]>;
    getReasonsList: ( subsidiary: number, cdc: number ) => Promise<ReasonsModel[]>;
    getTicketsList: ( cdc: number ) => Promise<TicketModel[]>;
    setNewEmployee: (newEmployee: EmployeeLine, clousingId: number) => void;
    setEmployee :  React.Dispatch<React.SetStateAction<EmployeeContext>>,
    updateEmployee: (updatedEmployee: EmployeeLine, clousingId: number) => void;
    deleteEmployee: (employeeId: string|number, clousingId: number) => Promise<boolean>;
    employeeRef: React.MutableRefObject<EmployeeContext>;
}

export interface EmployeeContext {
    [key: number]:  EmployeeModel
}

export interface EmployeeModel {
    id: number | string;
    employeeId?: number;
    total: TotalModel;
    lines: EmployeeLine[];
    isRoleEditable?: boolean;
}

export interface EmployeeLine {
    id: number | string;
    employeeName: string;
    employeeNumber: string;
    amount: number;
    reason: string;
    reasonId?: number;
    employeeId?: number;
    ticketNumber?: string;
    ticketId?: number;
    externalId?: number;
}

export interface ReasonsModel {
    id: number;
    reasonName: string;
    useCase: string;
}

export interface TicketModel {
    id: number;
    ticketNumber: string;
    ticketDate: string;
    paymentTypeResponse: TicketPaymentMethod[];
}

export interface TicketPaymentMethod {
  idPaymentMethod: number;
  paymentMethod: string;
  amount: number;
}

export interface Employee {
    id: number;
    name: string;
    employeeNumber: string; 
}

export interface NewEmployeeModel {
    employeeId: number;
    reason: number;
    amount: number;
    ticket: string;
}

export interface EmployeeFilterProps {
    employees: Employee[]
    label: boolean;
    itemId?: number | string;
    employeeSelect?: string;
    onSelect: (empleado: Employee, itemId?: number | string ) => void;
    disabled: boolean;
    employeeToEdit: {id: number | string | undefined, name: string | undefined} | null;
}

export interface CustomerFilter{
    customers: {
        value: number,
        label: string,
    }[],
    label: boolean;
    itemId?: number | string;
    customerSelect?: string;
    onSelect: (customer: any, itemId?: number | string ) => void;
    disabled: boolean;
}

export interface AddEmployeeProp {
    clousingId: number;
    subsidiaryId: number;
    cdc: number;
    data: EmployeeLine | null;
    isOpen:boolean; 
    onClose: () => void; 
}

export interface EmployeePayrollDiscountProps {
  line: EmployeeLine;
  subsidiaryId: number;
  isOpen: boolean;
  onClose: () => void;
}

// En caso de requerirse, agregar o cambiar
// los métodos de pago respecto a la DB... que posiblemente pase
// y ya
export const reasonPaymentMethods: Record<string, { methods: string[]; showTickets: boolean }> = {
  "CONSUMO EMPLEADO": { methods: ["CxcEmpleados"], showTickets: true },
  "CUPÓN EXTRAVIADO": { methods: ["CxcEspecial", "CxcGeneral", "PREPAGO"], showTickets: true },
  "VOUCHER EXTRAVIADO": { methods: ["TDC"], showTickets: true },
  "DIFERENCIA EN EFECTIVO": { methods: [], showTickets: false },
  "DIFERENCIA EN INVENTARIO": { methods: ["TDC"], showTickets: true },
  "MALA ELABORACIÓN DEL PRODUCTO": { methods: [], showTickets: false }
};

export interface PdfRequestNSDto {
  idCxcEmployee: number;
  pdf: boolean;
  firstname?: string;
  lastname?: string;
  department?: string;
  entityid?: string;
  title?: string;
  subsidiary?: string;
  internalid?: string;          // ID interno (en formato string)
  dia?: string;                 // Día (en formato string, e.g., "29")
  mes?: string;                 // Mes (en formato string, e.g., "09")
  anio?: string;                // Año (en formato string, e.g., "2025")
  montoAdeudo?: number;         // Monto total del adeudo
  motivos?: string;             // Motivo del adeudo
  numQuincenas?: number;        // Número de quincenas para el descuento
  importeDescuento?: number;    // Importe del descuento por quincena
  delMes?: string;              // Mes de inicio del descuento (en formato string, e.g., "10")
  delAnio?: string;             // Año de inicio del descuento (en formato string, e.g., "2025")
  apartirQuincena?: string;     // Quincena de inicio del descuento (en formato string, e.g., "15" o podría ser "1" si fuera la primera)
}

export interface PdfData {
  pdfRequestNSDto: PdfRequestNSDto; // Objeto con los detalles de la solicitud
  b64?: string;                      // PDF codificado en Base64
}