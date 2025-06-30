import dayjs from 'dayjs'
import 'dayjs/locale/id'
// import axios from 'axios';
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip'
import { NavLink, useLocation } from 'react-router-dom';
import { Select, CloseButton, Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useCallback, useEffect, useRef, useState } from "react"

import CONST from '../../../../utils/Constant';
import { getToken } from '../../../../utils/Auth';
// import { getToken } from '../../../../utils/Auth';
import CommonLayout from "../../../../layouts/CommonLayout"
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useLazyGetAllQuery } from '../../../../store/exam/batchApi';
import { useLazyGetUserForAssignBatchQuery } from '../../../../store/exam/examApi';
import axios from 'axios';

dayjs.locale('id')

const SetBatch = () => {
    
    // const navigate = useNavigate()

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });
    const location = useLocation()

    const inputRef = useRef()
    const [search, setSearch] = useState('')
    const [user, setUser] = useState([]);
    const [batch, setBatchExam] = useState([]);
    const [getUser] = useLazyGetUserForAssignBatchQuery();
    const [getBatch] = useLazyGetAllQuery();
    const [, setFocusInput] = useState(false)
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingBatch, setLoadingBatch] = useState(false);

    const [selectedRows, setSelectedRows] = useState([])
    const [loadingSetSession, setLoadingSetSession] = useState(false)

    const [formData, setFormData] = useState({
        exam_batch: ''
    });

    let [isOpen, setIsOpenDialogSetSesi] = useState(false)

    function open() {
        setIsOpenDialogSetSesi(true)
    }

    function close() {
        setIsOpenDialogSetSesi(false)
    }

    const handleChangeSelectBatch = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // getAllUserNotSubmitted(value, '')
    };

    const toggleRowSet = (id) => {
        setSelectedRows((prev) => {
            const exists = prev.includes(id)
            const updated = exists ? prev.filter((item) => item !== id) : [...prev, id]
            // console.log('Updated selectedRows:', updated) // LOG DI SINI setelah update
            return updated
        })
    }

    const getAllBatch = useCallback( async () => {
        try {
            setLoadingBatch(true)

            const response = await getBatch();
            const { data, error } = response;
            
            setBatchExam(data?.data);
            // setPagination({
            //     current_page: data.data.current_page,
            //     last_page: data.data.last_page,
            //     total: data.data.total,
            //     per_page: data.data.per_page,
            // });

            if (error) {
                setLoadingBatch(false)
                throw new Error("Gagal Mengambail data.");
            }
            setLoadingBatch(false)
            
        } catch (error) {
            setLoadingBatch(false)
            console.log(error)
        }
    }, [getBatch])

    const getAllUserNotSubmitted = useCallback( async (search) => {
        try {
            setLoadingUser(true)

            const response = await getUser(search);
            const { data, error } = response;

            
            if (error) {
                setLoadingUser(false)
                throw new Error("Gagal Mengambail data.");
            }
            setUser(data?.data?.data);
            setPagination({
                current_page: data.data.current_page,
                last_page: data.data.last_page,
                total: data.data.total,
                per_page: data.data.per_page,
            });
            setSelectedRows([])
            setLoadingUser(false)
            
        } catch (error) {
            setLoadingUser(false)
            console.log(error)
        }
    }, [getUser])

    const handleChange = useCallback(e => {
        setSearch(e.target.value)
        // console.log(e.target.value)   
    }, [])
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // getAllUserNotSubmitted(formData.exam_batch, e.target.value);
        }
    }, []);
    const deleteText = useCallback(() => setSearch(''), [])

    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.last_page) return;
        getAllUserNotSubmitted(page);
    };

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

    const setBatchToUser = () => {
        if (selectedRows.length === user.length) {
          setSelectedRows([]);
        } else {
          const allIds = user.map((user) => user.id);
          setSelectedRows(allIds);
        }
    };

    const saveSetBatch = useCallback((event, el) => {
        event.preventDefault();
        
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: "Set Sesi Ujian Untuk Peserta akan disimpan secara permanen!",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Simpan!',
            cancelButtonText: 'Batal',
            customClass: {
            container: 'montserrat'
            }
        }).then( async (result) => {
            if (result.isConfirmed) {
                setLoadingSetSession(true);
            
                const token = await getToken();
                if(token) {
                    const body = {
                        user_ids: selectedRows
                    }
                
                    axios.post(`${CONST.BASE_URL_API}exam-batches/${el}/assign-users/`, body ,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }})
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil',
                            text: 'Set Sesi Ujian berhasil Disimpan!',
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
                            title: 'Gagal Simpan',
                            text: 'Terjadi kesalahan saat simpan data.',
                            customClass: {
                            container: 'montserrat'
                            }
                        });
                    })
                    .finally(() => {
                        setLoadingSetSession(false);
                    });
                }
            }
        });
    }, [getAllBatch, selectedRows])

    useEffect(() => {
        getAllBatch()
        getAllUserNotSubmitted()

        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [handleFocusInput, getAllBatch, getAllUserNotSubmitted])

    return (
        <CommonLayout
            title='Set Sesi Ujian - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="list-batch-component lg:px-[7.5rem] px-4 pb-8">
                <div className='mt-[2rem]'>
                    <div className='flex sm:flex-row flex-col items-center justify-between gap-5'>
                        {
                            user?.length > 0 ?
                            <div className='flex items-center gap-2'>
                                <button onClick={setBatchToUser} type='button' className='bg-black/80 rounded-[8px] border-0 py-2 px-4 text-white hover:bg-black cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                                </svg>
                                <span>
                                {
                                    selectedRows.length === user.length ?
                                        'Batal Set Semua Peserta'
                                    :
                                        'Set Semua Peserta'
                                }
                                </span>
                                </button>
                                <button onClick={open} type='button' className={`${selectedRows?.length < 1 || loadingSetSession ? 'pointer-events-none opacity-50' : ''} bg-black/80 rounded-[8px] border-0 py-2 px-4 text-white hover:bg-black cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000000" className="size-6 fill-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                        </svg>
                                        <span>
                                            Simpan Set Sesi Ujian
                                        </span>
                                </button>
                            </div>
                            : false
                        }
                        <div className='flex items-center gap-2 max-xs:w-full'>
                            <NavLink to='/dashboard/batch/create' className='font-semibold bg-green-200/80 text-green-600 hover:bg-green-300/60 rounded-[8px] border-0 py-2 px-4 cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 fill-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span>Tambah Sesi</span>
                            </NavLink>

                            {
                                location.pathname !== '/dashboard/batch/assign' &&
                                <NavLink to='/dashboard/batch/assign' className='bg-green-base rounded-[8px] border-0 py-2 px-4 text-white hover:bg-green-base/80 cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 fill-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>Set Sesi Ujian</span>
                                </NavLink>
                            }
                        </div>
                    </div>
                    <div className="all-batch-table mt-5 overflow-x-auto">
                    {
                        user?.length > 0 ?
                        <div className='montserrat max-xs:w-full w-[50%] mt-2'>
                        <div className='box-search inter relative z-10'>
                            <input
                                type='text'
                                name='search-people'
                                autoComplete='off'
                                className={`text-black w-full bg-transparent pl-[10px] pr-[3.75rem] py-[0.75rem] border border-gray-500 rounded-[8px] font-normal`}
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
                        :false
                    }
                        <div className=''>
                            {/* <button onClick={setBatchToUser} type='button' className='bg-green-base rounded-[8px] border-0 py-2 px-4 text-white hover:bg-green-base/80 cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2 mb-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#000000" className="size-6 fill-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
                                </svg>
                                <span>Set Ke Semua Peserta</span>
                            </button> */}
                            <div className="relative mb-4 mt-5">
                                <Select onChange={handleChangeSelectBatch} value={formData.exam_batch} name="exam_batch" className={`${loadingBatch ? 'pointer-events-none opacity-50' : ''} montserrat border border-[#ccc] block w-full appearance-none rounded-lg bg-white px-3 py-[0.75rem] text-black focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 *:text-black`} aria-label="Jenis">
                                {
                                    batch.map((el) => {
                                        return (
                                            <option key={el?.id} value={el.id}>
                                                {el?.name}
                                            </option>
                                        )
                                    })
                                }
                                    <option value="" disabled hidden>
                                        {
                                            loadingBatch ? 'Memuat batch..' : 'Pilih Exam Batch'
                                        }
                                    </option>
                                </Select>
                                <ChevronDownIcon
                                    className="group pointer-events-none absolute top-2.5 right-2.5 size-8 fill-black"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    {
                        loadingUser ?
                            <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] text-gray-700 font-semibold">Memuat peserta...</h1>
                        :
                            <table className="w-full text-[1.05rem] text-center text-neutral-800 border-x border-gray-200">
                                <thead className="bg-second-base/25 text-second-base/90 uppercase montserrat">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Set
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            No.
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Nama Peserta
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Status Ujian
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="montserrat">
                                {
                                    user?.length < 1 ?
                                    (
                                        <tr className="bg-white border-b border-gray-300">
                                            <td colSpan={5} className="px-6 py-4 text-[1.25rem]">
                                                Tidak ada peserta.
                                            </td>
                                        </tr>
                                    )  
                                    :
                                    user
                                        ?.filter(value => {
                                        if (search === '') return value
                                        if (
                                            value.name
                                                ?.toLowerCase()
                                                .includes(
                                                    search
                                                        ?.toLowerCase()
                                                        .trim()
                                                )
                                        || value.email
                                                ?.toLowerCase()
                                                .includes(
                                                    search
                                                        ?.toLowerCase()
                                                        .trim()
                                                )
                                        ) {
                                            return value
                                        }
                                    })
                                    ?.map( (e, i) => {
                                        return (
                                            <tr key={i + 1} className="bg-white border-b border-gray-300">
                                                <td className="px-6 py-4 font-medium">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.includes(e.id)}
                                                        onChange={() => toggleRowSet(e.id)}
                                                        className="w-4 h-4 text-blue-600 cursor-pointer rounded focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {i + 1}.
                                                </td>
                                                <td className="px-6 py-4 text-left">
                                                    {e?.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {e?.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                {
                                                    !e.submitted_at &&
                                                        <div className='tag bg-gray-300/80 text-gray-700 p-2 text-sm w-max rounded-[10px] font-medium'>
                                                            Belum Submit Ujian
                                                        </div>
                                                }
                                                </td>
                                                {/* <td className="px-6 py-4">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button onClick={() => {
                                                            navigate(`/dashboard/batch/${e.id}/edit`)
                                                        }} id='edit-icon' className='cursor-pointer'>
                                                            <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                                        </button>
                                                        <Tooltip anchorSelect="#edit-icon">
                                                            Ubah
                                                        </Tooltip>
                                                    </div>
                                                </td> */}
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>
                    }
                    </div>

                    <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/40">
                        <div className="flex min-h-full items-center justify-center p-4 montserrat">
                            <DialogPanel
                            transition
                            className="w-full max-w-lg rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-own"
                            >
                            <DialogTitle as="h3" className="text-lg/7 font-medium text-gray-800">
                                Pemberitahuan Set Sesi Ujian
                            </DialogTitle>
                            <p className="mt-2 text-md/6 text-gray-500">
                                <h3 className='text-[]'>Total User yang akan di Set: <span className='font-semibold'> {user?.length} Peserta</span></h3>
                            </p>
                            <div className="mt-4 space-x-4">
                                <Button
                                    className={`${selectedRows?.length < 1 || loadingSetSession ? 'pointer-events-none opacity-50' : ''} inline-flex items-center gap-2 rounded-md bg-green-base px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-700 data-open:bg-green-700 cursor-pointer`}
                                    onClick={saveSetBatch}
                                >
                                 Simpan
                                </Button>
                                <CloseButton onClick={onclose} className={`${selectedRows?.length < 1 || loadingSetSession ? 'pointer-events-none opacity-50' : ''} inline-flex items-center gap-2 rounded-md bg-red-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-red-600 data-open:bg-red-600 cursor-pointer`}>Batal Simpan</CloseButton>
                            </div>
                            </DialogPanel>
                        </div>
                        </div>
                    </Dialog>

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
            </div>
        </CommonLayout>
    )
}

export default SetBatch