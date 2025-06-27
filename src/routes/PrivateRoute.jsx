import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const PrivateRoute = ({children}) => {
    const user = useSelector((state)=> state.user)
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.data.id || !user.data.email) {
            if(location.pathname.includes('dashboard')) {
                navigate('/admin/signin')
            } else {
                navigate('/login')
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

export default PrivateRoute