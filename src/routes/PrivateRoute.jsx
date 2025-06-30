import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// import { useSelector } from "react-redux";
import { getToken } from "../utils/Auth";
import { useSelector } from "react-redux";

const PrivateRoute = ({children}) => {
    const user = useSelector((state)=> state.user)
    const navigate = useNavigate(); 
    useEffect(() => {
        getToken().then((res) => {
          // if (!user.id || !user.email) {
          //     navigate('/login')
          // }
          console.log(res)
          if (!res) {
              navigate('/login')
          }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])

    return (
      <>
          {children}
      </>
    )
}

export default PrivateRoute