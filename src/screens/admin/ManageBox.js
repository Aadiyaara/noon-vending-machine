import {useEffect, useState} from 'react'
import TabManage from './TabManage';

export default function ManageBox({token ,items, refetchItems}) {

    const[orders, setOrders] = useState([])

    useEffect(() => {
        let headers = new Headers();
        headers.append('x-access-token', token);
        
        fetch('orders', {headers: headers}).then(res => res.json().then(response => setOrders(response.orders))
        ).catch(err =>console.error(err))
      }, [])

    return (
        <TabManage items={items} token={token} orders={orders} refetchItems={refetchItems} />
    )
}