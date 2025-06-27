import { useEffect, useState } from "react"
import CardBody from "./CardBody"
import CardFooter from "./CardFooter"
import CardHeader from "./CardHeader"
import { useDispatch, useSelector } from "react-redux"
import { setFinishQuiz } from "../../../store/quiz/quizSlice"

const CardQuiz = () => {
  const dispatch = useDispatch()

  const finishQuiz = useSelector(state => state.quiz.finishQuiz) 
  const [forcedNext, setForcedNext] = useState(false)

  useEffect(() => {
    setForcedNext(false)
    if(forcedNext) {
      alert('waktu habis')
      dispatch(setFinishQuiz(true))
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishQuiz, forcedNext])

  return (
    <div className="shadow-xl bg-[white] rounded-[.5em] w-[40em] max-w-[100%]">
      <CardHeader setForcedNext={setForcedNext}/>
      <CardBody />
      <CardFooter />
    </div>
  )
}

export default CardQuiz