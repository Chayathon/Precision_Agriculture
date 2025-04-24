"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '@nextui-org/react';

function VerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (token) {
            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:4000/api/verify-email?token=${token}`);

                if(res.status === 200) {
                    toast.success("ยืนยันที่อยู่อีเมลสำเร็จ");
                    setTimeout(() => router.push('/'), 3000);
                } else {
                    toast.error("Token หมดอายุ")
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'ยืนยันที่อยู่อีเมลไม่สำเร็จ');
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
                ยืนยันที่อยู่อีเมล
            </Button>
        </div>
    );
}

export default VerifyEmail