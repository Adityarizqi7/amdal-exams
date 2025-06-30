import Swal from "sweetalert2";
import { useCallback, useEffect, useRef, useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Select, Switch } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import DashboardLayout from "../../../layouts/DashboardLayout"
import { NavLink, useNavigate } from "react-router-dom";
// import { useCreateMutation } from "../../../store/answers/answersApi";
import axios from "axios";
import CONST from "../../../utils/Constant";
import { getToken } from "../../../utils/Auth";

const CreateAnswers = () => {

    const navigate = useNavigate()
    // const [create] = useCreateMutation();

    // const [errors, setErrors] = useState({});
    // const [touched, setTouched] = useState({});

    const [options, setOptions] = useState([
        { option_text: '', isCorrect: false, touched: {}, errors: {} }
    ]);
      
    // const [isCorrect, setIsCorrect] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const dropdownRef = useRef(null);
    
    const [exams, setExams] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loadingExam, setLoadingExam] = useState(false)
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [loadingQuestion, setLoadingQuestion] = useState(false);
    const [query, setQuery] = useState('');
    const [, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    
    const addOptionRow = () => {
        setOptions((prev) => [
          ...prev,
          { option_text: '', isCorrect: false, touched: {}, errors: {} }
        ]);
    };      
    const getAllExam = useCallback( async (page = 1, query = '') => {
        const token = await getToken();
        if (token) {

            setLoadingExam(true)
            const response = await axios.get(`${CONST.BASE_URL_API}exams/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: { page, search: query }
                }
            )

            if (response) {
                setLoadingExam(false)
                const newItems = response.data.data.data.map((item) => ({
                    id: item.id,
                    title: item.title
                }));
                
                setExams((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
                setHasMore(page < response.data.data.last_page);
            }
        }
    }, []);
    const getAllQuestion = useCallback( async (page = 1, query = '') => {
        const token = await getToken();
        if (token) {

            setLoadingQuestion(true)
            const response = await axios.get(`${CONST.BASE_URL_API}questions`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: { page, search: query }
                }
            )

            if (response) {
                setLoadingQuestion(false)
                const newItems = response.data.data.data.map((item) => ({
                    id: item.id,
                    title: item.question_text,
                    question_type: item.question_type,
                    weight: item.weight,
                }));
                
                // setSelectedQuestion(newItems[0])
                setQuestions((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
                setHasMore(page < response.data.data.last_page);
            }
        }
    }, []);

    // const validate = (fields = formData) => {
    //     const newErrors = {};
    //     if (!fields.option_text) newErrors.option_text = 'Kolom Nama Opsi harus diisi!';
    //     return newErrors;
    // };
    const handleIsCorrectChange = (index, value) => {
        setOptions((prev) => {
          const updated = [...prev];
          updated[index].isCorrect = value;
          return updated;
        });
    };
      
    const handleOptionChange = (index, e) => {
        const { name, value } = e.target;
      
        setOptions((prev) => {
          const updated = [...prev];
          updated[index][name] = value;
          return updated;
        });
    };
    const handleBlur = (index, e) => {
        const { name } = e.target;
      
        setOptions((prev) => {
          const updated = [...prev];
          updated[index].touched = { ...updated[index].touched, [name]: true };
      
          // validasi per input
          const errors = {};
          if (!updated[index].option_text) {
            errors.option_text = 'Kolom Nama Opsi harus diisi!';
          }
      
          updated[index].errors = errors;
          return updated;
        });
    };

    const isSubmitDisabled = () => {
        return loadingSubmit || options.some(
          (opt) => !opt.option_text || opt.errors.option_text
        );
    };    
      
    // const handleBlur = (e) => {
    //     const { name } = e.target;
    
    //     setTouched((prev) => ({ ...prev, [name]: true }));
    
    //     const newErrors = validate(formData);
    //     setErrors(newErrors);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        // Validasi
        const updatedOptions = options.map((opt) => {
            const errors = {};
            if (!opt.option_text) {
                errors.option_text = 'Kolom Nama Opsi harus diisi!';
            }
      
            return {
                ...opt,
                errors,
                touched: { option_text: true },
            };
        });
      
        setOptions(updatedOptions);
      
        const hasError = updatedOptions.some((opt) => Object.keys(opt.errors).length > 0);
        if (hasError) return;
      
        setLoadingSubmit(true);
      
        try {
          const payload = {
                exam_id: selectedExam.id,
                questions: [
                    {
                        question_text: selectedQuestion.title,
                        question_type: selectedQuestion.question_type,
                        weight: selectedQuestion.weight,
                        options: updatedOptions.map(({ option_text, isCorrect }) => ({
                            option_text,
                            is_correct: isCorrect
                        })),
                    }
                ]
            };

            const token = await getToken();
            if (token) {
                axios.post(`${CONST.BASE_URL_API}questions/store-batch`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }})
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Data Opsi Jawaban berhasil disimpan!',
                        customClass: {
                        container: 'montserrat'
                        }
                    })
                    navigate('/dashboard/answers')
                })
                .catch((error) => {
                    console.error(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Menyimpan',
                        text: 'Terjadi kesalahan saat menyimpan data.',
                        customClass: {
                            container: 'montserrat'
                        }
                    });
                })
                .finally(() => {
                    setLoadingExam(false);
                });
            }

            let timerInterval;
            Swal.fire({
                timer: 1000,
                icon: 'success',
                showConfirmButton: false,
                title: 'Berhasil, Data telah disimpan.',
                text: 'Tunggu sebentar',
                customClass: {
                    container: 'montserrat'
                },
                didOpen: () => {
                    Swal.showLoading()
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    navigate("/dashboard/answers")
                }
            }) 
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan saat menyimpan Opsi Jawaban',
                customClass: {
                    container: 'montserrat'
                }
            });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleScrollQuestion = (e) => {
        const el = e.target;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore) {
            setPage((prev) => {
                const next = prev + 1;
                getAllQuestion(next, query);
                return next;
            });
        }
    };

    const handleScrollExam = (e) => {
        const el = e.target;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore) {
            setPage((prev) => {
                const next = prev + 1;
                getAllExam(next, query);
                return next;
            });
        }
    };

    useEffect(() => {
        getAllQuestion(1, query);
        getAllExam(1, query);
    }, [query, getAllQuestion, getAllExam]);
    
    return (
        <DashboardLayout
            title='Buat Opsi Jawaban - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="create-answers-component px-7 pb-12 montserrat">
                <NavLink to='/dashboard/answers' className="go-back flex items-center gap-2 hover:opacity-80 cursor-pointer mt-[2rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>
                        Kembali ke Daftar
                    </span>
                </NavLink>

                <form id="form_wrapper" encType="multipart/form-data" className="form-create-answers-container mt-[2.5rem]">
                    <h1 className="font-semibold text-[1.75rem] text-gray-700">Tambah Opsi Jawaban</h1>
                    <section className="form-create-answers-card mt-[1.5rem]">
                        <div className="form-wrapper montserrat space-y-6">
                            <div className="form-input relative">
                                <label className="inline-block mb-1">Pilih Tipe Ujian <span className="text-red-500">*</span></label>
                                <Combobox value={selectedExam} onChange={setSelectedExam}>
                                    <ComboboxInput
                                    name="question_id"
                                    className="w-full border border-gray-300 mt-[0.25rem] rounded px-3 py-[0.75rem]"
                                    displayValue={(exam) => exam?.title || ''}
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                        setPage(1);
                                    }}
                                    />
                                    {
                                        selectedExam === '' || !selectedExam ?
                                            <h4 className="absolute top-[45px] left-3">Pilih Tipe Ujian</h4> 
                                        : false
                                    }
                                    <ComboboxButton className="group absolute top-[41px] right-0 px-2.5">
                                        <ChevronDownIcon className="size-8 fill-black" />
                                    </ComboboxButton>
                                    <ComboboxOptions
                                        anchor="bottom"
                                        transition
                                        className="z-[1000] h-[13rem] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5"
                                        ref={dropdownRef}
                                        onScroll={handleScrollExam}
                                    >
                                    {
                                        loadingExam ? 
                                            <div className="relative px-4 py-2 text-gray-400">Memuat data..</div>
                                        :
                                        <>
                                        {
                                            exams.length === 0 && (
                                                <div className="relative px-4 py-2 text-gray-400">Tidak ada hasil.</div>
                                            )
                                        }
                                        {
                                            exams.map((exam) => (
                                                <ComboboxOption
                                                key={exam.id}
                                                value={exam}
                                                className={({ active }) =>
                                                    `cursor-pointer select-none px-4 py-3 montserrat ${
                                                    active ? 'bg-blue-500 text-white' : ''
                                                    }`
                                                }
                                                >
                                                    {exam.title}
                                                </ComboboxOption>
                                            ))
                                        }
                                        </>
                                    }
                                    </ComboboxOptions>
                                </Combobox>
                                {/* {touched.exam_id && errors.exam_id && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.exam_id}</div>} */}
                            </div>
                        {
                            selectedExam ?
                            <>
                                    <div className="form-input relative">
                                        <label className="inline-block mb-1">Pilih Pertanyaan <span className="text-red-500">*</span></label>
                                        <Combobox value={selectedQuestion} onChange={setSelectedQuestion}>
                                            <ComboboxInput
                                            name="question_id"
                                            className="w-full border border-gray-300 mt-[0.25rem] rounded px-3 py-[0.75rem]"
                                            displayValue={(exam) => exam?.title || ''}
                                            onChange={(event) => {
                                                setQuery(event.target.value);
                                                setPage(1);
                                            }}
                                            />
                                            {
                                                selectedQuestion === '' || !selectedQuestion ?
                                                    <h4 className="absolute top-[45px] left-3">Pilih Pertanyaan</h4> 
                                                : false
                                            }
                                            <ComboboxButton className="group absolute top-[41px] right-0 px-2.5">
                                                <ChevronDownIcon className="size-8 fill-black" />
                                            </ComboboxButton>
                                            <ComboboxOptions
                                                anchor="bottom"
                                                transition
                                                className="z-[1000] h-[13rem] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5"
                                                ref={dropdownRef}
                                                onScroll={handleScrollQuestion}
                                            >
                                            {
                                                loadingQuestion ? 
                                                    <div className="relative px-4 py-2 text-gray-400">Memuat data..</div>
                                                :
                                                <>
                                                {
                                                    questions.length === 0 && (
                                                        <div className="relative px-4 py-2 text-gray-400">Tidak ada hasil.</div>
                                                    )
                                                }
                                                {
                                                    questions.map((exam) => (
                                                        <ComboboxOption
                                                        key={exam.id}
                                                        value={exam}
                                                        className={({ active }) =>
                                                            `cursor-pointer select-none px-4 py-3 montserrat ${
                                                            active ? 'bg-blue-500 text-white' : ''
                                                            }`
                                                        }
                                                        >
                                                            {exam.title}
                                                        </ComboboxOption>
                                                    ))
                                                }
                                                </>
                                            }
                                            </ComboboxOptions>
                                        </Combobox>
                                        {/* {touched.exam_id && errors.exam_id && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.exam_id}</div>} */}
                                    </div>
                                {
                                    selectedQuestion ?
                                    <>
                                    {
                                        options.map((option, index) => (
                                            <div key={index} className="options-row flex max-4xs:flex-col max-4xs:items-end items-center gap-5">
                                                <div className="form-input relative w-full">
                                                    <label className="inline-block mb-1">Nama Opsi Jawaban <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        name="option_text"
                                                        value={option.option_text}
                                                        onChange={(e) => handleOptionChange(index, e)}
                                                        onBlur={(e) => handleBlur(index, e)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '0.75rem',
                                                            border: option.touched.option_text && option.errors.option_text ? '1px solid red' : '1px solid #ccc',
                                                            borderRadius: '6px',
                                                            marginTop: '0.25rem',
                                                        }}
                                                        placeholder="Masukkan nama opsi jawaban"
                                                    />
                                                    {option.touched.option_text && option.errors.option_text && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{option.errors.option_text}</div>}
                                                </div>
                                                <div className="form-input relative">
                                                    <label className="inline-block mb-1">Nilai Kebenaran<span className="text-red-500">*</span></label>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={option.isCorrect}
                                                            onChange={(val) => handleIsCorrectChange(index, val)}
                                                            className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-200 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-green-base data-focus:outline data-focus:outline-white"
                                                            >
                                                            <span
                                                                aria-hidden="true"
                                                                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
                                                            />
                                                        </Switch>
                                                        <span className="font-medium">{option.isCorrect ? 'Benar' : 'Salah'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                        <button type="button" onClick={addOptionRow} className="cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="#005952" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 rounded-full text-white bg-green-base hover:bg-green-base/80 p-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </button>
                                    </>
                                    :
                                    false
                                }
                            </>
                            : false
                        }
                        </div>
                        <button type="button" onClick={handleSubmit} className={`${ isSubmitDisabled() ? 'pointer-events-none opacity-50' : ''} bg-green-base montserrat mt-6 w-full text-[1rem] font-semibold rounded-[10px] border-0 py-2.5 px-8 text-white hover:bg-green-base/80 cursor-pointer transition-colors`}>
                           {
                                loadingSubmit ? 'Memuat...' :
                                `Simpan Opsi Jawaban`
                           }
                        </button>
                    </section>
                </form>
            </div>
        </DashboardLayout>
    )
}

export default CreateAnswers