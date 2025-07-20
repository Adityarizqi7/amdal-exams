import axios from "axios";
import Swal from "sweetalert2";
import { getToken } from "../../../utils/Auth";
import { Select, Switch } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";

import CONST from "../../../utils/Constant";
import DashboardLayout from "src/layouts/DashboardLayout";

const EditUser = () => {

    const {id} = useParams()
    const navigate = useNavigate()

    const [userDetail, setUserDetail] = useState(false)
    const [loadingDetail, setLoadingDetail] = useState(false)

    const [isCorrect, setIsCorrect] = useState(false)
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user',
        is_active: false,
    });

    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const validate = (fields = formData) => {
        const newErrors = {};
        if (!fields.name) newErrors.name = 'Kolom Judul Pertanyaan harus diisi!';
        if (!fields.email) newErrors.email = 'Kolom Urutan harus diisi!';
        // if (!fields.password) {
        //     newErrors.password = 'Kolom Password harus diisi!';
        // } else if (fields.password.length < 6) {
        //     newErrors.password = 'Password minimal 6 karakter!';
        // }
        return newErrors;
    };

    const getDetail = useCallback( async () => {
        try {
            setLoadingDetail(true);

            const token = await getToken();

            if (token) {
                axios.get(`${CONST.BASE_URL_API}users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }})
                .then((response) => {
                    setLoadingDetail(false)
                    const resp = response.data.data
                    setUserDetail(response.data.data)

                    setFormData(
                        {
                            name: resp.name,
                            email: resp.email,
                            role: resp.role,
                            is_active: resp.is_active,
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(name, value)
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleIsCorrectChange = () => {
        setIsCorrect(!isCorrect)
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
            // const body = {
            //     name: formData.name,
            //     password: formData.password,
            //     email: formData.email,
            //     is_active: formData.is_active,
            //     role: formData.role,
            // }
            Swal.fire({
                title: 'Apakah kamu yakin?',
                text: "Data pengguna ini akan diubah!",
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
                    axios.put(`${CONST.BASE_URL_API}users/${userDetail.id}`, {
                        name: formData.name,
                        email: formData.email,
                        role: formData.role,
                        is_active: formData.is_active
                    }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }})
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Perubahan Pengguna berhasil disimpan!',
                            customClass: {
                            container: 'montserrat'
                            }
                        });
                        navigate('/dashboard/users')
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
            title={`Ubah ${userDetail?.name?.split(' ')[0]} - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025`}
        >
            <div className="create-question-component px-7 pb-12 montserrat">
                <NavLink to='/dashboard/users' className="go-back flex items-center gap-2 hover:opacity-80 cursor-pointer mt-[2rem]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    <span>
                        Kembali ke Daftar
                    </span>
                </NavLink>

                {
                    loadingDetail ?
                        <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] font-semibold">Memuat Pengguna...</h1>
                    :
                        <form id="form_wrapper" encType="multipart/form-data" className="form-create-question-container mt-[2.5rem]">
                            <h1 className="font-semibold text-[1.75rem] text-gray-700">Ubah Pengguna</h1>
                            <section className="form-create-question-card mt-[1.5rem]">
                                <div className="form-wrapper montserrat grid grid-cols-2 max-2xs:grid-cols-1 gap-5">
                                    <div className="form-input relative">
                                        <label className="inline-block mb-1">Nama <span className="text-red-500">*</span></label>
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
                                            placeholder="Masukkan judul pertanyaan"
                                        />
                                        {touched.name && errors.name && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.name}</div>}
                                    </div>
                                    <div className="form-input relative">
                                        <label className="inline-block mb-1">Email<span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            autoComplete='off'
                                            value={formData.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: touched.email && errors.email ? '1px solid red' : '1px solid #ccc',
                                                borderRadius: '6px',
                                                marginTop: '0.25rem',
                                            }}
                                            placeholder="Masukkan email"
                                        />
                                        {touched.email && errors.email && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.email}</div>}
                                    </div>
                                    {/* <div className="form-input relative">
                                        <div className="relative">
                                            <div className="form-input relative">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute w-5 h-5 top-[45px] left-2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                            </svg>
                                            <label className="inline-block mb-1">Password <span className="text-red-500">*</span></label>
                                            <input
                                                type='password'
                                                name="password"
                                                autoComplete='off'
                                                value={formData.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                style={{
                                                    width: '100%',
                                                    paddingLeft: '2.2rem',
                                                    paddingRight: '2.3rem',
                                                    paddingTop: '0.7rem',
                                                    paddingBottom: '0.7rem',
                                                    border: touched.password && errors.password ? '1px solid red' : '1px solid #ccc',
                                                    borderRadius: '6px',
                                                    marginTop: '0.25rem',
                                                }}
                                                placeholder="Masukkan password anda"
                                            />
                                            {touched.password && errors.password && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.password}</div>}
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="form-input relative">
                                        <label className="inline-block mb-1">Aktif<span className="text-red-500">*</span></label>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={isCorrect}
                                                onChange={handleIsCorrectChange}
                                                className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-gray-200 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-green-base data-focus:outline data-focus:outline-white"
                                                >
                                                <span
                                                    aria-hidden="true"
                                                    className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7"
                                                />
                                            </Switch>
                                            <span className="font-medium">{isCorrect ? 'Aktif' : 'Tidak Aktif'}</span>
                                        </div>
                                    </div>
                                    <div className="form-input relative">
                                        <label className="inline-block mb-1">Role<span className="text-red-500">*</span></label>
                                        <Select onChange={handleChange} value={formData.role} name="role" className="mt-[0.25rem] border border-[#ccc] block w-full appearance-none rounded-lg bg-white px-3 py-[0.75rem] text-black focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 *:text-black" aria-label="Jenis">
                                            <option value="essay" selected>User Umum</option>
                                            <option value="admin">Admin</option>
                                        </Select>
                                    </div>
                                </div>
                                <button type="button" onClick={handleSubmit} className={`${ formData.name === '' || formData.email === '' || errors.name || errors.email || loadingSubmit ? 'pointer-events-none opacity-50' : ''} bg-green-base montserrat mt-6 w-full text-[1rem] font-semibold rounded-[10px] border-0 py-2.5 px-8 text-white hover:bg-green-base/80 cursor-pointer transition-colors`}>
                                {
                                        loadingSubmit ? 'Memuat...' :
                                        `Simpan Perubahan Pengguna`
                                }
                                </button>
                            </section>
                        </form>
                }

            </div>
        </DashboardLayout>
    )
}

export default EditUser