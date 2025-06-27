import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChoiceOption from "../Answer/ChoiceOption";
import TinyMCEEditor from "../Answer/TinyMCEEditor";
import { setAnswerQuestion } from "../../../store/quiz/quizSlice";

const CardBody = () => {
  const dispatch = useDispatch();
  const activeQuestion = useSelector((state) => state.quiz.activeQuestion);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);
  const storedAnswer = useSelector(
    (state) => state.quiz.answerQuestion?.[activeQuestion?.id]
  );

  const [listChoice, setListChoice] = useState([]);

  useEffect(() => {
    if (!activeQuestion) return;
    console.log(activeQuestion)

    if (activeQuestion.question_type === "choice" || activeQuestion.question_type === "multiple_choice") {
      setListChoice(
        activeQuestion.options?.map((el) => ({
          ...el,
          selected: Array.isArray(storedAnswer)
            ? storedAnswer.includes(el.id)
            : storedAnswer === el.id,
        }))
      );
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestion?.id]); // refresh on question change

  const handleChangeChoice = (index) => {
    const updated = listChoice.map((el, i) => {
      if (activeQuestion.question_type === "choice") {
        return { ...el, selected: i === index };
      } else {
        return i === index ? { ...el, selected: !el.selected } : el;
      }
    });
    setListChoice(updated);

    const selectedIds = updated.filter((c) => c.selected).map((c) => c.id);
    dispatch(
      setAnswerQuestion({
        [activeQuestion.id]:
          activeQuestion.question_type === "choice"
            ? selectedIds[0]
            : selectedIds,
      })
    );
  };

  if (!activeQuestion) return null;

  return (
    <div className="px-4 py-8">
      <p className="font-bold text-xl mb-5">
        {activeQuestion.order}
        {startQuiz && "."} {activeQuestion.question_text}
      </p>

      {activeQuestion.question_type === "choice" ||
      activeQuestion.question_type === "multiple_choice" ? (
        <ChoiceOption listChoice={listChoice} onChange={handleChangeChoice} />
      ) : activeQuestion.question_type === "essay" ? (
        <TinyMCEEditor 
        // value={essayAnswer} 
        value={storedAnswer || ""} 
        onChange={(val) => {
          console.log(val)
          dispatch(setAnswerQuestion({ [activeQuestion.id]: val }))
        }} 
        key={`${activeQuestion.id}-${storedAnswer ?? ""}`}  />
      ) : null}
    </div>
  );
};

export default CardBody;
