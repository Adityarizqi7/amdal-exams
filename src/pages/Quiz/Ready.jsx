import { useDispatch } from "react-redux";
import CardQuiz from "../../components/Quiz/Card";
import { setNumberQuestion } from "../../store/quiz/quizSlice";
import { useEffect } from "react";

const Ready = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setNumberQuestion(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <CardQuiz />;
};

export default Ready;
