import {useState} from 'react'
import {encode as base64_encode} from 'base-64';
import { Button, Form } from 'semantic-ui-react'
export default function LoginBox({setToken}) {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    const login = () => {
        if(!username || username.length == 0 || !password || password.length == 0) {
            window.alert('Enter credentials')
            return
        }
        else {
            let headers = new Headers();
            headers.append('Authorization', 'Basic ' + base64_encode(username + ":" + password));
            fetch('/login', {
                method: 'POST',
                headers: headers
            }).then(res => {
                res.json().then(response => setToken(response.token))
            }).catch(err => {
                console.log(err);
                window.alert('Invalid credentials')
            })
        }
    }

    return (
        <Form>
            <Form.Field>
                <label>Username</label>
                <input placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <input placeholder='Password' onChange={(e) => setPassword(e.target.value)} type = 'password' />
            </Form.Field>
            <Button onClick={() => login()}>Submit</Button>
        </Form>
    )


}