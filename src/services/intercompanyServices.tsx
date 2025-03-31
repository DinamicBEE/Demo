import { Employee } from "@models/employee.model";
import { SubsidiaryModal } from "@models/common.model";
import api from "../api/index"


export const getListEmployesIntercompany = async (): Promise<Employee[]> => {
	try {
		const response = await api.get(`/crc/cash-register-closure/crcproc/employees/employeeListInter`);
		const result = response.data

		return result;

	} catch (error: any) {
		throw new Error(error);
	}
}

export const getSubsidiariesList = async (idEmploye: string): Promise<SubsidiaryModal[]> => {

	try {

		const response = await api.get(`/crc/cash-register-closure/api/subsidiaria/subEmploye?idEmploye=${idEmploye}`);
		const result = response.data

		return result;

	} catch (error: any) {
		console.log(error)
		return []
		// throw new Error(error)
	}

}