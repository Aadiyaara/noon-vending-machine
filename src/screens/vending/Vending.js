import {useState} from 'react'
import { Grid, Button, Segment } from 'semantic-ui-react'
import Items from '../../components/items/Items'
import MoneyButtonBar from '../../components/input/MoneyButtonBar'
import './vending.css'

export default function Vending({items, refetchItems}) {

    const [inbound, setInbound] = useState(0)
    const [item, setItem] = useState()
    const [log, setLog] = useState('')


    const increamentInbound = (amount) => {
        setInbound(c => c + amount)
    }

    const resetInbound = () => {
        setInbound(0)
    }

    const buy = () => {
        if(item == null) {
            window.alert('Please select an item first')
            setItem(null)
        }
        else if(item.price > inbound) {
            window.alert('Insufficient Funds')
            setItem(null)
        }
        else {
            fetch('/create_order', {
                method:'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'item_id': item.id,
                    'inbound_money': inbound,
                })
            }).then(res => res.json().then(response => {
                setLog(`\nYou have rcvd ${item.name} and a refund of Rs. ${response.refund}`)
                setItem(null)
                setInbound(0)
                refetchItems()
            })).catch(err => {
                window.alert(err)
            })
        }
    }

    return (
        <Grid celled>
            <Grid.Row>
                <Grid.Column width={10}>
                <Segment style={{overflow: 'auto', maxHeight: '60vh' }}>
                    <Items items={items} setItem={setItem} selectedItem={item} />
                </Segment>
                </Grid.Column>
                <Grid.Column width={6}>
                    {log}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width={10}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        Add Money Here
                        <MoneyButtonBar increamentInbound={increamentInbound} resetInbound={resetInbound} />
                    </div>
                </Grid.Column>
                <Grid.Column width={6}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                            <b>MONEY DEPOSITED {inbound}</b>
                        </div>
                        <div>
                            <Button color='red' onClick={() => resetInbound()}>Cancel</Button>
                            <Button color='green' onClick={() => buy()}>Buy</Button>
                        </div>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
