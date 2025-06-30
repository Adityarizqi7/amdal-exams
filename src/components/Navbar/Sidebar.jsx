import Swal from "sweetalert2"
// import { useSelector } from "react-redux"
import { NavLink } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {
    ChevronDownIcon,
    ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/16/solid'
import { createTheme, ThemeProvider } from "flowbite-react";

import { Logout } from "../../utils/Auth"
import amdalnet from '../../assets/images/amdalnet.png'
// import { useLazyLogoutQuery } from "../../store/auth/authApi"
import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems, SidebarLogo } from "flowbite-react"

const SideBarTheme = createTheme({
    "root": {
        "base": "md:block hidden h-dvh sticky top-0 self-start",
        "collapsed": {
            "on": "",
            "off": "xl:w-[20%] md:w-[30%]"
        },
        "inner": "overflow-y-auto overflow-x-hidden bg-green-base/90 p-0"
    },
    "collapse": {
        "button": "group flex w-full items-center p-2 text-base font-normal text-white transition duration-75 hover:bg-gray-700/80",
        "icon": {
            "base": "h-6 w-6 text-gray-500 transition duration-75 group-hover:text-gray-900",
            "open": {
                "off": "",
                "on": "text-gray-900"
            }
        },
        "label": {
            "base": "ml-3 flex-1 whitespace-nowrap text-left",
            "title": "sr-only",
        "icon": {
            "base": "h-6 w-6 transition delay-0 ease-in-out",
            "open": {
                "on": "rotate-180",
                "off": ""
            }
        }
        },
        "list": "space-y-2 py-2"
    },
    "cta": {
        "base": "mt-6 rounded-lg bg-gray-100 p-4",
        "color": {
            "blue": "bg-cyan-50 dark:bg-cyan-900",
            "dark": "bg-dark-50 dark:bg-dark-900",
            "failure": "bg-red-50 dark:bg-red-900",
            "gray": "bg-gray-50 dark:bg-gray-900",
            "green": "bg-green-50 dark:bg-green-900",
            "light": "bg-light-50 dark:bg-light-900",
            "red": "bg-red-50 dark:bg-red-900",
            "purple": "bg-purple-50 dark:bg-purple-900",
            "success": "bg-green-50 dark:bg-green-900",
            "yellow": "bg-yellow-50 dark:bg-yellow-900",
            "warning": "bg-yellow-50 dark:bg-yellow-900"
        }
    },
    "item": {
        "base": "flex items-center justify-center rounded-lg p-2 text-base font-normal text-white hover:bg-gray-700/80",
        "active": "bg-gray-100",
        "collapsed": {
            "insideCollapse": "group w-full pl-8 transition duration-75",
            "noIcon": "font-bold"
        },
        "content": {
            "base": "flex-1 whitespace-nowrap px-3"
        },
        "icon": {
            "base": "h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white",
            "active": "text-gray-700 dark:text-gray-100"
        },
        "label": "",
        "listItem": ""
    },
    "items": {
        "base": "p-2"
    },
    "itemGroup": {
        "base": "mt-4 space-y-2 border-t border-gray-200 pt-4 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700"
    },
    "logo": {
        "base": "mb-5 flex justify-center pl-2.5 py-6 border-r border-gray-200/50 bg-white",
        "collapsed": {
            "on": "hidden",
            "off": "self-center whitespace-nowrap text-xl font-semibold"
        },
        "img": "h-6 sm:h-7"
    }
});

export default function Topbar() {

    // const [apiLogout] = useLazyLogoutQuery();

    // const [logout] = useLazyLogoutQuery();

    // const dispatch = useDispatch()
    
    // const userLog = useSelector((state) => state.user)

    // const dropdownAccountRef = useRef(null);

    // const location = useLocation()
    // const navigate = useNavigate();

    // const [isOpen, setIsOpen] = useState(false);
    const [, setIsScrolled] = useState(false);
    // const [loadingLogout, setLoadingLogout] = useState(false);
    
    const changeColor = useCallback(() => {
        setIsScrolled(window.scrollY > 0);
    }, []);

    // function formatShortName(name) {
    //     const parts = name.trim().split(/\s+/);
    //     if (parts.length === 0) return '';
    //     return parts[0] + (parts.length > 1 ? ' ' + parts.slice(1).map(w => w[0]).join('') : '');
    // }

    // const toggleAccount = () => {
    //     setIsOpen(!isOpen);
    // }

    // const handleLogout = async (e) => {
    //     e.preventDefault();

    //     setLoadingLogout(true)
    //     apiLogout().finally(() => {
    //         setLoadingLogout(false)
    //         clearAuth();                
    //         // dispatch(logout());
    //         setTimeout(() => {
    //             navigate('/login');
    //         }, 0);
    //         window.location.reload()
    //     })
    // };

    useEffect(() => {
        // function handleClickOutside(event) {
        //     if (dropdownAccountRef.current && !dropdownAccountRef.current.contains(event.target)) {
        //       setIsOpen(false);
        //     }
        // }
      
        // document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener('scroll', changeColor);

        return () => {
            // document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener('scroll', changeColor);
        };
    }, [changeColor]);

    return (
        <ThemeProvider>
            <Sidebar aria-label="Amdalnet Logo" theme={SideBarTheme}>
                <SidebarLogo href="/" img={amdalnet} imgAlt="Amdalnet Logo">
                </SidebarLogo>
                <SidebarItems>
                    <SidebarItemGroup>
                        <SidebarItem href="/">
                            Beranda
                        </SidebarItem>
                        <SidebarCollapse
                            label="Pengguna"
                        >
                            <SidebarItem href="/dashboard/users">Daftar Pengguna</SidebarItem>
                            <SidebarItem href="/dashboard/user/create">Buat Pengguna Baru</SidebarItem>
                        </SidebarCollapse>
                        <SidebarCollapse
                            label="Tipe Ujian"
                        >
                            <SidebarItem href="/dashboard/exams">Daftar Tipe Ujian</SidebarItem>
                            <SidebarItem href="/dashboard/exam/create">Buat Tipe Ujian</SidebarItem>
                        </SidebarCollapse>
                        <SidebarCollapse
                            label="Pertanyaan"
                        >
                            <SidebarItem href="/dashboard/questions">Daftar Pertanyaan</SidebarItem>
                            <SidebarItem href="/dashboard/question/create">Buat Pertanyaan</SidebarItem>
                        </SidebarCollapse>
                        <SidebarCollapse
                            label="Opsi Jawaban"
                        >
                            <SidebarItem href="/dashboard/answers">Daftar Opsi Jawaban</SidebarItem>
                            <SidebarItem href="/dashboard/answer/create">Buat Opsi Jawaban</SidebarItem>
                        </SidebarCollapse>
                        <SidebarCollapse
                            label="Sesi Ujian"
                        >
                            <SidebarItem href="/dashboard/batches">Daftar Sesi</SidebarItem>
                            <SidebarItem href="/dashboard/batch/create">Buat Sesi</SidebarItem>
                            <SidebarItem href="/dashboard/batch/assign">Set Sesi</SidebarItem>
                        </SidebarCollapse>
                    </SidebarItemGroup>
                </SidebarItems>
            </Sidebar>
        </ThemeProvider>
    )
}

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