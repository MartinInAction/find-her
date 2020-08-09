import React from 'react'
import GridGenerator from './GridGenerator'
import 'bootstrap/dist/css/bootstrap.min.css'
import { InputGroup, FormControl, Button, Form, Spinner, DropdownButton, Dropdown } from 'react-bootstrap'
import BackgroundGrid from './BackgroundGrid'
import styles from '../styles/app.module.scss'
import MatchSearchInput from './MatchSearchInput'
import DispayText from './DisplayText'
import { calculateAge } from '../libs/Common'
import * as ApiHandler from '../libs/ApiHandler'
import { GET_MATCH_AMOUNT, LOCATION, AGE } from '../libs/Consts'
import MatchCard from './MatchCard'

const INITIAL_STATE = {
    apiToken: undefined,
    refreshToken: undefined,
    matches: [],
    nextPageToken: undefined,
    hasMessages: 2, // 0 for false, 1 for true and 2 for both :O
    username: undefined,
    filteredMatches: [],
    sort: undefined
}

export default class AppStateManager extends React.PureComponent<{}, {}> {
    state = INITIAL_STATE

    componentDidMount() {
        this.tryToAuth()
    }

    render() {
        let { apiToken, matches, username, filteredMatches } = this.state
        if (!apiToken) return this.renderLoggedOut()
        return (
            <div style={{ marginTop: 0, backgroundColor: '#0022' }}>
                {username ? <p style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>Logged in as: {username}</p> : <div />}
                <Button variant='primary' onClick={this.getMatches}>{matches.length > 0 ? 'LOAD MORE' : 'LOAD MATCHES'}</Button>
                <Button variant='primary' style={{ backgroundColor: 'red', borderColor: 'red' }} onClick={this.logoutUser}>SIGN OUT</Button>
                <MatchSearchInput matches={matches} onFilteredMatches={this.onFilteredMatches} />
                {this.renderSort()}
                <DispayText number={filteredMatches.length > 0 ? filteredMatches.length : matches.length} />
                <GridGenerator cols={3}>
                    {filteredMatches.length > 0 ? filteredMatches.map(this.renderMatch) : matches.map(this.renderMatch)}
                </GridGenerator>
            </div>
        );
    }

    renderSort = () => {
        let { matches } = this.state
        if (matches.length === 0) return <div />
        return <DropdownButton id="dropdown-basic-button" title={`Sort: ${this.state.sort}`}>
            <Dropdown.Item onClick={this.setSortingAge}>Age</Dropdown.Item>
            <Dropdown.Item onClick={this.setSortingLocation}>Location</Dropdown.Item>
        </DropdownButton>
    }

    renderLoggedOut = () => {
        let { isLoading, loginError } = this.state
        return (
            <>
                <BackgroundGrid />
                <div className={styles.loggedOutContainer}>
                    <Form onSubmit={this.signIn} className={styles.loggedOutWrapper}>
                        <img src='/findHerLogo.png' alt='Find Her' />
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id='basic-addon1'></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id='emailInput'
                                type='text'
                                placeholder='Email'
                                aria-label='Email'
                                aria-describedby='basic-addon1'
                            />
                        </InputGroup>
                        <InputGroup className='mb-3'>
                            <InputGroup.Prepend>
                                <InputGroup.Text id='basic-addon1'></InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                id='passInput'
                                type='password'
                                placeholder='Password'
                                aria-label='Password'
                                aria-describedby='basic-addon1'
                            />
                        </InputGroup>
                        <Button
                            variant='primary'
                            style={{ backgroundColor: 'red', borderColor: 'red', marginTop: 0 }}
                            disabled={isLoading}
                            type='submit'
                        >
                            {isLoading ? <Spinner animation='grow' size='sm' /> : 'SIGN IN'}
                        </Button>
                        {loginError ? <p className={styles.loginError}>Something went wrong...</p> : <p className={styles.loginError} />}
                    </Form>
                </div>
            </>
        )
    }

    renderMatch = (match: Object, index: number) => {
        if (!match?.person) return <div key={index} />
        return <MatchCard match={match} />
    }

    renderErrorMessage = (errorMessage?: string) => {
        return <div style={{ top: 0, width: '100%', backgroundColor: 'red', height: 50, position: 'absolute' }}>
            <p>Something went wrong, plz try again</p>
            <br />
            <p>{errorMessage}</p>
        </div>
    }

    onFilteredMatches = (filteredMatches) => this.setState({ filteredMatches })

    signIn = (event) => {
        event.preventDefault()
        let email = document.getElementById('emailInput').value
        let pass = document.getElementById('passInput').value
        this.setState({ loginError: undefined, isLoading: true })
        return ApiHandler.generateToken(email, pass)
            .then((data) => {
                let { token, facebookId } = data
                return this.authorize(token, facebookId)
            })
            .then((data) => this.getProfile())
            .catch((err) => {
                console.log('SIGN IN ERROR', err)
                this.setState({ loginError: err, isLoading: false })
            })
    }

    setSortingAge = () => {
        let { matches } = this.state
        matches.sort((a, b) => calculateAge(a.birth_date) - calculateAge(b.birth_date))
        this.setState({ sort: AGE, matches })
    }
    setSortingLocation = () => {
        let { matches } = this.state
        matches.sort((a, b) => a.distance_mi - b.distance_mi)
        this.setState({ sort: LOCATION, matches })
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
        return Promise.reject('cant auth')
    }

    authorize = (token: string, facebook_id: string) => {
        return ApiHandler.authorize(token, facebook_id)
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

    hasMoreMatches = () => {
        let {matches} = this.state
        if (matches.length === 0) return true
        if (matches.length < GET_MATCH_AMOUNT) return false
    }

    getMatches = () => {
        let { hasMessages, nextPageToken } = this.state

        if (!this.hasMoreMatches()) return null

        /* filter on 
        is_boost_match: false
        is_experiences_match: false
        is_fast_match: false
        is_opener: true
        is_super_boost_match: false
        is_super_like: false
        is_tinder_u: false
        */
        ApiHandler.getMatches(hasMessages, nextPageToken)
            .then((res) => {
                if (!res?.data) return Promise.reject(new Error(res))
                this.setState({ nextPageToken: res?.data?.next_page_token })
                return Promise.all(res.data.matches.map((match) => this.enhanceMatch(match)))
            })
            .then((enhancedMatches) => {
                let { matches } = this.state
                enhancedMatches = [...matches, ...enhancedMatches]
                this.setState({ matches: enhancedMatches })
            })
            .catch((error) => { })

    }

    enhanceMatch = (match: Object) => {
        return ApiHandler.getUser(match.person._id)
            .then((res) => res.results)
            .then((res) => ({ ...match, ...res }))
            .catch((res) => { })
    }

    getProfile = () => {
        return ApiHandler.getProfile()
            .then(({ data }) => this.setState({
                username: data.user.username,
                isLoading: false,
                loginError: undefined
            }))
            .catch(err => {
                console.log('get profile error', err)
            })
    }

    getGirls = () => {
        return ApiHandler.getRecommendations()
            .then((res) => { }) // set in state?
            .catch((err) => { })
    }

    refreshToken = () => {
        return ApiHandler.refreshToken()
            .then(({ data }) => {
                localStorage.setItem('tinderApiToken', data.api_token)
                localStorage.setItem('tinderRefreshToken', data.refresh_token)
                this.setState({
                    apiToken: data.api_token,
                    refreshToken: data.refresh_token
                })
            })
            .catch((err) => { })
    }

    logoutUser = () => {
        return ApiHandler.logout()
            .then(res => {
                localStorage.removeItem('tinderApiToken')
                localStorage.removeItem('tinderRefreshToken')
                localStorage.removeItem('tinderId')
                this.setState(INITIAL_STATE)
            })
            .catch(err => {
                console.log('Logged out error', err)
            })
    }
}