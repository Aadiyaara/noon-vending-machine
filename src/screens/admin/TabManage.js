import { Tab } from 'semantic-ui-react'
import Inventory from './inventory/Inventory'
import Orders from './orders/Orders'

const panes = (orders, token, items, refetchItems) => [
    { menuItem: 'Orders', render: () => <Tab.Pane><Orders orders={orders} /></Tab.Pane> },
    { menuItem: 'Inventory', render: () => <Tab.Pane><Inventory items={items} refetchItems={refetchItems} token={token} /></Tab.Pane> },
]

const TabManage = ({orders, token, items, refetchItems}) => {
    console.log('ITEMS', items);
    return (<Tab panes={panes(orders, token, items, refetchItems)} />)
}

export default TabManage