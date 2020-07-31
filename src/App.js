import React from 'react';
import logo from './logo.svg';
import './App.css';

const BASE_URL = 'https://api.gotinder.com/v2'

export default class App extends React.PureComponent<{}, {}> { 
  state = {
    apiToken: '',
    refreshToken: '',
    results: []
  }

  componentDidMount () {
    let facebookId = '10163192507730045'
    let facebookAccessToken = 'EAAGm0PX4ZCpsBAFpvqBnd7G51YIk1IJ4CWGQZBP7ubXxm2kdbFHEqTPkwZCgr4O3YnrYqtq2LVe6eeHPxaD0usZBXBOvXtS0zk0J2HhbhUzHZC8DL3jzqcMWug4qvnw0iZAZCLhSCJgk3lKGH3VFcamzicRFA6PWUR3n5OsF0Qa1t9kbPGxOSvnUlmvmdVGB9BztY7KCxYNLwZDZD'
    authorize(facebookAccessToken, facebookId)
    .then((res) => {
      return res.json()
    })
    .then((res) => {
      
      debugger
    })
  }
  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }

}


const authorize = (token: string, facebook_id: string) => {
  return fetch(`${BASE_URL}/auth/login/facebook`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify({
      token,
      facebook_id,
      locale: 'en'
    }),
    json: true
  })
  .catch((error) => {
    debugger
  })
  .then((data) => data)
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
