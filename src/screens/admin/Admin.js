import { useState } from 'react'
import LoginBox from './LoginBox'
import ManageBox from './ManageBox'

export default function Admin({items, refetchItems}) {

    const [token, setToken] = useState()

    return (
        <div className="Admin-Box nes-container is-rounded">
            {token ? <ManageBox token={token} items={items} refetchItems={refetchItems} /> : <LoginBox setToken={setToken} />}
        </div>
    )
}
