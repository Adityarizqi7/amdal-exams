import axios from "axios";
import Swal from "sweetalert2";
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout"
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getToken } from "../../../utils/Auth";
import CONST from "../../../utils/Constant";

const EditExam = () => {

    const { id } = useParams();

    const navigate = useNavigate()

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [examDetail, setExamDetail] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        duration: '',
    });

    const [loadingDetail, setLoadingDetail] = useState(false)

    const getDetail = useCallback( async () => {
        try {
            setLoadingDetail(true);

            const token = await getToken();

            if (token) {
                axios.get(`${CONST.BASE_URL_API}exams/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }})
                .then((response) => {
                    setLoadingDetail(false)
                    const resp = response.data.data
                    setExamDetail(response.data.data)
                    setFormData(
                        {
                            title: resp.title,
                            description: resp.description,
                            image: resp.image,
                            duration: resp.duration,
                        }
                    )
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
        } catch (error) {
            console.log(error)
        }
    }, [id])

    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const validate = (fields = formData) => {
        const newErrors = {};
        if (!fields.title) newErrors.title = 'Kolom Nama harus diisi!';
        if (!fields.description) newErrors.description = 'Kolom Deskripsi harus diisi!';
        if (!fields.duration) newErrors.duration = 'Kolom Durasi harus diisi!';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
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
                text: "Data tipe ujian ini akan diubah!",
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
                    
                    axios.put(`${CONST.BASE_URL_API}exams/${examDetail.id}`, {
                        title: formData.title,
                        description: formData.description,
                        duration: formData.duration,
                        image: formData.image
                    }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }})
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Perubahan Tipe Ujian berhasil disimpan!',
                            customClass: {
                            container: 'montserrat'
                            }
                        });
                        navigate('/dashboard/exams')
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

    useEffect(() => {
        getDetail()
    }, [getDetail])

    return (
        <DashboardLayout
            title={`Ubah Tipe '${examDetail.title}' - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025`}
        >
            <div className="edit-exam-component px-7 pb-12 montserrat">
                <NavLink to='/dashboard/exams' className="go-back flex items-center gap-2 hover:opacity-80 cursor-pointer mt-[2rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>
                        Kembali ke Daftar
                    </span>
                </NavLink>

            {
                loadingDetail ?
                    <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] text-gray-700 font-semibold">Memuat Detail Tipe...</h1>
                :
                !examDetail ? 
                    <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] text-gray-700 font-semibold">Tipe Ujian Soal tidak ditemukan.</h1>
                :
                    <form id="form_wrapper" encType="multipart/form-data" className="form-edit-exam-container mt-[2.5rem]">
                        <h1 className="font-semibold text-[1.75rem] text-gray-700">Ubah Tipe Ujian Soal</h1>
                        <section className="form-edit-exam-card mt-[1.5rem]">
                            <div className="form-wrapper montserrat space-y-5">
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Nama Tipe <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: touched.title && errors.title ? '1px solid red' : '1px solid #ccc',
                                            borderRadius: '6px',
                                            marginTop: '0.25rem',
                                        }}
                                        placeholder="Masukkan nama tipe"
                                    />
                                    {touched.title && errors.title && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.title}</div>}
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Deskripsi <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: touched.description && errors.description ? '1px solid red' : '1px solid #ccc',
                                            borderRadius: '6px',
                                            marginTop: '0.25rem',
                                        }}
                                        placeholder="Masukkan deskripsi"
                                    />
                                    {touched.description && errors.description && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.description}</div>}
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Durasi Ujian (Dalam Menit) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: touched.duration && errors.duration ? '1px solid red' : '1px solid #ccc',
                                            borderRadius: '6px',
                                            marginTop: '0.25rem',
                                        }}
                                        placeholder="Masukkan durasi ujian"
                                    />
                                    {touched.duration && errors.duration && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.duration}</div>}
                                </div>
                            </div>
                            <button type="button" onClick={handleSubmit} className={`${formData.title === '' || formData.description === '' || formData.duration === '' || errors.description || errors.title  || errors.title || loadingSubmit ? 'pointer-events-none opacity-50' : ''} bg-green-base montserrat mt-6 w-full text-[1rem] font-semibold rounded-[10px] border-0 py-2.5 px-8 text-white hover:bg-green-base/80 cursor-pointer transition-colors`}>
                            {
                                    loadingSubmit ? 'Memuat...' :
                                    `Simpan Perubahan Tipe Ujian`
                            }
                            </button>
                        </section>
                    </form>

            }
            </div>
        </DashboardLayout>
    )
}

export default EditExam