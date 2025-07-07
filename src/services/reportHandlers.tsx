import { DiscountReportModel, EmployeeSalesModel } from "@models/reports.model";

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

export const handleEmployeeSalesData = (rawData: any[]): EmployeeSalesModel[] => {

  return rawData.map(item => {
    const totalSale = parseFloat(item.ventaTotal || '0');
    const voids = parseFloat(item.voids || '0');
    const discounts = parseFloat(item.descuentos || '0');
    const netSales = (item.ventasNetas || '0');
    const pax = parseFloat(item.pax || '0');
    const salePer = (item.venta || '0');

    return {
      date: item.fechaDeVenta.split(' ')[0],
      location: item.ubicacion,
      cdc: item.centroDeConsumo,
      employee: item.empleado,
      totalSale: totalSale,
      voids: voids,
      discounts: discounts,
      netSales: netSales,
      pax: pax,
      salePer: parseFloat(salePer),
      checksCount: parseFloat(item.numeroCheques || '0'),
      averageCheck: parseFloat(item.chequePromedio || '0'),
      food: parseFloat(item.alimentos || '0'),
      drinks: parseFloat(item.bebidas || '0'),
      boutique: parseFloat(item.boutique || '0'),
      photos: parseFloat(item.fotos || '0'),
      unclassified: parseFloat(item.noClasificada || '0')
    }
  });
}

export const reportHandlers = {
  handleDiscountData,
  handleEmployeeSalesData
};