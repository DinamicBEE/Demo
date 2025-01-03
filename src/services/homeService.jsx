import axios from "axios";
import { API_HOME } from "./settings";

//const BASE_URL = "https://run.mocky.io/v3";


export const getGeneralInfo = async (subsidiary, store) => {
    
    try {
        console.log(subsidiary, store)
        const response = await axios.get(`${API_HOME}/5266be06-3fe2-4f6f-9263-0f315eaeab9b`);

        console.log(response)
        return response.data
        
    } catch (error) {
        console.error('Error al obtener las Subsidiarias: ', error)
        return []; 
    }

}

export function exportCSV({data, header}) {
    const csvString = [
        ["Vendedor", "Total POS", "Total Físico", "Diferencia",
         "Estatus", "Extras", "MXN", "USD", "EUR", "LIB", "CAN",
         "Clientes General", "Clientes Especiales", "Prepago",
         "CXC Empleados", "Intercompañia"
        ],
        ...data.map(item => [
            item.employe, item.totalPOS, item.totalClousing, 
            item.difference, item.status, item.mxm, item.mxm,
            item.usd, item.eur, item.lib, item.can, item.generalCXC,
            item.specialCXC, item.prepaid, item.employetotal,
            item.intercompany 
        ])
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8;'});

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${header.subsidiaryName}_${header.storeName}_${header.date}`;        document.body.appendChild(link)
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

}