import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const CardHeader = ({ setTimeOut }) => {
  const infoQuiz = useSelector((state) => state.quiz.infoQuiz);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);

  const [quizTime, setQuizTime] = useState(0);
  const timeRef = useRef(0);
  const intervalRef = useRef(null);

  // Inisialisasi waktu saat quiz mulai
  useEffect(() => {
    if (startQuiz && infoQuiz?.time) {
      setQuizTime(infoQuiz.time);
      timeRef.current = infoQuiz.time;
    }
  }, [startQuiz, infoQuiz?.time]);

  // Jalankan interval hanya sekali saat quiz dimulai
  useEffect(() => {
    if (!startQuiz || intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (timeRef.current <= 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setQuizTime(0);
        setTimeOut(true); // Trigger timeout
      } else {
        timeRef.current -= 1;
        setQuizTime(timeRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current); // Cleanup
  }, [startQuiz, setTimeOut]);

  if (!infoQuiz) return null;

  return (
    <div className="py-4 px-6 flex justify-between items-center"
				style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <p className="font-bold">{infoQuiz.title}</p>
      <Transition show={Boolean(infoQuiz.time)}>
        <div className={clsx(
          "px-1 py-2 rounded text-black border flex items-center gap-2",
          quizTime < 60 ? "bg-red-300 border-red-500 animate-pulse" : "bg-blue-300 border-blue-500"
        )}>
          <p>Time Left</p>
          <div className="bg-black text-white px-1 font-bold rounded">
            {String(Math.floor(quizTime / 3600)).padStart(2, "0")}
          </div>
          <div className="bg-black text-white px-1 font-bold rounded">
            {String(Math.floor((quizTime % 3600) / 60)).padStart(2, "0")}
          </div>
          <div className="bg-black text-white px-1 font-bold rounded">
            {String(quizTime % 60).padStart(2, "0")}
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default CardHeader;
