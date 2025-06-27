import axios from 'axios';
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip'
import { NavLink, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from "react"

import CONST from '../../../utils/Constant';
import { getToken } from '../../../utils/Auth';
import CommonLayout from "../../../layouts/CommonLayout"
import { useLazyGetExamQuery } from "../../../store/exam/examApi";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";

const ListQuestion = () => {
    
    const navigate = useNavigate()

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const [all] = useLazyGetExamQuery();
    const [exams, setExams] = useState([]);
    const [loadingExam, setLoadingExam] = useState(false);

    const getAllExam = useCallback( async () => {
        try {
            setLoadingExam(true)

            const response = await all();
            const { data, error } = response;

            setExams(data?.data?.data);
            setPagination({
                current_page: data.data.current_page,
                last_page: data.data.last_page,
                total: data.data.total,
                per_page: data.data.per_page,
            });

            if (error) {
                setLoadingExam(false)
                throw new Error("Gagal Mengambail data.");
            }
            setLoadingExam(false)
            
        } catch (error) {
            setLoadingExam(false)
            console.log(error)
        }
    }, [all])

    const deleteExam = useCallback((event, el) => {
        event.preventDefault();
      
        Swal.fire({
          title: 'Apakah kamu yakin?',
          text: "Data tipe ujian ini akan dihapus secara permanen!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal',
          customClass: {
            container: 'montserrat'
          }
        }).then( async (result) => {
          if (result.isConfirmed) {
            setLoadingExam(true);
            
            const token = await getToken();
            axios.delete(`${CONST.BASE_URL_API}exams/${el.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }})
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil',
                  text: 'Tipe Ujian berhasil dihapus!',
                  customClass: {
                    container: 'montserrat'
                  }
                }).then(() => {
                    getAllExam();
                })
                
              })
              .catch((error) => {
                console.error(error);
                Swal.fire({
                  icon: 'error',
                  title: 'Gagal Menghapus',
                  text: 'Terjadi kesalahan saat menghapus data.',
                  customClass: {
                    container: 'montserrat'
                  }
                });
              })
              .finally(() => {
                setLoadingExam(false);
              });
        }
        });
    }, [getAllExam])

    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.last_page) return;
        getAllExam(page);
    };

    useEffect(() => {
        getAllExam()
    }, [getAllExam])

    return (
        <CommonLayout
            title='Daftar Tipe Ujian - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="list-exams-component md:px-[7.5rem] px-4 pb-8">
                {
                    loadingExam ?
                    <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] font-semibold">Memuat Tipe Ujian...</h1>
                    :
                    <div className='mt-[2rem]'>
                        <NavLink to='/dashboard/exam/create' className='bg-green-base rounded-[8px] border-0 py-2 px-4 text-white hover:bg-green-base/80 cursor-pointer flex items-center w-max montserrat gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 fill-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <span>Tambah Tipe Ujian</span>
                        </NavLink>
                        <div className="all-exams-table mt-8 overflow-x-auto">
                            <table className="w-full text-[1.05rem] text-center text-neutral-800 border-x border-gray-200">
                                <thead className="text-white uppercase bg-green-base montserrat">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            No.
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Nama Tipe Ujian
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Durasi
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Deskripsi
                                        </th>
                                        {/* <th scope="col" className="px-6 py-3">
                                            Jumlah Pertanyaan
                                        </th> */}
                                        <th scope="col" className="px-6 py-3">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="montserrat">
                                {
                                    exams?.length < 1 ?
                                    (
                                        <tr className="bg-white border-b border-gray-300">
                                            <td colSpan={6} className="px-6 py-4 text-[1.25rem]">
                                                Data Tipe Ujian masih kosong, segera tambahkan.
                                            </td>
                                        </tr>
                                    )  
                                    :
                                    exams
                                    ?.map( (e, i) => {
                                        return (
                                            <tr key={i + 1} className="bg-white border-b border-gray-300">
                                                <td className="px-6 py-4 font-medium">
                                                    {i + 1}.
                                                </td>
                                                <td className="px-6 py-4">
                                                    {e?.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {e?.duration} Menit
                                                </td>
                                                <td className="px-6 py-4">
                                                    {e?.description}
                                                </td>
                                                {/* <td className="px-6 py-4 ">
                                                    {e?.questions_count}
                                                </td> */}
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button onClick={() => {
                                                            navigate(`/dashboard/exam/${e.id}`)
                                                        }} id='edit-icon' className='cursor-pointer'>
                                                            <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                                        </button>
                                                        <Tooltip anchorSelect="#edit-icon">
                                                            Ubah
                                                        </Tooltip>

                                                        <button id='trash-icon' onClick={(el) => deleteExam(el, e)} className="cursor-pointer">
                                                            <TrashIcon className="w-5 h-5 text-red-500" />
                                                        </button>
                                                        <Tooltip anchorSelect="#trash-icon">
                                                            Hapus
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>

                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }} className='pagination'>
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className='cursor-pointer'
                            >
                                Prev
                            </button>

                            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        fontWeight: page === pagination.current_page ? 'bold' : 'normal',
                                    }}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className='cursor-pointer'
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                }
            </div>
        </CommonLayout>
    )
}

export default ListQuestion