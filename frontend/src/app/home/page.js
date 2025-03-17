"use client";

import { Spinner } from '@nextui-org/react';
import axios from 'axios';
import { DateTime } from 'luxon';
import moment from 'moment';
import 'moment/locale/th';
import React, { useEffect, useState } from 'react'
import GaugeChart from 'react-gauge-chart';

function Page() {
    const [id, setId] = useState(null);
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    const [localtion, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [temp, setTemp] = useState(0);
    const [humidity, setHumidity] = useState(0);

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
    }, [id]);

    useEffect(() => {
        const fetchTMDDataNow = async () => {
            if (!lat || !lon) return;

            // ดึงวันที่และเวลาปัจจุบัน
            const thaiTime = DateTime.now().setZone('Asia/Bangkok');
            const date = thaiTime.toISODate();
            const hour = thaiTime.hour;
            const duration = 1;

            const url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/at?lat=${lat}&lon=${lon}&fields=tc,rh&date=${date}&hour=${hour}&duration=${duration}`;

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
        
                const forecasts = response.data.WeatherForecasts[0].forecasts;
                // ใช้ข้อมูลล่าสุด (ชั่วโมงแรก)
                setTemp(forecasts[0].data.tc || 0); // อุณหภูมิ (°C)
                setHumidity(forecasts[0].data.rh || 0); // ความชื้นสัมพัทธ์ (%)
            } catch (error) {
                console.error('Error fetching TMD data:', error);
            }
        };
    
        fetchTMDDataNow();
    }, [lat, lon]);

    if (!lat || !lon) {
        return <div className="flex justify-center pt-16">
            <Spinner size="lg" label="กำลังโหลดข้อมูล..." />
        </div>
    }

    return (
        <div className='flex flex-col items-center justify-center mt-10'>
            <p className='text-3xl pb-6'>กรุณาเลือกพืช</p>

            <p>ข้อมูลอุณหภูมิและความชื้น ตำบล {localtion}</p>
            <p>วันที่ {date} เวลา {time}.00 น.</p>
            <div className='flex justify-center space-around'>
                {/* อุณหภูมิ Gauge */}
                <div>
                <GaugeChart
                    id="temp-gauge"
                    nrOfLevels={20}
                    percent={temp / 50} // ปรับช่วงสูงสุด (สมมติ 50°C)
                    textColor="#000000"
                    formatTextValue={() => `${temp.toFixed(2)}°C`}
                    style={{width: 500}}
                />
                <h3 className='flex justify-center'>อุณหภูมิ (°C)</h3>
                </div>

                {/* ความชื้น Gauge */}
                <div>
                <GaugeChart
                    id="humidity-gauge"
                    nrOfLevels={10}
                    percent={humidity / 100} // ความชื้น 0-100%
                    textColor="#000000"
                    formatTextValue={() => `${humidity.toFixed(2)}%`}
                    style={{width: 500}}
                />
                <h3 className='flex justify-center'>ความชื้นสัมพัทธ์ (%)</h3>
                </div>
            </div>
        </div>
    )
}

export default Page