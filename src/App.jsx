import { useDispatch } from "react-redux";
import Router from "./routes/Router";
import { useMeQuery } from "./store/auth/authApi";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setUserDetails } from "./store/user/userSlice";
import { clearAuth } from "./utils/Auth";

export default function App() {

    const location = useLocation()
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const { isLoading, data } = useMeQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    useEffect(() => {
        const fetchUser = async () => {
            if(data) {
                if (data?.success) {
                    dispatch(setUserDetails(data.data));
                } else {
                    clearAuth();
                    if (location.pathname === '/admin/signin') {
                        navigate('/admin/signin')
                    } else {
                        navigate('/login')
                    }
                }
            }
        };

        if (!isLoading) {
            fetchUser(); // Call fetchUser properly
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, isLoading]);

    return <Outlet />;
    // return <Router />
}
