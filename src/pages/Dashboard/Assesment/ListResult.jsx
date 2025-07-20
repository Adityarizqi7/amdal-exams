import axios from 'axios';
import Swal from 'sweetalert2';
import { Select } from '@headlessui/react';
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useCallback, useEffect, useRef, useState } from "react"

import CONST from '../../../utils/Constant';
import { getToken } from '../../../utils/Auth';
import DashboardLayout from "../../../layouts/DashboardLayout"

const ListResult = () => {
    
    const inputRef = useRef()
    const [search, setSearch] = useState('')
    const [focusInput, setFocusInput] = useState(false)

    const [users, setUser] = useState([]);
    const [batch, setBatchExam] = useState([]);
    const [exam, setExam] = useState([]);
    
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingBatch, setLoadingBatch] = useState(false);
    const [loadingExam, setLoadingExam] = useState(false);
    const [loadingExportExcel, setLoadingExportExcel] = useState(false)

    const [formData, setFormData] = useState({
        exam_batch: '',
    });

    const [formDataExam, setFormDataExam] = useState({
        exam: '',
    });

    const [formDataBatchYear, setFormDataBatchYear] = useState({
        exam_batch_year: 2025
    });

    const getAllBatch = useCallback( async () => {
        setLoadingBatch(true)

        const token = await getToken();
        if(token) {
            await axios.get(`${CONST.BASE_URL_API}exam-batches/all?year=${formDataBatchYear.exam_batch_year}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
            .then((response) => {
                setLoadingBatch(false)
                const response_data = response?.data?.data
                
                setBatchExam(response_data);
            })
            .catch((error) => {
                setLoadingBatch(false)
                console.log(error)
            })
        }

    }, [formDataBatchYear.exam_batch_year])

    const getAllExam = useCallback( async () => {
        setLoadingExam(true)

        const token = await getToken();
        if(token) {
            await axios.get(`${CONST.BASE_URL_API}exams/all/without-paginate?year=${formDataBatchYear.exam_batch_year}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
            .then((response) => {
                setLoadingExam(false)
                const response_data = response?.data?.data

                setExam(response_data);
            })
            .catch((error) => {
                setLoadingExam(false)
                console.log(error)
            })
        }

    }, [formDataBatchYear.exam_batch_year])

    const getAllUser = useCallback( async (search = '') => {
        setLoadingUser(true)

        const token = await getToken();
        if(token) {
            await axios.get(`${CONST.BASE_URL_API}result-qualified?year=${formDataBatchYear.exam_batch_year}&title=${formDataExam.exam}&search=${search}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
            .then((response) => {
                setLoadingUser(false)
                const response_data = response?.data?.data
                
                setUser(response_data);
            })
            .catch((error) => {
                setLoadingUser(false)
                console.log(error)
            })
        }
    }, [formDataExam.exam, formDataBatchYear.exam_batch_year])

    const getExportRank = useCallback( async () => {

        const tanggal = new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const fileName = `Rank Seleksi Tenaga Teknis Operasional Amdalnet (${tanggal}).xlsx`;

        try {
            setLoadingExportExcel(true)
            const response = await axios.get(`${CONST.BASE_URL_API}export-result-qualified?year=${formDataBatchYear.exam_batch_year}&title=${formData.exam_batch}&search=${search}`, {
                responseType: 'blob',
            });
        
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            // setPagination({
            //     current_page: data.data.current_page,
            //     last_page: data.data.last_page,
            //     total: data.data.total,
            //     per_page: data.data.per_page,
            // });
            setLoadingExportExcel(false)
            
        } catch (error) {
            setLoadingExportExcel(false)
            console.log(error)
        }
    }, [formData.exam_batch, formDataBatchYear.exam_batch_year, search])

    // const getPaginationPages = (current, last) => {
    //     const delta = 2;
    //     const pages = [];
    //     const range = [];
    //     let l;
      
    //     for (let i = 1; i <= last; i++) {
    //       if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
    //         range.push(i);
    //       }
    //     }
      
    //     for (let i of range) {
    //       if (l) {
    //         if (i - l === 2) {
    //           pages.push(l + 1);
    //         } else if (i - l > 2) {
    //           pages.push('...');
    //         }
    //       }
    //       pages.push(i);
    //       l = i;
    //     }
      
    //     return pages;
    // };

    // const handlePageChange = (page) => {
    //     if (page < 1 || page > pagination.last_page) return;
    //     getAllUser({page});
    // };

    // const handleChange = useCallback(e => setSearch(e.target.value), [])
    const handleChange = (e) => setSearch(e.target.value)
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            getAllUser(e.target.value);
        }
    }, [getAllUser]);
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

    const handleChangeSelectBatch = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleChangeSelectExam = useCallback((e) => {
        const { name, value } = e.target;
        setFormData({
            exam_batch: ''
        })
        setFormDataExam((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleChangeSelectBatchYear = useCallback((e) => {
        const { name, value } = e.target;
        setFormDataBatchYear((prev) => ({ ...prev, [name]: value }));
        getAllBatch(value)
        getAllExam(value)
    }, [getAllBatch, getAllExam]);

    useEffect(() => {
        getAllUser()
        getAllBatch()
        getAllExam()

        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [getAllUser, handleFocusInput, getAllBatch, getAllExam])

    return (
        <DashboardLayout
            title='Perankingan - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="list-users-component px-7 pb-8">
                {
                    loadingUser ?
                    <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] font-semibold">Memuat Perankingan...</h1>
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
                                        placeholder='Cari Peserta...'
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
                            <div className='flex items-center gap-2'>
                                <button onClick={getExportRank} className='font-semibold bg-yellow-200/80 text-yellow-600 hover:bg-yellow-200 rounded-[8px] border-0 py-2 px-4 cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                                    </svg>
                                    <span>{loadingExportExcel ? 'Proses Export...' : 'Export Excel'}</span>
                                </button>
                            </div>
                        </div>
                        <div className="all-users-table mt-8 overflow-x-auto">
                            <div className="mb-6 flex items-center gap-4 w-full">
                                <div className='relative w-full'>
                                    <Select onChange={(e) => handleChangeSelectBatchYear(e)} value={formDataBatchYear.exam_batch_year} name="exam_batch_year" className={`montserrat border border-[#ccc] block w-full appearance-none rounded-lg bg-white px-3 py-[0.75rem] text-black focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 *:text-black`} aria-label="Jenis">
                                        <option value="2025">
                                            2025
                                        </option>
                                        <option value="2026">
                                            2026
                                        </option>
                                        <option value="" disabled hidden>
                                            Pilih Tahun Seleksi
                                        </option>
                                    </Select>
                                    <ChevronDownIcon
                                        className="group pointer-events-none absolute top-2.5 right-2.5 size-8 fill-black"
                                        aria-hidden="true"
                                    />
                               </div>
                                <div className='relative w-full'>
                                    <Select onChange={(e) => handleChangeSelectExam(e)} value={formDataExam.exam} name="exam" className={`${loadingExam || formDataBatchYear.exam_batch_year === '' ? 'pointer-events-none opacity-50' : ''} montserrat border border-[#ccc] block w-full appearance-none rounded-lg bg-white px-3 py-[0.75rem] text-black focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 *:text-black`} aria-label="Jenis">
                                    {
                                        exam.map((el) => {
                                            return (
                                                <option key={el?.id} value={el.title}>
                                                    {el?.title}
                                                </option>
                                            )
                                        })
                                    }
                                        <option value="" disabled hidden>
                                            {
                                                loadingExam ? 'Memuat formasi..' : 'Pilih Formasi Seleksi'
                                            }
                                        </option>
                                    </Select>
                                    <ChevronDownIcon
                                        className={`${loadingExam || formDataBatchYear.exam_batch_year === '' ? 'pointer-events-none opacity-50' : ''} group pointer-events-none absolute top-2.5 right-2.5 size-8 fill-black`}
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className='relative w-full'>
                                    <Select onChange={(e) => handleChangeSelectBatch(e)} value={formData.exam_batch} name="exam_batch" className={`${loadingBatch || formDataBatchYear.exam_batch_year === '' ? 'pointer-events-none opacity-50' : ''} montserrat border border-[#ccc] block w-full appearance-none rounded-lg bg-white px-3 py-[0.75rem] text-black focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 *:text-black`} aria-label="Jenis">
                                    {
                                        batch.map((el) => {
                                            return (
                                                <option key={el?.id} value={el.name}>
                                                    {el?.name}
                                                </option>
                                            )
                                        })
                                    }
                                        <option value="" disabled hidden>
                                            {
                                                loadingBatch ? 'Memuat sesi..' : 'Pilih Sesi Ujian'
                                            }
                                        </option>
                                    </Select>
                                    <ChevronDownIcon
                                        className={`${loadingBatch || formDataBatchYear.exam_batch_year === '' ? 'pointer-events-none opacity-50' : ''} group pointer-events-none absolute top-2.5 right-2.5 size-8 fill-black`}
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>
                            <table className="w-full text-[1.05rem] text-center border-x border-gray-200">
                                <thead className="bg-second-base/25 text-second-base/90 uppercase montserrat">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Nama
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Formasi
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Nilai
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Waktu Lama Pengerjaan
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Ranking
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="montserrat">
                                {
                                    users?.length < 1 ?
                                    (
                                        <tr className="bg-white border-b border-gray-300">
                                            <td colSpan={6} className="px-6 py-4 text-[1.25rem]">
                                                Para Peserta belum submit ujian.
                                            </td>
                                        </tr>
                                    )  
                                    :
                                    users
                                    ?.map( (e, i) => {
                                        return (
                                            <tr key={i + 1} className="bg-white border-b border-gray-300">
                                                <td className="px-6 py-4 text-left">
                                                    {e?.name}
                                                </td>
                                                <td className="px-6 py-4 text-left">
                                                    {e?.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {e?.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {e?.total_score_fix}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {e?.duration}
                                                </td>
                                                <td className="px-6 py-4 font-semibold">
                                                    { formData.exam_batch !== '' ? '-' : e?.ranking}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
{/* 
                        <div style={{ display: 'flex', gap: '4px', marginTop: '1rem' }} className='pagination flex justify-end montserrat'>
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className={`cursor-pointer ${pagination.current_page === pagination.last_page ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Prev
                            </button>

                            {getPaginationPages(pagination.current_page, pagination.last_page).map((page, index) =>
                                page === '...' ? (
                                    <span key={`ellipsis-${index}`} style={{ padding: '0 6px' }}>...</span>
                                ) : (
                                    <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    style={{
                                        fontWeight: page === pagination.current_page ? 'bold' : 'normal',
                                        cursor: 'pointer',
                                        margin: '0 4px',
                                        padding: '4px 8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        backgroundColor: page === pagination.current_page ? '#ddd' : '#fff'
                                    }}
                                    >
                                    {page}
                                    </button>
                                )
                                )}

                            <button
                                className={`cursor-pointer ${pagination.current_page === pagination.last_page ? 'pointer-events-none opacity-50' : ''}`}
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                            >
                                Next
                            </button>
                        </div> */}
                    </div>
                }
            </div>
        </DashboardLayout>
    )
}

export default ListResult