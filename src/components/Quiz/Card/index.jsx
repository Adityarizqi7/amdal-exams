import { useEffect, useState } from "react"
import CardBody from "./CardBody"
import CardFooter from "./CardFooter"
import CardHeader from "./CardHeader"
import { useSelector } from "react-redux"

const CardQuiz = () => {
  const finishQuiz = useSelector(state => state.quiz.finishQuiz) 
  const [forcedNext, setForcedNext] = useState(false)

  useEffect(() => {
    setForcedNext(false)
    if(forcedNext) alert('waktu habis');
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