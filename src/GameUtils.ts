export function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function numPrettier(num: number | bigint): string {
    const sextillion = 1_000_000_000_000_000_000_000n;
    const septillion = 1_000_000_000_000_000_000_000_000n;
    const octillion = 1_000_000_000_000_000_000_000_000_000n;
    const nonillion = 1_000_000_000_000_000_000_000_000_000_000n;
    const decillion = 1_000_000_000_000_000_000_000_000_000_000_000n;
    const quintillion = 1_000_000_000_000_000_000n;
    const quadrillion = 1_000_000_000_000_000n;
    const trillion = 1_000_000_000_000n;
    const billion = 1_000_000_000n;
    const million = 1_000_000n;

    // Helper function to format numbers with 1 decimal place
    const format = (value: bigint, divisor: bigint, label: string): string => {
        return `${(Number(value) / Number(divisor)).toFixed(1)} ${label}`;
    };

    if (typeof num === 'bigint') {
        if (num > decillion) return format(num, decillion, 'Decillion');
        if (num > nonillion) return format(num, nonillion, 'Nonillion');
        if (num > octillion) return format(num, octillion, 'Octillion');
        if (num > septillion) return format(num, septillion, 'Septillion');
        if (num > sextillion) return format(num, sextillion, 'Sextillion');
        if (num > quintillion) return format(num, quintillion, 'Quintillion');
        if (num > quadrillion) return format(num, quadrillion, 'Quadrillion');
        if (num > trillion) return format(num, trillion, 'Trillion');
        if (num > billion) return format(num, billion, 'Billion');
        if (num > million) return format(num, million, 'Million');
        return num.toString();
    }

    if (typeof num === 'number') {
        if (num >= 1e33) return `${(num / 1e33).toFixed(1)} Decillion`;
        if (num >= 1e30) return `${(num / 1e30).toFixed(1)} Nonillion`;
        if (num >= 1e27) return `${(num / 1e27).toFixed(1)} Octillion`;
        if (num >= 1e24) return `${(num / 1e24).toFixed(1)} Septillion`;
        if (num >= 1e21) return `${(num / 1e21).toFixed(1)} Sextillion`;
        if (num >= 1e18) return `${(num / 1e18).toFixed(1)} Quintillion`;
        if (num >= 1e15) return `${(num / 1e15).toFixed(1)} Quadrillion`;
        if (num >= 1e12) return `${(num / 1e12).toFixed(1)} Trillion`;
        if (num >= 1e9) return `${(num / 1e9).toFixed(1)} Billion`;
        if (num >= 1e6) return `${(num / 1e6).toFixed(1)} Million`;
        return num.toString();
    }

    throw new TypeError('Invalid input');
}

export function timePrettier(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
}

