import Cookies from "js-cookie"

export const setTimeStart = (datetime) => {
  Cookies.set('exam-start', datetime)
}

export const setLastTime = (datetime) => {
  Cookies.set('exam-last', datetime)
}

export const getTimeStart = () => {
  Cookies.get('exam-start')
}

export const getLastTime = () => {
  Cookies.get('exam-last')
}