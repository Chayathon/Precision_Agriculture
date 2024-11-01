'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar} from "@nextui-org/react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import { toast } from 'react-toastify';

function AdminNavbar() {
    const router = useRouter()
    const [user, setUser] = useState({
        username : ""
    })

    useEffect(() => {
        if(localStorage.getItem('UserData')) {
            const name = JSON.parse(localStorage.getItem('UserData'))
            setUser(name.username);
            // console.log(name.username)
        }  
    },[localStorage.getItem('UserData'), user])

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
                <NavbarItem>
                    <Link href="/admin/listAdmin">
                        List Admins
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/admin/listUser">
                        List Users
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/admin/listRole">
                        List Roles
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            showFallback src='https://images.unsplash.com/broken'
                            as="button"
                            size="sm"
                            className="transition-transform"
                        />
                        {/* {user} */}
                        {/* {JSON.parse(localStorage.getItem('UserData')).username} */}
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

export default AdminNavbar