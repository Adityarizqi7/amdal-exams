import { useDispatch, useSelector } from "react-redux";
import CardQuiz from "../../components/Quiz/Card";
import { setNumberQuestion } from "../../store/quiz/quizSlice";
import { useEffect } from "react";

const Ready = () => {
    const dispatch = useDispatch()

    const listQuestion = useSelector(state => state.quiz.listQuestion)

    useEffect(() => {
        if(listQuestion?.length){
            dispatch(setNumberQuestion(0));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listQuestion]);

    return <CardQuiz />;
};

export default Ready;
