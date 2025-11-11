export enum STATUS {
    Close = 'Cerrado',
    REOPENED = 'Reabierto',
    WITH_DIFFERENCE = 'Con Diferencia',
    WITH_DIFFERENCE_ = 'Con diferencia',
    Open = 'Abierto',
    RECLOSED = "Re-cerrado",
    ACTIVE = "Activo",
    INACTIVE = "Inactivo",
    CLOSED_STARBUCKS = "Cerrado Starbucks"
}

export const STATUS_CLOSED_DIALOG_EXCEPTIONS = ["abierto", "open", "reabierto", "cerrado starbucks"];