import Swal from "sweetalert2";
import { useCallback, useEffect, useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Select, Switch } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import CommonLayout from "../../../layouts/CommonLayout"
import { NavLink, useNavigate, useParams } from "react-router-dom";
// import { useCreateMutation } from "../../../store/answers/answersApi";
import axios from "axios";
import CONST from "../../../utils/Constant";
import { getToken } from "../../../utils/Auth";

const EditAnswers = () => {

    const {id} = useParams()
    const navigate = useNavigate()
    // const [create] = useCreateMutation();

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [formData, setFormData] = useState({
        option_text: '',
    });
    // const [options, setOptions] = useState([
    //     { option_text: '', isCorrect: false, touched: {}, errors: {} }
    // ]);
      
    const [isCorrect, setIsCorrect] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    // const dropdownRef = useRef(null);
    
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [detailAnswer, setDetailAnswers] = useState(false)

    // const [exams, setExams] = useState([]);
    // const [questions, setQuestions] = useState([]);
    // const [loadingExam, setLoadingExam] = useState(false)
    // const [selectedExam, setSelectedExam] = useState(null);
    // const [selectedQuestion, setSelectedQuestion] = useState(null);
    // const [loadingQuestion, setLoadingQuestion] = useState(false);
    // const [query, setQuery] = useState('');
    // const [, setPage] = useState(1);
    // const [hasMore, setHasMore] = useState(true);

    
    // const addOptionRow = () => {
    //     setOptions((prev) => [
    //       ...prev,
    //       { option_text: '', isCorrect: false, touched: {}, errors: {} }
    //     ]);
    // };      

    // const removeOption = (index) => {
    //     setOptions((prev) => prev.filter((_, i) => i !== index));
    // };

    const getDetail = useCallback( async () => {
            setLoadingDetail(true);
            const token = await getToken();

            if (token) {
                axios.get(`${CONST.BASE_URL_API}options/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }})
                .then((response) => {
                    setLoadingDetail(false)
                    const resp = response.data?.data[0]
                    setDetailAnswers(resp)
                    setFormData(
                        {
                            option_text: resp.option_text,
                        }
                    )
                    setIsCorrect(resp.is_correct)
                    // setSelectedExam(resp.question.exam)
                    // setSelectedQuestion([resp.question].map((item) => ({
                    //     id: item.id,
                    //     title: item.question_text,
                    //     question_type: item.question_type,
                    //     weight: item.weight,
                    // })));
                    // const prepared = resp.options.map((opt) => ({
                    //     id: opt.id,
                    //     option_text: opt.option_text,
                    //     isCorrect: opt.is_correct,
                    //     touched: {},
                    //     errors: {}
                    // }));
                  
                    // setOptions(prepared);
                })
                .catch(() => {
                    setLoadingDetail(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Mengambil data',
                        text: 'Terjadi kesalahan saat mengambil data.',
                        customClass: {
                            container: 'montserrat'
                        }
                    });
                })
                .finally(() => {
                    setLoadingDetail(false);
                });
            }
    }, [id]);

    // const getAllExam = useCallback( async (page = 1, query = '') => {
    //     const token = await getToken();
    //     if (token) {

    //         setLoadingExam(true)
    //         const response = await axios.get(`${CONST.BASE_URL_API}exams/all`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 },
    //                 params: { page, search: query }
    //             }
    //         )

    //         if (response) {
    //             setLoadingExam(false)
    //             const newItems = response.data.data.data.map((item) => ({
    //                 id: item.id,
    //                 title: item.title
    //             }));
                
    //             setExams((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
    //             setHasMore(page < response.data.data.last_page);
    //         }
    //     }
    // }, []);
    // const getAllQuestion = useCallback( async (page = 1, query = '') => {
    //     const token = await getToken();
    //     if (token) {

    //         setLoadingQuestion(true)
    //         const response = await axios.get(`${CONST.BASE_URL_API}questions`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 },
    //                 params: { page, search: query }
    //             }
    //         )

    //         if (response) {
    //             setLoadingQuestion(false)
    //             const newItems = response.data.data.data.map((item) => ({
    //                 id: item.id,
    //                 title: item.question_text,
    //                 question_type: item.question_type,
    //                 weight: item.weight,
    //             }));
                
    //             // setSelectedQuestion(newItems[0])
    //             setQuestions((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
    //             setHasMore(page < response.data.data.last_page);
    //         }
    //     }
    // }, []);

    const handleIsCorrect = () => {
        setIsCorrect(!isCorrect)
    }
    const validate = (fields = formData) => {
        const newErrors = {};
        if (!fields.option_text) newErrors.option_text = 'Kolom Nama Opsi harus diisi!';
        return newErrors;
    };
    // const handleIsCorrectChange = (index, value) => {
    //     setOptions((prev) => {
    //       const updated = [...prev];
    //       updated[index].isCorrect = value;
    //       return updated;
    //     });
    // };
      
    // const handleOptionChange = (index, e) => {
    //     const { name, value } = e.target;
      
    //     setOptions((prev) => {
    //       const updated = [...prev];
    //       updated[index][name] = value;
    //       return updated;
    //     });
    // };
    // const handleBlur = (index, e) => {
    //     const { name } = e.target;
      
    //     setOptions((prev) => {
    //       const updated = [...prev];
    //       updated[index].touched = { ...updated[index].touched, [name]: true };
      
    //       // validasi per input
    //       const errors = {};
    //       if (!updated[index].option_text) {
    //         errors.option_text = 'Kolom Nama Opsi harus diisi!';
    //       }
      
    //       updated[index].errors = errors;
    //       return updated;
    //     });
    // };

    // const isSubmitDisabled = () => {
    //     return loadingSubmit || options.some(
    //       (opt) => !opt.option_text || opt.errors.option_text
    //     );
    // };    

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value)
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
      
    const handleBlur = (e) => {
        const { name } = e.target;
    
        setTouched((prev) => ({ ...prev, [name]: true }));
    
        const newErrors = validate(formData);
        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        // Validasi
        // const updatedOptions = options.map((opt) => {
        //     const errors = {};
        //     if (!opt.option_text) {
        //         errors.option_text = 'Kolom Nama Opsi harus diisi!';
        //     }
      
        //     return {
        //         ...opt,
        //         errors,
        //         touched: { option_text: true },
        //     };
        // });
      
        // setOptions(updatedOptions);
      
        // const hasError = updatedOptions.some((opt) => Object.keys(opt.errors).length > 0);
        // if (hasError) return;

        setLoadingSubmit(true);

        const validationErrors = validate();
        setErrors(validationErrors);
        
        setTouched(Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {}));

        if (Object.keys(validationErrors).length === 0) {
            Swal.fire({
                title: 'Apakah kamu yakin?',
                text: "Data opsi jawaban ini akan diubah!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, Ubah!',
                cancelButtonText: 'Batal',
                customClass: {
                    container: 'montserrat'
                }
            }).then( async (result) => {
                if (result.isConfirmed) {
                setLoadingSubmit(true);
                
                const token = await getToken();
                if (token) {
                    const body = {
                        option_text: formData.option_text,
                        is_correct: isCorrect
                    }
                    axios.put(`${CONST.BASE_URL_API}options/${detailAnswer.id}`, body, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }})
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Perubahan Opsi Jawaban berhasil disimpan!',
                            customClass: {
                            container: 'montserrat'
                            }
                        });
                        navigate('/dashboard/answers')
                    })
                    .catch((error) => {
                        console.error(error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal Mengubah',
                            text: 'Terjadi kesalahan saat mengubah data.',
                            customClass: {
                            container: 'montserrat'
                            }
                        });
                    })
                    .finally(() => {
                        setLoadingSubmit(false);
                    });
                }
            }
            });
        }
      
        // try {
        //   const payload = {
        //         option_text: formData.option_text,
        //         is_correct: isCorrect
        //         // exam_id: selectedExam.id,
        //         // questions: [
        //         //     {
        //         //         question_text: selectedQuestion.title,
        //         //         question_type: selectedQuestion.question_type,
        //         //         weight: selectedQuestion.weight,
        //         //         options: updatedOptions.map(({ option_text, isCorrect }) => ({
        //         //             option_text,
        //         //             is_correct: isCorrect
        //         //         })),
        //         //     }
        //         // ]
        //     };

        //     const token = await getToken();
        //     if (token) {
        //         axios.post(`${CONST.BASE_URL_API}questions/store-batch`, payload, {
        //         headers: {
        //             Authorization: `Bearer ${token}`
        //         }})
        //         .then(() => {
        //             Swal.fire({
        //                 icon: 'success',
        //                 title: 'Berhasil',
        //                 text: 'Data Opsi Jawaban berhasil disimpan!',
        //                 customClass: {
        //                 container: 'montserrat'
        //                 }
        //             })
        //             navigate('/dashboard/answers')
        //         })
        //         .catch((error) => {
        //             console.error(error);
        //             Swal.fire({
        //                 icon: 'error',
        //                 title: 'Gagal Menghapus',
        //                 text: 'Terjadi kesalahan saat menghapus data.',
        //                 customClass: {
        //                     container: 'montserrat'
        //                 }
        //             });
        //         })
        //         .finally(() => {
        //             // setLoadingExam(false);
        //         });
        //     }

        //     let timerInterval;
        //     Swal.fire({
        //         timer: 1000,
        //         icon: 'success',
        //         showConfirmButton: false,
        //         title: 'Berhasil, Data telah disimpan.',
        //         text: 'Tunggu sebentar',
        //         customClass: {
        //             container: 'montserrat'
        //         },
        //         didOpen: () => {
        //             Swal.showLoading()
        //         },
        //         willClose: () => {
        //             clearInterval(timerInterval)
        //         }
        //     }).then((result) => {
        //         if (result.dismiss === Swal.DismissReason.timer) {
        //             navigate("/dashboard/answers")
        //         }
        //     }) 
        // } catch (error) {
        //     console.error(error);
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Gagal',
        //         text: 'Terjadi kesalahan saat menyimpan Opsi Jawaban',
        //     });
        // } finally {
        //     setLoadingSubmit(false);
        // }
    };

    // const handleScrollQuestion = (e) => {
    //     const el = e.target;
    //     if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore) {
    //         setPage((prev) => {
    //             const next = prev + 1;
    //             getAllQuestion(next, query);
    //             return next;
    //         });
    //     }
    // };

    // const handleScrollExam = (e) => {
    //     const el = e.target;
    //     if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore) {
    //         setPage((prev) => {
    //             const next = prev + 1;
    //             getAllExam(next, query);
    //             return next;
    //         });
    //     }
    // };

    useEffect(() => {
        getDetail()
        // getAllQuestion(1, query);
        // getAllExam(1, query);

    }, [getDetail]);
    
    return (
        <CommonLayout
            title={`Ubah Opsi '${detailAnswer.option_text}' - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025`}
        >
            <div className="edit-answers-component md:px-[7.5rem] px-4 pb-12 montserrat">
                <NavLink to='/dashboard/answers' className="go-back flex items-center gap-2 hover:opacity-80 cursor-pointer mt-[2rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>
                        Kembali ke Daftar
                    </span>
                </NavLink>

                {
                    loadingDetail ?
                        <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] font-semibold">Memuat Detail Opsi Jawaban...</h1>
                    :
                    !detailAnswer ? 
                        <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] font-semibold">Opsi Jawaban tidak ditemukan.</h1>
                    :
                    <form id="form_wrapper" encType="multipart/form-data" className="form-edit-answers-container mt-[2.5rem]">
                        <h1 className="font-semibold text-[1.75rem]">Ubah Opsi Jawaban</h1>
                        <section className="form-edit-answers-card mt-[1.5rem]">
                            <div className="form-wrapper montserrat space-y-6">
                                <div className="form-input relative w-full">
                                    <label className="inline-block mb-1">Nama Opsi Jawaban <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="option_text"
                                        value={formData.option_text}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: touched.option_text && errors.option_text ? '1px solid red' : '1px solid #ccc',
                                            borderRadius: '6px',
                                            marginTop: '0.25rem',
                                        }}
                                        placeholder="Masukkan nama opsi jawaban"
                                    />
                                    {touched.option_text && errors.option_text && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.option_text}</div>}
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Nilai Kebenaran<span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={isCorrect}
                                            onChange={handleIsCorrect}
                                            className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-200 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-green-base data-focus:outline data-focus:outline-white"
                                            >
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
                                            />
                                        </Switch>
                                        <span className="font-medium">{isCorrect ? 'Benar' : 'Salah'}</span>
                                    </div>
                                </div>
                            </div>
                            <button type="button" onClick={handleSubmit} className={`${ loadingSubmit || errors.option_text || formData.option_text === '' ? 'pointer-events-none opacity-50' : ''} bg-green-base montserrat mt-6 w-full text-[1rem] font-semibold rounded-[10px] border-0 py-2.5 px-8 text-white hover:bg-green-base/80 cursor-pointer transition-colors`}>
                            {
                                    loadingSubmit ? 'Memuat...' :
                                    `Simpan Perubahan Opsi Jawaban`
                            }
                            </button>
                        </section>
                    </form>
                }

            </div>
        </CommonLayout>
    )
}

export default EditAnswers