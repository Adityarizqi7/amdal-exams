import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChoiceOption from "../Answer/ChoiceOption";
import TinyMCEEditor from "../Answer/TinyMCEEditor";
import { changeAnswerQuestion } from "../../../store/quiz/quizSlice";
import { useSaveAnswerMutation } from "../../../store/answer/answerApi";
import { useRef } from "react";
import QuillEditor from "../Answer/QuillEditor";
import { Dialog, Transition } from "@headlessui/react";

const CardBody = () => {
  const dispatch = useDispatch();
  const activeQuestion = useSelector((state) => state.quiz.activeQuestion);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);
  const storedAnswer = useSelector((state) =>
    state.quiz.answerQuestion?.find((el) => el.question_id === activeQuestion?.id)
  );

  const [saveAnswer] = useSaveAnswerMutation();

  const debounceRef = useRef(null);
  const [listChoice, setListChoice] = useState([]);

  const [showImageModal, setShowImageModal] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

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

    const payload = {
      question_id: activeQuestion.id,
      selected_option_id: option_id,
      answer_text: null,
    };

    dispatch(changeAnswerQuestion(payload));
    saveAnswer(payload); // non-blocking
  };

  if (!activeQuestion) return null;
  return (
    <div className="px-4 py-8">
      <p className="font-bold text-xl mb-5">
        {activeQuestion.order}
        {startQuiz && "."} {activeQuestion.question_text}
        {activeQuestion.image && (
          <img src={activeQuestion.image} 
          alt="Soal Gambar"
          className=" max-h-[10em] object-contain"
          onClick={() => {
            setPreviewImageUrl(activeQuestion.image);
            setShowImageModal(true);
          }} />
        )}
      </p>

      <Transition appear show={showImageModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowImageModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="relative bg-white rounded-xl p-2 shadow-xl max-w-6xl w-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-2 right-2 bg-white border rounded-full px-2 py-1 text-sm hover:bg-gray-100"
              >
                ❌
              </button>
              <img
                src={previewImageUrl}
                alt="Preview"
                className="w-full h-auto object-contain rounded-lg"
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
      
      {activeQuestion.question_type === "multiple_choice" ? (
        <ChoiceOption listChoice={listChoice} onChange={handleChangeChoice} />
      ) : activeQuestion.question_type === "essay" ? (
        <QuillEditor
          value={storedAnswer?.answer_text || ""}
          onChange={(val) => {
            const payload = {
              question_id: activeQuestion.id,
              selected_option_id: null,
              answer_text: val === '' || val === '<p><br></p>' ? '' : val,
            };

            dispatch(changeAnswerQuestion(payload));

            // Clear previous timeout if exists
            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
            }

            // Set new debounce timeout
            debounceRef.current = setTimeout(() => {
              saveAnswer(payload);
            }, 1000); // 500ms debounce
          }}
          key={`${activeQuestion.id}`}
        />
        // <TinyMCEEditor
        //   value={storedAnswer?.answer_text || ""}
        //   onChange={(val) => {
        //     const payload = {
        //       question_id: activeQuestion.id,
        //       selected_option_id: null,
        //       answer_text: val,
        //     };

        //     dispatch(changeAnswerQuestion(payload));

        //     // Clear previous timeout if exists
        //     if (debounceRef.current) {
        //       clearTimeout(debounceRef.current);
        //     }

        //     // Set new debounce timeout
        //     debounceRef.current = setTimeout(() => {
        //       saveAnswer(payload);
        //     }, 1000); // 500ms debounce
        //   }}
        //   key={`${activeQuestion.id}`}
        // />
        // <textarea 
        //   key={`${activeQuestion.id}`} 
        //   value={storedAnswer?.answer_text}
        //   placeholder="Masukkan Jawaban disini"
        //   className={clsx("w-full min-w-full max-w-full min-h-[10em] focus:outline-green-base border rounded-[.5em] p-2",
        //     storedAnswer?.answer_text ? "border-green-base" : "border-blue-300"
        //   )}
        //   onChange={(e) => {
        //     const value = e.target.value;

        //     const payload = {
        //       question_id: activeQuestion.id,
        //       selected_option_id: null,
        //       answer_text: value,
        //     };

        //     dispatch(changeAnswerQuestion(payload));

        //     // Clear previous timeout if exists
        //     if (debounceRef.current) {
        //       clearTimeout(debounceRef.current);
        //     }

        //     // Set new debounce timeout
        //     debounceRef.current = setTimeout(() => {
        //       saveAnswer(payload);
        //     }, 1000); // 500ms debounce
        //   }}></textarea>
      ) : null}
    </div>
  );
};

export default CardBody;
