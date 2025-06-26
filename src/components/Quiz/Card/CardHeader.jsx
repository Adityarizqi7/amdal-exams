import { Transition } from "@headlessui/react";
import { useEffect, useState } from "react";

const CardHeader = ({ data, setForcedNext }) => {
    const [quizTime, setQuizTime] = useState(data.time || 0);

    useEffect(() => {
        if (quizTime <= 0) return;

        const countDownTimer = setInterval(() => {
            setQuizTime((prev) => {
                if (prev <= 1) {
                    setForcedNext(true);
                    clearInterval(countDownTimer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countDownTimer); // cleanup on unmount
    }, [quizTime, setForcedNext]);

    return (
        <div className="py-4 px-6 flex justify-between items-center shadow-b">
            <p className="font-bold">{data.title}</p>
            <Transition show={data.time}>
                <div className="px-1 py-2 bg-blue-300 rounded-[.25em] text-black border border-blue-500 flex items-center gap-2">
                    <p>Time Left</p>
                    <div className="bg-black text-white px-1 font-bold rounded-[.25em]">
                        {quizTime.toString().padStart(2, "0")}
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default CardHeader;
