import {MachineMode} from '../../config/constants'
import { Button } from 'semantic-ui-react'

export default function MachineModeSelector({currentMode, selector}) {

    const changeMode = (mode) => {
        if(currentMode != mode)
            selector(mode)
    }

    console.log('MODE', MachineMode.ADMIN);

    return (
        <Button.Group>
            <Button 
                positive={currentMode == MachineMode.VENDING} 
                onClick={() => changeMode(MachineMode.VENDING)} >
                    VEDNING
            </Button>
            <Button.Or />
            <Button 
                positive={currentMode == MachineMode.ADMIN}
                onClick={() => changeMode(MachineMode.ADMIN)} >
                    ADMIN
            </Button>
        </Button.Group>
    );
}