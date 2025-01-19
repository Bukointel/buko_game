import './scss/Building.scss';
import { useState } from 'react';
import { numPrettier } from './GameUtils.ts';
import IBuilding from "./IBuilding.ts";
import GameStore from './GameStore.ts';
import { observer } from 'mobx-react-lite';


export default observer(({ ind, building, hidden = false }:
    {
        ind: number,
        building: IBuilding;
        hidden: boolean
    }) => {
    const [opened, setopened] = useState(false)



    return (
        <div className='Building_wrapper' style={{ opacity: hidden ? 0.6 : 1 }}>
            <div className='Building' onClick={() => { !hidden && setopened(!opened) }}>
                <div className='Building_decor' style={{ backgroundPositionY: `${-ind * 64}px`, backgroundPositionX: `${hidden ? 64 : 0}px` }}>
                </div>
                <div className='Building_info'>
                    <div className='Building_info_name' style={{
                        fontSize: `${building.name.length > 9 ? building.name.length > 16 ? 15 : 22 : 28}px`
                    }}>
                        {hidden ? "???" : building.name}
                    </div>
                    <div className='Building_info_price' style={{
                        color: `${GameStore.bukos >= building.price ? "#6f6" : "#f66"}`
                    }}>
                        <img src="/img/play.png" alt="" />
                        {numPrettier(building.price)}
                    </div>
                </div>
                <div className='Building_count'>
                    {building.bought > 0n && Number(building.bought)}
                </div>
            </div>
            {
                opened && <div className='Building_opened'>
                    <div className='Building_opened_count'>
                        <div className='Building_opened_text'>
                            {building.description}

                            {
                                building.profit > 0n
                                    ? <div className='Building_opened_text_profit'>
                                        Each gain {numPrettier(building.profit)} per sec
                                        <br />
                                        Total {numPrettier(building.profit * building.bought)} per sec
                                    </div>
                                    : <div className='Building_opened_text_profit'>
                                        {numPrettier(GameStore.calcBPS())} per tap
                                    </div>

                            }
                        </div>
                        <div className='Building_opened_buy' onClick={() => {
                            GameStore.bukos >= building.price && GameStore.buyBuilding(ind)
                        }}>
                            BUY
                        </div>
                    </div>



                    {GameStore.getAvailableUpgrade(ind).name.length > 0 &&
                        <>
                            <img src="/img/separator.png" className='Building_opened_upgrade_separator' alt="" />
                            <div className='Building_opened_upgrade'>
                                <div className='Building_opened_upgrade_desc'>
                                    <div className='Building_opened_upgrade_desc_text'>
                                        <div className='Building_opened_upgrade_desc_text_name'>
                                            {GameStore.getAvailableUpgrade(ind).name}
                                        </div>
                                        <div className='Building_opened_upgrade_desc_text_flavor'>
                                            {GameStore.getAvailableUpgrade(ind).description}
                                        </div>
                                    </div>
                                    <div className='Building_opened_upgrade_desc_img'>
                                        <img src="/img/upgrades.png" alt="" />
                                    </div>
                                </div>
                                <div className='Building_opened_upgrade_price'>
                                    <div className='Building_opened_upgrade_price_count' style={{
                                        color: `${GameStore.bukos >= GameStore.getAvailableUpgrade(ind).price ? "#6f6" : "#f66"}`
                                    }}>

                                        <img src="/img/play.png" alt="" />
                                        {numPrettier(GameStore.getAvailableUpgrade(ind).price)}
                                    </div>
                                    <div className='Building_opened_buy' onClick={() => {
                                        GameStore.bukos >= GameStore.getAvailableUpgrade(ind).price && GameStore.upgradeBuilding(ind)
                                    }}>
                                        BUY UPGRADE
                                    </div>
                                </div>

                                <div className='Building_opened_upgrade_desc_text_flavor_bot'>
                                    "{GameStore.getAvailableUpgrade(ind).flavorText}"
                                </div>
                            </div>
                        </>
                    }

                </div>
            }
        </div>
    )
})