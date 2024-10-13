'use client'

import React from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar} from "@nextui-org/react";
import { toast } from 'react-toastify';

function AdminNavbar() {
    const router = useRouter()

    const logout = () => {
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
                    <Link href="/admin/listAdmin" color="foreground">
                        List Admins
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/admin/listUser" aria-current="page" color="secondary">
                        List Users
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/admin/listRole" color="foreground">
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
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="settings">My Settings</DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={logout}>
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>

        // <nav className='bg-[#333] text-white p-5'>
        //     <div className='container mx-auto'>
        //         <div className='flex justify-between items-center'>
        //             <div>
        //                 <Button onClick={logout}>Log out</Button>
        //             </div>
        //             <ul className='flex'>
        //                 <li className='mx-3'><Link href='/admin/listAdmin'>List Admin</Link></li>
        //                 <li className='mx-3'><Link href='/admin/listUser'>List User</Link></li>
        //                 <li className='mx-3'><Link href='/admin/listRole'>List Role</Link></li>
        //             </ul>
        //         </div>
        //     </div>
        // </nav>
    )
}

export default AdminNavbar