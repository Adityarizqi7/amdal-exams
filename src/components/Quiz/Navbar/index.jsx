import clsx from "clsx"
import { useSelector } from "react-redux"

const QuizNavbar = () => {
  const online = useSelector(state => state.inet.online)
  const userLog = useSelector(state => state.user)

  return (
    <nav className="absolute top-0 left-0 right-0 py-4 z-10 bg-white shadow montserrat">
      <div className="container mx-auto grid items-center px-4 grid-cols-[1fr_auto_1fr]">
        <div><span>{ userLog.name }</span> - <span>{ userLog.email }</span></div>
        <div className="flex items-center gap-2">
          <span className={clsx("size-4 rounded-full", online ? "bg-green-600" : "bg-red-600")}></span>
          <p className="text-sm">{online ? "Online" : "Offline"}</p>
        </div>
        <div></div>
      </div>
    </nav>
  )
}

export default QuizNavbar
