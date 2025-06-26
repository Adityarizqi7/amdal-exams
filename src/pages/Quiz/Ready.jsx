import CardQuiz from "../../components/Quiz/Card";

const dataReady = {
    header: {
        title: "Quiz Programmer",
        time: 10,
    },
    body: {
        question: {
            id: 1,
            number: 1,
            title: "Apa kabarmu hari ini?",
        },
        choice: [
            {
                id: 1,
                text: "Baik",
            },
            {
                id: 2,
                text: "Tidak Baik",
            },
            {
                id: 3,
                text: "Sangat Baik",
            },
            {
                id: 4,
                text: "Biasa Saja",
            },
        ],
    },
};

const Ready = () => {
    return <CardQuiz header={dataReady.header} body={dataReady.body} />;
};

export default Ready;
