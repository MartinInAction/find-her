import React from 'react';
import logo from './logo.svg';
import './App.css';

export default class App extends React.PureComponent<{}, {}> { 
  state = {
    apiToken: '',
    refreshToken: '',
    matches: []
  }

  componentDidMount () {
    getMatches(undefined)
      .then(({ data }) => {
        this.setState({ matches: data.matches })
      })
    let facebookId = '10163192507730045'
    // Obtain userId by pressing your FB profile pic and check url "fbid=${id}"
    let facebookAccessToken = ''
    // Obtain token from https://gist.github.com/taseppa/66fc7239c66ef285ecb28b400b556938
    authorize(facebookAccessToken, facebookId)
      .then((res) => {
        let {data} = res
        this.setState({
          apiToken: data.api_token,
          refreshToken: data.refresh_token,
          tinderId: data._id
        })
        return data
      })
    .then((res) => {
      getMatches(res)
        .then(({data}) => {
          this.setState({matches: data.matches})
        })
    })
    .catch((error) => alert(`Error code ${error}`))
  }
  render () {
    let {matches} = this.state
    return (
      <div className="App">
        {matches.map(this.renderMatch)}
      </div>
    );
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
  return fetch(`/matches?locale=en-AU&count=100&message=1&is_tinder_u=false`, {
    headers: {
      ...defaultOptions.headers,
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
    ...defaultOptions,
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
    if (res?.error?.code) return Promise.reject(new Error(res?.error?.code))
    return res
  })
  .catch((error) => Promise.reject(error))
}


const defaultOptions = {
  headers: {
    'User-Agent': 'Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'platform': 'ios',
    'Accept-Language': 'en'
  }
}
