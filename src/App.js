import React from 'react';
import './App.css';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import GridGenerator from './components/GridGenerator'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Pagination, Parallax, Virtual} from 'swiper';
import { InputGroup, FormControl, Row, Col, Button } from 'react-bootstrap';
SwiperCore.use([Pagination, Virtual]);




// change this to your own for now
// then maybe use https://www.npmjs.com/package/get-facebook-id ????
const MILE_CONVERTER_NUMBER = 1.609344
export default class App extends React.PureComponent<{}, {}> { 
  state = {
    apiToken: undefined,
    refreshToken: undefined,
    matches: [],
    nextPageToken: undefined,
    hasMessages: 2, // 0 for false, 1 for true and 2 for both :O
    username: undefined
  }

  componentDidMount () {
    this.tryToAuth()
      .then(() => this.getMatches())

  } 

  render () {
    let {apiToken, matches, username} = this.state
    if (!apiToken) return this.renderLoggedOut()
    return (
      <div className="App" style={{marginTop: 0, backgroundColor: '#0022'}}>
        {username ? <p style={{color: '#fff', fontSize: 20, fontWeight: '800'}}>Logged in as: {username}</p> : <div />}
        <Button variant="primary" onClick={this.getMatches}>{matches.length > 0 ? 'LOAD MORE' : 'LOAD MATCHES'}</Button>
        <GridGenerator cols={3}>
            {matches.map(this.renderMatch)}
          </GridGenerator>
      </div>
    );
  }

  renderLoggedOut = () =>  {
    return (
      <Row style={{margin: 20, flex: 1, display: 'flex',  flexDirection: 'column', justifyContent: 'center', alignSelf: 'center'}}>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1"></InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            id='emailInput'
            type="email" 
            placeholder="Email"
            aria-label="Email"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <InputGroup id='email' className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1"></InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            id='passInput'
            type="password" 
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon1"
          />
        </InputGroup>
        <Button variant="primary" style={{ marginTop: 0 }} onClick={this.onSignIn}>SIGN IN</Button>
      </Row>
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
      * maybe show on map?
     */
    if (!match?.person) return <div key={index} />
    return (
      <div key={index} style={{border: '2px solid white', borderRadius: 10, paddingTop: 20, flex: 1, marginTop: 50}}>
        <Swiper
          pagination
          spaceBetween={1}
          slidesPerView={1} 
          >
          {match?.person?.photos.map((photo, index) => {
            return <SwiperSlide>
              <img key={index} style={{borderRadius: 10, resizeMode: 'contain', height: 250, width: 'auto', maxWidth: 400 }} src={photo?.url} alt='hot grill' />
            </SwiperSlide>
          })}
    </Swiper>        
        <p style={{color: 'white', fontSize: 20, fontWeight: '800'}}>{match.person.name}</p>
        <p style={{ color: 'white' }}>{Math.floor(match.distance_mi * MILE_CONVERTER_NUMBER)} km</p>
        <p style={{ color: 'white' }}>{calculateAge(match.birth_date)} år</p>
      </div>
    )
  }

  renderErrorMessage = (errorMessage?: string) => {
    return <div style={{top: 0, width: '100%', backgroundColor: 'red', height: 50, position: 'absolute'}}>
      <p>Something went wrong, plz try again</p>
      <br />
      <p>{errorMessage}</p>

    </div>
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
      .then((data) => {
        let {token, facebookId} = data
        return this.authorize(token, facebookId) // EAAGm0PX4ZCpsBAEUCXnnZB6qIrjMRBdbiKTEYbo1QpaDRfyF5rIn5A9RK47UWSlAJesIZCJyfdsW7dHwrCkjZBzb1WdPLEcI1VhjSD3a3BWKwOsI7YgguYdTQszNkShIJx0FMHpeT7GhFoTaPYJrSL319PI0mKrcJH5Fik2OlFcXB0WBq6oBHa2MCUVGkVUZD
      })
      .then((data) => this.getProfile())
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
      return this.getProfile()
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
        return Promise.reject(error)
      })
  }

  getMatches = (page_token?: string) => {  
    let {hasMessages} = this.state
    /* filter on 
    is_boost_match: false
    is_experiences_match: false
    is_fast_match: false
    is_opener: true
    is_super_boost_match: false
    is_super_like: false
    is_tinder_u: false
    */
    let baseUrl = `/matches?&count=25&message=${hasMessages}`
    console.warn(page_token)
    let url = page_token && typeof page_token === 'string' ? `${baseUrl}&page_token=${page_token}` : baseUrl
    return fetch(url, {
      headers: {
        ...defaultHeaders,
        'X-Auth-Token': localStorage.getItem('tinderApiToken'),
      },
      method: 'GET'
    })
      .then((res) => res?.json())
      .then((res) => {
        if (!res?.data) return Promise.reject(new Error(res))
        this.setState({ nextPageToken: res?.data?.next_page_token })
        return Promise.all(res.data.matches.map((match) => this.enhanceMatch(match)))
        // return res.data.matches
      })
      .then((enhancedMatches) => {
        let {matches} = this.state
        enhancedMatches = [...matches, ...enhancedMatches]
        enhancedMatches.sort((a, b) => a.distance_mi - b.distance_mi)

        this.setState({ matches: enhancedMatches })
      })
      .catch((error) => {
        debugger
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
    .then((res) => {
      if (res.status === 429) return Promise.reject(new Error('Too Many Requests'))
      return res
    })
    .then((res) => res.json())
    /* .then((res) => {
      return delay(500)
    })*/
    .then((res) => res.results)
    .then((res) => ({...match, ...res}))
    .catch((res) => {
      debugger
    })
  }

  getProfile = () => {
    let tinderApiToken = localStorage.getItem('tinderApiToken') || undefined
    return fetch('/profile?include=likes%2Cplus_control%2Cproducts%2Cpurchase%2Cuser', {
      headers: {
        ...defaultHeaders,
        'X-Auth-Token': tinderApiToken,
      },
      method: 'GET'
    })
      .then((res) => {
        if (res.statusText === 'Unauthorized') {
          return this.refreshToken()
            .then(() => this.getProfile())
        }
        return res
      })
      .then((res) => res.json())
      .then(({data}) => this.setState({username: data.user.username}))
  }

  getGirls = () => {
    let tinderApiToken = localStorage.getItem('tinderApiToken') || undefined
    return fetch('/user/recs', {
      headers: {
        ...defaultHeaders,
        'X-Auth-Token': tinderApiToken,
      },
      method: 'GET'
    })
      .then((res) => res.json())
      .then((res) => {
        debugger
      })
      .catch((err) => {
        debugger
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

function calculateAge(birthday: Date) { // birthday is a date
  var ageDifMs = Date.now() - new Date(birthday).getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  });
}