import Swal from "sweetalert2";
import { useCallback, useEffect, useRef, useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Select } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import CommonLayout from "../../../layouts/CommonLayout"
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CONST from "../../../utils/Constant";
import { getToken } from "../../../utils/Auth";

const EditQuestion = () => {

    const { id } = useParams();
    const navigate = useNavigate()

    const [loadingDetail, setLoadingDetail] = useState(false)
    const [detailQuest, setDetailQuest] = useState(false)

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState({
        question_text: '',
        image: '',
        order: '',
        question_type: '',
        weight: '',
    });

    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const dropdownRef = useRef(null);
    
    const [selectedExam, setSelectedExam] = useState(null);
    const [loadingExam, setLoadingExam] = useState(false);
    const [query, setQuery] = useState('');
    const [exams, setExams] = useState([]);
    const [, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const getDetail = useCallback( async () => {
        try {
            setLoadingDetail(true);

            const token = await getToken();

            if (token) {
                axios.get(`${CONST.BASE_URL_API}questions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }})
                .then((response) => {
                    setLoadingDetail(false)
                    const resp = response.data.data
                    setDetailQuest(response.data.data)
                    setFormData(
                        {
                            question_text: resp.question_text,
                            order: resp.order,
                            weight: resp.weight,
                            image: resp.image,
                        }
                    )
                    setSelectedExam(resp.exam)
                })
                .catch(() => {
                    setLoadingDetail(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Mengambil data',
                        text: 'Terjadi kesalahan saat mengambi; data.',
                        customClass: {
                            container: 'montserrat'
                        }
                    });
                })
                .finally(() => {
                    setLoadingDetail(false);
                });  
            }
        } catch (error) {
            console.log(error)
        }
    }, [id])

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

    const validate = (fields = formData) => {
        const newErrors = {};
        if (!fields.question_text) newErrors.question_text = 'Kolom Judul Pertanyaan harus diisi!';
        if (!fields.order) newErrors.order = 'Kolom Urutan harus diisi!';
        if (!fields.weight) newErrors.weight = 'Kolom Bobot harus diisi!';
        return newErrors;
    };

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
        
        const validationErrors = validate();
        setErrors(validationErrors);
        
        setTouched(Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {}));
        
        if (Object.keys(validationErrors).length === 0) {
            Swal.fire({
                title: 'Apakah kamu yakin?',
                text: "Data pertanyaan ini akan diubah!",
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
                        exam_id: selectedExam.id,
                        question_text: formData.question_text,
                        order: formData.order,
                        question_type: formData.question_type === '' ? 'multiple_choice' : formData.question_type,
                        weight: formData.weight,
                    }
                    axios.put(`${CONST.BASE_URL_API}questions/${detailQuest.id}`, body, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }})
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Perubahan Peratnyaan berhasil disimpan!',
                            customClass: {
                            container: 'montserrat'
                            }
                        });
                        navigate('/dashboard/questions')
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
    
    }

    const handleScroll = (e) => {
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
        getDetail()
        getAllExam(1, query);
    }, [query, getAllExam, getDetail]);
    
    return (
        <CommonLayout
            title={`Ubah Tipe '${detailQuest.question_text}' - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025`}
        >
            <div className="create-question-component md:px-[7.5rem] px-4 pb-12 montserrat">
                <NavLink to='/dashboard/questions' className="go-back flex items-center gap-2 hover:opacity-80 cursor-pointer mt-[2rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>
                        Kembali ke Daftar
                    </span>
                </NavLink>

                {
                    loadingDetail ?
                        <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] font-semibold">Memuat Detail Pertanyaan...</h1>
                    :
                    !detailQuest ? 
                        <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] font-semibold">Pertanyaan tidak ditemukan.</h1>
                    :
                    <form id="form_wrapper" encType="multipart/form-data" className="form-create-question-container mt-[2.5rem]">
                        <h1 className="font-semibold text-[1.75rem]">Tambah Pertanyaan</h1>
                        <section className="form-create-question-card mt-[1.5rem]">
                            <div className="form-wrapper montserrat grid grid-cols-2 max-2xs:grid-cols-1 gap-5">
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Tipe Ujian<span className="text-red-500">*</span></label>
                                    <Combobox value={selectedExam} onChange={setSelectedExam}>
                                        <ComboboxInput
                                        name="exam_id"
                                        className="w-full border border-gray-300 mt-[0.25rem] rounded px-3 py-[0.75rem]"
                                        displayValue={(exam) => exam?.title || ''}
                                        onChange={(event) => {
                                            setQuery(event.target.value);
                                            setPage(1);
                                        }}
                                        />
                                        <ComboboxButton className="group absolute top-[37px] right-0 px-2.5">
                                            <ChevronDownIcon className="size-8 fill-white/60 group-data-hover:fill-black" />
                                        </ComboboxButton>
                                        <ComboboxOptions
                                            anchor="bottom"
                                            transition
                                            className="z-[1000] h-[13rem] overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5"
                                            ref={dropdownRef}
                                            onScroll={handleScroll}
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
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Judul Pertanyaan <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="question_text"
                                        value={formData.question_text}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: touched.question_text && errors.question_text ? '1px solid red' : '1px solid #ccc',
                                            borderRadius: '6px',
                                            marginTop: '0.25rem',
                                        }}
                                        placeholder="Masukkan judul pertanyaan"
                                    />
                                    {touched.question_text && errors.question_text && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.question_text}</div>}
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Urutan<span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: touched.order && errors.order ? '1px solid red' : '1px solid #ccc',
                                            borderRadius: '6px',
                                            marginTop: '0.25rem',
                                        }}
                                        placeholder="Masukkan urutan pertanyaan"
                                    />
                                    {touched.order && errors.order && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.order}</div>}
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Jenis<span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Select onChange={handleChange} value={formData.question_type} name="question_type" className="mt-[0.25rem] border border-[#ccc] block w-full appearance-none rounded-lg bg-white px-3 py-[0.75rem] text-black focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 *:text-black" aria-label="Jenis">
                                            <option value="multiple_choice">Pilihan Ganda</option>
                                            <option value="essay">Essay</option>
                                            <option value="" disabled hidden>
                                                Pilih Tipe
                                            </option>
                                        </Select>
                                        <ChevronDownIcon
                                            className="group pointer-events-none absolute top-2.5 right-2.5 size-8 fill-black"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    {touched.question_type && errors.question_type && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.question_type}</div>}
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Bobot<span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: touched.weight && errors.weight ? '1px solid red' : '1px solid #ccc',
                                            borderRadius: '6px',
                                            marginTop: '0.25rem',
                                        }}
                                        placeholder="Masukkan bobot pertanyaan"
                                    />
                                    {touched.weight && errors.weight && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.weight}</div>}
                                </div>
                            </div>
                            <button type="button" onClick={handleSubmit} className={`${ formData.question_text === ''|| formData.order === '' || formData.weight === '' || errors.question_text || errors.order || errors.weight || loadingSubmit ? 'pointer-events-none opacity-50' : ''} bg-green-base montserrat mt-6 w-full text-[1rem] font-semibold rounded-[10px] border-0 py-2.5 px-8 text-white hover:bg-green-base/80 cursor-pointer transition-colors`}>
                            {
                                    loadingSubmit ? 'Memuat...' :
                                    `Simpan Perubahan Pertanyaan`
                            }
                            </button>
                        </section>
                    </form>
                }

            </div>
        </CommonLayout>
    )
}

export default EditQuestion