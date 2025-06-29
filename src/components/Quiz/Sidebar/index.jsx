import { Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNumberQuestion, setStartQuiz } from "../../../store/quiz/quizSlice";
import { useNavigate } from "react-router-dom";
import { clearAuth } from "../../../utils/Auth";
import { logout } from "../../../store/user/userSlice";
import { useLazyLogoutQuery } from "../../../store/auth/authApi";

const QuizSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
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


  return (
    // <div className="fixed inset-0 z-10 flex justify-end pointer-events-none">
    //   {/* Overlay */}
    //   <Transition
    //     as={Fragment}
    //     show={isOpen || true}
    //     enter="transition-opacity duration-300"
    //     enterFrom="opacity-0"
    //     enterTo="opacity-20"
    //     leave="transition-opacity duration-300"
    //     leaveFrom="opacity-20"
    //     leaveTo="opacity-0"
    //   >
    //     <div
    //       className="absolute inset-0 bg-black opacity-0 pointer-events-none"
    //       onClick={() => setIsOpen(false)}
    //     />
    //   </Transition>

      <aside
        className={clsx(
          "relative w-[20em] shrink bg-white shadow-lg z-20 transition-transform duration-500 px-4 py-12 pointer-events-auto flex flex-col justify-between",
          // eslint-disable-next-line no-constant-condition
          (isOpen || true) ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div>
          <p className="text-xl font-bold text-center">{ activeExam?.title }</p>
          { startQuiz && (
          <div className="my-8 grid grid-cols-3 grid-rows-auto gap-4 overflow-auto max-h-[80svh] px-2">
            {listQuestion?.map((q, i) => {
              const isAnswered = answerQuestion?.find((el) => el.question.id === q.id && (el.selected_option_id || el.answer_text) );
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
          ) }
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              // Tambahkan fungsi logout di sini, contoh:
              apiLogout().finally(() => {
                clearAuth();                // hapus token di localStorage
                dispatch(logout());         // reset redux state user
                dispatch(setStartQuiz(false))
                setTimeout(() => {
                  navigate('/login');       // beri jeda 1 tick agar tidak race
                }, 0);
              });
            }}
            className="cursor-pointer w-full bg-red-100 text-red-600 font-bold py-2 rounded hover:bg-red-200 transition"
          >
            Log Out
          </button>
        </div>

        {/* Toggle Button */}
        {/* <div
          className="size-14 flex items-center justify-center bg-white absolute top-0 -left-14 rounded-l-full cursor-pointer shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bars3Icon className="size-6" />
        </div> */}
      </aside>
    // </div>
  );
};

export default QuizSideBar;
