'use client'

import React from 'react'
import Link from 'next/link'
import {Card, CardHeader, CardBody, CardFooter, Input, Button} from "@nextui-org/react";

function Page() {
  return(
    <div className="grid w-[100vw] h-[100vh]">
        <Card className="m-auto w-1/3 drop-shadow-2xl bg-blend-darken">
            <CardHeader className='text-2xl font-bold justify-center'>
                ลืมรหัสผ่าน
            </CardHeader>
            <CardBody>
                <form>
                    <div className='mb-4'>
                        <Input type='email' label='Email' variant='faded' />
                    </div>
                    <Button color='primary' className='w-full'>ยืนยัน</Button>
                </form>
            </CardBody>
            <CardFooter>
                กลับไปหน้า&nbsp;<Link href='/' className='text-blue-500 hover:underline'>เข้าสู่ระบบ</Link>
            </CardFooter>
        </Card>
    </div>
  )
}

export default Page