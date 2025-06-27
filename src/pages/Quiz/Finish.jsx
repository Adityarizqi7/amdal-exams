// import { useSelector } from "react-redux";

const Finish = () => {
  // const answer = useSelector((state) => state.quiz.answerQuestion);
  // const list = useSelector((state) => state.quiz.listQuestion);

  // const getAnswerText = (item) => {
  //   const userAnswer = answer?.[item.id];

  //   if (!userAnswer) return <span className="italic text-gray-400">Belum dijawab</span>;

  //   // Essay langsung ditampilkan
  //   if (item.question_type === "essay") {
  //     return <span>{userAnswer}</span>;
  //   }

  //   // Single choice
  //   if (item.question_type === "choice") {
  //     const choice = item.options.find((c) => c.id === userAnswer);
  //     return <span>{choice?.text || <i className="text-gray-400">Tidak ditemukan</i>}</span>;
  //   }

  //   // Multiple choice
  //   if (item.question_type === "multiple_choice") {
  //     // Pastikan userAnswer adalah array
  //     if (!Array.isArray(userAnswer)) {
  //       return <span className="italic text-red-500">Format jawaban salah</span>;
  //     }

  //     const choices = item.options
  //       .filter((c) => userAnswer.includes(c.id))
  //       .map((c) => c.text);

  //     return choices.length > 0
  //       ? <span>{choices.join(", ")}</span>
  //       : <span className="italic text-gray-400">Belum dijawab</span>;
  //   }

  //   return <span className="italic text-gray-400">Belum dijawab</span>;
  // };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Quiz Selesai 🎉</h2>
      <p className="text-gray-700 mb-6">Terima kasih telah menyelesaikan quiz.</p>
    </div>
  );
};

export default Finish;
