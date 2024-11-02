import React from 'react'
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

function Page() {
    return (
        <div className='m-4'>
            <div className='grid grid-cols-6 gap-4 mb-4'>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>อายุ (วัน)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>30</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>อุณหภูมิ (°C)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>25</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ความชื้น (%)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>90</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ค่าความเป็นกรด-ด่าง (pH)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>25</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ค่าการนำไฟฟ้า (us/cm)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>25</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ค่าความเข้มแสง (lux)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>25</p>
                    </CardBody>
                </Card>
            </div>
            <div className='grid grid-cols-3 gap-4'>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ไนโตรเจน (mg/L)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>70</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ฟอสฟอรัส (mg/L)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>70</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>โพแทสเซียม (mg/L)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>70</p>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Page