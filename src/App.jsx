import { useDispatch } from "react-redux";
import Router from "./routes/Router";
import { useMeQuery } from "./store/auth/authApi";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { setUserDetails } from "./store/user/userSlice";
import { clearAuth } from "./utils/Auth";

export default function App() {
    const dispatch = useDispatch();
    const { isLoading, data } = useMeQuery();

    useEffect(() => {
        const fetchUser = async () => {
            if (data) {
                dispatch(setUserDetails(data));
            } else {
                clearAuth();
            }
        };

        if (!isLoading) {
            fetchUser(); // Call fetchUser properly
        }
    }, [data, dispatch, isLoading]);

    return <Outlet />;
    // return <Router />
}
