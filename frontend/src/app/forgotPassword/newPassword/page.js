"use client";

import { Button, Card, CardBody, CardHeader, Input, Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

function NewPassword() {
    const router = useRouter();
    const [email, setEmail] = useState(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        const resetEmail = sessionStorage.getItem('resetEmail');
        if (resetEmail) {
            setEmail(resetEmail);
        } else {
            router.push('/forgotPassword');
        }
    }, [router]);

    if (!email) {
        return <div className="flex justify-center pt-16">
            <Spinner size="lg" label="กำลังโหลดข้อมูล..." />
      </div>
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(!password || !confirmPassword) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            return;
        }

        if(password !== confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน!");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/updatePassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email, password
                })
            });

            if(res.status === 200) {
                toast.success("เปลี่ยนรหัสผ่านสำเร็จแล้ว");
                sessionStorage.removeItem('resetEmail');

                setTimeout(() => {
                    router.push('/');
                }, 1000)
            } else {
                toast.error("เปลี่ยนรหัสผ่านไม่สำเร็จ!");
            }
        } catch(error) {
            console.error("Error: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="grid w-[100vw] h-[100vh]">
            <Card className="m-auto w-1/3 drop-shadow-2xl bg-blend-darken">
                <CardHeader className='text-2xl font-bold justify-center'>
                    สร้างรหัสผ่านใหม่
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <div className='my-4'>
                            <Input
                                onChange={(e) => setPassword(e.target.value)}
                                label="รหัสผ่าน"
                                endContent={
                                    <Button type="button" size="sm" className='bg-gray-300' onPress={toggleVisibility} aria-label="toggle password visibility">
                                        {isVisible ? 'ซ่อน' : 'แสดง'}
                                    </Button>
                                }
                                type={isVisible ? "text" : "password"}
                                autoFocus
                                isRequired
                            />
                        </div>
                        <div className='my-4'>
                            <Input
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                label="ยืนยันรหัสผ่าน"
                                endContent={
                                    <Button type="button" size="sm" className='bg-gray-300' onPress={toggleVisibility} aria-label="toggle password visibility">
                                        {isVisible ? 'ซ่อน' : 'แสดง'}
                                    </Button>
                                }
                                type={isVisible ? "text" : "password"}
                                isRequired
                            />
                        </div>
                        <Button
                            type='submit'
                            color='success'
                            className='w-full'
                            isLoading={isLoading}
                            disabled={isLoading}
                            aria-label={isLoading ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
                        >
                            {isLoading ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default NewPassword