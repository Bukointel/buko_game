import { useState } from 'react';
import GameStore from './GameStore';
import { numPrettier, timePrettier } from './GameUtils';
import './scss/Statistic.scss';

export default () => {
    const [confirm1, setconfirm1] = useState(false);
    const [confirm2, setconfirm2] = useState(false);
    const [confirm3, setconfirm3] = useState(false);

    return (
        <div className='Statistic'>
            <div className='Statistic_element'>
                <div className='Statistic_element_header'>
                    Total earned
                </div>
                <div className='Statistic_element_value'>
                    {numPrettier(GameStore.totalEarned)}
                </div>
            </div>
            <img src="/img/separator.png" className='Statistic_separator' alt="" />
            <div className='Statistic_element'>
                <div className='Statistic_element_header'>
                    Total by buildings
                </div>
                <div className='Statistic_element_value'>
                    {numPrettier(GameStore.totalByBuildings)}
                </div>
            </div>
            <img src="/img/separator.png" className='Statistic_separator' alt="" />
            <div className='Statistic_element'>
                <div className='Statistic_element_header'>
                    Total tapped
                </div>
                <div className='Statistic_element_value'>
                    {numPrettier(GameStore.totalTapped)}
                </div>
            </div>
            <img src="/img/separator.png" className='Statistic_separator' alt="" />
            <div className='Statistic_element'>
                <div className='Statistic_element_header'>
                    Play time
                </div>
                <div className='Statistic_element_value'>
                    {timePrettier(GameStore.timePlayed)}
                </div>
            </div>

            <div className='Statistic_element Statistic_element_new' onClick={() => {
                if (confirm3) {
                    GameStore.clear()
                }
                if (confirm2) {
                    setconfirm3(true)
                }
                if (confirm1) {
                    setconfirm2(true)
                }
                setconfirm1(true)
            }}>
                <div className='Statistic_element_header'>
                    {
                        confirm3 ? 'Confirm start of new game' : confirm2 ? "Have you thought about it?" : confirm1 ? "Are you sure?" : "Start new game"
                    }
                </div>
            </div>
            {/* <img src="/img/separator.png" className='Statistic_separator' alt="" /> */}
        </div>
    )
}