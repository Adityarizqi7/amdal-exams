// src/components/Quiz/Card/CardHeader.jsx
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CardHeader = ({ setForcedNext }) => {
  const infoQuiz = useSelector((state) => state.quiz.infoQuiz);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);
  const [quizTime, setQuizTime] = useState(0);

  // Set initial time once infoQuiz is available
  useEffect(() => {
    if (infoQuiz?.time) {
      setQuizTime(infoQuiz.time); // convert from minutes to seconds
    }
  }, [infoQuiz]);

  // Countdown effect
  useEffect(() => {
    if (quizTime <= 0 || !startQuiz) return;

    const countDownTimer = setInterval(() => {
      setQuizTime((prev) => {
        if (prev <= 1) {
          clearInterval(countDownTimer);
          setForcedNext(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countDownTimer);
  }, [quizTime, setForcedNext, startQuiz]);

  if (!infoQuiz) return null;

  return (
    <div
      className="py-4 px-6 flex justify-between items-center"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      <p className="font-bold">{infoQuiz.title}</p>
      <Transition show={Boolean(quizTime)}>
        <div
          className={clsx(
            "px-1 py-2 rounded-[.25em] text-black border flex items-center gap-2",
            quizTime < 60
              ? "bg-red-300 border-red-500 animate-pulse"
              : "bg-blue-300 border-blue-500"
          )}
        >
          <p>Time Left</p>
          <div className="bg-black text-white px-1 font-bold rounded-[.25em]">
            {Math.floor(quizTime / 3600).toString().padStart(2, "0")}
          </div>
          <div className="bg-black text-white px-1 font-bold rounded-[.25em]">
            {Math.floor((quizTime % 3600) / 60).toString().padStart(2, "0")}
          </div>
          <div className="bg-black text-white px-1 font-bold rounded-[.25em]">
            {(quizTime % 60).toString().padStart(2, "0")}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default CardHeader;
