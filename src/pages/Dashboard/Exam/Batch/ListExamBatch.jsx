import dayjs from 'dayjs'
import 'dayjs/locale/id'
import axios from 'axios';
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip'
import { NavLink } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from "react"

import CONST from '../../../../utils/Constant';
import { getToken } from '../../../../utils/Auth';
import DashboardLayout from "../../../../layouts/DashboardLayout"
import { useLazyGetBatchQuery } from '../../../../store/exam/batchApi';
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";

dayjs.locale('id')

const ListExamBatch = () => {
    
    // const navigate = useNavigate()

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const inputRef = useRef()
    const [search, setSearch] = useState('')
    const [batch, setBatch] = useState([]);
    const [getBatch] = useLazyGetBatchQuery();
    const [focusInput, setFocusInput] = useState(false)
    const [loadingBatch, setLoadingBatch] = useState(false);

    const getAllBatch = useCallback( async (searchInput) => {
        try {
            setLoadingBatch(true)

            if (typeof searchInput === 'object' && !Array.isArray(searchInput) && searchInput !== null) {
                searchInput = { search, ...searchInput }
            } else {
                searchInput = { search: searchInput, page: pagination.current_page }
            }

            const response = await getBatch(searchInput);
            const { data, error } = response;
            
            setBatch(data?.data?.data);
            setPagination({
                current_page: data.data.current_page,
                last_page: data.data.last_page,
                total: data.data.total,
                per_page: data.data.per_page,
            });

            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal mengambil data',
                    text: 'Terjadi kesalahan saat mengambil data.',
                    customClass: {
                    container: 'montserrat'
                    }
                });
                setLoadingBatch(false)
                throw new Error("Gagal Mengambil data.");
            }
            setLoadingBatch(false)
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal mengambil data',
                text: 'Terjadi kesalahan saat mengambil data.',
                customClass: {
                container: 'montserrat'
                }
            });
            setLoadingBatch(false)
            console.log(error)
        }
    }, [getBatch])

    const deleteBatch = useCallback((event, el) => {
        event.preventDefault();
      
        Swal.fire({
          title: 'Apakah kamu yakin?',
          text: "Data Sesi ini akan dihapus secara permanen!",
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
            setLoadingBatch(true);
            
            const token = await getToken();
            axios.delete(`${CONST.BASE_URL_API}exam-batches/${el.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }})
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil',
                  text: 'Sesi berhasil dihapus!',
                  customClass: {
                    container: 'montserrat'
                  }
                }).then(() => {
                    getAllBatch();
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
                setLoadingBatch(false);
              });
        }
        });
    }, [getAllBatch])

    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.last_page) return;
        getAllBatch({page});
    };

    const handleChange = (e) => setSearch(e.target.value)
    // const handleChange = useCallback(e => setSearch(e.target.value), [])
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            getAllBatch(e.target.value);
        }
    }, [getAllBatch]);
    const deleteText = useCallback(() => setSearch(''), [])

    const handleFocusInput = useCallback(
        event => {
            if ((event.ctrlKey || event.metaKey) && event.code === 'KeyK') {
                setFocusInput(true)
                event.preventDefault()
                inputRef.current.focus()
            }
            if (event.code === 'Escape') inputRef.current.blur() || deleteText()
        },
        [inputRef, deleteText]
    )

    useEffect(() => {
        getAllBatch()

        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [getAllBatch, handleFocusInput])

    return (
        <DashboardLayout
            title='Daftar Sesi - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="list-batch-component px-7 pb-8">
                {
                    loadingBatch ?
                    <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] text-gray-700 font-semibold">Memuat Sesi...</h1>
                    :
                    <div className='mt-[2rem]'>
                        <div className='flex max-xs:flex-col items-center justify-between gap-5'>
                            <div className='montserrat max-xs:w-full w-[50%]'>
                                <div className='box-search inter relative z-10'>
                                    <input
                                        type='text'
                                        name='search-people'
                                        autoComplete='off'
                                        className={`${
                                            focusInput
                                                ? 'border-b-[rgb(72, 96, 228)]'
                                                : false
                                        } text-black w-full bg-transparent pl-[10px] pr-[3.75rem] py-[0.75rem] border border-gray-500 rounded-[8px] font-normal`}
                                        placeholder='Cari Sesi...'
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        ref={inputRef}
                                        value={search}
                                    />
                                    {search !== '' && (
                                        <>
                                            <kbd
                                                onClick={deleteText}
                                                className='montserrat absolute top-[0.70rem] right-[10px] hidden cursor-pointer rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 sm:block'
                                            >
                                                Esc
                                            </kbd>
                                            <kbd
                                                onClick={deleteText}
                                                className='montserrat absolute top-[0.65rem] right-[10px] block cursor-pointer rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 sm:hidden'
                                            >
                                                Del
                                            </kbd>
                                        </>
                                    )}
                                    {
                                        <h1
                                            onClick={() => inputRef.current.focus()}
                                            className={`${
                                                search !== ''
                                                    ? 'hidden'
                                                    : 'block'
                                            } inter absolute top-[0.80rem] right-[10px] text-[14px] font-semibold text-gray-400`}
                                        >
                                            Ctrl K
                                        </h1>
                                    }
                                </div>
                            </div>
                            <div className='flex items-center gap-2 max-xs:w-full'>
                                <NavLink to='/dashboard/batch/assign' className='bg-yellow-200/80 rounded-[8px] border-0 py-2 px-4 text-yellow-600 hover:bg-yellow-200 font-semibold cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <span>Set Sesi Ujian</span>
                                </NavLink>
                                <NavLink to='/dashboard/batch/create' className='rounded-[8px] border-0 py-2 px-4 font-semibold bg-green-200/80 text-green-600 hover:bg-green-300/60 cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 fill-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>Tambah Sesi</span>
                                </NavLink>
                            </div>
                        </div>
                        <div className="all-batch-table mt-8 overflow-x-auto">
                            <table className="w-full text-[1.05rem] text-center text-neutral-800 border-x border-gray-200">
                                <thead className="bg-second-base/25 text-second-base/90 uppercase montserrat">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            No.
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Nama Sesi
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Sesi Mulai
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Sesi Berakhir
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Jumlah Peserta
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="montserrat">
                                {
                                    batch?.length < 1 ?
                                    (
                                        <tr className="bg-white border-b border-gray-300">
                                            <td colSpan={6} className="px-6 py-4 text-[1.25rem]">
                                                Data Sesi masih kosong, segera tambahkan.
                                            </td>
                                        </tr>
                                    )  
                                    :
                                    batch
                                    ?.map( (e, i) => {
                                        return (
                                            <tr key={i + 1} className="bg-white border-b border-gray-300">
                                                <td className="px-6 py-4 font-medium">
                                                    {(pagination.current_page - 1) * pagination.per_page + (i + 1)}.
                                                </td>
                                                <td className="px-6 py-4 text-left">
                                                    {e?.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {dayjs(e?.start_time).format('DD MMMM YYYY HH:mm')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {dayjs(e?.end_time).format('DD MMMM YYYY HH:mm')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {e?.max_participants} Orang
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center items-center gap-2">
                                                        {/* <button onClick={() => {
                                                            navigate(`/dashboard/batch/${e.id}/edit`)
                                                        }} id='edit-icon' className='cursor-pointer'>
                                                            <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                                        </button>
                                                        <Tooltip anchorSelect="#edit-icon">
                                                            Ubah
                                                        </Tooltip> */}

                                                        <button id='trash-icon' onClick={(el) => deleteBatch(el, e)} className="cursor-pointer">
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

                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }} className='pagination flex justify-end montserrat'>
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className={`cursor-pointer ${pagination.current_page === pagination.last_page ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Prev
                            </button>

                            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        fontWeight: page === pagination.current_page ? 'bold' : 'normal',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className={`cursor-pointer ${pagination.current_page === pagination.last_page ? 'pointer-events-none opacity-50' : ''}`}
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                }
            </div>
        </DashboardLayout>
    )
}

export default ListExamBatch