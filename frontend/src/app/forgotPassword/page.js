"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Card, CardHeader, CardBody, CardFooter, Input, Button, InputOtp } from "@nextui-org/react";
import { FaCircleCheck } from 'react-icons/fa6';
import { HiMail } from 'react-icons/hi';

function ForgotPassword() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState();
    const [inputOTP, setInputOTP] = useState();

    const [isChecked, setIsChecked] = useState(false);
    const [isInvalid, setIsInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!isChecked) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/forgotPassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email
                    })
                });

                if(res.status === 200) {
                    const data = await res.json();
                    setOTP(data.resultData.otp);
                    setIsChecked(true);
                    
                    toast.success("ส่ง OTP ไปที่อีเมลของคุณแล้ว", {
                        autoClose: 60000 * 5
                    });
                } else if(res.status === 404) {
                    toast.error("ไม่พบที่อยู่อีเมลนี้!", {
                        autoClose: 60000 * 5
                    });
                }
            } else {
                if(inputOTP == otp) {
                    toast.success("OTP ถูกต้อง!");
                    sessionStorage.setItem('resetEmail', email);
                    router.push('/forgotPassword/newPassword');
                } else {
                    toast.warn("OTP ไม่ถูกต้อง!");
                    setIsInvalid(true);
                }
            }
        } catch (error) {
            console.error("Failed to fetch: ", error);
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
        } finally {
            setIsLoading(false);
        }
    }

    const handleResendOTP = async () => {
        setIsSending(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email
                })
            });

            if (res.status === 200) {
                const data = await res.json();
                setOTP(data.resultData.otp);
                toast.success("ส่ง OTP ไปที่อีเมลของคุณแล้ว", {
                    autoClose: 60000 * 5
                });
            } else if (res.status === 404) {
                toast.error("ไม่พบที่อยู่อีเมลนี้!", {
                    autoClose: 60000 * 5
                });
            }
        } catch (error) {
            console.error("Failed to Resend: ", error);
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
        } finally {
            setIsSending(false);
            setInputOTP("");
        }
    }

    return (
        <div className="grid w-[100vw] h-[100vh]">
            <Card className="m-auto drop-shadow-2xl bg-blend-darken w-11/12 sm:w-2/3 md:w-2/4 lg:w-2/6">
                <CardHeader className='text-2xl font-bold justify-center'>
                    ลืมรหัสผ่าน
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <Input
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            variant='faded'
                            label='อีเมล'
                            autoFocus
                            isRequired
                            startContent={
                                <HiMail size={20} />
                            }
                        />
                        <div className='my-3 mx-2'>
                            {isChecked && (
                                <>
                                    <p className='text-sm'>กรุณากรอก OTP</p>
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
                            endContent={<FaCircleCheck size={16} />}
                        >
                            {isLoading ? 'กำลังดำเนินการ...' : (isChecked ? 'ยืนยัน OTP' : 'ยืนยัน')}
                        </Button>
                        {isInvalid && (
                            <Button
                                onPress={handleResendOTP}
                                className='w-full mt-2'
                                isLoading={isSending}
                                disabled={isSending}
                                endContent={<HiMail size={20} />}
                            >
                                {isSending ? 'กำลังส่ง OTP...' : 'ส่ง OTP อีกครั้ง'}
                            </Button>
                        )}
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