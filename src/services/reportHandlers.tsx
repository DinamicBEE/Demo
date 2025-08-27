import { BanamexCommerceModel, BanamexEmployeesModel, BanamexGuideModel, BanamexModel, BanamexSummaryModel, DiscountReportModel, EmployeeSalesModel, PMixGeneralReportModel, SyncErrorsModel } from "@models/reports.model";
import { GUIDE_TO_BANKING_BANAMEX } from "@models/reportsConstService.model";

export const handleDiscountData = (rowData: any[]): DiscountReportModel[] => {

  return rowData.map(item =>{
    
    const discountAmount = parseFloat(item.s || '0');
    const totalSale = parseFloat(item.ventaTotal || '0');

    const discountPercentage = totalSale > 0 
      ? (discountAmount / totalSale) * 100 
      : 0;
    const formatDate = item.venta.split(' ')[0]
    const date = new Date(`${formatDate}T00:00:00`);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return {
      date: `${day}/${month}/${year}`,
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

export const handleEmployeeSalesData = (rowData: any[]): EmployeeSalesModel[] => {

  return rowData.map(item => {
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

export const handlePMIXGeneralData = (rowData: any[]): PMixGeneralReportModel[] => {
  return rowData.map(item => {
    return {
      date: item.salesDate.split('T')[0],
      subsidiary: item.subsidiaries,
      cdc: item.consumerCenter,
      category: item.category,
      family: item.family,
      key: item.code,
      item: item.product,
      quantity: item.itemNumber,
      totalSale: item.totalSale,
      voids: item.totalVoids,
      discounts: item.totalDiscount,
      netSales: item. netSales,
      categoryPercentage: item.categorySale,
      familyPercentage: item.familySale,
      cost: item.cost,
      costPercentage: item.costSale
    }
  })

}

export const handleSyncErrorsData = (rowData: any[]): SyncErrorsModel[] => {
  const exceptionsStatus = ["PRODUCTO NO REGISTRADO", "TENDER MEDIA NO REGISTRADO", "DESCUENTO NO REGISTRADO"]
  
  return rowData.map(item => {
    const isException = exceptionsStatus.includes(item.type.toUpperCase());

     
    let statusID = 0;
    let textTool = ""
    
    if (isException) {
      const lowerStatus = item.status.toLowerCase();
      
      if (lowerStatus === "pendiente") {
        statusID = 1;
        textTool = "En proceso"
      } else if (lowerStatus === "en proceso") {
        statusID = 2;
        textTool = "Sincronizado"
      }
    }
    
    return {
      id: item.id,
      transactionID: item.transactionID,
      especialStatus: item.status,
      attempts: item.attempts,
      type: item.type,
      errorMsg: item.errorMsg,
      onCDC: item.onCDC,
      processOfError: item.processOfError,
      attended: !item.attended ? "Sin atender" : "Atendido",
      creationDate: item.creationDate,
      lastAttemptDate: item.lastAttemptDate,
      isException: exceptionsStatus.includes(item.type.toUpperCase()),
      nextStatus: statusID,
      nextStatusTool: textTool
    }
  })
  
}

export const handleBanamexData = (backingData: any): BanamexModel => {
  const preGuide: BanamexGuideModel[] = GUIDE_TO_BANKING_BANAMEX

  const preEmployees: BanamexEmployeesModel[] = backingData.difColaboradorResponses.map( (item:any) => {
    return {
      employeeName: item.empleado,
      cdc: item.cdc,
      mxnCurrency: item.pesos,
      usdCurrency: item.dolares,
      sumAmountChange: item.montoCambio,
      difference: item.diferencia,
    }
  })

  const preCommerce: BanamexCommerceModel[] = backingData.comercioBanamexResponses.map( (item:any) => {
    return {
      day: item.dia,
      month: item.mes,
      year: item.anio,
      typeOperation: item.tipoOperacion,
      usdReceived: item.recibidoDolares,
      usdOperation: item.operacionDolares,
      exchangeRate: item.tipoCambio,
      usdChange: item.cambioDolares,
      nationalChange: item.cambioNacional,
      employeeId: item.identificadorCajero,
      recordSales: item.registroVenta,
      cdcId: item.numeroEstablecimiento,
      cdc: item.cdc,
      depositedAmount: item.montoDepositar,
      verification1: item.comprobacionUno,
      verification2: item.comprobacionDos,
      verification3: item.comprobacionTres,
      verification4: item.comprobacionCuatro,
      paymenthSaleID: item.paymenthSaleID,
    }
  })

  const preSummary: BanamexSummaryModel[] = backingData.resumenBanamexResponses.map( (item:any) => {
    return {
      cdc: item.cdc,
      cdcId: item.cdcNum,
      usdAmount: item.montoDolares,
      exchangeRate: item.cambioDolares,
      realAmount: item.montoReal,
      meraAmount: item.montoCC,
      difference: item.diferencia,
    }
  });

  const totalUsdAmount: number = backingData.resumenBanamexResponses.reduce((acc: number, curr: { montoDolares: number })=> acc + (curr.montoDolares), 0);
  const totalExchangeRate: number = backingData.resumenBanamexResponses.reduce((acc: number, curr: { cambioDolares: number })=> acc + (curr.cambioDolares), 0);
  const totalRealAmount: number = backingData.resumenBanamexResponses.reduce((acc: number, curr: { montoReal: number })=> acc + (curr.montoReal), 0);
  const totalMeraAmount: number = backingData.resumenBanamexResponses.reduce((acc: number, curr: { montoCC: number })=> acc + (curr.montoCC), 0);
  const totalDifference: number = backingData.resumenBanamexResponses.reduce((acc: number, curr: { diferencia: number })=> acc + (curr.diferencia), 0);

  preSummary.push({
    cdc: "Total",
    cdcId: 0,
    usdAmount: totalUsdAmount,
    exchangeRate: totalExchangeRate,
    realAmount: totalRealAmount,
    meraAmount: totalMeraAmount,
    difference: totalDifference
  });


  return {
    guide: preGuide,
    employees: preEmployees,
    commerce: preCommerce,
    summary: preSummary
  };

}

export const reportHandlers = {
  handleDiscountData,
  handleEmployeeSalesData,
  handlePMIXGeneralData,
  handleSyncErrorsData,
  handleBanamexData
};