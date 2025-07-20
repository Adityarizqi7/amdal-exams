import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Select, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import CONST from '../../utils/Constant';
import { getToken } from '../../utils/Auth';
import formatAngka from "../../utils/number";
import DashboardLayout from "../../layouts/DashboardLayout"
import dayjs from "dayjs";


const Dashboard = () => {

    const [exam, setExam] = useState([]);
    const [topUser, setTopUser] = useState([]);
    const [highlight, setHighlight] = useState([]);
    const [batchHighlight, setBatchHighlight] = useState([]);

    const [loadingExam, setLoadingExam] = useState(false);
    const [loadingTopUser, setLoadingTopUser] = useState(false);
    const [loadingHighlight, setLoadingHighlight] = useState(false);
    const [loadingBatchHighlight, setLoadingBatchHighligh] = useState(false);

    const [formDataExam, setFormDataExam] = useState({
        exam: ''
    });

    const getHighlight = useCallback( async () => {
        setLoadingHighlight(true)

        const token = await getToken();
        if(token) {

            await axios.get(`${CONST.BASE_URL_API}dashboard-highlight`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
            .then((response) => {
                setLoadingHighlight(false)
                const response_data = response?.data?.data?.highlight
                
                setHighlight(response_data);
            })
            .catch((error) => {
                setLoadingHighlight(false)
                console.log(error)
            })
        }

    }, [])

    const getTopParticipant = useCallback( async (exam_param) => {
        setLoadingTopUser(true)

        const token = await getToken();
        if(token) {
            await axios.get(`${CONST.BASE_URL_API}top-score?year=${2025}&title=${formDataExam.exam || exam_param}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
            .then((response) => {
                setLoadingTopUser(false)
                const response_data = response?.data?.data
                
                setTopUser(response_data);
            })
            .catch((error) => {
                setLoadingTopUser(false)
                console.log(error)
            })
        }
    }, [formDataExam.exam])

    const getBatchHighlight = useCallback( async () => {
        setLoadingBatchHighligh(true)

        const token = await getToken();
        if(token) {
            await axios.get(`${CONST.BASE_URL_API}batch-highlight?year=${2025}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
            .then((response) => {
                setLoadingBatchHighligh(false)
                const response_data = response?.data?.data

                setBatchHighlight(response_data);
            })
            .catch((error) => {
                setLoadingBatchHighligh(false)
                console.log(error)
            })
        }
    }, [formDataExam.exam])

    const getAllExam = useCallback( async () => {
        setLoadingExam(true)

        const token = await getToken();
        if(token) {
            await axios.get(`${CONST.BASE_URL_API}exams/all/without-paginate?year=${2025}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }})
            .then((response) => {
                setLoadingExam(false)
                const response_data = response?.data?.data

                if(response_data?.length > 0) {
                    if(formDataExam.exam === '') {
                        setFormDataExam({
                            exam: response_data?.[0]?.title
                        })
                    }
                    getTopParticipant()
                    setExam(response_data);
                }
            })
            .catch((error) => {
                setLoadingExam(false)
                console.log(error)
            })
        }
    }, [getTopParticipant])

    const handleChangeSelectExam = useCallback((e) => {
        const { name, value } = e.target;
        setFormDataExam((prev) => ({ ...prev, [name]: value }));
        getTopParticipant()
    }, [getTopParticipant]);

    useEffect(() => {
        getHighlight()
        getAllExam()
        getBatchHighlight()
    }, [getHighlight, getAllExam, getBatchHighlight])

    return (
        <DashboardLayout
            title='Welcome to Dashboard - Admin Dashobard Seleksi Tenaga Teknis Operasional Amdalnet 2025'
        >
            <div className="dashboard-component px-7 pb-8 pt-8">
                <div className="highlight-total-wrapper grid grid-cols-3 gap-5">
                    <div className="card-highlight rounded-[12px] p-4 bg-second-base/70 space-y-2">
                        <div className="card-above flex justify-between gap-3">
                            <div className="title-count-card space-y-1">
                                <h3 className="text-gray-100 font-medium">Akun Peserta 2025</h3>
                                <h1 className="font-bold text-white text-[1.25rem]">
                                {
                                    loadingHighlight ? 'memuat...' : formatAngka(highlight.total_users) + ' Peserta'
                                }
                                </h1>
                            </div>
                            <div className="box-icon p-2 rounded-full h-max bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-second-base" width={19} viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M3 10.417c0-3.198 0-4.797.378-5.335c.377-.537 1.88-1.052 4.887-2.081l.573-.196C10.405 2.268 11.188 2 12 2s1.595.268 3.162.805l.573.196c3.007 1.029 4.51 1.544 4.887 2.081C21 5.62 21 7.22 21 10.417v1.574c0 5.638-4.239 8.375-6.899 9.536C13.38 21.842 13.02 22 12 22s-1.38-.158-2.101-.473C7.239 20.365 3 17.63 3 11.991zM14 9a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-2 8c4 0 4-.895 4-2s-1.79-2-4-2s-4 .895-4 2s0 2 4 2" clipRule="evenodd"></path></svg>
                            </div>
                        </div>  
                    </div>
                    <div className="card-highlight rounded-[12px] p-4 bg-orange-600/70 space-y-2">
                        <div className="card-above flex justify-between gap-3">
                            <div className="title-count-card space-y-1">
                                <h3 className="text-gray-100 font-medium">Mengikuti Ujian Seleksi 2025</h3>
                                <h1 className="font-bold text-white text-[1.25rem]">
                                {
                                    loadingHighlight ? 'memuat...' : formatAngka(highlight.total_exam_participants_2025) + ' Peserta'
                                }
                                </h1>
                            </div>
                            <div className="box-icon p-2 rounded-full h-max bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-orange-500" width={19} viewBox="0 0 24 24"><path fill="currentColor" d="M16 6a4 4 0 1 1-8 0a4 4 0 0 1 8 0"></path><path fill="currentColor" fillRule="evenodd" d="M16.5 22c-1.65 0-2.475 0-2.987-.513C13 20.975 13 20.15 13 18.5s0-2.475.513-2.987C14.025 15 14.85 15 16.5 15s2.475 0 2.987.513C20 16.025 20 16.85 20 18.5s0 2.475-.513 2.987C18.975 22 18.15 22 16.5 22m1.968-4.254a.583.583 0 1 0-.825-.825l-1.92 1.92l-.366-.365a.583.583 0 1 0-.825.825l.778.778a.583.583 0 0 0 .825 0z" clipRule="evenodd"></path><path fill="currentColor" d="M14.477 21.92c-.726.053-1.547.08-2.477.08c-8 0-8-2.015-8-4.5S7.582 13 12 13c2.88 0 5.406.856 6.814 2.141C18.298 15 17.574 15 16.5 15c-1.65 0-2.475 0-2.987.513C13 16.025 13 16.85 13 18.5s0 2.475.513 2.987c.237.238.542.365.964.434" opacity={0.5}></path></svg>
                            </div>
                        </div>  
                    </div>
                    <div className="card-highlight rounded-[12px] p-4 bg-green-500/70 space-y-2">
                        <div className="card-above flex justify-between gap-3">
                            <div className="title-count-card space-y-1">
                                <h3 className="text-gray-100 font-medium">Formasi Seleksi 2025</h3>
                                <h1 className="font-bold text-white text-[1.25rem]">
                                {
                                    loadingHighlight ? 'memuat...' : formatAngka(highlight.total_exam_2025) + ' Formasi Ujian'
                                }
                                </h1>
                            </div>
                            <div className="box-icon p-2 rounded-full h-max bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="text-green-500" width={19} viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z" opacity={0.5}></path>
                                    <path fill="currentColor" d="M16.519 16.501c.175-.136.334-.295.651-.612l3.957-3.958c.096-.095.052-.26-.075-.305a4.3 4.3 0 0 1-1.644-1.034a4.3 4.3 0 0 1-1.034-1.644c-.045-.127-.21-.171-.305-.075L14.11 12.83c-.317.317-.476.476-.612.651q-.243.311-.412.666c-.095.2-.166.414-.308.84l-.184.55l-.292.875l-.273.82a.584.584 0 0 0 .738.738l.82-.273l.875-.292l.55-.184c.426-.142.64-.212.84-.308q.355-.17.666-.412m5.849-5.809a2.163 2.163 0 1 0-3.06-3.059l-.126.128a.52.52 0 0 0-.148.465c.02.107.055.265.12.452c.13.375.376.867.839 1.33s.955.709 1.33.839c.188.065.345.1.452.12a.53.53 0 0 0 .465-.148z"></path>
                                    <path fill="currentColor" fillRule="evenodd" d="M7.25 9A.75.75 0 0 1 8 8.25h6.5a.75.75 0 0 1 0 1.5H8A.75.75 0 0 1 7.25 9m0 4a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75m0 4a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75" clipRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>  
                    </div>
                </div>
                <div className="year-tab mt-10">
                    <TabGroup>
                        <TabList className="flex w-full">
                            <Tab
                                key={2025}
                                className="w-full pb-2 text-[1.15rem] border-b border-gray-400/40 font-semibold text-gray-500 cursor-pointer outline-none data-selected:border-b data-selected:border-gray-500/70
                                 data-selected:text-gray-700"
                            >
                                Periode Seleksi 2025
                            </Tab>
                            <Tab
                                disabled
                                key={2026}
                                className="w-full pb-2 text-[1.15rem] border-b border-gray-400/40 font-semibold text-gray-500 cursor-pointer outline-none data-selected:border-b data-selected:border-gray-500/70
                                 data-selected:text-gray-700"
                            >
                                Periode Seleksi 2026
                            </Tab>
                        </TabList>
                        <TabPanels className="mt-3">
                            <TabPanel key={2025} className="rounded-xl bg-white/5 mt-6">
                                <div className="highlight-total-wrapper grid grid-cols-2 gap-8">
                                    <div className="card-highlight rounded-[12px] p-4 border border-gray-500/40 space-y-2">
                                        <div className="card-detail">
                                            <div className="title-card space-y-1">
                                                <h3 className="text-gray-800 text-[1.075rem] font-semibold">Formasi Seleksi</h3>
                                            </div>
                                            <div className="item-card mt-3 max-h-[20rem] overflow-y-auto">
                                                <table className="w-full">
                                                    <thead className="montserrat text-[14px] text-gray-700/80 border-b border-gray-200 text-left sticky top-0 bg-white">
                                                        <tr>
                                                            <th scope="col" className="pb-2 pr-1 font-normal">
                                                                Nama Formasi
                                                            </th>
                                                            <th scope="col" className="pb-2 font-normal">
                                                                Jumlah Peserta
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="montserrat text-[16px] text-gray-800">
                                                        {
                                                            loadingHighlight ? 
                                                                <tr className="border-b border-gray-300/70">
                                                                    <td colSpan={2} className="py-2 pr-1 text-center leading-normal">
                                                                        Memuat...
                                                                    </td>
                                                                </tr>
                                                            :
                                                            highlight?.grouping_exam_count_2025?.map((element) => {
                                                                return (
                                                                    <tr className="border-b border-gray-300/70">
                                                                        <td className="py-2 pr-1 text-left leading-normal">
                                                                            {element?.label}
                                                                        </td>
                                                                        <td className="py-2 text-center font-medium">
                                                                            {element?.count}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>  
                                    </div>
                                    <div className="card-highlight rounded-[12px] p-4 border border-gray-500/40 space-y-2">
                                        <div className="card-detail">
                                            <div className="title-card space-y-1">
                                                <h3 className="text-gray-800 text-[1.075rem] font-semibold">Sesi Ujian Terbaru</h3>
                                            </div>
                                            <div className="item-card mt-3 max-h-[20rem] overflow-y-auto">
                                                <table className="w-full">
                                                    <thead className="montserrat text-[14px] text-gray-700/80 border-b border-gray-200 text-left sticky top-0 bg-white">
                                                        <tr>
                                                            <th scope="col" className="pb-2 pr-1 font-normal">
                                                                Nama Sesi
                                                            </th>
                                                            <th scope="col" className="pb-2 font-normal">
                                                                Waktu
                                                            </th>
                                                            <th scope="col" className="pb-2 font-normal">
                                                                Status
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="montserrat text-[16px] text-gray-800">
                                                        {
                                                            loadingBatchHighlight ? 
                                                                <tr className="border-b border-gray-300/70">
                                                                    <td colSpan={3} className="py-2 pr-1 text-center leading-normal">
                                                                        Memuat...
                                                                    </td>
                                                                </tr>
                                                            :
                                                            batchHighlight?.map((element) => {
                                                                return (
                                                                    <tr className="border-b border-gray-300/70">
                                                                        <td className="py-2 pr-1 text-left leading-normal">
                                                                            {element?.data?.name}
                                                                        </td>
                                                                        <td className="py-2 text-left">
                                                                            {dayjs(element?.data?.start_time).format('dddd, D MMMM YYYY HH:mm')}
                                                                        </td>
                                                                        <td className="py-2 text-left">
                                                                        {
                                                                            element?.slug === 'upcoming' ?
                                                                                <div className="label w-max bg-blue-200/80 text-blue-600 px-3 py-1 rounded-[8px] font-medium">
                                                                                    {element?.type}
                                                                                </div>
                                                                            :
                                                                            element?.slug === 'finish' ?
                                                                                <div className="label w-max bg-green-200/80 text-green-600 px-3 py-1 rounded-[8px] font-medium">
                                                                                    {element?.type}
                                                                                </div>
                                                                            :
                                                                            element?.slug === 'new' ?
                                                                                <div className="label w-max bg-gray-200/80 text-gray-600 px-3 py-1 rounded-[8px] font-medium">
                                                                                    {element?.type}
                                                                                </div>
                                                                            :
                                                                                <div className="label w-max bg-yellow-200/80 text-yellow-600 px-3 py-1 rounded-[8px] font-medium">
                                                                                    {element?.type}
                                                                                </div>

                                                                        }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>  
                                    </div>
                                </div>

                                <section className="top-score mt-9">
                                    <div className="flex items-center justify-between gap-3">
                                        <h1 className="font-semibold text-[20px]">Top 10 Peserta Nilai Tertinggi</h1>
                                        <div className='relative'>
                                            <Select onChange={(e) => handleChangeSelectExam(e)} value={formDataExam.exam} name="exam" className={`montserrat border border-[#ccc] block appearance-none rounded-lg bg-white px-3 py-[0.75rem] text-black w-max focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25 *:text-black`} aria-label="Jenis">
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
                                                className={`${loadingExam ? 'pointer-events-none opacity-50' : ''} group pointer-events-none absolute top-2 right-2.5 size-8 fill-black`}
                                                aria-hidden="true"
                                            />
                                        </div>
                                    </div>
                                    <div className="card-highlight rounded-[12px] p-4 border border-gray-500/40 space-y-2 mt-4">
                                        <div className="card-detail">
                                            <div className="title-card space-y-1">
                                                <h3 className="text-gray-800 text-[1.075rem] font-semibold">Top 10 Peserta</h3>
                                            </div>
                                            <div className="item-card mt-3 max-h-[20rem] overflow-y-auto">
                                                <table className="w-full">
                                                    <thead className="montserrat text-[14px] text-gray-700/80 border-b border-gray-200 text-left sticky top-0 bg-white">
                                                        <tr>
                                                            <th scope="col" className="pb-2 pr-1 font-normal">
                                                                No.
                                                            </th>
                                                            <th scope="col" className="pb-2 pr-1 font-normal">
                                                                Nama
                                                            </th>
                                                            <th scope="col" className="pb-2 pr-1 font-normal">
                                                                Formasi
                                                            </th>
                                                            <th scope="col" className="pb-2 font-normal">
                                                                Nilai
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="montserrat text-[16px] text-gray-800">
                                                        {
                                                            loadingTopUser ? 
                                                                <tr className="border-b border-gray-300/70">
                                                                    <td colSpan={4} className="py-2 pr-1 leading-normal text-center">
                                                                        Memuat...
                                                                    </td>
                                                                </tr>
                                                            :
                                                            topUser?.length < 1 ?
                                                            (
                                                                <tr className="bg-white border-b border-gray-300">
                                                                    <td colSpan={6} className="py-4 text-center">
                                                                        Belom ada peserta.
                                                                    </td>
                                                                </tr>
                                                            )  
                                                            :
                                                            topUser?.map((element, index) => {
                                                                return (
                                                                    <tr className="border-b border-gray-300/70">
                                                                        <td className="py-2 pr-1 text-left leading-normal">
                                                                            {index + 1}.
                                                                        </td>
                                                                        <td className="py-2 text-left">
                                                                            <div className="line-clamp-1">
                                                                                {element?.name}
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-2 pr-1 text-left leading-normal">
                                                                            <div className="line-clamp-1">
                                                                                {formDataExam.exam}
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-2 text-left">
                                                                            {element?.total_score_fix}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>  
                                    </div>
                                </section>
                            </TabPanel>
                            <TabPanel key={2026} className="rounded-xl bg-white/5 p-3">
                                Belom dimulai.
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Dashboard