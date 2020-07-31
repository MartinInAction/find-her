import React from 'react';
import './App.css';

export default class App extends React.PureComponent<{}, {}> { 
  state = {
    apiToken: undefined,
    refreshToken: undefined,
    matches: []
  }

  componentDidMount () {
    return authorize('EAAGm0PX4ZCpsBAEUCXnnZB6qIrjMRBdbiKTEYbo1QpaDRfyF5rIn5A9RK47UWSlAJesIZCJyfdsW7dHwrCkjZBzb1WdPLEcI1VhjSD3a3BWKwOsI7YgguYdTQszNkShIJx0FMHpeT7GhFoTaPYJrSL319PI0mKrcJH5Fik2OlFcXB0WBq6oBHa2MCUVGkVUZD', '10163192507730045')
  }
  render () {
    let {apiToken} = this.state
    if (!apiToken) return this.renderLoggedOut()
    let {matches} = this.state
    return (
      <div className="App">
        {matches.map(this.renderMatch)}
      </div>
    );
  }

  renderLoggedOut = () =>  {
    return (
      <div style={{ flex: 1, marginLeft: 20, display: 'flex', flexDirection: 'column', maxWidth: 400, justifyContent: 'center', alignSelf: 'center'}}>
        <input id='emailInput' placeholder='email' type='email' style={{marginTop: 20}} />
        <input id='passInput' placeholder='password' type='password' style={{marginTop: 20}} />
        <input type='submit' style={{ marginTop: 20 }} value='Sign in' onClick={this.onSignIn} />
      </div>
    )
  }

  onSignIn = () => {
    let email = document.getElementById('emailInput').value
    let pass = document.getElementById('passInput').value
    return fetch('/generate-token', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        email,
        pass
      })
    })
    .then((res) => res.json())
    .then((token) => {
      debugger
      return authorize(token, '10163192507730045') // EAAGm0PX4ZCpsBAEUCXnnZB6qIrjMRBdbiKTEYbo1QpaDRfyF5rIn5A9RK47UWSlAJesIZCJyfdsW7dHwrCkjZBzb1WdPLEcI1VhjSD3a3BWKwOsI7YgguYdTQszNkShIJx0FMHpeT7GhFoTaPYJrSL319PI0mKrcJH5Fik2OlFcXB0WBq6oBHa2MCUVGkVUZD
    })
    .then((res) => {
      let {data} = res
      this.setState({
        apiToken: data.api_token,
        refreshToken: data.refresh_token,
        tinderId: data._id
      })
      debugger
      return data
    })
    .then((data) => getMatches(data))
    .catch((err) => {})
  }

  renderMatch = (match: Object) => {
    return (
      <div style={{borderWidth: 2, borderColor: 'red'}}>
        <img style={{height: 200, width: 200, margin: 50}} src={match.person.photos[0].url} alt='hot grill' />
        <p>{match.person.name}</p>
      </div>
    )
  }

}

const getMatches = (data) => {
  debugger
  return fetch(`/matches?locale=en-AU&count=100&message=1&is_tinder_u=false`, {
    headers: {
      ...defaultHeaders,
      'X-Auth-Token': data?.api_token || '63292fd1-1a70-4cee-b1c2-29713dce0272',
    },
    method: 'GET',
  })
  .then((res) => res.json())
  .catch((error) => {
    return Promise.reject(error)
  })
}

const authorize = (token: string, facebook_id: string) => {
  return fetch(`/auth/login/facebook`, {
    headers: {
      ...defaultHeaders
    },
    method: 'POST',
    body: JSON.stringify({
      token,
      facebook_id,
      locale: 'en'
    }),
    json: true
  })
  .then((res) => {
    debugger
    return res
  })
  .then((res) => res.json())
  .then((res) => {
    if (res?.error?.code) return Promise.reject(new Error(res?.error?.code))
    return res
  })
  .catch((error) => {
    debugger
    return Promise.reject(error)
  })
}


const defaultHeaders = {
    'User-Agent': 'Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'platform': 'ios',
    'Accept-Language': 'en'
}
