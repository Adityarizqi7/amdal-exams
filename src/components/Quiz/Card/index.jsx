import { Fragment, useEffect, useState } from "react"
import CardBody from "./CardBody"
import CardFooter from "./CardFooter"
import CardHeader from "./CardHeader"
import { useDispatch } from "react-redux"
import { setFinishQuiz } from "../../../store/quiz/quizSlice"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import { useNavigate } from "react-router-dom"

const CardQuiz = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const finishQuiz = useSelector(state => state.quiz.finishQuiz) 
  const [timeOut, setTimeOut] = useState(false)
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false);

  useEffect(() => {
    setTimeOut(false);
    if (timeOut) {
      setShowTimeoutDialog(true);
    }
  }, [timeOut]);

  const handleTimeoutConfirm = () => {
    dispatch(setFinishQuiz(true));
    navigate('/quiz/finish')
  };

  return (
    <>
    <div className="shadow-xl bg-[white] rounded-[.5em] w-[40em] max-w-[100%]">
      { !showTimeoutDialog && (
        <>
          <CardHeader setTimeOut={setTimeOut}/>
          <CardBody />
          <CardFooter />
        </>
      ) }
    </div>
    <Transition appear show={showTimeoutDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-sm bg-white rounded-xl p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                <Dialog.Title className="text-lg font-bold text-gray-900">
                  Waktu Habis
                </Dialog.Title>
              </div>
              <Dialog.Description className="text-sm text-gray-600">
                Waktu pengerjaan telah habis. Klik tombol di bawah untuk
                melihat hasil ujian.
              </Dialog.Description>

              <div className="flex justify-end">
                <button
                  onClick={handleTimeoutConfirm}
                  className="cursor-pointer bg-green-base text-white px-4 py-2 rounded-md font-medium text-sm"
                >
                  Cek Hasil
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default CardQuiz