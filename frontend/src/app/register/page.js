'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import {Card, CardHeader, CardBody, CardFooter, Input, Textarea, Button} from "@nextui-org/react";
import { toast } from 'react-toastify'

function Page() {
    const router = useRouter()
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [tel, setTel] = useState("")
    const [address, setAddress] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(password != confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน!")
            return;
        }

        if(!firstname || !lastname || !email || !tel || !address || !username || !password || !confirmPassword) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!")
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname, lastname, email, tel, address, username, password
                })
            })

            if(res.ok) {
                const form = e.target
                form.reset()
                toast.success("ลงทะเบียนสำเร็จแล้ว", {
                    autoClose: 1500
                })

                setTimeout(() => {
                    router.push('/')
                }, 1500)
                    
            }
            else {
                toast.warn("อีเมลหรือชื่อผู้ใช้นี้ ได้รับการลงทะเบียนแล้ว")
                return;
            }
        }
        catch (err) {
            console.log("Error", err)
        }
    }

    return(
        <div className="grid w-[100vw] h-[100vh]">
            <Card className="m-auto w-1/2 drop-shadow-2xl bg-blend-darken">
                <CardHeader className='text-2xl font-bold justify-center'>
                    สมัครสมาชิก
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <div className='flex my-4 gap-4'>
                            <Input onChange={(e) => setFirstname(e.target.value)} type='text' label='ชื่อจริง' isClearable isRequired />

                            <Input onChange={(e) => setLastname(e.target.value)} type='text' label='นามสกุล' isClearable isRequired />
                        </div>
                        <div className='flex my-4 gap-4'>
                            <Input onChange={(e) => setEmail(e.target.value)} type='email' label='อีเมล' isClearable isRequired />

                            <Input onChange={(e) => setTel(e.target.value)} type='text' label='เบอร์โทรศัพท์' maxLength='10' isClearable isRequired />
                        </div>
                        <div className='my-4'>
                            <Textarea onChange={(e) => setAddress(e.target.value)} label='ที่อยู่' isClearable isRequired />
                        </div>
                        <div className='my-4'>
                            <Input onChange={(e) => setUsername(e.target.value)} type='text' label='ชื่อผู้ใช้' isClearable isRequired />
                        </div>
                        <div className='my-4'>
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
                                isRequired
                            />
                        </div>
                        <div className='my-4'>
                            <Input
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                label="ยืนยันรหัสผ่าน"
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
                                isRequired
                            />
                        </div>
                        <Button color='primary' type='submit' className='w-full'>สมัครสมาชิก</Button>
                    </form>
                </CardBody>
                <CardFooter className='flex justify-between'>
                    <p>มีบัญชีอยู่แล้ว? <Link href='/' className='text-blue-500 hover:underline'>เข้าสู่ระบบ</Link></p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Page