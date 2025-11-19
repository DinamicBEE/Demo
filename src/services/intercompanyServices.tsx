import { Employee } from "@models/employee.model";
import { SubsidiaryModal } from "@models/common.model";
import api from "../api/index"
import { GET_INTERCOMP_EMP_LIST, GET_SUBS_LIST } from "./settings";


export const getListEmployesIntercompany = async (): Promise<Employee[]> => {
	try {
		const response = await api.get(GET_INTERCOMP_EMP_LIST);
		const result = response.data

		return result;

	} catch (error: any) {
		throw new Error(error);
	}
}

export const getSubsidiariesList = async (idEmploye: string): Promise<SubsidiaryModal[]> => {

	try {

		const response = await api.get(GET_SUBS_LIST, {
      params: {
        idEmploye: idEmploye
      }
    });
		const result = response.data

		return result;

	} catch (error: any) {
		console.error(error)
		return []
		// throw new Error(error)
	}

}