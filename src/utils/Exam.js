import Cookies from "js-cookie"

export const setTimeStart = (datetime) => {
  Cookies.set('exam-start', datetime)
}

export const setExamActive = (exam_id) => {
  Cookies.set('exam-active', exam_id)
}

export const setExamAUser = (user_id) => {
  Cookies.set('exam-user', user_id)
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

export const getExamActive = () => {
  Cookies.get('exam-active')
}

export const getExamUser = () => {
  Cookies.get('exam-user')
}