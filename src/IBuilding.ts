export default interface IUpgrade {
    basePrice: bigint;
    price: bigint;
    name: string;
    description: string;
    baseProfit: bigint;
    profit: bigint;
    opened: boolean;
    bought: bigint;
    upgrade: number;
}