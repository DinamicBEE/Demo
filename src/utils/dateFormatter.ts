
export const formatToDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() es 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatToYYYYMMDD = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

export const formatToYYYYMMDDstring = (date: string): string => {
  const [dia, mes, anio] = date.split('/');
  return `${anio}-${mes}-${dia}`;
};

export const formatToDDMMYYYYstring = (date: string): string => {
  const dateObj = new Date(date);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // getMonth() es 0-based
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

/** Formato de fecha completa a DD/MM/YYYY HH:mm:ss
 * @param completeDate - Fecha string en formato "YYYY-MM-DD HH:mm:ss"
 * @return Fecha formateada en formato "DD/MM/YYYY HH:mm:ss"
*/
export const formatCompleteDate = (completeDate: string): string => {
  if (!completeDate) return "";
  const [date, time] = completeDate.split(' ');
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year} ${time}`;
}

/** Formato de fecha completa de yyyy-MM-ddTHH:mm:ss a DD/MM/YYYY
 * @param completeDate - Fecha string en formato "YYYY-MM-DDTHH:mm:ss"
 * @return Fecha formateada en formato "DD/MM/YYYY"
*/
export const formatOnlyDate = (completeDate: string): string => {
  if (!completeDate) return "";
  const [date, time] = completeDate.split('T');
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}