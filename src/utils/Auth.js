import Cookies from "js-cookie"

export const Login = (data) => {
    Cookies.set('jwt', JSON.stringify(data))
}

export const Logout = () => {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
}

export const getToken = async () => {
    return Cookies.get('access_token')
}

export const getRefreshToken = () => {
    return Cookies.get('refresh_token')
}

export const setToken = (access_token, refresh_token) => {
    Cookies.set('access_token', access_token)
    Cookies.set('refresh_token', refresh_token)
}
export const clearAuth = () => {
    Cookies.remove('access_token')
    Cookies.remove('refresh_token')
}