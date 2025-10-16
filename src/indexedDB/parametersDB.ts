import { ParametersSelectedModel } from "@models/common.model";
import Dexie from "dexie";

class LocalDB extends Dexie {

    parametersSelected: Dexie.Table<{ key: string; value: ParametersSelectedModel; }, string> ;

    constructor() {
       
        super("LocalDB");

        this.version(1).stores({
            parametersSelected: "&key",
        });

        this.parametersSelected = this.table("parametersSelected");
        this.open().catch((err) => console.error("Failed to open DB:", err));
    }
}

export const parameters = new LocalDB();