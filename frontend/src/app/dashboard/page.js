'use client'

import React from 'react'
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

function Page() {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    const labels = ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'];
      
    const dataTemp = {
        labels,
        datasets: [
            {
                label: 'อุณหภูมิ',
                data: [24, 25, 26, 27, 29, 30, 29, 28, 27],
                backgroundColor: 'rgba(150, 150, 150, 0.5)',
                borderColor: 'rgba(150, 150, 150, 1)',
                borderWidth: 2
            },
        ],
    };
      
    const dataMoisture = {
        labels,
        datasets: [
            {
                label: 'ความชื้น',
                data: [80, 78, 75, 70, 67, 75, 80, 83, 85],
                backgroundColor: 'rgba(0, 229, 255, 0.5)',
                borderColor: 'rgba(0, 229, 255, 1)',
                borderWidth: 2
            },
        ],
    };
      
    const dataPH = {
        labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
        datasets: [
            {
                label: 'ค่าความเป็นกรด-ด่าง',
                data: [6.5, 6.4, 6.3, 6.2, 6.0, 5.8, 5.5, 5.8, 6.3],
                backgroundColor: 'rgba(255, 131, 0, 0.5)',
                borderColor: 'rgba(255, 131, 0, 1)',
                borderWidth: 2
            },
        ],
    };
      
    const dataEC = {
        labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
        datasets: [
            {
                label: 'ค่าการนำไฟฟ้า',
                data: [1500, 1400, 1100, 1200, 1450, 1300, 1100, 900, 700],
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                borderColor: 'rgba(0, 0, 255, 1)',
                borderWidth: 2
            },
        ],
    };
      
    const dataLight = {
        labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
        datasets: [
            {
                label: 'ค่าความเข้มแสง',
                data: [10000, 12000, 14000, 17000, 20000, 19000, 18000, 17000, 16000],
                backgroundColor: 'rgba(255, 255, 0, 0.5)',
                borderColor: 'rgba(255, 255, 0, 1)',
                borderWidth: 2
            },
        ],
    };
      
    const dataNitrogen = {
        labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
        datasets: [
            {
                label: 'ไนโตรเจน',
                data: [90, 85, 80, 73, 70, 68, 65, 62, 75],
                backgroundColor: 'rgba(150, 0, 255, 0.5)',
                borderColor: 'rgba(150, 0, 255, 1)',
                borderWidth: 2
            },
        ],
    };
      
    const dataPhosphorus = {
        labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
        datasets: [
            {
                label: 'ฟอสฟอรัส',
                data: [50, 48, 45, 42, 40, 38, 35, 32, 45],
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                borderColor: 'rgba(0, 255, 0, 1)',
                borderWidth: 2
            },
        ],
    };
      
    const dataPotassium = {
        labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
        datasets: [
            {
                label: 'โพแทสเซียม',
                data: [145, 142, 139, 135, 130, 124, 118, 110, 140],
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 2
            },
        ],
    };

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
                        <p className='text-center text-6xl font-bold'>28</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ความชื้น (%)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>70</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ค่าความเป็นกรด-ด่าง (pH)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>5.5</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ค่าการนำไฟฟ้า (us/cm)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>1200</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ค่าความเข้มแสง (lux)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>15000</p>
                    </CardBody>
                </Card>
            </div>
            <div className='grid grid-cols-3 gap-4 mb-4'>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ไนโตรเจน (mg/L)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>75</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>ฟอสฟอรัส (mg/L)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>40</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className='flex justify-center'>
                        <p className='text-gray-500'>โพแทสเซียม (mg/L)</p>
                    </CardHeader>
                    <CardBody>
                        <p className='text-center text-6xl font-bold'>125</p>
                    </CardBody>
                </Card>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <Card className='px-4 pb-4'>
                    <CardHeader className='flex justify-center'>อุณหภูมิ (°C)</CardHeader>
                        <Bar options={options} data={dataTemp} />
                </Card>
                <Card className='px-4 pb-4'>
                    <CardHeader className='flex justify-center'>ความชื้น (%)</CardHeader>
                        <Bar options={options} data={dataMoisture} />
                </Card>
                <Card className='px-4 pb-4'>
                    <CardHeader className='flex justify-center'>ค่าความเป็นกรด-ด่าง (pH)</CardHeader>
                        <Bar options={options} data={dataPH} />
                </Card>
                <Card className='px-4 pb-4'>
                    <CardHeader className='flex justify-center'>ค่าการนำไฟฟ้า (us/cm)</CardHeader>
                        <Bar options={options} data={dataEC} />
                </Card>
                <Card className='px-4 pb-4'>
                    <CardHeader className='flex justify-center'>ค่าความเข้มแสง (lux)</CardHeader>
                        <Bar options={options} data={dataLight} />
                </Card>
                <Card className='px-4 pb-4'>
                    <CardHeader className='flex justify-center'>ไนโตรเจน (mg/L)</CardHeader>
                        <Bar options={options} data={dataNitrogen} />
                </Card>
                <Card className='px-4 pb-4'>
                    <CardHeader className='flex justify-center'>ฟอสฟอรัส (mg/L)</CardHeader>
                        <Bar options={options} data={dataPhosphorus} />
                </Card>
                <Card className='px-4 pb-4'>
                    <CardHeader className='flex justify-center'>โพแทสเซียม (mg/L)</CardHeader>
                        <Bar options={options} data={dataPotassium} />
                </Card>
            </div>
        </div>
    )
}

export default Page