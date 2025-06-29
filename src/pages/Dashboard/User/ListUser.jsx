import axios from 'axios';
import Swal from 'sweetalert2';
import { Tooltip } from 'react-tooltip'
import { NavLink, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from "react"

import CONST from '../../../utils/Constant';
import { getToken } from '../../../utils/Auth';
import CommonLayout from "../../../layouts/CommonLayout"
import { useLazyGetUserQuery } from "../../../store/user/userApi";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import { CloseButton, Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

const ListUser = () => {
    
    const navigate = useNavigate()

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
    });

    const inputRef = useRef()
    const [search, setSearch] = useState('')
    const [focusInput, setFocusInput] = useState(false)
    const [getUser] = useLazyGetUserQuery();
    const [users, setUser] = useState([]);
    const [loadingUser, setLoadingUser] = useState(false);

    const [file, setFile] = useState(null);
    const [loadingImportExcel, setLoadingImportExcel] = useState(false)

    const handleChangeImportExcel = (e) => {
        setFile(e.target.files[0]);
    };

    let [isOpen, setIsOpenDialogSetSesi] = useState(false)
    
    function open() {
        setIsOpenDialogSetSesi(true)
    }
    function close() {
        setIsOpenDialogSetSesi(false)
    }

    const getAllUser = useCallback( async (search) => {
        try {
            setLoadingUser(true)

            const response = await getUser(search);
            const { data, error } = response;

            setUser(data?.data?.data);
            setPagination({
                current_page: data.data.current_page,
                last_page: data.data.last_page,
                total: data.data.total,
                per_page: data.data.per_page,
            });

            if (error) {
                setLoadingUser(false)
                throw new Error("Gagal Mengambail data.");
            }
            setLoadingUser(false)
            
        } catch (error) {
            setLoadingUser(false)
            console.log(error)
        }
    }, [getUser])

    const deleteUser = useCallback((event, el) => {
        event.preventDefault();
      
        Swal.fire({
          title: 'Apakah kamu yakin?',
          text: "Data Pengguna ini akan dihapus secara permanen!",
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
            setLoadingUser(true);
            
            const token = await getToken();
            axios.delete(`${CONST.BASE_URL_API}users/${el.id}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }})
              .then(() => {
                Swal.fire({
                  icon: 'success',
                  title: 'Berhasil',
                  text: 'Penggua berhasil dihapus!',
                  customClass: {
                    container: 'montserrat'
                  }
                }).then(() => {
                    getAllUser();
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
                setLoadingUser(false);
              });
        }
        });
    }, [getAllUser])

    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.last_page) return;
        getAllUser(page);
    };

    const handleChange = useCallback(e => setSearch(e.target.value), [])
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

    const importDocumentExcel = async () => {

        if (!file) return alert('Pilih file Excel terlebih dahulu');
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            setLoadingImportExcel(true)

            const token = await getToken()

            if(token) {
                const response = await axios.post(`${CONST.BASE_URL_API}users/import`, formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    },
                });
                if (response) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil',
                        text: 'Berhasil Import Dokumen!',
                        customClass: {
                            container: 'montserrat'
                        }
                    })
                    setLoadingImportExcel(false)
                }
            }
          
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Gagal Mengimpor',
                text: 'Terjadi kesalahan saat mengimpor.',
                customClass: {
                container: 'montserrat'
                }
            });
            setLoadingImportExcel(false)
        }
    };

    useEffect(() => {
        getAllUser()

        document.addEventListener('keydown', handleFocusInput)

        return () => {
            document.removeEventListener('keydown', handleFocusInput)
        }
    }, [getAllUser, handleFocusInput])

    

    return (
        <CommonLayout
            title='Daftar Pengguna - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="list-users-component lg:px-[7.5rem] px-4 pb-8">
                {
                    loadingUser ?
                    <h1 className="montserrat mt-[2rem] text-center text-[1.25rem] font-semibold">Memuat Pengguna...</h1>
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
                                        placeholder='Cari Pengguna...'
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
                                <button onClick={open} className='bg-green-base rounded-[8px] border-0 py-2 px-4 text-white hover:bg-green-base/80 cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m-6 3.75 3 3m0 0 3-3m-3 3V1.5m6 9h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                                    </svg>
                                    <span>Import Excel</span>
                                </button>
                                <NavLink to='/dashboard/user/create' className='bg-green-base rounded-[8px] border-0 py-2 px-4 text-white hover:bg-green-base/80 cursor-pointer flex items-center max-xs:w-full w-max montserrat gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 fill-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span>Tambah Pengguna</span>
                                </NavLink>
                            </div>
                        </div>
                        <div className="all-users-table mt-8 overflow-x-auto">
                            <table className="w-full text-[1.05rem] text-center text-neutral-800 border-x border-gray-200">
                                <thead className="text-white uppercase bg-green-base montserrat">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            No.
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Nama
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Role
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Aktif
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="montserrat">
                                {
                                    users?.length < 1 ?
                                    (
                                        <tr className="bg-white border-b border-gray-300">
                                            <td colSpan={6} className="px-6 py-4 text-[1.25rem]">
                                                Data Pengguna masih kosong, segera tambahkan.
                                            </td>
                                        </tr>
                                    )  
                                    :
                                    users
                                    ?.map( (e, i) => {
                                        return (
                                            <tr key={i + 1} className="bg-white border-b border-gray-300">
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
                                                    {e?.role === 'admin' ? 'Admin' : 'Peserta'}
                                                </td>
                                                <td className="px-6 py-4 ">
                                                    {e.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center items-center gap-2">
                                                        <button onClick={() => {
                                                            navigate(`/dashboard/user/${e.id}/edit`)
                                                        }} id='edit-icon' className='cursor-pointer'>
                                                            <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                                                        </button>
                                                        <Tooltip anchorSelect="#edit-icon">
                                                            Ubah
                                                        </Tooltip>

                                                        <button id='trash-icon' onClick={(el) => deleteUser(el, e)} className="cursor-pointer">
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

                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }} className='pagination flex justify-end'>
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

                        <Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={close}>
                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/40">
                                <form method='i' className="flex min-h-full items-center justify-center p-4 montserrat">
                                    <DialogPanel
                                    transition
                                    className="w-full max-w-lg rounded-xl bg-white p-6 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-own"
                                    >
                                    <DialogTitle as="h3" className="text-lg/7 font-medium text-gray-800">
                                        Pemberitahuan Import Excel
                                    </DialogTitle>
                                    <p className="mt-2 text-md/6 text-gray-500 space-y-3">
                                        <h3>Silahkan masukkan file</h3>
                                        <input
                                            type="file"
                                            name="question_text"
                                            onChange={handleChangeImportExcel}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid #ccc',
                                                borderRadius: '6px',
                                                marginTop: '0.25rem',
                                            }}
                                            placeholder="Masukkan judul pertanyaan"
                                            accept=".xlsx,.xls" 
                                        />
                                    </p>
                                    <div className="mt-4 space-x-4">
                                        <Button
                                            className={`${loadingImportExcel || file === '' ? 'pointer-events-none opacity-50' : ''} inline-flex items-center gap-2 rounded-md bg-green-base px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-green-700 data-open:bg-green-700 cursor-pointer`}
                                            onClick={importDocumentExcel}
                                        >
                                            Simpan
                                        </Button>
                                        <CloseButton onClick={onclose} className={`${loadingImportExcel ? 'pointer-events-none opacity-50' : ''} inline-flex items-center gap-2 rounded-md bg-red-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-red-600 data-open:bg-red-600 cursor-pointer`}>Batal Simpan</CloseButton>
                                    </div>
                                    </DialogPanel>
                                </form>
                            </div>
                        </Dialog>
                    </div>
                }
            </div>
        </CommonLayout>
    )
}

export default ListUser