import { Button } from 'semantic-ui-react'

export default function MoneyButtonBar({increamentInbound, resetInbound}) {
    return (
        <Button.Group>
            <Button color='orange' onClick={() => increamentInbound(10)}>10</Button>
            <Button color='yellow' onClick={() => increamentInbound(20)}>20</Button>
            <Button color='olive' onClick={() => increamentInbound(50)}>50</Button>
            <Button color='green' onClick={() => increamentInbound(100)}>100</Button>
        </Button.Group>
    )
}
