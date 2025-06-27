import { useSelector } from "react-redux";

const Finish = () => {
  const answer = useSelector((state) => state.quiz.answerQuestion);
  const list = useSelector((state) => state.quiz.listQuestion);

  const getAnswerText = (item) => {
  const userAnswer = answer?.[item.question.id];

  if (!userAnswer) return <span className="italic text-gray-400">Belum dijawab</span>;

  // Essay langsung ditampilkan
  if (item.question.type === "essay") {
    return <span>{userAnswer}</span>;
  }

  // Single choice
  if (item.question.type === "choice") {
    const choice = item.choice.find((c) => c.id === userAnswer);
    return <span>{choice?.text || <i className="text-gray-400">Tidak ditemukan</i>}</span>;
  }

  // Multiple choice
  if (item.question.type === "multiple_choice") {
    // Pastikan userAnswer adalah array
    if (!Array.isArray(userAnswer)) {
      return <span className="italic text-red-500">Format jawaban salah</span>;
    }

    const choices = item.choice
      .filter((c) => userAnswer.includes(c.id))
      .map((c) => c.text);

    return choices.length > 0
      ? <span>{choices.join(", ")}</span>
      : <span className="italic text-gray-400">Belum dijawab</span>;
  }

  return <span className="italic text-gray-400">Belum dijawab</span>;
};


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full text-center">
      <h2 className="text-2xl font-bold mb-4 text-green-600">Quiz Selesai 🎉</h2>
      <p className="text-gray-700 mb-6">Terima kasih telah menyelesaikan quiz.</p>

      <div className="text-left">
        <h3 className="font-semibold mb-2">Jawabanmu:</h3>
        <ul className="space-y-2 text-sm">
          {list?.map((item, idx) => (
            <li key={item.question.id} className="border-b pb-1">
              <strong>{idx + 1}. {item.question.title}</strong><br />
              Jawaban: {getAnswerText(item)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Finish;
