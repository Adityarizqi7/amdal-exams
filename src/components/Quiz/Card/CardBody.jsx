import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChoiceOption from "../Answer/ChoiceOption";
import TinyMCEEditor from "../Answer/TinyMCEEditor";
import { changeAnswerQuestion } from "../../../store/quiz/quizSlice";
import clsx from "clsx";

const CardBody = () => {
  const dispatch = useDispatch();
  const activeQuestion = useSelector((state) => state.quiz.activeQuestion);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);
  const storedAnswer = useSelector((state) =>
    state.quiz.answerQuestion?.find((el) => el.question_id === activeQuestion?.id)
  );

  const [listChoice, setListChoice] = useState([]);
  useEffect(() => {
    if (!activeQuestion) return;

    if (activeQuestion.question_type === "multiple_choice") {
      setListChoice(
        activeQuestion.options?.map((el) => ({
          ...el,
          selected: storedAnswer?.selected_option_id === el.id,
        }))
      );
    }
  }, [activeQuestion, storedAnswer]);

  const handleChangeChoice = (option_id) => {
    const updated = listChoice.map((el) => ({
      ...el,
      selected: el.id === option_id,
    }));
    setListChoice(updated);

    dispatch(
      changeAnswerQuestion({
        question_id: activeQuestion.id,
        selected_option_id: option_id,
        answer_text: null,
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

      {activeQuestion.question_type === "multiple_choice" ? (
        <ChoiceOption listChoice={listChoice} onChange={handleChangeChoice} />
      ) : activeQuestion.question_type === "essay" ? (
        // <TinyMCEEditor
        //   value={storedAnswer?.answer_text || ""}
          // onChange={(val) => {
          //   dispatch(
          //     changeAnswerQuestion({
          //       question_id: activeQuestion.id,
          //       selected_option_id: null,
          //       answer_text: val,
          //     })
          //   );
          // }}
        //   key={`${activeQuestion.id}`}
        // />
        <textarea 
          key={`${activeQuestion.id}`} 
          value={storedAnswer?.answer_text}
          placeholder="Masukkan Jawaban disini"
          className={clsx("w-full min-w-full max-w-full min-h-[10em] focus:outline-green-base border rounded-[.5em] p-2",
            storedAnswer?.answer_text ? "border-green-base" : "border-blue-300"
          )}
          onChange={(e) => {
            if(!e.target.value) return
            dispatch(
              changeAnswerQuestion({
                question_id: activeQuestion.id,
                selected_option_id: null,
                answer_text: e.target.value,
              })
            );
          }}></textarea>
      ) : null}
    </div>
  );
};

export default CardBody;
