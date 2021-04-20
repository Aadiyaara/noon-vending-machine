import { Table } from "semantic-ui-react";
import Order from "./Order";

export default function Orders({orders}) {

    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        ORDER ID
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        AMOUNT PAID
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        ITEM NAME
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        SELLING PRICE
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        REFUND
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    orders.map(order => {
                        return <Order order={order} key={order.id} />
                    })
                }
            </Table.Body>
        </Table>
    )
} 