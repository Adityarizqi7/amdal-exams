import { useSelector } from "react-redux"

const Home = () => {
  const userLog = useSelector((state) => state.user)
  console.log(userLog)
  return (
    <div>Home</div>
  )
}

export default Home