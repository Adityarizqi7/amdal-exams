import Swal from "sweetalert2";
import { useState } from "react";
import CommonLayout from "../../../layouts/CommonLayout"
import { NavLink, useNavigate } from "react-router-dom";
import { useCreateMutation } from "../../../store/exam/examApi";

const CreateExam = () => {

    const navigate = useNavigate()
    const [create] = useCreateMutation();
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        duration: '',
    });

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
            setLoadingSubmit(true)
            const response = await create(formData);

            const { error } = response;

            if (error) {
                setLoadingSubmit(false)
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal Menyimpan data',
                    text: 'Terjadi kesalahan saat menyimpan data.',
                    customClass: {
                    container: 'montserrat'
                    }
                });
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
                    navigate("/dashboard/exams")
                }
            }) 
        }
    
    }
    
    return (
        <CommonLayout
            title='Buat Tipe Ujian - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="create-exam-component md:px-[7.5rem] px-4 pb-12 montserrat">
                <NavLink to='/dashboard/exams' className="go-back flex items-center gap-2 hover:opacity-80 cursor-pointer mt-[2rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>
                        Kembali ke Daftar
                    </span>
                </NavLink>

                <form id="form_wrapper" encType="multipart/form-data" className="form-create-exam-container mt-[2.5rem]">
                    <h1 className="font-semibold text-[1.75rem] text-gray-700">Tambah Tipe Ujian / Formasi Ujian</h1>
                    <section className="form-create-exam-card mt-[1.5rem]">
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
                        <button type="button" onClick={handleSubmit} className={`${formData.title === '' || formData.description === '' || formData.duration === '' || errors.description || errors.duration  || errors.title || loadingSubmit ? 'pointer-events-none opacity-50' : ''} bg-green-base montserrat mt-6 w-full text-[1rem] font-semibold rounded-[10px] border-0 py-2.5 px-8 text-white hover:bg-green-base/80 cursor-pointer transition-colors`}>
                           {
                                loadingSubmit ? 'Memuat...' :
                                `Simpan Tipe Ujian`
                           }
                        </button>
                    </section>
                </form>
            </div>
        </CommonLayout>
    )
}

export default CreateExam