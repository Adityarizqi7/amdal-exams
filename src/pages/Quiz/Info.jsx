import {
  UserIcon,
  EnvelopeIcon,
  IdentificationIcon,
  PlayCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { useState, Fragment, useEffect, useMemo, useCallback } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import {
  useLazyGetExamQuery,
  useLazyGetListQuestionQuery,
  useStartExamBeMutation,
} from "../../store/exam/examApi";
import { setActiveExam, setListExam } from "../../store/exam/examSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadData from "../../components/Quiz/Loading/LoadData";
import { setListQuestion, setStartQuiz } from "../../store/quiz/quizSlice";

const Info = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLog = useSelector((state) => state.user);
  const listExam = useSelector((state) => state.exam.listExams);
  const activeExam = useSelector((state) => state.exam.activeExam);
  const startQuiz = useSelector((state) => state.quiz.startQuiz);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isBeforeTime, setIsBeforeTime] = useState(false);
  const [isAfterTime, setIsAfterTime] = useState(false);
  const [timeWarning, setTimeWarning] = useState(false);

  const [apiGetExams] = useLazyGetExamQuery();
  const [apiGetQuestions] = useLazyGetListQuestionQuery();
  const [apiStartExam] = useStartExamBeMutation();

  const selectedData = useMemo(() => listExam?.find(e => e.id === selectedExam), [selectedExam, listExam]);

  const fetchExams = useCallback(async () => {
    const response = await apiGetExams();
    const data = response?.data?.data;
    if (data) {
      dispatch(setListExam(data));
      if (userLog.exam_id) {
        setSelectedExam(userLog.exam_id);
        dispatch(setActiveExam(userLog.exam_id));
      }
    }
  }, [apiGetExams, dispatch, userLog.exam_id]);

  const fetchQuestions = async (exam_id) => {
    const response = await apiGetQuestions(exam_id);
    if (response?.data?.success) {
      dispatch(setListQuestion(response.data.data));
    }
  };

  const handleChangeExam = (val) => {
    if (!userLog.exam_id) {
      setSelectedExam(val);
      dispatch(setActiveExam(val));
    }
  };

  const handleConfirm = async () => {
    setIsOpen(false);
    setLoading(true)
    // 🔐 Cek login sebelum lanjut
    if (!userLog?.email) {
      navigate("/login");
      return;
    }

    await fetchQuestions(activeExam.id);
    if (!userLog.start_exam) {
      const response = await apiStartExam({ exam_id: activeExam.id });
      if (response?.data?.success) dispatch(setStartQuiz(true));
    }

    if (!isBeforeTime && !isAfterTime) {
      dispatch(setStartQuiz(true));
      // navigate("/quiz/ready");
    }
  };

  useEffect(() => {
    if (!listExam?.length) fetchExams();
  }, [fetchExams, listExam?.length]);

  useEffect(() => {
    if (userLog?.email) {
      setLoading(false);
      setSelectedExam(userLog.exam_id);
      dispatch(setActiveExam(userLog.exam_id));
    }
  }, [userLog, dispatch]);

  useEffect(() => {
    if (!selectedData || !userLog) return;

    const now = new Date();
    const start = new Date(userLog.batch_start_time);
    const end = userLog.start_exam && selectedData.duration
      ? new Date(new Date(userLog.start_exam).getTime() + selectedData.duration * 60000)
      : new Date(userLog.batch_end_time);

    setIsBeforeTime(now < start);
    setIsAfterTime(now > end);
    setTimeWarning(now < start || now > end);
  }, [selectedData, userLog]);

  useEffect(() => {
    if (activeExam && userLog.start_exam && userLog.exam_id) {
      userLog.submitted_at ? navigate("/quiz/finish") : handleConfirm();
    }
  }, [activeExam, userLog, navigate]);

  useEffect(() => {
    if (startQuiz) navigate("/quiz/ready");
  }, [startQuiz, navigate]);

  const isAssessmentEnded = useMemo(() => {
    if (userLog.submitted_at || isAfterTime) return true;
    if (userLog.start_exam && selectedData?.duration) {
      const endTime = new Date(new Date(userLog.start_exam).getTime() + selectedData.duration * 60000);
      return new Date() > endTime;
    }
    return false;
  }, [userLog, selectedData, isAfterTime]);

  if (loading) return <LoadData />;

  return (
    <div className="flex items-center justify-center px-4 montserrat max-w-full">
      <div className="bg-white backdrop-blur-lg rounded-xl shadow-lg p-6 w-[30em] max-w-full lg:max-w-md">
        <h2 className="text-lg font-bold text-green-base mb-4">Informasi Asesmen</h2>

        {timeWarning && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md mb-4 text-sm flex items-center gap-2">
            <ExclamationTriangleIcon className="w-5 h-5" />
            Saat ini berada di luar rentang waktu pengerjaan asesmen.
          </div>
        )}

        <div className="text-sm text-gray-800 space-y-2 mb-4">
          <div className="font-semibold">Data Peserta:</div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-gray-600" />
            {userLog?.name || "-"}
          </div>
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="w-4 h-4 text-gray-600" />
            {userLog?.email || "-"}
          </div>
          <div className="flex items-center gap-2">
            <IdentificationIcon className="w-4 h-4 text-gray-600" />
            {userLog?.role || "-"}
          </div>
          <div className="flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-4 h-4 text-gray-600" />
            Sesi: {userLog?.batch || "-"}
          </div>
          <div className="flex items-center gap-2">
            <ClipboardDocumentListIcon className="w-4 h-4 text-gray-600" />
            Waktu:{" "}
            {userLog?.batch_start_time && userLog?.batch_end_time
              ? `${new Date(userLog.batch_start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${new Date(userLog.batch_end_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "-"}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <label className="font-semibold flex items-center gap-1">
            <ClipboardDocumentListIcon className="w-4 h-4 text-gray-600" />
            Pilih Asesmen
          </label>
          {timeWarning && !userLog.exam_id ? (
            <p className="text-red-600">Anda Belum Memilih Asesmen</p>
          ) : (
            <Listbox
              value={selectedExam}
              onChange={handleChangeExam}
              disabled={userLog.exam_id}
            >
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-green-base focus:border-green-base text-sm">
                  <span className="block truncate">
                    {selectedExam
                      ? selectedData?.title || "Asesmen Tidak Ditemukan"
                      : "-- Pilih Asesmen --"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                  {listExam?.map((exam) => (
                    <Listbox.Option
                      key={exam.id}
                      value={exam.id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? "bg-green-100 text-green-900" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {exam.title}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                              <CheckIcon className="h-4 w-4" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          )}

          {selectedData && (
            <div className="mt-3 text-sm text-gray-700 space-y-1 border-t pt-3">
              <div>
                <span className="font-semibold">Jumlah Soal:</span>{" "}
                {selectedData.questions_count || 0}
              </div>
              <div>
                <span className="font-semibold">Durasi:</span>{" "}
                {selectedData.duration || 0} menit
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          {(isAssessmentEnded && userLog?.batch_start_time) ? (
            <button
              onClick={() => navigate("/quiz/finish")}
              className="cursor-pointer w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
              Lihat Hasil Asesmen
            </button>
          ) : (isBeforeTime || !userLog?.batch_start_time) ? (
            <div className="text-center text-sm text-red-600 font-semibold">
              ⏳ Waktu asesmen belum dimulai. Silakan kembali lagi nanti.
            </div>
          ) : (
            <button
              onClick={() => {
                if (!userLog?.email) return navigate("/login");
                setIsOpen(true);
              }}
              disabled={!selectedExam || !selectedData || !userLog?.batch_start_time}
              className="cursor-pointer w-full inline-flex justify-center items-center gap-2 px-4 py-2 bg-green-base text-white font-semibold rounded-lg transition-all disabled:opacity-50"
            >
              <PlayCircleIcon className="w-5 h-5" />
              {userLog.start_exam ? "Lanjutkan" : "Mulai Asesmen"}
            </button>
          )}
        </div>
      </div>

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
            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all space-y-4">
              <div className="flex items-center gap-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                <Dialog.Title className="text-lg font-medium text-gray-800">
                  Konfirmasi
                </Dialog.Title>
              </div>
              <Dialog.Description className="text-sm text-gray-600">
                Apakah kamu yakin ingin memulai asesmen sekarang? Pastikan kamu sudah siap.
              </Dialog.Description>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirm}
                  className="cursor-pointer px-4 py-2 rounded-md text-sm bg-green-base text-white font-medium"
                >
                  Ya, Mulai
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Info;
