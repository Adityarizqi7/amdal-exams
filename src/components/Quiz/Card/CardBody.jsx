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
    (state) => state.quiz.answerQuestion?.[activeQuestion?.question?.id]
  );

  const [listChoice, setListChoice] = useState([]);
  const [essayAnswer, setEssayAnswer] = useState("");

  useEffect(() => {
    if (!activeQuestion) return;

    const { question, choice } = activeQuestion;

    if (question.type === "choice" || question.type === "multiple_choice") {
      setListChoice(
        choice?.map((el) => ({
          ...el,
          selected: Array.isArray(storedAnswer)
            ? storedAnswer.includes(el.id)
            : storedAnswer === el.id,
        }))
      );
    } else if (question.type === "essay") {
      setEssayAnswer(storedAnswer || "");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestion?.question.id]); // refresh on question change

  const handleChangeChoice = (index) => {
    const updated = listChoice.map((el, i) => {
      if (activeQuestion.question.type === "choice") {
        return { ...el, selected: i === index };
      } else {
        return i === index ? { ...el, selected: !el.selected } : el;
      }
    });
    setListChoice(updated);

    const selectedIds = updated.filter((c) => c.selected).map((c) => c.id);
    dispatch(
      setAnswerQuestion({
        [activeQuestion.question.id]:
          activeQuestion.question.type === "choice"
            ? selectedIds[0]
            : selectedIds,
      })
    );
  };

  const handleEssayChange = (content) => {
    setEssayAnswer(content);
    dispatch(setAnswerQuestion({ [activeQuestion.question.id]: content }));
  };

  if (!activeQuestion) return null;

  return (
    <div className="px-4 py-8">
      <p className="font-bold text-xl mb-5">
        {activeQuestion.question.number}
        {startQuiz && "."} {activeQuestion.question.title}
      </p>

      {activeQuestion.question.type === "choice" ||
      activeQuestion.question.type === "multiple_choice" ? (
        <ChoiceOption listChoice={listChoice} onChange={handleChangeChoice} />
      ) : activeQuestion.question.type === "essay" ? (
        <TinyMCEEditor value={essayAnswer} onChange={handleEssayChange} />
      ) : null}
    </div>
  );
};

export default CardBody;
