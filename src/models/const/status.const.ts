export enum STATUS {
    Close = 'Cerrado',
    REOPENED = 'Reabierto',
    IN_CORRECTION = 'En corrección',
    WITH_DIFFERENCE = 'Con Diferencia',
    WITH_DIFFERENCE_ = 'Con diferencia',
    Open = 'Abierto',
    RECLOSED = "Re-cerrado",
    ACTIVE = "Activo",
    INACTIVE = "Inactivo",
    CLOSED_STARBUCKS = "Cerrado Starbucks",
    OPEN_CHECK = "Cheque abierto"
}

export const STATUS_CLOSED_DIALOG_EXCEPTIONS = ["abierto", "open", "reabierto", "cerrado starbucks", "en corrección", "cheque abierto"];
// export const STATUS_CLOSED_DIALOG_EXCEPTIONS = ["abierto", "open", "reabierto", "cerrado starbucks", "en corrección"];