import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/user/userSlice";
import { setUserDetails } from "../store/user/userSlice";
import { clearAuth } from "../utils/Auth";
// import { useLazyGetExamQuery } from "../store/user/userApi";
// import toast from "react-hot-toast";

import GlobalContext from "./GlobalContext"; // pastikan path sesuai

const GlobalProvider = ({ children }) => {
    const user = useSelector((state) => state.user.username);
    const exam = useSelector((state) => state.user.exam);
    const dispatch = useDispatch();

    // const [fetchGetExam] = useLazyGetExamQuery();

    const handleLogout = () => {
        dispatch(logout());
        clearAuth();
    };

    useEffect(() => {
        // logic fetching exam jika perlu
        dispatch(
            setUserDetails({
                id: 19,
                username: "guni",
                exam: "programmer",
            })
        );
    }, [user, exam, dispatch]);

    return (
        <GlobalContext.Provider value={{ handleLogout }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
