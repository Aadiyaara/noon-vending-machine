
import { Table } from "semantic-ui-react";

export default function Item({order}) {

    return (
        <Table.Row>
            <Table.Cell>
                {order.id}
            </Table.Cell>
            <Table.Cell>
                {order.inbound}
            </Table.Cell>
            <Table.Cell>
                {order.item_name}
            </Table.Cell>
            <Table.Cell>
                {order.selling_price}
            </Table.Cell>
            <Table.Cell>
                {order.refund}
            </Table.Cell>
        </Table.Row>
    )
} 