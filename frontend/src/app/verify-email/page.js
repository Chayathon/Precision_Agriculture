"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '@nextui-org/react';
import { FaCircleCheck } from 'react-icons/fa6';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (token) {
            setIsLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/verify-email?token=${token}`);

                if(res.status === 200) {
                    toast.success("ยืนยันที่อยู่อีเมลสำเร็จ");
                    setTimeout(() => router.push('/'), 3000);
                } else {
                    toast.error("หมดเวลาในการยืนยันอีเมล");
                }
            } catch (error) {
                toast.error("ยืนยันที่อยู่อีเมลไม่สำเร็จ");
                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };
    }
        
    return (
        <div className='flex justify-center my-20'>
            <Button
                onPress={handleSubmit}
                color='success'
                size='lg'
                isLoading={isLoading}
                disabled={isLoading}
            >
                ยืนยันที่อยู่อีเมล<FaCircleCheck size={20} />
            </Button>
        </div>
    );
}

export default function VerifyEmail() {
    return (
        <Suspense fallback={<div>กำลังโหลด...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}