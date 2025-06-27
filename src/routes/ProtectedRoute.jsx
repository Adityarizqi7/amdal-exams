import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ProtectedRoute = ({children}) => {
  const user = useSelector((state)=> state.user)

    const navigate = useNavigate(); 
    
    useEffect(() => {
        if (user.id && user.email) {
            if(user.role == 'admin'){
              navigate('/dashboard/exam/create')
            } else {
              navigate('/quiz')
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])

  return (
    <>
        {children}
    </>
  )
}

export default ProtectedRoute