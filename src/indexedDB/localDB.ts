import Dexie from "dexie";

class LocalDB extends Dexie {

    userData: Dexie.Table<{ key: string; value: string; }, string> ;

    constructor() {
       
        super("LocalDB");

        this.version(1).stores({
            userData: "key, value", // 'key' es la clave primaria, 'value' es indexado
        });

        this.userData = this.table("userData");
    }
}

export const loadData = new LocalDB();