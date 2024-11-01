'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar} from "@nextui-org/react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { toast } from 'react-toastify';

function UserNavbar() {
    const router = useRouter()
    const user = JSON.parse(localStorage.getItem('UserData'))
    const [username, setUsername] = useState('')

    useEffect(() => {
        if(localStorage.getItem('UserData')) {
            setUsername(user.username);
        }
    }, [user])

    const handleLogout = () => {
        Cookies.remove('UserData');
        Cookies.remove('Token');

        toast.success("ออกจากระบบแล้ว")
        router.push('/')
    }

    return (
        <Navbar className='bg-gray-800 text-white'>
            <NavbarBrand>
                <p className="font-bold text-inherit">Precision Agriculture</p>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">

            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar
                                showFallback src='https://images.unsplash.com/broken'
                                as="button"
                                size="sm"
                                className="transition-transform"
                            />
                            <b>{username}</b>
                        </div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="settings">My Settings</DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                        <p className='flex justify-between'>Log Out <FaArrowRightFromBracket className='text-lg' /></p>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    )
}

export default UserNavbar