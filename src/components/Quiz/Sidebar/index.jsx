import { Transition, Dialog } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNumberQuestion, setStartQuiz } from "../../../store/quiz/quizSlice";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/Auth";
import { logout } from "../../../store/user/userSlice";
import { useLazyLogoutQuery } from "../../../store/auth/authApi";

const QuizSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activeExam = useSelector((state) => state.exam.activeExam);
  const listQuestion = useSelector((state) => state.quiz.listQuestion);
  const answerQuestion = useSelector((state) => state.quiz.answerQuestion);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);

  const [apiLogout] = useLazyLogoutQuery();

  const handleSelect = (index) => {
    if (!listQuestion || !listQuestion[index]) return;
    dispatch(setNumberQuestion(index));
    setIsOpen(false);
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 970);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const confirmLogout = () => {
    apiLogout().then(() => {
      clearAuth();
      dispatch(logout());
    }).finally(() => {
      dispatch(setStartQuiz(false));
      window.location.reload();
    });
  };

  return (
    <>
      <aside
        className={clsx(
          "w-[20em] shrink bg-white shadow-lg z-20 transition-transform duration-500 px-4 py-12 pointer-events-auto flex flex-col justify-between",
          (isOpen || !isMobile) ? "translate-x-0" : "translate-x-full",
          (isMobile) ? "fixed top-0 right-0 bottom-0" : "relative"
        )}
      >
        <div>
          <p className="text-xl font-bold text-center">{activeExam?.title}</p>
          {startQuiz && (
            <div className="my-8 grid grid-cols-3 grid-rows-auto gap-4 overflow-auto max-h-[80svh] px-2">
              {listQuestion?.map((q, i) => {
                const isAnswered = answerQuestion?.find((el) =>
                  el.question.id === q.id && (el.selected_option_id || el.answer_text));
                return (
                  <div
                    key={q.id}
                    onClick={() => handleSelect(i)}
                    className={clsx(
                      "cursor-pointer size-20 flex items-center justify-center font-bold border rounded-md transition",
                      isAnswered
                        ? "bg-green-200 border-green-400"
                        : "bg-blue-200 border-blue-400"
                    )}
                  >
                    {q.order}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="mt-4">
          <button
            onClick={() => setShowConfirmLogout(true)}
            className="cursor-pointer w-full bg-red-100 text-red-600 font-bold py-2 rounded hover:bg-red-200 transition"
          >
            Log Out
          </button>
        </div>

        {isMobile && (
          <div
            className="size-14 flex items-center justify-center bg-white absolute top-0 -left-14 rounded-l-full cursor-pointer shadow-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Bars3Icon className="size-6" />
          </div>
        )}
      </aside>

      {/* Dialog Konfirmasi Logout */}
      <Transition appear show={showConfirmLogout} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowConfirmLogout(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Konfirmasi Logout
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Apakah Anda yakin ingin keluar dari sesi ini?
                    </p>
                  </div>

                  <div className="mt-4 flex justify-center gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
                      onClick={() => setShowConfirmLogout(false)}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                      onClick={confirmLogout}
                    >
                      Logout
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default QuizSideBar;
