"use client";

import { Card, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import axios from 'axios';
import { DateTime } from 'luxon';
import moment from 'moment';
import 'moment/locale/th';
import React, { useEffect, useState } from 'react'
import GaugeChart from 'react-gauge-chart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from 'react-chartjs-2';

function Home() {
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);

    const [localtion, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const [temp, setTemp] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [condition, setCondition] = useState('');

    const [weatherHourly, setWeatherHourly] = useState([]);
    const [weatherDaily, setWeatherDaily] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const user = JSON.parse(localStorage.getItem('UserData') || '{}')
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getUser/${user.id}`);
    
                if (res.status === 200) {
                    const data = await res.json();
                    setLat(data.resultData.subdistrictRel.lat);
                    setLon(data.resultData.subdistrictRel.long);
                    setLocation(data.resultData.subdistrictRel.name_th);
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const thaiTime = DateTime.now().setZone('Asia/Bangkok');

        const fetchTMDDataNow = async () => {
            if (!lat || !lon) return;

            // ดึงวันที่และเวลาปัจจุบัน
            const date = thaiTime.toISODate();
            const hour = thaiTime.hour;
            const duration = 1;

            const url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/at?lat=${lat}&lon=${lon}&fields=tc,rh,cond&date=${date}&hour=${hour}&duration=${duration}`;

            moment.locale('th');
            setDate(moment(date).format('DD MMMM') + ' ' + (parseInt(moment(date).format('YYYY')) + 543));
            setTime(hour);

            try {
                const response = await axios.get(url, {
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${process.env.NEXT_PUBLIC_TMD_TOKEN}`,
                },
                });
        
                const forecasts = await response.data.WeatherForecasts[0].forecasts;
                // ใช้ข้อมูลล่าสุด (ชั่วโมงแรก)
                setTemp(forecasts[0].data.tc || 0); // อุณหภูมิ (°C)
                setHumidity(forecasts[0].data.rh || 0); // ความชื้นสัมพัทธ์ (%)
                setCondition(forecasts[0].data.cond || 0); // สภาพอากาศโดยทั่วไป
            } catch (error) {
                console.error('Error fetching TMD data:', error);
            }
        };

        const fetchTMDDataHourly = async () => {
            if (!lat || !lon) return;

            // ดึงวันที่และเวลาปัจจุบัน
            const date = thaiTime.toISODate();
            const hour = thaiTime.hour;
            const duration = 24;

            const url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/at?lat=${lat}&lon=${lon}&fields=tc,rh,rain&date=${date}&hour=${hour}&duration=${duration}`;

            try {
                const response = await axios.get(url, {
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${process.env.NEXT_PUBLIC_TMD_TOKEN}`,
                },
                });
        
                const forecasts = await response.data.WeatherForecasts[0].forecasts;
                setWeatherHourly(forecasts || []);
            } catch (error) {
                console.error('Error fetching TMD data:', error);
            }
        };

        const fetchTMDDataDaily = async () => {
            if (!lat || !lon) return;

            // ดึงวันที่และเวลาปัจจุบัน
            const date = thaiTime.toISODate();
            const duration = 14;

            const url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/daily/at?lat=${lat}&lon=${lon}&fields=tc_max,tc_min,rh,rain,cond&date=${date}&duration=${duration}`;

            try {
                const response = await axios.get(url, {
                headers: {
                    accept: 'application/json',
                    authorization: `Bearer ${process.env.NEXT_PUBLIC_TMD_TOKEN}`,
                },
                });
        
                const forecasts = await response.data.WeatherForecasts[0].forecasts;
                setWeatherDaily(forecasts || []);
            } catch (error) {
                console.error('Error fetching TMD data:', error);
            }
        };
    
        fetchTMDDataNow();
        fetchTMDDataHourly();
        fetchTMDDataDaily();
    }, [lat, lon]);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        LineElement,
        PointElement,
        Tooltip,
        Legend
    );
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    const weatherHourlyChart = (data) => {
        if (!data) {
            return {
                labels: [],
                datasets: []
            };
        }
        return {
            labels: data.map(item => moment(item.time).format('HH:MM')),
            datasets: [
                {
                    label: "อุณหภูมิ (°C)",
                    data: data.map(item => item.data.tc),
                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                    borderColor: "rgba(255, 0, 0, 1)",
                },
                {
                    label: "ความชื้น (%)",
                    data: data.map(item => item.data.rh),
                    backgroundColor: "rgba(0, 200, 255, 0.5)",
                    borderColor: "rgba(0, 200, 255, 1)",
                },
                {
                    label: "ปริมาณฝน (mm)",
                    data: data.map(item => item.data.rain),
                    backgroundColor: "rgba(0, 0, 255, 0.5)",
                    borderColor: "rgba(0, 0, 255, 1)",
                },
            ],
        }
    };

    const weatherCondition = (conditionCode) => {
        switch (conditionCode) {
            case 1:
                return "ท้องฟ้าแจ่มใส (Clear)";
            case 2:
                return "มีเมฆบางส่วน (Partly cloudy)";
            case 3:
                return "มีเมฆเป็นส่วนมาก (Cloudy)";
            case 4:
                return "มีเมฆมาก (Overcast)";
            case 5:
                return "ฝนตกเล็กน้อย (Light rain)";
            case 6:
                return "ฝนปานกลาง (Moderate rain)";
            case 7:
                return "ฝนตกหนัก (Heavy rain)";
            case 8:
                return "ฝนฟ้าคะนอง (Thunderstorm)";
            case 9:
                return "อากาศหนาวจัด (Very cold)";
            case 10:
                return "อากาศหนาว (Cold)";
            case 11:
                return "อากาศเย็น (Cool)";
            case 12:
                return "อากาศร้อนจัด (Very hot)";
            default:
                return "ไม่ทราบสภาพอากาศ";
        }
    };

    if (!temp || !humidity || !condition) {
        return <div className="flex justify-center pt-16">
            <Spinner size="lg" label="กำลังโหลดข้อมูล..." />
        </div>
    }

    return (
        <div className='flex flex-col items-center justify-center m-4'>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="col-span-1 lg:col-span-2 p-4 pb-4 drop-shadow-xl items-center">
                    <p>ข้อมูลสภาพอากาศ ตำบล {localtion}</p>
                    <p>วันที่ {date} เวลา {time}.00 น.</p>
                    <p className='pt-4 text-lg font-bold sm:text-xl md:text-2xl lg:text-4xl'>{weatherCondition(condition)}</p>
                </Card>
                <Card className="items-center p-4 pb-4 drop-shadow-xl">
                    <GaugeChart
                        id="temp-gauge"
                        nrOfLevels={20}
                        percent={temp / 50}
                        textColor="#000000"
                        formatTextValue={() => `${temp.toFixed(2)}°C`}
                        style={{
                            width: '400px'
                        }}
                    />
                    <p className='flex justify-center'>อุณหภูมิ (°C)</p>
                </Card>
                <Card className="items-center p-4 pb-4 drop-shadow-xl">
                    <GaugeChart
                        id="humidity-gauge"
                        nrOfLevels={10}
                        percent={humidity / 100}
                        textColor="#000000"
                        formatTextValue={() => `${humidity.toFixed(2)}%`}
                        style={{
                            width: '400px'
                        }}
                    />
                    <p className='flex justify-center'>ความชื้นสัมพัทธ์ (%)</p>
                </Card>
                <Card className="col-span-1 lg:col-span-2 p-4 pb-4 drop-shadow-xl">
                    <p className='flex justify-center'>พยากรณ์อากาศรายชั่วโมง</p>
                    <Line
                        options={options}
                        data={weatherHourlyChart(weatherHourly)}
                    />
                </Card>
                <Card className="col-span-1 lg:col-span-2 p-4 pb-4 drop-shadow-xl">
                    <p className='flex justify-center pb-2'>พยากรณ์อากาศรายวัน</p>
                    <Table removeWrapper aria-label="Weather Daily">
                        <TableHeader>
                            <TableColumn>วันที่</TableColumn>
                            <TableColumn>อุณหภูมิสูงสุด</TableColumn>
                            <TableColumn>อุณหภูมิต่ำสุด</TableColumn>
                            <TableColumn>ความชื้นเฉลี่ย</TableColumn>
                            <TableColumn>ปริมาณฝน</TableColumn>
                            <TableColumn>สภาพอากาศโดยรวม</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {weatherDaily.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{moment(item.time).format('DD MMMM') + ' ' + (parseInt(moment(item.time).format('YYYY')) + 543)}</TableCell>
                                    <TableCell>{item.data.tc_max}°C</TableCell>
                                    <TableCell>{item.data.tc_min}°C</TableCell>
                                    <TableCell>{item.data.rh}%</TableCell>
                                    <TableCell>{item.data.rain}mm</TableCell>
                                    <TableCell>{weatherCondition(item.data.cond)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}

export default Home