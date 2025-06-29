import { Helmet, HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router-dom";
import QuizSideBar from "../components/Quiz/Sidebar";
import QuizNavbar from "../components/Quiz/Navbar";
import { useDispatch } from "react-redux";
import { setOnline } from "../store/inet/inetSlice";
import { useEffect } from "react";
import klh from '../assets/images/klh-half-gray.png'

const QuizLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // ✅ Cek status awal koneksi
    dispatch(setOnline(navigator.onLine));

    // ✅ Setup listener untuk perubahan koneksi
    const handleOnline = () => {
      dispatch(setOnline(true));
    };
    const handleOffline = () => {
      dispatch(setOnline(false));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet prioritizeSeoTags>
          <title>Quiz Programmer</title>

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://api.fontshare.com/css?f[]=general-sans@200,201,300,301,400,401,500,501,600,601,700,701,1,2&display=swap"
            rel="stylesheet"
          />
        </Helmet>
      </HelmetProvider>

      {/* Layout: Navbar, Sidebar, Content */}
      <div className="flex">
        <div className="grow-1 relative overflow-hidden">
          <QuizNavbar />
          <div className="relative min-h-[100svh] bg-green-base/5 flex justify-center items-center">
            <img
                src={klh}
                loading='lazy'
                alt='KLH Logo'
                className='absolute w-1/2 object-contain opacity-50 z-0 left-0'
            />
            <div className="relative z-[1]">
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
