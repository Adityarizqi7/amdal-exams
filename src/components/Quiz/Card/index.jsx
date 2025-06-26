import { useEffect, useState } from "react"
import CardBody from "./CardBody"
import CardFooter from "./CardFooter"
import CardHeader from "./CardHeader"

const CardQuiz = ({header=null, body=null, footer=null}) => {
  const [forcedNext, setForcedNext] = useState(false)

  useEffect(() => {
    setForcedNext(false)
    if(forcedNext) alert('waktu habis');
  }, [header.id, forcedNext])

  return (
    <div className="shadow-xl bg-[white] rounded-[.5em] min-w-[30em]">
      <CardHeader data={header} setForcedNext={setForcedNext}/>
      <CardBody data={body}/>
      <CardFooter data={footer}/>
    </div>
  )
}

export default CardQuiz