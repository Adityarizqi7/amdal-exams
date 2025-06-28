import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setNumberQuestion, changeAnswerQuestion } from "../../../store/quiz/quizSlice";
import { useSaveAnswerMutation } from "../../../store/answer/answerApi";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useEndExamBeMutation } from "../../../store/exam/examApi";

const CardFooter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentIndex = useSelector((state) => state.quiz.numberQuestion);
  const list = useSelector((state) => state.quiz.listQuestion);
  const active = useSelector((state) => state.quiz.activeQuestion);
  const answer = useSelector((state) => state.quiz.answerQuestion);

  const [isOpen, setIsOpen] = useState(false);
  const [unansweredWarning, setUnansweredWarning] = useState(false);
  const [saveAnswer] = useSaveAnswerMutation();
  const [endExam] = useEndExamBeMutation();

  if (!list?.length || !active) return null;

  const total = list.length;

  const simpanJawaban = async () => {
    const questionId = active.id;
    const questionType = active.question_type;

    const currentAnswer = answer?.find(el => el.question_id === questionId);

    if (questionType === "essay") {
      dispatch(changeAnswerQuestion({
        question_id: questionId,
        selected_option_id: null,
        answer_text: currentAnswer?.answer_text,
      }));

      await saveAnswer({
        question_id: questionId,
        selected_option_id: null,
        answer_text: currentAnswer?.answer_text,
      });
    } else {
      const selectedOptionId = currentAnswer?.selected_option_id;

      if (selectedOptionId) {
        await saveAnswer({
          question_id: questionId,
          selected_option_id: selectedOptionId,
          answer_text: null,
        });
      }
    }
  };

  const handleNext = async () => {
    await simpanJawaban();

    if (currentIndex + 1 < total) {
      dispatch(setNumberQuestion(currentIndex + 1));
    } else {
      const isAllAnswered = list.every((q) =>
        answer.some((ans) =>
          ans.question_id === q.id &&
          (ans.selected_option_id !== null || (ans?.answer_text && ans?.answer_text.trim() !== ""))
        )
      );

      setUnansweredWarning(!isAllAnswered);
      setIsOpen(true);
    }
  };

  const handleBack = async () => {
    await simpanJawaban();
    if (currentIndex > 0) {
      dispatch(setNumberQuestion(currentIndex - 1));
    }
  };

  const confirmFinish = async () => {
    if (!unansweredWarning) {
      await endExam()
      setIsOpen(false);
      navigate("/quiz/finish");
    }
  };

  return (
    <>
      <div
        className="flex justify-between px-4 py-2"
        style={{ boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)" }}
      >
        {currentIndex > 0 ? (
          <button
            onClick={handleBack}
            className="cursor-pointer bg-gray-300 px-4 py-2 rounded font-bold text-black"
          >
            Kembali
          </button>
        ) : (
          <div />
        )}

        <button
          className="cursor-pointer bg-green-base px-4 py-2 rounded font-bold text-white"
          onClick={handleNext}
        >
          {currentIndex + 1 === total ? "Selesai" : "Next Question"}
        </button>
      </div>

      {/* Modal Konfirmasi */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center px-4">
            <Dialog.Panel className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                <Dialog.Title className="text-lg font-semibold text-gray-800">
                  Akhiri Ujian?
                </Dialog.Title>
              </div>
              <Dialog.Description className="text-sm text-gray-600">
                {unansweredWarning
                  ? "Masih ada soal yang belum dijawab. Harap selesaikan semua soal terlebih dahulu."
                  : "Apakah kamu yakin ingin mengakhiri ujian sekarang?"}
              </Dialog.Description>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Batal
                </button>
                <button
                  onClick={confirmFinish}
                  disabled={unansweredWarning}
                  className={`px-4 py-2 rounded-md text-sm text-white font-semibold ${
                    unansweredWarning
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-base hover:bg-green-700"
                  }`}
                >
                  Ya, Akhiri
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CardFooter;
