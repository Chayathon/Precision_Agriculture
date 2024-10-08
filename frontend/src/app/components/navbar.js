'use client'

import React from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import { Text, Button } from '@chakra-ui/react'
import { toast } from 'react-toastify';

function UserNavbar() {
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
                        <Text>Precision Agriculture</Text>
                    </div>
                    <ul className='flex'>
                        <li className='mx-3'><Button onClick={logout}>Log out</Button></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default UserNavbar