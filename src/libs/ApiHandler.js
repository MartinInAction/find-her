import { GET_MATCH_AMOUNT } from './Consts'

const GET = 'GET'
const POST = 'POST'

export let generateToken = (email: string, pass: string) => {
    return fetch('/generate-token', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: POST,
        body: JSON.stringify({
            email,
            pass
        })
    })
    .then((res) => res.json())
}
export let authorize = (token: string, facebook_id: string) => {
return fetch(`/auth/login/facebook`, {
        headers: {
            ...defaultHeaders
        },
        method: POST,
        body: JSON.stringify({
            token,
            facebook_id,
            locale: 'en'
        }),
        json: true
    })
    .then((res) => res.json())
}

export let getMatches = (hasMessages: boolean, nextPageToken?: string) => {
    let baseUrl = `/matches?&count=${GET_MATCH_AMOUNT}&message=${hasMessages}`
    let url = !!nextPageToken && typeof nextPageToken === 'string' ? `${baseUrl}&page_token=${nextPageToken}` : baseUrl
    return fetch(url, {
        headers: {
            ...defaultHeaders,
            'X-Auth-Token': localStorage.getItem('tinderApiToken'),
        },
        method: GET
    })
    .then((res) => res?.json())
}

export let getUser = (userId: number) => {
    return fetch(`/user/${userId}`, {
        // 5e1777f2890f930100e04e3c
        headers: {
            ...defaultHeaders,
            'X-Auth-Token': localStorage.getItem('tinderApiToken'),
        },
        method: GET
    })
    .then((res) => {
        if (res.status === 429) return Promise.reject(new Error('Too Many Requests'))
        return res
    })
    .then((res) => res.json())
}

export let getProfile = () => {
    return fetch('/profile?include=likes%2Cplus_control%2Cproducts%2Cpurchase%2Cuser', {
        headers: {
            ...defaultHeaders,
            'X-Auth-Token': localStorage.getItem('tinderApiToken'),
        },
        method: GET
    })
        .then((res) => {
            if (res.statusText === 'Unauthorized') {
                return this.refreshToken()
                    .then(() => this.getProfile())
            }
            return res
        })
        .then((res) => res.json())
}

export let getRecommendations = () => {
    return fetch('/user/recs', {
        headers: {
            ...defaultHeaders,
            'X-Auth-Token': localStorage.getItem('tinderApiToken'),
        },
        method: GET
    })
        .then((res) => res.json())
}

export let refreshToken = () => {
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
    .then((res) => res.json())
}

export let logout = () => {
    return fetch('/auth/logout', {
        headers: {
            ...defaultHeaders
        },
        method: POST
    })
}

const defaultHeaders = {
    'User-Agent': 'Tinder/7.5.3 (iPhone; iOS 10.3.2; Scale/2.00)',
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'platform': 'ios',
    'Accept-Language': 'en'
}