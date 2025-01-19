import { numPrettier } from './GameUtils';
import { makeAutoObservable, observable, toJS } from "mobx";
import buildingsData from "./Buildings.ts";
import upgradesData from "./Upgrades.ts";
import IBuilding from "./IBuilding.ts";

class GameStore {
    bukos: bigint = 200n;
    buildings: IBuilding[] = [];

    totalEarned: bigint = 0n;
    totalByBuildings: bigint = 0n;
    totalTapped: bigint = 0n;
    tappingUpgrade: number = 0;
    timePlayed: number = 0;

    constructor() {
        makeAutoObservable(this);

        // Загрузка прогресса из localStorage
        this.loadProgress();

        // Инициализация улучшений, если данных нет
        if (!this.buildings.length) {
            this.buildings = observable(buildingsData.map((building, index) => ({
                ...building,
                price: BigInt(building.basePrice),
                opened: index === 0 ? true : false,
                profit: BigInt(building.baseProfit),
                bought: 0n,
                upgrade: 0,
            })));
        }
    }

    tap() {
        const bpc = this.calcBPC();
        this.bukos += bpc;
        this.totalTapped += bpc;
        return bpc;
    }

    sec() {
        const bps = this.calcBPS()
        this.bukos += bps;
        this.totalByBuildings += bps;
        this.totalEarned = this.totalByBuildings + this.totalTapped;
        this.timePlayed = this.timePlayed ? this.timePlayed + 1 : 1;
        this.saveProgress();
    }

    calcBPS() {
        let bps = 0n
        for (let i = 1; i < this.buildings.length; i++) {
            bps += this.buildings[i].profit * this.buildings[i].bought
        }

        return bps;
    }

    getBalance() {
        return this.bukos;
    }

    getBPSRound() {
        const bpc = this.calcBPC()
        const bps = this.calcBPS()
        return bps < 1_000_000 ? BigInt(Math.round(Number(bps) + (Number(this.buildings[0].bought) * Number(bpc)) / 10)) : bps + BigInt(Math.round((Number(this.buildings[0].bought) * Number(bpc)) / 10));
    }

    getBPS() {
        const bpc = this.calcBPC()
        const bps = this.calcBPS()
        return numPrettier(bps < 1_000_000 ? Number(bps) + (Number(this.buildings[0].bought) * Number(bpc)) / 10 : bps + BigInt(Math.round((Number(this.buildings[0].bought) * Number(bpc)) / 10)));
    }

    buyBuilding(index: number) {
        const building = this.buildings[index];
        if (building && this.bukos >= BigInt(building.price)) {
            this.bukos -= BigInt(building.price);
            building.bought += 1n;
            // Формула роста цены: basePrice * 1.15 ^ bought
            const newPrice = Number(building.basePrice) * Math.pow(1.15, Number(building.bought));
            building.price = BigInt(Math.ceil(newPrice));
            this.saveProgress();
        }
    }

    openBuilding(ind: number) {
        this.buildings[ind].opened = true;
    }

    // Сохранение прогресса в localStorage
    saveProgress() {
        const data = {
            bukos: this.bukos.toString(), // Сохраняем bigint как строку
            buildings: toJS(this.buildings).map(building => ({
                ...building,
                basePrice: building.basePrice.toString(), // Сохраняем bigint как строку
                price: building.price.toString(),
                baseProfit: building.baseProfit.toString(),
                profit: building.profit.toString(),
                bought: building.bought.toString(),
                upgrade: building.upgrade.toString(),
            })),
            totalEarned: this.totalEarned.toString(),
            totalByBuildings: this.totalByBuildings.toString(),
            totalTapped: this.totalEarned.toString(),
            tappingUpgrade: this.tappingUpgrade.toString(),
            timePlayed: this.timePlayed.toString()

        };
        localStorage.setItem('gameProgress', JSON.stringify(data));
    }

    // Загрузка прогресса из localStorage
    loadProgress() {
        try {
            const data = localStorage.getItem('gameProgress');
            if (data) {
                const parsed = JSON.parse(data);
                this.bukos = BigInt(parsed.bukos);
                this.buildings = observable(parsed.buildings.map((building: any) => ({
                    ...building,
                    basePrice: BigInt(building.basePrice), // Преобразуем обратно в bigint
                    price: BigInt(building.price),
                    baseProfit: BigInt(building.baseProfit),
                    profit: BigInt(building.profit),
                    bought: BigInt(building.bought),
                    upgrade: Number(building.upgrade),

                })));
                console.log(parsed);

                this.totalEarned = BigInt(parsed.totalEarned);
                this.totalByBuildings = BigInt(parsed.totalByBuildings);
                this.totalTapped = BigInt(parsed.totalTapped);
                this.tappingUpgrade = Number(parsed.tappingUpgrade);
                this.timePlayed = Number(parsed.timePlayed)

            }
        } catch (error) {
            this.clear()
        }
    }

    clear() {
        localStorage.removeItem('gameProgress');
        this.bukos = 150n;
        this.buildings = observable(buildingsData.map((building, index) => ({
            ...building,
            price: BigInt(building.basePrice),
            opened: index === 0 ? true : false,
            profit: BigInt(building.baseProfit),
            bought: 0n,
            upgrade: 0,
        })));
        this.totalEarned = 0n;
        this.totalByBuildings = 0n;
        this.totalTapped = 0n;
        this.tappingUpgrade = 0;
        this.timePlayed = 0;
    }

    getAvailableUpgrade(ind: number) {
        const boughtUpgrades = this.buildings[ind].upgrade;
        const boughtBuildings = this.buildings[ind].bought;
        // console.log(`boughtUpgrades: ${boughtUpgrades}`);
        // console.log(`boughtBuildings: ${boughtBuildings}`);

        const numToName: Record<number, keyof typeof upgradesData> = {
            0: "pawUpgrades",
            1: "dogsFeastUpgrades",
            2: "doghouseUpgrades",
            3: "shelterUpgrades",
            4: "factoryUpgrades",
            5: "bankUpgrades",
            6: "templeUpgrades",
            7: "wizardTowerUpgrades",
            8: "shipmentUpgrades",
            9: "alchemyLabUpgrades",
            10: "portalUpgrades",
            11: "timeMachineUpgrades",
            12: "antimatterCondenserUpgrades",
            13: "prismUpgrades",
            14: "chancemakerUpgrades",
            15: "fractalEngineUpgrades",
            16: "javascriptConsoleUpgrades",
            17: "idleverseUpgrades",
        };

        const name = numToName[ind];
        if (!name) {
            throw new Error(`Invalid index: ${ind}`);
        }

        const upgrades = upgradesData[name];
        // Сортируем массив по unlocksOn
        const sortedUpgrades = [...upgrades].sort((a, b) => (a.price > b.price ? 1 : -1));
        // Фильтруем те, которые доступны при текущем количестве зданий
        const availableUpgrades = sortedUpgrades.filter(upgrade => upgrade.unlocksOn <= boughtBuildings);
        // Пропускаем первые boughtUpgrades записей
        const availableUpgradesSlice = availableUpgrades.slice(boughtUpgrades);
        // console.log(availableUpgradesSlice);
        if (availableUpgradesSlice.length > 0) {
            return availableUpgradesSlice[0]
        } else {
            return { name: '', unlocksOn: 0n, price: 0n, description: '', flavorText: '' }
        }
    }

    upgradeBuilding(ind: number) {
        this.buildings[ind].upgrade += 1;
        this.buildings[ind].profit *= 2n;
    }

    calcBPC(): bigint {
        if (this.buildings[0].upgrade === 0) { return 1n; }
        if (this.buildings[0].upgrade === 1) { return 2n; }
        if (this.buildings[0].upgrade === 2) { return 4n; }
        if (this.buildings[0].upgrade === 3) { return 8n; }
        if (this.buildings[0].upgrade > 3) {
            const countOfBuildings = this.buildings.reduce((sum, building) => sum + building.bought, 0n) || 0n;
            if (this.buildings[0].upgrade === 4) { return BigInt(Math.round(Number(countOfBuildings) / 10)); }
            if (this.buildings[0].upgrade === 5) { return BigInt(Math.round(Number(countOfBuildings) / 2)); }
            if (this.buildings[0].upgrade === 6) { return countOfBuildings * 5n; }
            if (this.buildings[0].upgrade === 7) { return countOfBuildings * 50n; }
            if (this.buildings[0].upgrade === 8) { return countOfBuildings * 1000n; }
            if (this.buildings[0].upgrade === 9) { return countOfBuildings * 20000n; }
            if (this.buildings[0].upgrade === 10) { return countOfBuildings * 400000n; }
            if (this.buildings[0].upgrade === 11) { return countOfBuildings * 8000000n; }
            if (this.buildings[0].upgrade === 12) { return countOfBuildings * 160000000n; }
            if (this.buildings[0].upgrade === 13) { return countOfBuildings * 3200000000n; }
            if (this.buildings[0].upgrade === 14) { return countOfBuildings * 64000000000n; }
            if (this.buildings[0].upgrade === 15) { return countOfBuildings * 1280000000000n; }
        }
        // Значение по умолчанию, если ничего не подошло
        return 0n;
    }



    get firstBuilding() {
        return this.buildings[0].bought;
    }

}

export default new GameStore();
