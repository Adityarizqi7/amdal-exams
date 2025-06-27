import { Checkbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { setAnswerQuestion } from "../../../store/quiz/quizSlice";

const CardBody = () => {
  const dispatch = useDispatch();
  const activeQuestion = useSelector((state) => state.quiz.activeQuestion);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);
  const answerQuestion = useSelector((state) => state.quiz.answerQuestion);

  const [listChoice, setListChoice] = useState([]);

  useEffect(() => {
    if (activeQuestion?.choice) {
      const storedAnswerId = answerQuestion?.[activeQuestion.question.id];
      const newList = activeQuestion.choice.map((el) => ({
        ...el,
        selected: el.id === storedAnswerId,
      }));
      setListChoice(newList);
    }
  }, [activeQuestion, answerQuestion]);

  const handleChange = (index) => {
    const updated = listChoice.map((el, i) => ({
      ...el,
      selected: i === index ? !el.selected : false,
    }));

    setListChoice(updated);

    const selected = updated.find((el) => el.selected);
    if (selected) {
      dispatch(
        setAnswerQuestion({
          [activeQuestion.question.id]: selected.id,
        })
      );
    }
  };

  if (!activeQuestion) return null;

  return (
    <div className="px-4 py-8">
      <p className="font-bold text-xl">
        {activeQuestion.question.number}
        {startQuiz && "."} {activeQuestion.question.title}
      </p>

      <div className={clsx("grid grid-cols-1 gap-4", startQuiz && "mt-5")}>
        {listChoice.map((el, index) => (
          <div
            key={index}
            className={clsx(
              "p-3 flex items-center gap-4 cursor-pointer border rounded-md transition-all",
              el.selected
                ? "bg-green-100 border-green-400"
                : "bg-blue-50 border-blue-200"
            )}
            onClick={() => handleChange(index)}
          >
            <Checkbox checked={el.selected} className="group size-6 rounded-md p-1 bg-white">
              <CheckIcon
                className={clsx(
                  "size-4 fill-black transition-opacity",
                  el.selected ? "opacity-100" : "opacity-0"
                )}
              />
            </Checkbox>
            <span>{el.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardBody;
