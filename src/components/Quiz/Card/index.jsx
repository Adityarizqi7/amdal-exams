import { Fragment, useEffect, useState } from "react"
import CardBody from "./CardBody"
import CardFooter from "./CardFooter"
import CardHeader from "./CardHeader"
import { useDispatch, useSelector } from "react-redux"
import { setAnswerQuestion, setFinishQuiz } from "../../../store/quiz/quizSlice"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid"
import { useNavigate } from "react-router-dom"
import LoadData from "../Loading/LoadData"
import { useLazyGetAnswerQuery } from "../../../store/answer/answerApi"
import { useActivitySuspectMutation } from "../../../store/exam/examApi"

const CardQuiz = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [timeOut, setTimeOut] = useState(false)
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false)
  const [isTabInactive, setIsTabInactive] = useState(false)
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(false)

  const listQuestion = useSelector((state) => state.quiz.listQuestion)
  const activeQuestion = useSelector((state) => state.quiz.activeQuestion)
  const userLog = useSelector((state) => state.user)

  const [apiGetAnswer] = useLazyGetAnswerQuery()
  const [apiActivitySuspect] = useActivitySuspectMutation()

  useEffect(() => {
    setTimeOut(false)
    if (timeOut) {
      setShowTimeoutDialog(true)
    }
  }, [timeOut])

  useEffect(() => {
    if(userLog.exam_id && userLog.start_exam){
      apiGetAnswer().then(res => {
        if(res.isSuccess && res.data?.success){
          dispatch(setAnswerQuestion(res.data.data))
        }
      }).catch(err => {
        console.log(err)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLog])

  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log(document.visibilityState)
      console.log(isTabInactive)
      if (document.visibilityState === "hidden") {
        setIsTabInactive(true)
        apiActivitySuspect()
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   const threshold = 160
  //   const checkDevTools = () => {
  //     const widthThreshold = window.outerWidth - window.innerWidth > threshold
  //     const heightThreshold = window.outerHeight - window.innerHeight > threshold
  //     setIsDevToolsOpen(widthThreshold || heightThreshold)
  //   }

  //   checkDevTools()
  //   window.addEventListener("resize", checkDevTools)
  //   return () => window.removeEventListener("resize", checkDevTools)
  // }, [])

  const handleTimeoutConfirm = () => {
    dispatch(setFinishQuiz(true))
    navigate("/quiz/finish")
  }

  const isLoading = !listQuestion?.length || !activeQuestion?.id

  return (
    <>
      <div className="">
        {isLoading ? (
          <LoadData />
        ) : !showTimeoutDialog ? (
          <div className="shadow-xl bg-[white] rounded-[.5em] w-[40em] max-w-[100%]">
            <CardHeader setTimeOut={setTimeOut} />
            <CardBody />
            <CardFooter />
          </div>
        ) : null}
      </div>

      {/* Timeout Dialog */}
      <Transition appear show={showTimeoutDialog} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
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

      {/* Dialog: Tab Tidak Aktif */}
      <Transition appear show={isTabInactive} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsTabInactive(false)}>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md mx-auto space-y-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                <Dialog.Title className="text-lg font-bold text-gray-900">
                  Tab Tidak Aktif
                </Dialog.Title>
              </div>
              <Dialog.Description className="text-sm text-gray-600">
                Anda meninggalkan tab ini. <span className="text-red-600">Hal ini dapat mempengaruhi hasil penilaian.</span>
              </Dialog.Description>
              <button
                onClick={() => setIsTabInactive(false)}
                className="w-full bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Saya Mengerti
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* Dialog: DevTools Dibuka */}
      <Transition appear show={isDevToolsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md mx-auto space-y-4">
              <Dialog.Title className="text-lg font-bold text-red-600">
                Inspect Element Terdeteksi
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600">
                Silakan tutup Developer Tools untuk melanjutkan ujian.
              </Dialog.Description>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default CardQuiz
