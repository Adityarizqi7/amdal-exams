import { useDispatch, useSelector } from "react-redux";
import { setNumberQuestion } from "../../../store/quiz/quizSlice";

const CardFooter = () => {
  const dispatch = useDispatch();
  const currentIndex = useSelector((state) => state.quiz.numberQuestion);
  const total = useSelector((state) => state.quiz.listQuestion.length);

  const handleNext = () => {
    if (currentIndex + 1 < total) {
      dispatch(setNumberQuestion(currentIndex + 1));
    } else {
      alert("Quiz selesai!");
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      dispatch(setNumberQuestion(currentIndex - 1));
    }
  };

  return (
    <div
      className="flex justify-end px-4 py-2"
      style={{ boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      {currentIndex > 0 ? (
        <button
          onClick={handleBack}
          className="bg-gray-300 px-4 py-2 rounded font-bold text-black"
        >
          Kembali
        </button>
      ) : <div />}
      <button
        className="bg-blue-500 px-4 py-2 rounded-[.5em] font-bold text-white cursor-pointer"
        onClick={handleNext}
      >
        Next Question
      </button>
    </div>
  );
};

export default CardFooter;
