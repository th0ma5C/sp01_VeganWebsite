import { getTownList } from "@/api/cityList";
import { cityList } from "@/api/cityList/mockList";

interface TownList {
    [key: string]: string[]
}

class City {
    #cityList;
    #townList: TownList = {};
    private static instance: City;

    // 單例模式防止多次實例化
    private constructor() {
        this.#cityList = [...cityList.RESPONSE];
    }

    // 單例訪問方法
    static getInstance() {
        if (!City.instance) {
            City.instance = new City();
        }
        return City.instance;
    }

    get cityList() {
        return this.#cityList
    }

    async setTownList(param: string) {
        try {
            const { RESPONSE: [{ TOWN }] } = await getTownList(param);
            const townList = TOWN.map((town) => {
                return town.NAME
            })
            return townList
        } catch (error) {
            console.log(this.setTownList.name, error);
        }
    }

    async getShowTownList(cityName: string) {
        if (!this.#townList[cityName]) {
            try {
                const city = this.#cityList.find(city => city.NAME === cityName);
                if (city) {
                    const param = JSON.stringify([{ CITY: city.CODE }]);
                    const list = await this.setTownList(param);
                    if (list) {
                        this.#townList[cityName] = list;
                    }
                }
            } catch (error) {
                console.error(`Error loading town list for ${cityName}`, error);
            }
        }
        return this.#townList[cityName];
    }

    // constructor() {
    //     this.#cityList = [...cityList.RESPONSE];

    //     try {
    //         this.initTownList();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async initTownList() {
    //     try {
    //         const townListEntries = await Promise.all(
    //             this.#cityList.map(async (city) => {
    //                 const param = [{
    //                     CITY: city.CODE
    //                 }]
    //                 return {
    //                     [city.NAME]: await this.setTownList(JSON.stringify(param))
    //                 };
    //             })
    //         );
    //         this.#townList = Object.assign({}, ...townListEntries);
    //     } catch (error) {
    //         console.log(this.initTownList.name, error);
    //     }
    // }


}

export const city = City.getInstance();