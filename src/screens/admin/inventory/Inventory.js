import { Table } from "semantic-ui-react";
import Item from "./Item";

export default function Inventory({token, items, refetchItems}) {


    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        ITEM ID
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        ITEM NAME
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        ITEM PRICE
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        ACTIVE AVAILIBILITY 
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        ACTIONS
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    items.map(item => {
                        return <Item item={item} refetchItems={refetchItems} token={token} key={item.id} />
                    })
                }
            </Table.Body>
        </Table>
    )
} 