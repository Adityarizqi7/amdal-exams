import axios from "axios";
import Swal from "sweetalert2";
import { Datepicker } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/16/solid";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Select } from "@headlessui/react";

import 'rsuite/TimePicker/styles/index.css';
import CONST from "../../../../utils/Constant";
import { getToken } from "../../../../utils/Auth";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CommonLayout from "../../../../layouts/CommonLayout"
import dayjs from "dayjs";
import { TimePicker } from "rsuite";

dayjs.locale('id')

const EditBatch = () => {

    const {id} = useParams()
    const navigate = useNavigate()

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

    const [dateTime, setDateTime] = useState({
        start_date: '',
        end_date: ''
    })

    const [loadingSubmit, setLoadingSubmit] = useState(false)

    // const dropdownRef = useRef(null);
    
    const [detailBatch, setDetailBatch] = useState(false)
    const [loadingDetail, setLoadingDetail] = useState(false)
    // const [selectedExam, setSelectedExam] = useState(null);
    // const [loadingExam, setLoadingExam] = useState(false);
    // const [query, setQuery] = useState('');
    // const [exams, setExams] = useState([]);
    // const [, setPage] = useState(1);
    // const [hasMore, setHasMore] = useState(true);

    // const parseLocalDate = (str) => {
    //     const [year, month, day] = str.split('-') // pastikan formatnya "YYYY-MM-DD"
    //     return new Date(Number(year), Number(month) - 1, Number(day)) // month is 0-based
    // }
      

    const getDetail = useCallback( async () => {
        try {
            setLoadingDetail(true);

            const token = await getToken();

            if (token) {

                axios.get(`${CONST.BASE_URL_API}exam-batches/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }})
                .then((response) => {
                    setLoadingDetail(false)
                    console.log(response)
                    const resp = response.data.data
                    setDetailBatch(response.data.data)
                    setFormData(
                        {
                            name: resp.name,
                            max_participant: resp.max_participants,
                        }
                    )
                    setDateTime({
                        start_date: dayjs(resp.start_time).format('D MMMM YYYY HH:mm:ss'),
                        end_date: dayjs(resp.start_time).format('D MMMM YYYY HH:mm:ss')
                    })
                })
                .catch(() => {
                    setLoadingDetail(false)
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Mengambil data',
                        text: 'Terjadi kesalahan saat mengambi data.',
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
        console.log(value, name, 'hahaoo')
        setFormTime((prev) => ({
          ...prev,
          [name]: value, // value adalah objek Date
        }));
    };

    const handleDateChange = (date, name) => {
        console.log(date, name, 'hahaho')
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
            Swal.fire({
                title: 'Apakah kamu yakin?',
                text: "Data Sesi Ujian ini akan diubah!",
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
                        // exam_id: selectedExam.id,
                        name: formData.name,
                        max_participants: formData.max_participant,
                        start_time: `${formatDateToISO(formDate?.start_time)?.split(' ')?.[0]} ${formatDateToISO(formTime?.start_clock)?.split(' ')?.[1]}`,
                        end_time: `${formatDateToISO(formDate?.end_time)?.split(' ')?.[0]} ${formatDateToISO(formTime?.end_clock)?.split(' ')?.[1]}`     
                    }
                    axios.put(`${CONST.BASE_URL_API}exam-batches/${detailBatch.id}`, body, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }})
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Perubahan Sesi Ujian berhasil disimpan!',
                            customClass: {
                            container: 'montserrat'
                            }
                        });
                        navigate('/dashboard/batches')
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

    useEffect(() => {
        getDetail()
        // getAllExam(1, query);
    }, [getDetail]);
    
    return (
        <CommonLayout
            title={`Ubah Sesi Ujian '${detailBatch.name}' - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025`}
        >
            <div className="edit-batch-component px-7 pb-[12rem] montserrat">
                <NavLink to='/dashboard/batches' className="go-back flex items-center gap-2 hover:opacity-80 cursor-pointer mt-[2rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>
                        Kembali ke Daftar
                    </span>
                </NavLink>

            {
                loadingDetail ?
                        <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] text-gray-700 font-semibold">Memuat Detail Sesi...</h1>
                    :
                    !detailBatch ? 
                        <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] text-gray-700 font-semibold">Sesi Ujian tidak ditemukan.</h1>
                    :
                    false
            }

                <form id="form_wrapper" encType="multipart/form-data" className="form-edit-batch-container mt-[2.5rem]">
                    <h1 className="font-semibold text-[1.75rem] text-gray-700">Ubah Sesi Ujian</h1>
                    <section className="form-edit-batch-card mt-[1.5rem]">
                        <div className="form-wrapper montserrat">
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
                                    <h4 className="font-medium mb-2 text-[1rem] montserrat">Tanggal sebelumnya: <span className="text-blue-700">{ dateTime.start_date }</span></h4>
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
                                    <h4 className="font-medium mb-2 text-[1rem] montserrat">Tanggal sebelumnya: <span className="text-blue-700">{ dateTime.end_date }</span></h4>
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
                        {/* {
                            selectedExam ?
                            : false
                        } */}
                        </div>
                        <button type="button" onClick={handleSubmit} className={`${ formData.name === ''|| formDate.start_time === '' || formDate.end_time === '' || formData.max_participant === '' || errors.name || errors.max_participant ? 'pointer-events-none opacity-50' : ''} bg-green-base montserrat mt-6 w-full text-[1rem] font-semibold rounded-[10px] border-0 py-2.5 px-8 text-white hover:bg-green-base/80 cursor-pointer transition-colors`}>
                           {
                                loadingSubmit ? 'Memuat...' :
                                `Simpan Perubahan Sesi Ujian`
                           }
                        </button>
                    </section>
                </form>
            </div>
        </CommonLayout>
    )
}

export default EditBatch