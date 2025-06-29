import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "../../../utils/dayjsConfig";

const CardHeader = ({ setTimeOut }) => {
  const activeExam = useSelector((state) => state.exam.activeExam);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);
  const userLog = useSelector((state) => state.user);

  const [quizTime, setQuizTime] = useState(0);
  const timeRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (startQuiz && userLog?.start_exam && activeExam?.duration) {
      const now = dayjs().tz("Asia/Jakarta");
      const startTime = dayjs(userLog.start_exam).tz("Asia/Jakarta");
      const endTime = startTime.add(activeExam.duration, 'minute');
      const diff = endTime.diff(now, 'second');

      if (diff <= 0) {
        setQuizTime(0);
        setTimeOut(true);
      } else {
        setQuizTime(diff);
        timeRef.current = diff;
      }
    }
  }, [startQuiz, userLog?.start_exam, activeExam?.duration, setTimeOut]);

  useEffect(() => {
    if (!startQuiz || intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      if (timeRef.current <= 1) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setQuizTime(0);
        setTimeOut(true);
      } else {
        timeRef.current -= 1;
        setQuizTime(timeRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [startQuiz, setTimeOut]);

  if (!activeExam) return null;

  return (
    <div className="py-4 px-6 flex flex-wrap justify-between items-center"
      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <p className="font-bold">{activeExam.title}</p>
      <Transition show={Boolean(quizTime)}>
        <div className={clsx(
          "px-1 py-2 rounded text-black border flex items-center gap-2 ml-auto",
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
