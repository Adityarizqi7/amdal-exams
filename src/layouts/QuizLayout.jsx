import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import QuizSideBar from "../components/Quiz/Sidebar";
import QuizNavbar from "../components/Quiz/Navbar";
import { useDispatch } from "react-redux";
import { setOnline } from "../store/inet/inetSlice";
import { useEffect } from "react";
import klh from "../assets/images/klh-half-gray.png";

const QuizLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setOnline(navigator.onLine));
    const handleOnline = () => dispatch(setOnline(true));
    const handleOffline = () => dispatch(setOnline(false));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  return (
    <>
      <HelmetProvider>
        <Helmet prioritizeSeoTags>
          <title>Quiz Programmer</title>
        </Helmet>
      </HelmetProvider>

      <div className="flex">
        <div className="grow-1 relative overflow-auto">
          <QuizNavbar />
          <div className="relative min-h-[100svh] bg-green-base/5 flex justify-center items-center pt-[8em] pb-[4em] overflow-hidden">
            <img
              src={klh}
              loading="lazy"
              alt="KLH Logo"
              className="absolute w-1/2 object-contain opacity-50 z-0 left-0"
            />
            <div className="relative z-[1] max-w-[90%]">
              <Outlet />
            </div>
          </div>
        </div>
        <QuizSideBar />
      </div>
    </>
  );
};

export default QuizLayout;
