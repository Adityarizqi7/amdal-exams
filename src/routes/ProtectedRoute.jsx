import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { useSelector } from "react-redux";
import { getToken } from "../utils/Auth";

const ProtectedRoute = ({children}) => {
  // const user = useSelector((state)=> state.user)

    const navigate = useNavigate(); 

    useEffect(() => {
        getToken().then((res) => {
          // if (!user.id || !user.email) {
          //     navigate('/login')
          // }
          if (res) {
              navigate('/login')
          }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <>
        {children}
    </>
  )
}

export default ProtectedRoute