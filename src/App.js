import React from 'react';
import './App.css';

// change this to your own for now
// then maybe use https://www.npmjs.com/package/get-facebook-id ????
const FACEBOOK_ID = '10163192507730045'
export default class App extends React.PureComponent<{}, {}> { 
  state = {
    apiToken: undefined,
    refreshToken: undefined,
    matches: []
  }

  componentDidMount () {
    this.tryToAuth()
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
      return this.authorize(token, FACEBOOK_ID) // EAAGm0PX4ZCpsBAEUCXnnZB6qIrjMRBdbiKTEYbo1QpaDRfyF5rIn5A9RK47UWSlAJesIZCJyfdsW7dHwrCkjZBzb1WdPLEcI1VhjSD3a3BWKwOsI7YgguYdTQszNkShIJx0FMHpeT7GhFoTaPYJrSL319PI0mKrcJH5Fik2OlFcXB0WBq6oBHa2MCUVGkVUZD
    })
    .then((data) => this.getMatches(data))
    .catch((err) => {})
  }

  renderMatch = (match: Object, index: number) => {
    return (
      <div key={index} style={{borderWidth: 2, borderColor: 'red'}}>
        <img style={{height: 200, width: 200, margin: 50}} src={match.person.photos[0].url} alt='hot grill' />
        <p>{match.person.name}</p>
      </div>
    )
  }

  hasAuth = () => {
    let tinderApiToken = localStorage.getItem('tinderApiToken') || undefined
    let tinderRefreshToken = localStorage.getItem('tinderRefreshToken') || undefined
    let tinderId = localStorage.getItem('tinderId') || undefined
    if (!!tinderApiToken && !!tinderRefreshToken && !!tinderId) return true
  }

  tryToAuth = () => {
    let tinderApiToken = localStorage.getItem('tinderApiToken') || undefined
    let tinderRefreshToken = localStorage.getItem('tinderRefreshToken') || undefined
    let tinderId = localStorage.getItem('tinderId') || undefined
    if (!!tinderApiToken && !!tinderRefreshToken && !!tinderId) {
      this.setState({
        apiToken: tinderApiToken,
        refreshToken: tinderRefreshToken,
        tinderId: tinderId
      })
      return Promise.resolve()
        .then(this.getMatches())
    }
    return Promise.reject(new Error('cant auth'))
  }

  authorize = (token: string, facebook_id: string) => {
    if (this.hasAuth()) this.tryToAuth()
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
      .then((res) => res.json())
      .then((res) => {
        let { data } = res
        localStorage.setItem('tinderApiToken', data.api_token)
        localStorage.setItem('tinderRefreshToken', data.refresh_token)
        localStorage.setItem('tinderId', data._id)
        this.setState({
          apiToken: data.api_token,
          refreshToken: data.refresh_token,
          tinderId: data._id
        })
        return data
      })
      .then((res) => {
        if (res?.error?.code) return Promise.reject(new Error(res?.error?.code))
        return res
      })
      .catch((error) => {
        debugger
        return Promise.reject(error)
      })
  }

  getMatches = (data?: Object) => {  
    return fetch(`/matches?locale=en-AU&count=100&message=1&is_tinder_u=false`, {
      headers: {
        ...defaultHeaders,
        'X-Auth-Token': data?.api_token || localStorage.getItem('tinderApiToken'),
      },
      method: 'GET',
    })
    .then((res) => {
      if (res.statusText === 'Unauthorized') {
        return this.refreshToken()
          .this.getMatches()
      }
      return res
    })
    .then((res) => res?.json())
    .then((res) => {
      if (!res?.data) return Promise.reject(new Error('could not get matches'))
      this.setState({ matches: res.data.matches })
    })
    .catch((error) => {
      
    })
  }

  refreshToken = () => {
    let tinderApiToken = localStorage.getItem('tinderApiToken') || undefined
    let tinderRefreshToken = localStorage.getItem('tinderRefreshToken') || undefined
    return fetch('/auth', {
      headers: {
        ...defaultHeaders,
        'X-Auth-Token': tinderApiToken,
      },
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: tinderRefreshToken,
      })
    })
    .then((res) => {
      debugger
      return res
    })
      .then((res) => res.json())
      .then(({data}) => {
        debugger
        localStorage.setItem('tinderApiToken', data.api_token)
        localStorage.setItem('tinderRefreshToken', data.refresh_token)
        this.setState({
          apiToken: data.api_token,
          refreshToken: data.refresh_token
        })
      })
      .catch((err) => {
        debugger
      })
  }

}

const defaultHeaders = {
    'User-Agent': 'Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'platform': 'ios',
    'Accept-Language': 'en'
}
