'use client'

import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie";
import Link from 'next/link';
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

function Page() {
    const [admins, setAdmins] = useState(0);
    const [users, setUsers] = useState(0);
    const [roles, setRoles] = useState(0);

    const fetchAdmin = async (role_id) => {
        try {
            const token = Cookies.get("Token");
            const res = await fetch(`http://localhost:4000/api/listUser/${role_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setAdmins(data.resultData.length);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchUser = async (role_id) => {
        try {
            const token = Cookies.get("Token");
            const res = await fetch(`http://localhost:4000/api/listUser/${role_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(data.resultData.length);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchRole = async () => {
        try {
            const token = Cookies.get("Token");
            const res = await fetch(`http://localhost:4000/api/listRole`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setRoles(data.resultData.length);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchAdmin(2);
        fetchUser(1);
        fetchRole();
    }, []);

    return (
        <div className='m-4'>
            <div className='grid grid-cols-3 gap-4 mb-4'>
                <Link href='/admin/listAdmin'>
                    <Card className='drop-shadow-xl hover:-translate-y-1'>
                        <CardHeader className='flex justify-center'>
                            <p className='text-gray-500'>ผู้ดูแลระบบ</p>
                        </CardHeader>
                        <CardBody>
                            <p className='text-center text-6xl font-bold'>{admins}</p>
                        </CardBody>
                        <CardFooter className='flex justify-center'>
                            <p className='text-gray-500'>คน</p>
                        </CardFooter>
                    </Card>
                </Link>
                <Link href='/admin/listUser'>
                    <Card className='drop-shadow-xl hover:-translate-y-1'>
                        <CardHeader className='flex justify-center'>
                            <p className='text-gray-500'>ผู้ใช้</p>
                        </CardHeader>
                        <CardBody>
                            <p className='text-center text-6xl font-bold'>{users}</p>
                        </CardBody>
                        <CardFooter className='flex justify-center'>
                            <p className='text-gray-500'>คน</p>
                        </CardFooter>
                    </Card>
                </Link>
                <Link href='/admin/listRole'>
                    <Card className='drop-shadow-xl hover:-translate-y-1'>
                        <CardHeader className='flex justify-center'>
                            <p className='text-gray-500'>ตำแหน่ง</p>
                        </CardHeader>
                        <CardBody>
                            <p className='text-center text-6xl font-bold'>{roles}</p>
                        </CardBody>
                        <CardFooter className='flex justify-center'>
                            <p className='text-gray-500'>บทบาท</p>
                        </CardFooter>
                    </Card>
                </Link>
            </div>
        </div>
    )
}

export default Page