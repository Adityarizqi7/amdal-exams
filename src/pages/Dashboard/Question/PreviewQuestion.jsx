import Swal from "sweetalert2";
import { useCallback, useEffect, useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Select } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon, PencilSquareIcon } from "@heroicons/react/16/solid";
import CommonLayout from "../../../layouts/CommonLayout"
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CONST from "../../../utils/Constant";
import { getToken } from "../../../utils/Auth";
import { Tooltip } from "react-tooltip";

const EditQuestion = () => {

    const { id } = useParams();

    const navigate = useNavigate()

    const [loadingDetail, setLoadingDetail] = useState(false)
    const [detailQuest, setDetailQuest] = useState(false)

    const [selectedExam, setSelectedExam] = useState(null);

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
                    setSelectedExam(resp.exam)
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

    useEffect(() => {
        getDetail()
    }, [getDetail]);
    
    return (
        <CommonLayout
            title='Buat Pertanyaan - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
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
                        <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] text-gray-700 font-semibold">Pertanyaan tidak ditemukan.</h1>
                    :
                    <form id="form_wrapper" encType="multipart/form-data" className="form-create-question-container mt-[2.5rem]">
                        <div className="flex items-center w-full justify-between">
                            <h1 className="font-semibold text-[1.75rem]">Tinjau Pertanyaan</h1>
                            <button onClick={() => {
                                navigate(`/dashboard/question/${detailQuest.id}/edit`)
                            }} id='edit-icon' className='cursor-pointer'>
                                <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                            </button>
                            <Tooltip anchorSelect="#edit-icon">
                                Ubah
                            </Tooltip>
                        </div>
                        <section className="form-create-question-card mt-[1.5rem]">
                            <div className="form-wrapper montserrat grid grid-cols-2 max-2xs:grid-cols-1 gap-5">
                                <div className="form-input relative">
                                    <label className="inline-block mb-3">Tipe Ujian</label>
                                    <h3 className="font-semibold">{selectedExam.title}</h3>
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Judul Pertanyaan </label>
                                    <h3 className="font-semibold">{detailQuest.question_text}</h3>
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Urutan</label>
                                    <h3 className="font-semibold">{detailQuest.order}</h3>
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Jenis</label>
                                    <h3 className="font-semibold">{detailQuest.question_type === 'choice' ? 'Pilihan Ganda' : 'Essay'}</h3>
                                </div>
                                <div className="form-input relative">
                                    <label className="inline-block mb-1">Bobot</label>
                                    <h3 className="font-semibold">{detailQuest.weight}</h3>
                                </div>
                            </div>
                            <table className="w-full mt-[2rem] text-[1.05rem] text-center text-neutral-800 border-x border-gray-200">
                                <thead className="text-white uppercase bg-green-base montserrat">
                                    <tr className="border-b border-gray-200">
                                        <th colSpan={3} className="px-6 py-4 text-[1.25rem]">
                                            OPSI JAWABAN
                                        </th>
                                    </tr>
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            No.
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Nama Jawaban
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Benar/Salah
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="montserrat">
                                {
                                    detailQuest.options?.length < 1 ?
                                    (
                                        <tr className="bg-white border-b border-gray-300">
                                            <td colSpan={3} className="px-6 py-4 text-[1.25rem]">
                                                Data jawaban masih belum ada.
                                            </td>
                                        </tr>
                                    )  
                                    :
                                    detailQuest.options
                                    ?.map( (e, i) => {
                                        return (
                                            <tr key={i + 1} className="bg-white border-b border-gray-300">
                                                <td className="px-6 py-4 font-medium">
                                                    {i + 1}.
                                                </td>
                                                <td className="px-6 py-4">
                                                    {e?.option_text}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {e?.is_correct ? 'Benar' : 'Salah'}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </section>
                    </form>
                }

            </div>
        </CommonLayout>
    )
}

export default EditQuestion