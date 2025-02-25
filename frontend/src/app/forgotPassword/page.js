"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardBody, CardFooter, Input, Button, InputOtp } from "@nextui-org/react";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function ForgotPassword() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState();
    const [inputOTP, setInputOTP] = useState();
    const [isCheck, setIsCheck] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!isCheck) {
                const res = await fetch(`http://localhost:4000/api/forgotPassword/${email}`);

                if(res.status === 200) {
                    const data = await res.json();
                    setOTP(data.resultData.otp);
                    setIsCheck(true);
                    
                    toast.success("ส่ง OTP ไปที่อีเมลของคุณแล้ว");
                } else if(res.status === 404) {
                    toast.error("ไม่พบที่อยู่อีเมลนี้!");
                }
            } else {
                if(inputOTP == otp) {
                    toast.success("OTP ถูกต้อง!");
                    router.push(`/forgotPassword/newPassword?email=${encodeURIComponent(email)}`);
                } else {
                    toast.warn("OTP ไม่ถูกต้อง!");
                }
            }
        } catch (error) {
            console.error("Failed to fetch: ", error);
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="grid w-[100vw] h-[100vh]">
            <Card className="m-auto w-1/3 drop-shadow-2xl bg-blend-darken">
                <CardHeader className='text-2xl font-bold justify-center'>
                    ลืมรหัสผ่าน
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-2'>
                            <Input
                                onChange={(e) => setEmail(e.target.value)}
                                type='email'
                                label='อีเมล'
                                variant='faded'
                                autoFocus
                                isRequired
                            />
                        </div>
                        <div className='m-2'>
                            {isCheck && (
                                <>
                                    <p>กรุณากรอก OTP</p>
                                    <InputOtp
                                        isRequired
                                        autoFocus
                                        value={inputOTP}
                                        onChange={(e) => setInputOTP(e.target.value)}
                                        aria-label="OTP input field"
                                        length={6}
                                        name="otp"
                                        placeholder="Enter code"
                                    />
                                </>
                            )}
                        </div>
                        <Button
                            type='submit'
                            color='primary'
                            className='w-full'
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            {isLoading ? 'กำลังดำเนินการ...' : (isCheck ? 'ยืนยัน OTP' : 'ยืนยัน')}
                        </Button>
                    </form>
                </CardBody>
                <CardFooter>
                    กลับไปหน้า&nbsp;<Link href='/' className='text-blue-500 hover:underline'>เข้าสู่ระบบ</Link>
                </CardFooter>
            </Card>
        </div>
    )
}

export default ForgotPassword