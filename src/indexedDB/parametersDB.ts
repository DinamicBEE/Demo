import { ParametersSelectedModel } from "@models/common.model";
import Dexie from "dexie";

class LocalDB extends Dexie {

    parametersSelected: Dexie.Table<{ key: string; value: ParametersSelectedModel; },ParametersSelectedModel> ;

    constructor() {
       
        super("LocalDB");

        this.version(1).stores({
            parametersSelected: "country, subsidiaries, zone, cdc, status, date",
        });

        this.parametersSelected = this.table("parametersSelected");
    }
}

export const parameters = new LocalDB();