import * as ReportsModels from "@models/reports.model";
import { GUIDE_TO_BANKING_BANAMEX } from "@models/const/reportBanck.const";

export const handleDiscountData = (rowData: any[]): ReportsModels.DiscountReportModel[] => {

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

export const handleEmployeeSalesData = (rowData: any[]): ReportsModels.EmployeeSalesModel[] => {

  return rowData.map(item => {
    const totalSale = parseFloat(item.ventaTotal || '0');
    const voids = parseFloat(item.voids || '0');
    const discounts = parseFloat(item.descuentos || '0');
    const netSales = (item.ventasNetas || '0');
    const pax = parseFloat(item.pax || '0');
    const salePer = (item.venta || '0');

    const formatDate = item.fechaDeVenta.split(' ')[0]
    const date = new Date(`${formatDate}T00:00:00`);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return {
      date: `${day}/${month}/${year}`,
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

const dateTransform = (dateString: string) => {
  const formatDate = dateString.split('T')[0]
  const date = new Date(`${formatDate}`);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const handlePaymentMethod = (rowData: any[]): ReportsModels.PaymentMethodModel[] => {

  return rowData.map(item =>{

    return {
      date: dateTransform(item.fechaVenta),
      location: item.ubicacion,
      cdc: item.centroDeConsumo,
      paymentMethod: item.formaPago,
      currency: item.moneda,
      exchangeRate: item.tipoCambio,
      ticketNumber: item.ticket,
      amount: item.importe,
      netSales: item.ventasNetas,
      netSalesWithVAT: item.ventasNetasIva,
      comments: item.comentarios
    }
  });
}

export const handlePMIXGeneralData = (rowData: any[]): ReportsModels.PMixGeneralReportModel[] => {
  return rowData.map(item => {

    return {
      date: dateTransform(item.salesDate),
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

export const handleSyncErrorsData = (rowData: any[]): ReportsModels.SyncErrorsModel[] => {
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

export const handleBanamexData = (backingData: any): ReportsModels.BanamexModel => {
  const preGuide: ReportsModels.BanamexGuideModel[] = GUIDE_TO_BANKING_BANAMEX

  const preEmployees: ReportsModels.BanamexEmployeesModel[] = backingData.difColaboradorResponses.map( (item:any) => {
    return {
      employeeName: item.empleado,
      cdc: item.cdc,
      mxnCurrency: item.pesos,
      usdCurrency: item.dolares,
      sumAmountChange: item.montoCambio,
      difference: item.diferencia,
    }
  })

  const preCommerce: ReportsModels.BanamexCommerceModel[] = backingData.comercioBanamexResponses.map( (item:any) => {
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

  const preSummary: ReportsModels.BanamexSummaryModel[] = backingData.resumenBanamexResponses.map( (item:any) => {
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

export const handleSantanderData = (backingData: any[]): ReportsModels.SantanderModel[] => {
  return backingData.map( (item:any) => {
    return {
      operationType: item.tipoOperacion,
      dateTime: item.fechaYhora,
      commerceCode: item.codigoComercio,
      cashier: item.cajero,
      id: item.id,
      currencyReceivedType: item.tipoMonedaRecibida,
      amountReceived: item.cantidadRecibida,
      purchaseAmount: item.importeCompra,
      exchangeRate: item.tipoCambio,
      currencyAmount: item.monedaDelImporte,
      transactionId: item.idTransaccion,
      exchangeRateMXN: item.cambioMxp,
      exchangeRateUSD: item.cambioUsd,
      cdc: item.cdc,
      operator: item.operador,
      chequeNumber: item.numeroCheque,
    }
  });
}

export const handleCuoponsData = (rowData: any[]): ReportsModels.CouponsModel[] => {
  return rowData.map(item => {
    return {
      check: item.ticket,
      consumption: parseFloat(item.consumo),
      pricePerConsumption: parseFloat(item.precioCupones),
      difference: parseFloat(item.diferencia),
      exchangeRateClient: parseFloat(item.tipoCambio),
      clients: item.cliente,
      pax: parseInt(item.pax),
      folioCouponsMXN: item.folioCuponesMXN,
      folioCouponsUSD: item.folioCuponesUSD,
      valueMXN: parseFloat(item.valorMXP),
      valueUSD: parseFloat(item.valorUSD),
      flight: item.vuelo,
      passengerName: item.nombrePasajero
    }
  })
}

export const handleVoidsData = (rowData: any[]): ReportsModels.VoidsModel[] => {
  return rowData.map(item => {
    const formatDate = item.saleDate.split(' ')[0]
    const date = new Date(`${formatDate}T00:00:00`);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return {
      date: `${day}/${month}/${year}`,
      cdc: item.consumerCenter,
      ticketNumber: item.ticketNumber,
      product: item.productName,
      voidDescription: item.voidDescription,
      voidAmount: item.voids,
      totalSale: item.totalTicket,
      discounts: item.discounts,
      netSales: item.netSale,
      voidPercentage:item.voidSalePercentage,
      employee: item.employeeName,
      approvedBy: item.approverName,
      openTime: item.openTicketHour,
      closeTime: item.closeTicketHour,
    }
  })
}

export const handleSalesVsDiscountData = (rowData: any[]): ReportsModels.SalesVsDiscountModel[] => {
  return rowData.map(item => {
    return {
      date: dateTransform(item.fechaVenta),
      cdc: item.centroDeConsumo,
      totalSale: Number(item.ventaTotal),
      voids: Number(item.voids),
      discounts: Number(item.descuentos),
      netSales: Number(item.ventasNetas),
      budget: Number(item.presupuesto),
      budgetDifferencePercentage: Number(item.porcentajeDiferenciaVsPresupuesto),
      budgetDifferenceAmount: Number(item.diferenciaVsPresupuesto),
      lastYearSale: Number(item.ventaAnioAnterior),
      lastYearDifferencePercentage: Number(item.porcentajeDiferenciaVsAnterior),
      pax: Number(item.pax),
      salePerPax: Number(item.ventaEntrePax),
      lastYearPax: Number(item.paxAnioAnterior),
      checksCount: Number(item.numCheques),
      paxPerCheck: Number(item.paxEntreCheques),
      averageCheckValue: Number(item.valorChequePromedio),
      lastYearAverageCheckValue: Number(item.getValorChequePromedioAnioAnterior),
      cost: item.costo ? Number(item.costo) : 0,
      costPercentage: item.costoVsVentas ? Number(item.costoVsVentas) : 0,
      realRPE: item.rpeReal ? Number(item.rpeReal) : 0,
      budgetRPE: item.rpePresupuesto ? Number(item.rpePresupuesto) : 0,
      rpeDifference: item.rpeDiferencia ? Number(item.rpeDiferencia) : 0,
    }
  });
}

export const reportHandlers = {
  handleDiscountData,
  handleEmployeeSalesData,
  handlePaymentMethod,
  handleCuoponsData,
  handlePMIXGeneralData,
  handleSyncErrorsData,
  handleBanamexData,
  handleSantanderData,
  handleVoidsData,
  handleSalesVsDiscountData 
};