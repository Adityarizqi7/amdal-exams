import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useEndExamBeMutation, useLazyMyExamQuery } from "../../../src/store/exam/examApi";
import LoadData from "../../components/Quiz/Loading/LoadData";

const Finish = () => {
  const userLog = useSelector((state) => state.user);

  const [apiEndSubmission] = useEndExamBeMutation()

  const [fetchExam, { data: hasilExam, isLoading }] = useLazyMyExamQuery();
  const [score, setScore] = useState(null);
  


  useEffect(() => {
    if (userLog?.id) {
      // apiEndSubmission().finally(() => {
        fetchExam(); // panggil hanya sekali setelah user tersedia
      // })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLog]);

  useEffect(() => {
    if (hasilExam?.data?.score !== undefined || hasilExam?.success) {
      setScore(hasilExam?.data?.score);
    }
  }, [hasilExam]);

  if (isLoading || score === null) {
    return (
      <LoadData/>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full mx-auto text-center border border-green-200">
      <h2 className="text-3xl font-bold mb-4 text-green-600">🎉 { hasilExam?.data?.exam?.title } Selesai!</h2>
      <p className="text-gray-700">
        Terima kasih telah menyelesaikan Asessment.
      </p>
      { !hasilExam?.data?.isProgrammer && (
        <>
          <p className="text-gray-700 mb-6">Hasil Anda sebagai berikut:</p>
          <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg py-4 px-6 text-xl font-semibold mb-6">
            Skor Anda: <span className="text-green-900 text-3xl">{score}</span>
          </div>
        </>
      ) }

      <p className="text-sm text-gray-500">Semoga hasil ini membawa manfaat bagi pengembangan Anda!</p>
    </div>
  );
};

export default Finish;
