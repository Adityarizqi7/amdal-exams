// import axios from "axios";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useState } from "react";
import utc from 'dayjs/plugin/utc'
import { TimePicker } from "rsuite";
import timezone from 'dayjs/plugin/timezone'
import { Datepicker } from "flowbite-react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Select } from "@headlessui/react";

import 'rsuite/TimePicker/styles/index.css';
import CONST from "../../../../utils/Constant";
// import { getToken } from "../../../../utils/Auth";
import { NavLink, useNavigate } from "react-router-dom";
import CommonLayout from "../../../../layouts/CommonLayout"
import { useCreateMutation } from "../../../../store/exam/batchApi";


dayjs.extend(utc)
dayjs.extend(timezone)

const CreateBatch = () => {

    const navigate = useNavigate()
    const [create] = useCreateMutation();

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        max_participant: '',
    });
    const [formDate, setFormDate] = useState({
        start_time: '',
        end_time: '',
    });
    const [formTime, setFormTime] = useState({
        start_clock: '',
        end_clock: '',
    });

    const [loadingSubmit, setLoadingSubmit] = useState(false)

    // const dropdownRef = useRef(null);
    
    // const [selectedExam, setSelectedExam] = useState(null);
    // const [loadingExam, setLoadingExam] = useState(false);
    // const [query, setQuery] = useState('');
    // const [exams, setExams] = useState([]);
    // const [, setPage] = useState(1);
    // const [hasMore, setHasMore] = useState(true);

    
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

    const formatDateToISO = (dateString) => {

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
      
        const isoDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
        return isoDate;
    }
      
    const validate = (fields = formData) => {
        const newErrors = {};
        if (!fields.name) newErrors.name = 'Kolom Nama Sesi harus diisi!';
        if (!fields.max_participant) newErrors.max_participant = 'Kolom Batas Jumlah Peserta harus diisi!';
        return newErrors;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeTime = (value, name) => {
        setFormTime((prev) => ({
          ...prev,
          [name]: value,
        }));
    };

    const handleDateChange = (date, name) => {
        setFormDate((prev) => ({
          ...prev,
          [name]: date,
        }));
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
            setLoadingSubmit(true)
            const body = {
                // exam_id: selectedExam.id,
                name: formData.name,
                max_participants: formData.max_participant,
                start_time: `${formatDateToISO(formDate?.start_time)?.split(' ')?.[0]} ${formatDateToISO(formTime?.start_clock)?.split(' ')?.[1]}`,
                end_time: `${formatDateToISO(formDate?.end_time)?.split(' ')?.[0]} ${formatDateToISO(formTime?.end_clock)?.split(' ')?.[1]}`
            }

            // console.log(body)
            const response = await create(body);

            const { error } = response;

            if (error) {
                console.log(error)
                setLoadingSubmit(false)
                throw new Error("Terdapat inputan yang masih salah.");
            }

            setLoadingSubmit(false);
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
                    navigate("/dashboard/batches")
                }
            }) 
        }
    
    }

    // const handleScroll = (e) => {
    //     const el = e.target;
    //     if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && hasMore) {
    //         setPage((prev) => {
    //             const next = prev + 1;
    //             getAllExam(next, query);
    //             return next;
    //         });
    //     }
    // };

    // useEffect(() => {
    //     getAllExam(1, query);
    // }, [query, getAllExam]);
    
    return (
        <CommonLayout
            title='Buat Pertanyaan - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="create-question-component md:px-[7.5rem] px-4 pb-[12rem] montserrat">
                <NavLink to='/dashboard/batches' className="go-back flex items-center gap-2 hover:opacity-80 cursor-pointer mt-[2rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>
                        Kembali ke Daftar
                    </span>
                </NavLink>

                <form id="form_wrapper" encType="multipart/form-data" className="form-create-question-container mt-[2.5rem]">
                    <h1 className="font-semibold text-[1.75rem] text-gray-700">Tambah Sesi Ujian</h1>
                    <section className="form-create-question-card mt-[1.5rem]">
                        <div className="form-wrapper montserrat">
                            {/* <div className="form-input relative">
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
                                    {
                                        selectedExam === '' || !selectedExam ?
                                            <h4 className="absolute top-[45px] left-3">Pilih Tipe Ujian</h4> 
                                        : false
                                    }
                                    <ComboboxButton className="group absolute top-[37px] right-0 px-2.5">
                                        <ChevronDownIcon className="size-8 fill-black" />
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
                                {touched.exam_id && errors.exam_id && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.exam_id}</div>}
                            </div> */}
                        {/* {
                            selectedExam ?
                            : false
                        } */}
                            <div className="space-y-5 mt-5">
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Nama Sesi <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: touched.name && errors.name ? '1px solid red' : '1px solid #ccc',
                                            borderRadius: '6px',
                                            marginTop: '0.25rem',
                                        }}
                                        placeholder="Masukkan nama sesi"
                                    />
                                    {touched.name && errors.name && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.name}</div>}
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Sesi Mulai<span className="text-red-500">*</span></label>
                                    <div className="space-y-3">
                                        <Datepicker
                                            name="start_time"
                                            selected={formDate.start_time}
                                            onChange={(date) => handleDateChange(date, 'start_time')}
                                            minDate={new Date()}
                                            title="Sesi Mulai"
                                            autoHide={false}
                                            language="id-ID"
                                            labelTodayButton="Hari ini"
                                            labelClearButton="Hapus"
                                        />
                                        <TimePicker
                                            onChange={(value) => handleChangeTime(value, 'start_clock')}
                                            value={formTime.start_clock}
                                            format="HH:mm"
                                        />
                                    </div>
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Sesi Akhir<span className="text-red-500">*</span></label>
                                    <div className="space-y-3">
                                        <Datepicker
                                            name="end_time"
                                            selected={formDate.end_time}
                                            onChange={(date) => handleDateChange(date, 'end_time')}
                                            title="Sesi Akhir"
                                            autoHide={false}
                                            language="id-ID"
                                            labelTodayButton="Hari ini"
                                            labelClearButton="Hapus"
                                        />
                                        <TimePicker
                                            onChange={(value) => handleChangeTime(value, 'end_clock')}
                                            value={formTime.end_clock}
                                            format="HH:mm"
                                        />
                                    </div>
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Batas jumlah peserta<span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="max_participant"
                                        value={formData.max_participant}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: touched.max_participant && errors.max_participant ? '1px solid red' : '1px solid #ccc',
                                            borderRadius: '6px',
                                            marginTop: '0.25rem',
                                        }}
                                        placeholder="Masukkan batas jumlah peserta pertanyaan"
                                    />
                                    {touched.max_participant && errors.max_participant && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.max_participant}</div>}
                                </div>
                            </div>
                        </div>
                        <button type="button" onClick={handleSubmit} className={`${ formData.name === ''|| formDate.start_time === '' || formDate.end_time === '' || formData.max_participant === '' || errors.name || errors.max_participant ? 'pointer-events-none opacity-50' : ''} bg-green-base montserrat mt-6 w-full text-[1rem] font-semibold rounded-[10px] border-0 py-2.5 px-8 text-white hover:bg-green-base/80 cursor-pointer transition-colors`}>
                           {
                                loadingSubmit ? 'Memuat...' :
                                `Simpan Sesi Ujian`
                           }
                        </button>
                    </section>
                </form>
            </div>
        </CommonLayout>
    )
}

export default CreateBatch