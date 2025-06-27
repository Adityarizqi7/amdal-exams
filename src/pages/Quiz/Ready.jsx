import { useDispatch } from "react-redux";
import CardQuiz from "../../components/Quiz/Card";
import { setInfoQuestion, setListQuestion, setNumberQuestion } from "../../store/quiz/quizSlice";
import { useEffect } from "react";

const dataQuiz = {
    header: {
        title: "Quiz Programmer",
        time: 65,
    },
    body: [
        {
            question: {
                id: 1,
                number: 1,
                title: "Apa bahasa pemrograman favoritmu?",
                type: "choice",
            },
            choice: [
                { id: 1, text: "JavaScript" },
                { id: 2, text: "Python" },
                { id: 3, text: "Java" },
                { id: 4, text: "C++" },
            ],
        },
        {
            question: {
                id: 2,
                number: 2,
                title: "Apa kegunaan Git dalam pemrograman?",
                type: "essay",
            },
            choice: [],
        },
        {
            question: {
                id: 3,
                number: 3,
                title: "Pilih framework frontend berikut yang pernah kamu pakai:",
                type: "multiple_choice",
            },
            choice: [
                { id: 1, text: "React" },
                { id: 2, text: "Vue" },
                { id: 3, text: "Angular" },
                { id: 4, text: "Svelte" },
            ],
        },
        {
            question: {
                id: 4,
                number: 4,
                title: "Apa IDE favoritmu untuk ngoding?",
                type: "choice",
            },
            choice: [
                { id: 1, text: "VS Code" },
                { id: 2, text: "IntelliJ IDEA" },
                { id: 3, text: "Sublime Text" },
                { id: 4, text: "Vim" },
            ],
        },
        {
            question: {
                id: 5,
                number: 5,
                title: "Mengapa testing penting dalam pengembangan aplikasi?",
                type: "essay",
            },
            choice: [],
        },
        {
            question: {
                id: 6,
                number: 6,
                title: "Tools apa saja yang kamu gunakan untuk version control?",
                type: "multiple_choice",
            },
            choice: [
                { id: 1, text: "Git" },
                { id: 2, text: "SVN" },
                { id: 3, text: "Mercurial" },
                { id: 4, text: "Dropbox" },
            ],
        },
        {
            question: {
                id: 7,
                number: 7,
                title: "Bahasa pemrograman mana yang pertama kali kamu pelajari?",
                type: "choice",
            },
            choice: [
                { id: 1, text: "Pascal" },
                { id: 2, text: "C" },
                { id: 3, text: "Python" },
                { id: 4, text: "JavaScript" },
            ],
        },
        {
            question: {
                id: 8,
                number: 8,
                title: "Apa perbedaan antara frontend dan backend development?",
                type: "essay",
            },
            choice: [],
        },
        {
            question: {
                id: 9,
                number: 9,
                title: "Library atau framework backend mana yang pernah kamu pakai?",
                type: "multiple_choice",
            },
            choice: [
                { id: 1, text: "Express.js" },
                { id: 2, text: "Laravel" },
                { id: 3, text: "Django" },
                { id: 4, text: "Spring Boot" },
            ],
        },
        {
            question: {
                id: 10,
                number: 10,
                title: "Apa tujuan penggunaan API dalam aplikasi?",
                type: "essay",
            },
            choice: [],
        },
    ]
};

const Ready = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setInfoQuestion(dataQuiz.header));
        dispatch(setListQuestion(dataQuiz.body));
        dispatch(setNumberQuestion(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <CardQuiz />;
};

export default Ready;
