import Swal from "sweetalert2"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import CommonLayout from "../../layouts/CommonLayout";
import klh from '../../assets/images/klh-half-gray.png'
// import { authApi } from "../../store/auth/authApi";
import { getToken, setToken } from "../../utils/Auth";
import { logout, setUserDetails } from "../../store/user/userSlice";
import { useLoginMutation } from "../../store/auth/authApi";

export default function Login() {
    const userLog = useSelector(state => state.user)

    const [login] = useLoginMutation();
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    const [loading, setLoading] = useState(false)
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if(userLog?.role == 'user'){
            navigate('/quiz')
        } else if(userLog?.role == 'admin'){
            navigate('/dashboard/exams')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[formData.email,  formData.password, errors.password, errors.email,  loading, userLog])

    const validate = (fields = formData) => {
        const newErrors = {};
        if (!fields.email) newErrors.email = 'Kolom Email harus diisi!';
        if (!fields.password) newErrors.password = 'Kolom Password harus diisi!';
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

    const [passwordType, setPasswordType] = useState("password")
    const changePasswordType = () => {
        passwordType === "password" ? setPasswordType("text") : setPasswordType("password")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        setErrors(validationErrors);

        setTouched(Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {}));

        if (Object.keys(validationErrors).length === 0) {
            try {
                dispatch(logout())
                setLoading(true)
                const response = await login(formData);
    
                const { data, error } = response; // Explicitly destructure

                if (error) {
                    setLoading(false)
                    throw new Error("Email atau password salah");
                }

                setToken(data.data.access_token);
                dispatch(setUserDetails(data.data.user));

                if (await getToken()) {
                    setLoading(false);
                    let timerInterval
                    Swal.fire({
                        timer: 1000,
                        icon: 'success',
                        showConfirmButton: false,
                        title: 'Berhasil Masuk',
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
                            if (location.pathname === '/admin/signin') {
                                navigate("/dashboard/exams")
                            } else {
                                navigate("/quiz")
                                window.location.reload()
                            }
                        }
                    }) 
                    // navigate("/dashboard"); // Ensure navigation only on success
                    // window.location.href = "/dashboard"
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal Masuk',
                        text: 'Terjadi kesalahan saat proses masuk.',
                        customClass: {
                        container: 'montserrat'
                        }
                    });
                    throw new Error("Error when login");
                }
            } catch (error) {
                console.log(error)
                Swal.fire({icon: "error", title: "Gagal Login", text: error.message})
            }
        }
    };

    return (
        <CommonLayout
            title='Masuk - Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="login-component md:px-[7.5rem] px-8 md:py-[5rem] sm:py-[2rem] py-7 bg-green-base/5">
                <form id="form_wrapper" onSubmit={handleSubmit} encType="multipart/form-data" className="form-login-container mx-auto shadow-own flex md:w-[75%] rounded-[14px] bg-white">
                    <section className="image-form w-[50%] lg:inline hidden">
                        <img
                            width='auto'
                            height='auto'
                            src={klh}
                            loading='lazy'
                            alt='KLH Logo'
                            className='w-full h-full object-cover opacity-50'
                        />
                    </section>
                    <section className="form-login-card lg:w-[50%] w-full px-6 pt-[4rem] pb-[3rem] space-y-4">
                        <div className="greeting-login space-y-2">
                            <h1 className="font-bold montserrat text-[1.5rem]">Hai{location.pathname === '/admin/signin' && ' Admin'}, Selamat Datang!</h1>
                            <h4 className="font-normal montserrat text-[14px]">Silahkan masuk dengan Akun Anda.</h4>
                        </div>
                        <div className="form-wrapper montserrat space-y-5">
                            <div className="form-input relative">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute w-5 h-5 top-[45px] left-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <label className="inline-block mb-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{
                                        width: '100%',
                                        paddingLeft: '2.2rem',
                                        paddingRight: '0.5rem',
                                        paddingTop: '0.7rem',
                                        paddingBottom: '0.7rem',
                                        border: touched.email && errors.email ? '1px solid red' : '1px solid #ccc',
                                        borderRadius: '6px',
                                        marginTop: '0.25rem',
                                    }}
                                    placeholder="Masukkan email anda"
                                />
                                {touched.email && errors.email && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.email}</div>}
                            </div>

                            <div className="form-input relative">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute w-5 h-5 top-[45px] left-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                <label className="inline-block mb-1">Password <span className="text-red-500">*</span></label>
                                <input
                                    type={passwordType}
                                    name="password"
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
                                {
                                    passwordType === "password" ?
                                        <button type="button" onClick={changePasswordType} className="visibility-button outline-0 cursor-pointer absolute top-[45px] right-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>
                                        </button>
                                    :
                                        <button type="button" onClick={changePasswordType} className="visibility-button outline-0 cursor-pointer absolute top-[45px] right-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        </button>
                                }
                                {touched.password && errors.password && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '8px' }}>{errors.password}</div>}
                            </div>
                        </div>
                        <button type="submit" className={`${formData.email === '' || formData.password === '' || errors.password || errors.email || loading ? 'pointer-events-none opacity-50' : ''} bg-green-base montserrat mt-2 w-full text-[1rem] font-semibold rounded-[10px] border-0 py-2.5 px-8 text-white hover:bg-green-base/80 cursor-pointer transition-colors`}>
                           {
                                loading ? 'Memuat...' :
                                `Masuk ${location.pathname === '/admin/signin' ? ' Sebagai Admin' : ''}`
                           }
                        </button>
                    </section>
                </form>
            </div>
        </CommonLayout>
    )
}