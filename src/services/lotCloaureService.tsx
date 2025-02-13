import { STATUS } from "@models/status.model";
import { table } from "console";


export const getLotsClosure = async (
  dateRange: string,
  locationId: number,
  companyId: number
) => {
  try {
    //const response = await axios.get(`${API_HOME}/5266be06-3fe2-4f6f-9263-0f315eaeab9b`);
    const response = lotsClosure;

    //return response.data
    return response;
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};

const lotsClosure = [
  {
    id: 1,
    location: "Location 1",
    company: "Company 1",
    lotNumber: "123456",
    status: STATUS.CLOSED,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 1",
  },
  {
    id: 2,
    location: "Location 2",
    company: "Company 2",
    lotNumber: "123456",
    status: STATUS.OPEN,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 2",
  },
  {
    id: 3,
    location: "Location 3",
    company: "Company 3",
    lotNumber: "123456",
    status: STATUS.CLOSED,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 3",
  },
  {
    id: 4,
    location: "Location 4",
    company: "Company 4",
    lotNumber: "123456",
    status: STATUS.REOPENED,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 4",
  },
  {
    id: 5,
    location: "Location 5",
    company: "Company 5",
    lotNumber: "123456",
    status: STATUS.WITH_DIFFERENCE,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 5",
  },
  {
    id: 6,
    location: "Location 6",
    company: "Company 6",
    lotNumber: "123456",
    status: STATUS.CLOSED,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 6",
  },
];

const lotClosure = {
  id: 1,
  location: "Location 1",
  company: "Company 1",
  dateClosed: "2021-09-01",
  lotsNumbers: [
    {
      id: 1,
      lotNumber: "123456",
      amount: 100,
    }
  ],
  total:{
    totalPos: 100,
    totalClousing: 200,
    totalDifference: 100
  }

}
