import { Fragment, useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' })
  const [worksheets, setWorksheets] = useState<{ title: string, description: string, price: number, cost: number }[]>([])

  const handleUsernameOnChange = (event: React.ChangeEvent<HTMLInputElement>) => setLoginCredentials({ ...loginCredentials, username: event.currentTarget.value })
  const handlePasswordOnChange = (event: React.ChangeEvent<HTMLInputElement>) => setLoginCredentials({ ...loginCredentials, password: event.currentTarget.value })
  const handleLoginSubmitButtonOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    fetch(`${process.env.REACT_APP_API_URL}/sessions`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({ user: loginCredentials })
    }).then(response => response.json())
      .then(data => setIsLoggedIn(data.logged_in))
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${process.env.REACT_APP_API_URL}/worksheets/index`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ user: loginCredentials })
      }).then(response => response.json())
        .then(data => setWorksheets(data.worksheets))
    }
  }, [isLoggedIn, loginCredentials])

  if (!isLoggedIn)
    return <Fragment>
      <form>
        <label htmlFor='username'>Username</label>
        <input id='username' type='text' placeholder='Type username here' onChange={handleUsernameOnChange} />
        <label htmlFor='password'>Password</label>
        <input id='password' type='password' placeholder='Type password here' onChange={handlePasswordOnChange} />
        <button type='button' onClick={handleLoginSubmitButtonOnClick}>Submit</button>
      </form>
    </Fragment>
  else
    return <Fragment>
      <p>Total Cost: ${worksheets.reduce((accumulator, { cost }) => accumulator + parseFloat(cost as any) , 0).toFixed(2)}</p> 
      <p>Total Price: ${worksheets.reduce((accumulator, { price }) => accumulator + parseFloat(price as any) , 0).toFixed(2)}</p> 
      <p>Total Profits: ${worksheets.reduce((accumulator, { cost, price }) => accumulator + (parseFloat(price as any) - parseFloat(cost as any)), 0).toFixed(2)}</p>
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>Title</td>
            <td>Description</td>
            <td>Cost ($)</td>
            <td>Price ($)</td>
            <td>Profit ($)</td>
          </tr>
        </thead>
        <tbody>
          {worksheets.map(({ title, description, cost, price }, index) => <tr>
            <td>{index + 1}</td>
            <td>{title}</td>
            <td>{description}</td>
            <td>{cost}</td>
            <td>{price}</td>
          </tr>)}
        </tbody>
      </table>
    </Fragment>
}

export default App