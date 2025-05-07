"use client";

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardHeader, Input, Spinner } from '@nextui-org/react';
import { FaCircleCheck } from 'react-icons/fa6';

function NewPassword() {
    const router = useRouter();
    const [email, setEmail] = useState(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
    const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

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
            setIsLoading(false);
            return;
        }

        if(password !== confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน!");
            setIsLoading(false);
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
            <Card className="m-auto drop-shadow-2xl bg-blend-darken w-11/12 sm:w-2/3 md:w-2/4 lg:w-2/6">
                <CardHeader className='text-2xl font-bold justify-center'>
                    สร้างรหัสผ่านใหม่
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <Input
                                onChange={(e) => setPassword(e.target.value)}
                                label="รหัสผ่าน"
                                endContent={
                                    <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibility} aria-label="toggle password visibility">
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
                                    <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibilityConfirm} aria-label="toggle password visibility">
                                        {isVisibleConfirm ? 'ซ่อน' : 'แสดง'}
                                    </Button>
                                }
                                type={isVisibleConfirm ? "text" : "password"}
                                isRequired
                            />
                        </div>
                        <Button
                            type='submit'
                            color='primary'
                            className='w-full'
                            isLoading={isLoading}
                            disabled={isLoading}
                            aria-label={isLoading ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
                        >
                            {isLoading ? 'กำลังดำเนินการ...' : 'ยืนยัน'} <FaCircleCheck size={16} />
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default NewPassword