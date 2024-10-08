'use client'

import React from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import { Text, Button } from '@chakra-ui/react'
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
        <nav className='bg-[#333] text-white p-5'>
            <div className='container mx-auto'>
                <div className='flex justify-between items-center'>
                    <div>
                        <Button onClick={logout}>Log out</Button>
                    </div>
                    <ul className='flex'>
                        <li className='mx-3'><Link href='/admin/listAdmin'>List Admin</Link></li>
                        <li className='mx-3'><Link href='/admin/listUser'>List User</Link></li>
                        <li className='mx-3'><Link href='/admin/listRole'>List Role</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default AdminNavbar