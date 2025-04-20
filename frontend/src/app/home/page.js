"use client";

import React, { useEffect, useState } from 'react'
import { Card, Spinner } from '@nextui-org/react';
import axios from 'axios';
import { DateTime } from 'luxon';
import moment from 'moment';
import 'moment/locale/th';
import AOS from 'aos';
import 'aos/dist/aos.css';
import GaugeChart from 'react-gauge-chart';
import WeatherCardHourly from '../components/WeatherCardHourly';
import WeatherCardDaily from '../components/WeatherCardDaily';

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

            const url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/hourly/at?lat=${lat}&lon=${lon}&fields=tc,rh,rain,ws10m,cond&date=${date}&hour=${hour}&duration=${duration}`;

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
            const duration = 10;

            const url = `https://data.tmd.go.th/nwpapi/v1/forecast/location/daily/at?lat=${lat}&lon=${lon}&fields=tc_max,tc_min,rh,rain,ws10m,cond&date=${date}&duration=${duration}`;

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

    useEffect(() => {
        AOS.init({
            duration: 500,
            easing: 'ease-in-out',
            once: true,
        });
    }, []);

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
        <div className="container mx-auto max-w-[1200px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-4">
                <Card className="col-span-1 sm:col-span-2 p-4 pb-4 drop-shadow-xl items-center" data-aos="fade-up">
                    <p>ข้อมูลสภาพอากาศ ตำบล {localtion}</p>
                    <p>วันที่ {date} เวลา {time}.00 น.</p>
                    <p className='pt-4 text-lg font-bold sm:text-xl md:text-2xl lg:text-4xl'>{weatherCondition(condition)}</p>
                </Card>
                <Card className="items-center p-4 drop-shadow-xl" data-aos="fade-up">
                    <div className='w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]'>
                        <GaugeChart
                            id="temp-gauge"
                            nrOfLevels={20}
                            percent={temp / 50}
                            textColor="#A0A0A0"
                            formatTextValue={() => `${temp.toFixed(2)}°C`}
                        />
                    </div>
                    <p className='flex justify-center'>อุณหภูมิ (°C)</p>
                </Card>
                <Card className="items-center p-4 drop-shadow-xl" data-aos="fade-up">
                    <div className='w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]'>
                        <GaugeChart
                            id="humidity-gauge"
                            nrOfLevels={10}
                            percent={humidity / 100}
                            textColor="#A0A0A0"
                            formatTextValue={() => `${humidity.toFixed(2)}%`}
                        />
                    </div>
                    <p className='flex justify-center'>ความชื้นสัมพัทธ์ (%)</p>
                </Card>
                <Card className="col-span-1 sm:col-span-2 p-4 pb-4 drop-shadow-xl" data-aos="fade-up">
                    <p>พยากรณ์อากาศรายชั่วโมง</p>
                    <div className="flex overflow-x-auto p-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {weatherHourly.map((forecast, index) => (
                            <div key={index} className="snap-start">
                                <WeatherCardHourly
                                    key={index}
                                    time={forecast.time}
                                    temp={forecast.data.tc}
                                    humid={forecast.data.rh}
                                    rainChance={forecast.data.rain}
                                    windSpeed={forecast.data.ws10m}
                                    condition={forecast.data.cond}
                                />
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="col-span-1 sm:col-span-2 p-4 pb-4 drop-shadow-xl" data-aos="fade-up">
                    <p>พยากรณ์อากาศรายวัน</p>
                    <div className="flex overflow-x-auto p-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {weatherDaily.map((forecast, index) => (
                            <div key={index} className="snap-start">
                                <WeatherCardDaily
                                    key={index}
                                    time={forecast.time}
                                    tempMax={forecast.data.tc_max}
                                    tempMin={forecast.data.tc_min}
                                    humid={forecast.data.rh}
                                    rainChance={forecast.data.rain}
                                    windSpeed={forecast.data.ws10m}
                                    condition={forecast.data.cond}
                                />
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="col-span-1 sm:col-span-2 p-4 pb-4 drop-shadow-xl" data-aos="fade-up">
                    <iframe src="https://www.tmd.go.th/StromTrack" className='w-full' height="600" frameborder="0" />
                </Card>
                <Card className="col-span-1 sm:col-span-2 p-4 pb-4 drop-shadow-xl" data-aos="fade-up">
                    <iframe src= "https://www.tmd.go.th/weatherEarthquakeWidget" className='w-full' height="600" frameborder="0" />
                </Card>
            </div>
        </div>
    )
}

export default Home