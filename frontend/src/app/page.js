'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie';
import {Card, CardHeader, CardBody, CardFooter, Input, Button} from "@nextui-org/react";
import { toast } from 'react-toastify';
import { ThemeSwitcher } from './components/ThemeSwitcher';

function Page() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(!username || !password) {
            toast.error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username, password
                })
            });

            const data = await res.json();

            if(res.status === 200 && data.message == 'Login Successfully') {
                Cookies.set('Token', data.token, { expires: 1 });
                Cookies.set('UserData', JSON.stringify(data.resultData), { expires: 1 });
                localStorage.setItem("Token", data.token);
                localStorage.setItem("UserData", JSON.stringify(data.resultData));
                
                toast.success("เข้าสู่ระบบสำเร็จ");
                router.push(data.path);
            } else if (res.status === 400) {
                toast.warn("ชื่อผู้ใช้ไม่ถูกต้อง");
            }
            else if (res.status === 401) {
                toast.warn("รหัสผ่านไม่ถูกต้อง");
            } else {
                toast.error(data.message || "เกิดข้อผิดพลาด");
            }
        } catch (error) {
            console.error("Login Error:", error.message, error.stack);
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='grid w-[100vw] h-[100vh]'>
            <Card className="m-auto drop-shadow-2xl bg-blend-darken w-11/12 sm:w-2/3 md:w-2/4 lg:w-2/6">
                <CardHeader className='px-4 text-2xl font-bold justify-between'>
                    เข้าสู่ระบบ
                    <ThemeSwitcher size="md" />
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <Input
                            onChange={(e) => setUsername(e.target.value)}
                            type='text'
                            label='ชื่อผู้ใช้'
                            variant='faded'
                            autoFocus
                            required
                        />
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            label="รหัสผ่าน"
                            variant='faded'
                            endContent={
                                <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibility} aria-label="toggle password visibility">
                                    {isVisible ? 'ซ่อน' : 'แสดง'}
                                </Button>
                            }
                            type={isVisible ? "text" : "password"}
                            className='my-4'
                            required
                        />
                        <Button
                            type='submit'
                            color='success'
                            className='w-full'
                            isLoading={isLoading}
                            disabled={isLoading}
                            aria-label={isLoading ? 'กำลังเข้าสู่ระบบ' : 'เข้าสู่ระบบ'}
                        >
                            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </Button>
                    </form>
                </CardBody>
                <CardFooter className='flex justify-between'>
                    <p><span className='hidden sm:inline'>ยังไม่มีบัญชี?</span> <Link href='/register' className='text-blue-500 hover:underline'>สมัครสมาชิก</Link></p>
                    <Link href='/forgotPassword' className='text-blue-500 hover:underline'>ลืมรหัสผ่าน</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page