import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useMeQuery } from "./store/auth/authApi";
import { setUserDetails } from "./store/user/userSlice";
import { getToken, clearAuth } from "./utils/Auth";

export default function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [token, setToken] = useState(null);

    const { isLoading, data, error } = useMeQuery(undefined, {
        skip: !token, // skip if token belum ada
        refetchOnMountOrArgChange: true,
    });

    // ✅ Redirect dari '/admin/signin/' ke '/admin/signin'
    useEffect(() => {
        if (location.pathname === "/admin/signin/") {
            navigate("/admin/signin", { replace: true });
        }
    }, [location.pathname, navigate]);

    // ✅ Ambil token saat pertama kali load
    useEffect(() => {
        const init = async () => {
            const result = await getToken();
            if (!result) {
                // Cek apakah ini halaman admin
                const loginPath = location.pathname.startsWith("/admin") ? "/admin/signin" : "/login";
                navigate(loginPath);
            } else {
                setToken(result);
            }
        };

        init();
    }, [navigate, location.pathname, token]);

    // ✅ Jika sudah ada token, tapi hasil query error atau gagal
    useEffect(() => {
        if (!token || isLoading) return;

        if (data?.success) {
            dispatch(setUserDetails(data.data));
        } else {
            clearAuth();
            const loginPath = location.pathname.startsWith("/admin") ? "/admin/signin" : "/login";
            navigate(loginPath);
        }
    }, [token, isLoading, data, error, dispatch, navigate, location.pathname]);

    return <Outlet />;
}
