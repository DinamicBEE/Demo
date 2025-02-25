/** Obtiene la fecha actual formateada */
export const getCurrentDate = (): string => {
  return new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}
