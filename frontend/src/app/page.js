'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie';
import {Card, CardHeader, CardBody, CardFooter, Input, Button} from "@nextui-org/react";
import { toast } from 'react-toastify';

function Page() {
    const router = useRouter()
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!username || !password) {
            toast.error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน")
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username, password
                })
            })

            const data = await res.json()

            if(res.ok && data.message == 'Login Successfully') {
                Cookies.set('Token', data.token, { expires: 1 })
                Cookies.set('UserData', JSON.stringify(data.resultData), { expires: 1 })
                localStorage.setItem("Token", data.token);
                localStorage.setItem("UserData", JSON.stringify(data.resultData))
                
                toast.success("เข้าสู่ระบบแล้ว")
                router.push(data.path)
            }
            else {
                toast.error("ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง!")
                return;
            }
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <div className='grid w-[100vw] h-[100vh]'>
            <Card className="m-auto w-1/3 drop-shadow-2xl bg-blend-darken">
                <CardHeader className='text-2xl font-bold justify-center'>
                    เข้าสู่ระบบ
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <Input onChange={(e) => setUsername(e.target.value)} type='text' label='ชื่อผู้ใช้' />
                        <Input
                            onChange={(e) => setPassword(e.target.value)}
                            label="รหัสผ่าน"
                            endContent={
                                <Button type="button" size="sm" className='bg-gray-300' onClick={toggleVisibility} aria-label="toggle password visibility">
                                {isVisible ? (
                                    'ซ่อน'
                                ) : (
                                    'แสดง'
                                )}
                                </Button>
                            }
                            type={isVisible ? "text" : "password"}
                            className='my-4'
                        />
                        <Button type='submit' color='success' className='w-full'>เข้าสู่ระบบ</Button>
                    </form>
                </CardBody>
                <CardFooter className='flex justify-between'>
                    <p>ยังไม่มีบัญชี? <Link href='/register' className='text-blue-500 hover:underline'>สมัครสมาชิก</Link></p>
                    <Link href='/forgotPassword' className='text-blue-600 hover:underline'>ลืมรหัสผ่าน</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page