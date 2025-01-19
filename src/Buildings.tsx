import { observer } from 'mobx-react-lite';
import GameStore from './GameStore.ts';
import './scss/Buildings.scss';
import Building from './Building.tsx';


export default observer(() => {
    return (
        <div className='Buildings_wrapper'>
            <div className='Buildings'>
                {
                    GameStore.buildings.map((building, ind) => {
                        let show = true
                        let hidden = false
                        if (ind > 0) {
                            if (GameStore.buildings[ind - 1].opened) {
                                hidden = true
                                if (building.price <= GameStore.bukos || building.opened) {
                                    hidden = false
                                }
                            } else {
                                show = false
                            }
                        }
                        if (show) {
                            return <Building
                                ind={ind}
                                building={building}
                                hidden={hidden}
                                key={building.name}
                            />
                        }
                    })
                }
            </div>
        </div>
    )
})