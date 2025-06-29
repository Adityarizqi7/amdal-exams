import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardQuiz from "../../components/Quiz/Card";
import { setListQuestion, setNumberQuestion } from "../../store/quiz/quizSlice";
import { useLazyGetListQuestionQuery } from "../../store/exam/examApi";
import { setUserDetails } from "../../store/user/userSlice";
import { useMeQuery } from "../../store/auth/authApi";
import LoadData from "../../components/Quiz/Loading/LoadData";

const Ready = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const listQuestion = useSelector((state) => state.quiz.listQuestion);
  const userLog = useSelector((state) => state.user);
  const activeExam = useSelector(state => state.exam.activeExam)
  const startQuiz = useSelector(state => state.quiz.startQuiz)

  const [fetchQuestions, { data: fetchedData, isSuccess }] = useLazyGetListQuestionQuery();
  const { isLoading, data: fetchMe, isSuccess: meSuccess } = useMeQuery(undefined, {
		refetchOnMountOrArgChange: true,
	});

  // 🔁 Set user data saat /me sukses
  useEffect(() => {
    if (fetchMe?.success) {
      dispatch(setUserDetails(fetchMe.data));
    }
  }, [fetchMe, dispatch]);

  // 🔁 Validasi user dan fetch soal
  useEffect(() => {
    if (meSuccess && meSuccess && userLog) {
      if (!activeExam?.id || !startQuiz) {
        navigate("/quiz");
        console.log('apakah navigate')
        return;
      } else if (userLog.submited_at) {
        navigate("/quiz/finish");
        return;
      }

      if (listQuestion?.length === 0) {
        fetchQuestions(userLog.exam_id);
      } else {
        dispatch(setNumberQuestion(0));
      }
    }
  }, [userLog, listQuestion, isLoading, meSuccess, fetchQuestions, navigate, dispatch, activeExam, startQuiz]);

  // 🔁 Simpan soal ke store saat berhasil
  useEffect(() => {
    if (isSuccess && fetchedData?.success && fetchedData.data?.length > 0) {
      dispatch(setListQuestion(fetchedData.data));
      dispatch(setNumberQuestion(0));
    }
  }, [isSuccess, fetchedData, dispatch]);

	if(!(!isLoading && meSuccess && userLog)) return <LoadData/>

  return <CardQuiz />;
};

export default Ready;
