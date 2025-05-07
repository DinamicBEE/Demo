import { ReactNode, createContext, useContext, useState, useMemo, useCallback } from 'react';
import { IntercompanyContext, IntercompanyContextType, IntercompanyLine, IntercompanyModel } from '@models/intercompany.model';
import { getIntercompanyClousing } from '@services/clousingService';
import { TotalModel } from '@models/common.clousing.model';
import { Employee } from '@models/employee.model';
import { getListEmployesIntercompany, getSubsidiariesList } from '@services/intercompanyServices';
import { SubsidiaryModal } from '@models/common.model';

const intercompanyContext = createContext<IntercompanyContextType>({} as IntercompanyContextType);

export const useIntercompanyContext = () => useContext(intercompanyContext);

export function IntercompanyClousingProvider({ children }: { children: ReactNode }) {
	const [intercompany, setIntercompany] = useState<IntercompanyContext>({})
	const [error, setError] = useState<string>("");
	const [employeeList, setEmployeeList] = useState<Employee[]>();
	const [subsidiariesList, setSubsidiariesList] = useState<SubsidiaryModal[]>()

	const getIntercompanyData = useCallback(async (clousingId: number) => {

		if (intercompany[clousingId]) {
			return intercompany[clousingId];
		}

		try {

			const data: IntercompanyModel = await getIntercompanyClousing(clousingId);

			const updateIntercompany: IntercompanyContext = {
				...intercompany,
				[clousingId]: data,

			};

			setIntercompany(updateIntercompany);

			return data;

		} catch (error) {

			setError(error instanceof Error ? error.message : String(error));

			throw error;

		}

	}, [intercompany]);

	const setIntercompanyData = useCallback((intercompanyData: IntercompanyModel, clousingId: number) => {

		const currentRegister = intercompany[clousingId];
		const updateLines = intercompanyData.lines;

		const newTotalPhysical = updateLines?.reduce(
			(acc: number, curr: IntercompanyLine) => acc + curr.physicalAmount,
			0
		);

		const newDifference = (currentRegister.total?.totalPOS || 0) - (newTotalPhysical || 0);

		const newTotal: TotalModel = {
			totalPOS: currentRegister.total?.totalPOS || 0,
			totalPhysical: newTotalPhysical || 0,
			difference: newDifference,
		};

		const updateData: IntercompanyContext = {
			...intercompany,
			[clousingId]: {
				...currentRegister,
				lines: updateLines,
				total: newTotal
			}
		}

		setIntercompany(updateData);

	}, [intercompany]);

	const getEmployeesList = useCallback(async () => {

		if (employeeList) return employeeList;

		try {

			const data: Employee[] = await getListEmployesIntercompany();

			setEmployeeList(data);

			return data;

		} catch (error) {

			setError(error instanceof Error ? error.message : String(error));
			throw error;

		}

	}, [employeeList]);

	const getSubsidiaries = useCallback(async (idEmployee: string) => {

		try {

			const data: SubsidiaryModal[] = await getSubsidiariesList(idEmployee);

			setSubsidiariesList(data);

			return data;

		} catch (error) {

			setError(error instanceof Error ? error.message : String(error));
			throw error;

		}

	}, [subsidiariesList]);

	const value = useMemo(
		() => ({
			intercompany,
			error,
			getIntercompanyData,
			setIntercompanyData,
			getEmployeesList,
			getSubsidiaries,
			setIntercompany
		}),
		[intercompany, error, getIntercompanyData, setIntercompanyData, getEmployeesList, getSubsidiaries, setIntercompany]
	);

	return (
		<intercompanyContext.Provider value={value}>
			{children}
		</intercompanyContext.Provider>
	);

}