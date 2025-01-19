import { useEffect, useState } from 'react';
import GameStore from './GameStore';
import './scss/Balance.scss';
import { numPrettier } from './GameUtils';

export default () => {
    const [balance, setBalance] = useState(0n);
    let interval: number;
    useEffect(() => {
        const smoothUpdate = () => {
            const targetBalance = GameStore.bukos;
            const difference = targetBalance - balance;
            let stepsCount: bigint;
            if (GameStore.getBPSRound() > 30n) {
                stepsCount = 30n;
            } else {
                const difAbs = difference > 0 ? difference : difference * -1n;
                if (difAbs > GameStore.getBPSRound()) {
                    stepsCount = difAbs < 30n ? difAbs : 30n;
                } else {
                    stepsCount = GameStore.getBPSRound();
                }
            }

            if (stepsCount > 0n) {
                if (difference !== 0n) {
                    const step = difference / stepsCount;
                    let steps = 0

                    interval = setInterval(() => {
                        if (steps >= stepsCount || balance === targetBalance) {
                            clearInterval(interval!);
                            setBalance(targetBalance);
                            return;
                        }
                        setBalance(prev => prev + step); // Увеличиваем/уменьшаем значение на шаг
                        steps++;
                    }, 1000 / Number(stepsCount));
                }
            } else {
                setBalance(targetBalance)
            }

        };

        smoothUpdate();

        return () => {
            if (interval) clearInterval(interval); // Очищаем интервал при размонтировании
        };
    }, [GameStore.bukos]); // Слушаем изменения GameStore.bukos

    return (
        <div className='Balance'>
            <div className='Balance_count'>
                TAILS: {numPrettier(balance)}
            </div>
            <div className='Balance_pps'>
                TAILS per sec: {GameStore.getBPS()}
            </div>
        </div>
    );
};
