import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getTimeStart, setExamActive, setExamAUser, setTimeStart } from "../../../utils/Exam";
import dayjs from "../../../utils/dayjsConfig"
import Cookies from "js-cookie"

const CardHeader = ({ setTimeOut }) => {
  const activeExam = useSelector((state) => state.exam.activeExam);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);
  const userLog = useSelector((state) => state.user);

  const [quizTime, setQuizTime] = useState(0);
  const timeRef = useRef(0);
  const intervalRef = useRef(null);

  // Inisialisasi waktu saat quiz mulai
  useEffect(() => {
    if (startQuiz && activeExam?.duration && userLog) {
      let start = userLog.start_exam;

      if(activeExam.id == Cookies.get('exam-active') && userLog.id == Cookies.get('exam-user') && !start){
        start = getTimeStart() || Cookies.get('exam-start')
      }
      console.log(start)
      if(Cookies.get('exam-user') == null){
        setExamAUser(userLog.id)
      }

      if (!start) {
        const now = dayjs().tz("Asia/Jakarta").toISOString();
        console.log(now)
        setExamAUser(userLog.id)
        setExamActive(activeExam.id)
        setTimeStart(now);
        start = now;
      }

      const endTime = dayjs(start).add(activeExam.duration, 'minute');
      const diff = endTime.diff(dayjs(), 'second');

      if (diff <= 0) {
        setQuizTime(0);
        setTimeOut(true);
      } else {
        setQuizTime(diff);
        timeRef.current = diff;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startQuiz, activeExam?.duration, userLog]);

  // Jalankan timer countdown
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

  if (!activeExam) return null;

  return (
    <div className="py-4 px-6 flex justify-between items-center"
				style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
      <p className="font-bold">{activeExam.title}</p>
      <Transition show={Boolean(activeExam.duration)}>
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
