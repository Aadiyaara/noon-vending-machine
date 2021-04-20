import { useState } from 'react'

import { Table, Button, Form } from "semantic-ui-react";

export default function Item({item, refetchItems, token}) {

    const [inventory, setInventory] = useState(item.active_inventory)

    const save = () => {
        let headers = new Headers()
        headers.append('x-access-token', token)
        headers.append('Content-Type', 'application/json')
        fetch('/update_item', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                'item_id': item.id,
                'active_inventory': inventory
            })
        }).then(res => {
            res.json().then(response => console.log(response));
            refetchItems()
        }).catch(err => {
            setInventory(item.active_inventory)
            window.alert('Oops! An error occured, Please try again!')
        })
    } 

    return (
        <Table.Row>
            <Table.Cell>
                {item.id}
            </Table.Cell>
            <Table.Cell>
                {item.name}
            </Table.Cell>
            <Table.Cell>
                {item.price}
            </Table.Cell>
            <Table.Cell>
            <Form>
                <Form.Field>
                    <label>Active Inventory</label>
                    <input placeholder='Available' type='number' value={inventory} defaultValue={item.active_inventory} onChange={(e) => setInventory(e.target.value) }/>
                </Form.Field>
            </Form>
            </Table.Cell>
            <Table.Cell>
                <Button disabled={inventory == item.active_inventory} onClick={() => save()}> SAVE </Button>
            </Table.Cell>
        </Table.Row>
    )
} 