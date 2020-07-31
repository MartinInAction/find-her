import React from 'react';
import './App.css';

// change this to your own for now
// then maybe use https://www.npmjs.com/package/get-facebook-id ????
const FACEBOOK_ID = '10163192507730045'
const MILE_CONVERTER_NUMBER = 1.609344
export default class App extends React.PureComponent<{}, {}> { 
  state = {
    apiToken: undefined,
    refreshToken: undefined,
    matches: [],
    hasMessages: 2 // 0 for false, 1 for true and 2 for both :O
  }

  componentDidMount () {
    this.tryToAuth()
  }

  render () {
    let {apiToken} = this.state
    if (!apiToken) return this.renderLoggedOut()
    let {matches} = this.state
    return (
      <div className="App" style={{backgroundColor: '#0022'}}>
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

  renderMatch = (match: Object, index: number) => {
    /**
     * TODO
     * seen: match_seen: true // can see if match is opened
     * 
     * sort on :
      * birth_date,
      * last_activity_date
      * common_friend_count
      * common_like_count
      
      // find endpoint for location... maybe show on map?
      // if only "km away" show circle with that area?
      // fetch Request URL: https://api.gotinder.com/user/${user.id}?locale=en-AU
        .then data.distance_mi

     */
    return (
      <div key={index} style={{margin: 50, padding: 50, paddingBottom: 20, backgroundColor: 'black'}}>
        <img style={{ resizeMode: 'contain', height: 'auto', width: '50%', maxWidth: 400}} src={match.person.photos[0].url} alt='hot grill' />
        <p style={{color: 'white'}}>{match.person.name}</p>
        <p style={{ color: 'white' }}>{Math.floor(match.distance_mi * MILE_CONVERTER_NUMBER)} km</p>
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
      .then((data) => this.getMatches())
      .catch((err) => { })
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
    let {hasMessages} = this.state
    // max 100 matches / request
    return fetch(`/matches?locale=en-AU&count=40&message=${hasMessages}&is_tinder_u=false`, {
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
      return Promise.all(res.data.matches.map((match) => this.enhanceMatch(match)))    
    })
    .then((enhancedMatches) => {
      enhancedMatches.sort((a, b) => a.distance_mi - b.distance_mi)
      this.setState({ matches: enhancedMatches})
    })
    .catch((error) => {
      
    })
  }

  enhanceMatch = (match: Object) => {
    let {apiToken} = this.state
    return fetch(`/user/${match.person._id}`, {
      // 5e1777f2890f930100e04e3c
      headers: {
        ...defaultHeaders,
        'X-Auth-Token': apiToken,
      },
      method: 'GET'
    })
    .then((res) => res.json())
      .then((res) => res.results)
    .then((res) => ({...match, ...res}))
    .catch((res) => {
      debugger
    })
  }

  getProfile = () => {
    let { apiToken } = this.state
    fetch('https://api.gotinder.com/v2/profile?locale=en-AU&include=account', {
      headers: {
        ...defaultHeaders,
        'X-Auth-Token': apiToken,
      },
      method: 'post'
    })
      .then((res) => res.json())
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
