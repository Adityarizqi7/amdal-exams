import Swal from "sweetalert2"
import { useSelector } from "react-redux"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import {
    ChevronDownIcon,
    ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/16/solid'

import { clearAuth, Logout } from "../../utils/Auth"
import klh from '../../assets/images/klh.png'
import amdalnet from '../../assets/images/amdalnet.png'
import { useLazyLogoutQuery } from "../../store/auth/authApi"

export default function Topbar() {

    const [apiLogout] = useLazyLogoutQuery();

    // const [logout] = useLazyLogoutQuery();

    // const dispatch = useDispatch()
    
    const userLog = useSelector((state) => state.user)

    const dropdownAccountRef = useRef(null);

    const location = useLocation()
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);
    
    const changeColor = useCallback(() => {
        setIsScrolled(window.scrollY > 0);
    }, []);

    function formatShortName(name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) return '';
        return parts[0] + (parts.length > 1 ? ' ' + parts.slice(1).map(w => w[0]).join('') : '');
    }

    const toggleAccount = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = async (e) => {
        e.preventDefault();

        setLoadingLogout(true)
        apiLogout().finally(() => {
            setLoadingLogout(false)
            clearAuth();                // hapus token di localStorage
            // dispatch(logout());         // reset redux state user
            setTimeout(() => {
                navigate('/login');       // beri jeda 1 tick agar tidak race
            }, 0);
            window.location.reload()
        })
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownAccountRef.current && !dropdownAccountRef.current.contains(event.target)) {
              setIsOpen(false);
            }
        }
      
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener('scroll', changeColor);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener('scroll', changeColor);
        };
    }, [changeColor]);

    return (
        <header
            className={`${location.pathname === '/' ? isScrolled ? 'bg-white border-b border-gray-100' : 'bg-transparent border-0 border-gray-100' : 'bg-white border-b border-gray-100'} transition-colors  sticky top-0 z-[999] w-full px-[2rem]`}
        >
            {/* Dekstop Menu Navbar */}
            <Menu>
                <div className='montserrat flex max-5xs:flex-col gap-2 py-6 max-5xs:py-4 max-xs:gap-1 items-center justify-between max-6xs:justify-center'>
                    <div className='brand-image flex items-center gap-4'>
                        <img
                            src={klh}
                            width='auto'
                            height='auto'
                            loading='lazy'
                            alt={`Me Logo`}
                            className='w-[3rem]'
                        />
                        <img
                            src={amdalnet}
                            width='auto'
                            height='auto'
                            loading='lazy'
                            alt={`Me Logo`}
                            className='w-[11rem] md:hidden block'
                        />
                    </div>
                    <div className='md:block hidden'>
                    {
                        userLog.name ? 
                            <div ref={dropdownAccountRef} className="account-popup relative">
                                <button onClick={toggleAccount} type="button" className="cursor-pointer inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold bg-green-200/80 text-green-600 hover:bg-green-300/60 shadow-inner shadow-white/10">
                                    {formatShortName(userLog.name)}
                                    <ChevronDownIcon className="size-4 fill-green-600" />
                                </button>
                                {
                                    isOpen ? 
                                    <div className="wrapper-account absolute bg-white shadow-own top-[3.25rem] right-[0rem] w-52 origin-top-right rounded-[8px] border border-white/5 text-sm/6 transition duration-100 ease-out [--anchor-gap:--spacing(1)] p-2">
                                        <button type="button" onClick={handleLogout} className={`${loadingLogout ? 'opacity-50 pointer-events-none' : ''} menu-item p-2 w-full rounded-[6px] hover:bg-red-100/80 text-red-500 cursor-pointer flex items-center gap-2`}>
                                            <ArrowRightStartOnRectangleIcon className="size-5 fill-red-500" />
                                            <span className="font-semibold">
                                                {loadingLogout ? 'Memuat...' : 'Keluar'}
                                            </span>
                                        </button>
                                    </div>
                                    : false
                                }
                            </div>
                        :
                            <div className='flex items-center gap-4'>
                                <button onClick={() => {
                                    navigate('/login')
                                }} className='rounded-[10px] border-0 py-3 px-8 font-semibold bg-green-300/60 text-green-600 hover:bg-green-300 cursor-pointer'>
                                    Masuk
                                </button>
                                {/* <button className='border border-green-base rounded-[10px] py-3 px-8 text-green-base bg-green-base/10 hover:bg-green-base/20 cursor-pointer'>
                                    Daftar
                                </button> */}
                            </div>
                    }
                    </div>
                    <div
                        className="-mr-2 flex md:hidden md:gap-0 gap-2 rounded-full py-[0.75rem] px-4"
                    >
                        {/* <DarkBtn /> */}
                        <Menu.Button className='inline-flex items-center justify-center rounded-md text-gray-600 focus:outline-none'>
                            <span className='sr-only'>Open main menu</span>
                            <svg
                                className='block h-6 w-full ui-open:hidden'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                aria-hidden='true'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M4 6h16M4 12h16M4 18h16'
                                />
                            </svg>
                            <svg
                                className='hidden h-6 w-6 ui-open:block'
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                aria-hidden='true'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </Menu.Button>
                    </div>
                </div>

                {/* Mobile Menu Navbar */}
                <Transition
                    enter='transition ease-out duration-100 transform'
                    enterFrom='opacity-0 scale-95'
                    enterTo='opacity-100 scale-100'
                    leave='transition ease-in duration-75 transform'
                    leaveFrom='opacity-100 scale-100'
                    leaveTo='opacity-0 scale-95'
                    className='absolute w-full left-0 shadow-sm outline-0'
                >
                    <Menu.Items
                        className='montserrat md:hidden rounded-[1.15rem] bg-white overflow-y-auto h-auto'
                        id='mobile-menu'
                    >
                        <div className='space-y-1 p-2'>
                            <Menu.Item>
                                <ItemNav
                                    title={'Beranda'}
                                    path={'/'}
                                    classItemNav='block py-4 px-4 bg-gray-100 w-full rounded-[6px]'
                                />
                            </Menu.Item>
                            {
                                userLog.role && userLog.role === 'admin' ?
                                    <div className="space-y-2">
                                        <Menu.Item>
                                            <ItemNav
                                                title={'Tipe Soal'}
                                                path={'/dashboard/exams'}
                                                classItemNav='block py-4 px-4 bg-gray-100 w-full rounded-[6px]'
                                            />
                                        </Menu.Item>
                                        <Menu.Item>
                                            <ItemNav
                                                title={'Pertanyaan'}
                                                path={'/dashboard/questions'}
                                                classItemNav='block py-4 px-4 bg-gray-100 w-full rounded-[6px]'
                                            />
                                        </Menu.Item>
                                        <Menu.Item>
                                            <ItemNav
                                                title={'Jawaban'}
                                                path={'/dashboard/answers'}
                                                classItemNav='block py-4 px-4 bg-gray-100 w-full rounded-[6px]'
                                            />
                                        </Menu.Item>
                                        <Menu.Item>
                                            <ItemNav
                                                title={'Sesi'}
                                                path={'/dashboard/batches'}
                                                classItemNav='block py-4 px-4 bg-gray-100 w-full rounded-[6px]'
                                            />
                                        </Menu.Item>
                                        <Menu.Item>
                                            <ItemNav
                                                title={'Pengguna'}
                                                path={'/dashboard/users'}
                                                classItemNav='block py-4 px-4 bg-gray-100 w-full rounded-[6px]'
                                            />
                                        </Menu.Item>
                                        {/* <Menu.Item>
                                            <button type="button" onClick={handleLogout} className={`${loadingLogout ? 'opacity-50 pointer-events-none' : ''} menu-item flex items-center gap-2 text-red-500 py-4 px-4 w-full rounded-[6px]`}>
                                                <ArrowRightStartOnRectangleIcon className="size-5 fill-red-500" />
                                                <span className="font-semibold">
                                                    {loadingLogout ? 'Memuat...' : 'Keluar'}
                                                </span>
                                            </button>
                                        </Menu.Item> */}
                                        <div ref={dropdownAccountRef} className="account-popup relative">
                                            <button onClick={toggleAccount} type="button" className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-green-base hover:bg-green-base/80 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10">
                                                {formatShortName(userLog.name)}
                                                <ChevronDownIcon className="size-4 fill-white/60" />
                                            </button>
                                            {
                                                isOpen ? 
                                                <div className="wrapper-account absolute bg-white shadow-own top-[3.25rem] left-[0rem] w-52 origin-top-right rounded-[8px] border border-white/5 text-sm/6 transition duration-100 ease-out [--anchor-gap:--spacing(1)] p-2">
                                                    <button type="button" onClick={handleLogout} className={`${loadingLogout ? 'opacity-50 pointer-events-none' : ''} menu-item p-2 w-full rounded-[6px] hover:bg-gray-100 text-red-500 cursor-pointer flex items-center gap-2`}>
                                                        <ArrowRightStartOnRectangleIcon className="size-5 fill-red-500" />
                                                        <span className="font-semibold">
                                                            {loadingLogout ? 'Memuat...' : 'Keluar'}
                                                        </span>
                                                    </button>
                                                </div>
                                                : false
                                            }
                                        </div>
                                    </div>
                                :
                                <button onClick={() => {
                                    navigate('/login')
                                }} className='font-semibold bg-green-300/60 text-green-600 hover:bg-green-300 rounded-[10px] border-0 py-3 px-8 cursor-pointer'>
                                    Masuk
                                </button>
                            }
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </header>
    )
}

/* Child Component Navbar  */
const WrapperItemsDropdownNav = React.memo(
    ({
        head_title,
        checkPath,
        children,
        classDropDownButton,
        classChildDropDownButton,
        classDropDownTransition,
        classDropDownWrapItem,
    }) => {

        const [rotate, setRotate] = useState(false)
        const handleRotateChange = () => {
            setRotate(!rotate)
        }

        return (
            <Menu as={'div'} className='relative'>
                <Menu.Button
                    onClick={handleRotateChange}
                    className={`${classDropDownButton} ${checkPath} text-[1rem] font-medium`}
                >
                    <div
                        className={`${classChildDropDownButton} flex items-center gap-2`}
                    >
                        <span>{head_title}</span>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform`} />
                    </div>
                </Menu.Button>
                <Transition
                    enter='transition-transform duration-100 ease-out'
                    enterFrom='transform scale-95 opacity-0'
                    enterTo='transform scale-100 opacity-100'
                    leave='transition duration-100 ease-out'
                    leaveFrom='transform scale-100 opacity-100'
                    leaveTo='transform scale-95 opacity-0'
                    className={`${classDropDownTransition}`}
                >
                    <Menu.Items
                        className={`${classDropDownWrapItem} shadow-own flex flex-col rounded-[5px] bg-white py-1`}
                    >
                        {children}
                    </Menu.Items>
                </Transition>
            </Menu>
        )
    }
)
const ItemDropdownNav = React.memo(({ title, path, onClick }) => {
    return (
        <Menu.Item>
            {() => (
                <NavLink
                    onClick={onClick}
                    className={({ isActive }) =>
                        isActive ? "text-green-base font-semibold text-[1.1rem]" : "bg-white text-black"
                    }
                    to={path}
                >
                    {title}
                </NavLink>
            )}
        </Menu.Item>
    )
})
const ItemNav = React.memo(({ title, path, classItemNav }) => {
    return (
        <NavLink
            to={path}
            className={({ isActive }) =>
                `${classItemNav} ${
                isActive
                    ? "text-green-base font-semibold"
                    : "bg-white text-black"
                }`
            }
        >
            {title}
        </NavLink>
    )
})