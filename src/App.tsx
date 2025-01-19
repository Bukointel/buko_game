import './scss/App.scss';
import './scss/null.scss';
import './scss/fonts.scss';
import Game from './Game/Game.jsx';
import Buildings from './Buildings.tsx';
import { useEffect, useState } from 'react';
import GameStore from './GameStore';
import { observer } from 'mobx-react-lite';
import Balance from "./Balance.tsx";
import Statistic from "./Statistic.tsx";


export default observer(() => {
  const [openedTab, openTab] = useState('Game');
  useEffect(() => {
    for (let i = 0; i < GameStore.buildings.length; i++) {
      if (GameStore.bukos >= GameStore.buildings[i].price) {
        GameStore.openBuilding(i);
      }
    }
  }, [GameStore.bukos])
  let mainGameSecInterval: number;
  useEffect(() => {
    mainGameSecInterval = setInterval(() => {
      GameStore.sec()
    }, 1000);
    return () => {
      clearInterval(mainGameSecInterval)
    }
  }, [])

  let autoClickInterval: number;
  useEffect(() => {
    if (Number(GameStore.buildings[0].bought) > 0) {
      autoClickInterval = setInterval(() => {
        GameStore.tap()
      }, 10000 / Number(GameStore.buildings[0].bought));
    }
    return () => {
      clearInterval(autoClickInterval)
    }
  }, [GameStore.firstBuilding])

  return (
    // <div className='App' onClick={() => { GameStore.getAvailableUpgrade(0) }}>
    <div className='App'>
      <Balance />
      <div className='App_content'>
        {openedTab === 'Buildings' && <Buildings />}
        {openedTab === 'Statistic' && <Statistic />}
        <Game hide={openedTab !== 'Game'} />
      </div>
      <div className='App_menu'>
        <div className='App_menu_element' onClick={() => { openTab('Buildings') }}>
          <img src="/img/buildings.png" alt="" />
          <div className='App_menu_element_text'>
            BUILDINGS
          </div>
        </div>
        <div className='App_menu_element' onClick={() => { openTab('Game') }}>
          <img src="/img/play.png" alt="" />
          <div className='App_menu_element_text'>
            PLAY
          </div>
        </div>
        <div className='App_menu_element' onClick={() => { openTab('Statistic') }}>
          <img src="/img/statistic.png" alt="" />
          <div className='App_menu_element_text'>
            STATISTIC
          </div>
        </div>
      </div>

    </div>
  )
})