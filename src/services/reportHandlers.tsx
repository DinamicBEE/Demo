import { DiscountReportModel } from "@models/reports.model";

export const handleDiscountData = (rawData: any[]): DiscountReportModel[] => {

  return rawData.map(item =>{
    
    const discountAmount = parseFloat(item.s || '0');
    const totalSale = parseFloat(item.ventaTotal || '0');

    const discountPercentage = totalSale > 0 
      ? (discountAmount / totalSale) * 100 
      : 0;

    return {
      date: item.venta.split(' ')[0],
      cdc: item.centroDeConsumo,
      discountType: item.descuento,
      discountAmount: discountAmount,
      totalSale: totalSale,
      discountPercentage: parseFloat(discountPercentage.toFixed(2)),
      employee: item.empleado,
      approver: item.aprobo
    }
  });
}

export const reportHandlers = {
  handleDiscountData,
};