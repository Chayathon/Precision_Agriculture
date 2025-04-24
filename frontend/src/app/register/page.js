'use client';

import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { toast } from 'react-toastify'
import {Card, CardHeader, CardBody, CardFooter, Input, Textarea, Button, Select, SelectItem} from "@nextui-org/react";
import { FaUserCheck } from 'react-icons/fa6';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

function Register() {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [address, setAddress] = useState({
        detail: "",
        province: "",
        district: "",
        subdistrict: "",
    });
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/provinces`);
    
                if(res.status === 200) {
                    const data = await res.json();
                    setProvinces(data.resultData);
                }
            } catch (error) {
                console.error("Failed to fetch", error);
            }
        }

        fetchProvinces();
    }, []);
    
    useEffect(() => {
        if (address?.province) {
            const fetchDistricts = async (provinceId) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/province/${provinceId}/districts`);
        
                    if(res.status === 200) {
                        const data = await res.json();
                        setDistricts(data.resultData);
                    }
                } catch (error) {
                    console.error("Failed to fetch", error);
                }
            }
            fetchDistricts(address?.province);

            setAddress(prev => ({
                ...prev,
                district: "",
                subdistrict: ""
            }));
        } else {
            setAddress(prev => ({
                ...prev,
                district: "",
                subdistrict: ""
            }));
        }
    }, [address?.province]);
    
    useEffect(() => {
        if (address?.district) {
            const fetchSubdistricts = async (districtId) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/district/${districtId}/subdistricts`);
        
                    if(res.status === 200) {
                        const data = await res.json();
                        setSubdistricts(data.resultData);
                    }
                } catch (error) {
                    console.error("Failed to fetch", error);
                }
            }
            fetchSubdistricts(address?.district);

            setAddress(prev => ({
                ...prev,
                subdistrict: ""
            }));
        } else {
            setAddress(prev => ({
                ...prev,
                subdistrict: ""
            }));
        }
    }, [address?.district]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(password != confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน!");
            setIsLoading(false);
            return;
        }

        if(!firstname || !lastname || !email || !tel || !address || !username || !password || !confirmPassword) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    tel,
                    address: address.detail,
                    province: address.province,
                    district: address.district,
                    subdistrict: address.subdistrict,
                    username,
                    password
                })
            });

            if(res.status === 201) {
                const form = e.target;
                form.reset();
                toast.success("สำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยัน");
            }
            else if (res.status === 400) {
                toast.warn("อีเมลหรือชื่อผู้ใช้นี้ ได้รับการลงทะเบียนแล้ว");
            } else {
                toast.error(data.message || "เกิดข้อผิดพลาด");
            }
        } catch (error) {
            console.error("Register Error:", error.message, error.stack);
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="grid w-[100vw] h-[100vh]">
            <Card className="m-auto drop-shadow-2xl bg-blend-darken w-11/12 max-sm:my-4 sm:w-2/3 md:w-3/4 lg:w-4/5 xl:w-1/2">
                <CardHeader className='px-4 text-2xl font-bold justify-between'>
                    สมัครสมาชิก
                    <ThemeSwitcher size="md" />
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <div className='sm:flex my-4 gap-4'>
                            <Input onChange={(e) => setFirstname(e.target.value)} className='max-sm:my-4' type='text' label='ชื่อจริง' autoFocus isClearable isRequired />

                            <Input onChange={(e) => setLastname(e.target.value)} type='text' label='นามสกุล' isClearable isRequired />
                        </div>
                        <div className='sm:flex my-4 gap-4'>
                            <Input onChange={(e) => setEmail(e.target.value)} className='max-sm:my-4' type='email' label='อีเมล' isClearable isRequired />

                            <Input onChange={(e) => setTel(e.target.value)} type='text' label='เบอร์โทรศัพท์' maxLength='10' isClearable isRequired />
                        </div>
                        <div className='my-4'>
                            <Textarea
                                onChange={(e) => setAddress(prev => ({
                                    ...prev,
                                    detail: e.target.value
                                }))}
                                type='text'
                                label='ที่อยู่'
                                placeholder='บ้านเลขที่, ซอย, ถนน, หมู่ที่...'
                                maxRows={2}
                                isClearable
                                isRequired
                            />
                        </div>
                        <div className='md:flex my-4 gap-4'>
                            <Select
                                onChange={(e) => setAddress(prev => ({
                                    ...prev,
                                    province: e.target.value
                                }))}
                                items={provinces}
                                label='จังหวัด'
                                placeholder='เลือกจังหวัด'
                                isRequired
                            >
                                {(item) => <SelectItem key={item.province_id}>{item.name_th}</SelectItem>}
                            </Select>
                            
                            <Select
                                className='max-md:my-4'
                                onChange={(e) => setAddress(prev => ({
                                    ...prev,
                                    district: e.target.value
                                }))}
                                items={districts}
                                label='เขต/อำเภอ'
                                placeholder='เลือกเขต/อำเภอ'
                                selectedKeys={address.district ? [address.district] : []}
                                isDisabled={!address?.province}
                                isRequired
                            >
                                {(item) => <SelectItem key={item.district_id}>{item.name_th}</SelectItem>}
                            </Select>
                            
                            <Select
                                onChange={(e) => setAddress(prev => ({
                                    ...prev,
                                    subdistrict: e.target.value
                                }))}
                                items={subdistricts}
                                label='แขวง/ตำบล'
                                placeholder='เลือกแขวง/ตำบล'
                                selectedKeys={address.subdistrict ? [address.subdistrict] : []}
                                isDisabled={!address?.district}
                                isRequired
                            >
                                {(item) => <SelectItem key={item.subdistrict_id}>{item.name_th}</SelectItem>}
                            </Select>
                        </div>
                        <div className='my-4'>
                            <Input onChange={(e) => setUsername(e.target.value)} type='text' label='ชื่อผู้ใช้' isClearable isRequired />
                        </div>
                        <div className='sm:flex my-4 gap-4'>
                            <Input
                                className='max-sm:my-4'
                                onChange={(e) => setPassword(e.target.value)}
                                label="รหัสผ่าน"
                                endContent={
                                    <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibility} aria-label="toggle password visibility">
                                        {isVisible ? 'ซ่อน' : 'แสดง'}
                                    </Button>
                                }
                                type={isVisible ? "text" : "password"}
                                isRequired
                            />

                            <Input
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                label="ยืนยันรหัสผ่าน"
                                endContent={
                                    <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibility} aria-label="toggle password visibility">
                                        {isVisible ? 'ซ่อน' : 'แสดง'}
                                    </Button>
                                }
                                type={isVisible ? "text" : "password"}
                                isRequired
                            />
                        </div>
                        <Button
                            color='primary'
                            type='submit'
                            className='w-full'
                            isLoading={isLoading}
                            disabled={isLoading}
                            aria-label={isLoading ? 'กำลังสมัครสมาชิก' : 'สมัครสมาชิก'}
                        >
                            {isLoading ? 'กำลังสมัครสมาชิก' : 'สมัครสมาชิก'} <FaUserCheck size={18} />
                        </Button>
                    </form>
                </CardBody>
                <CardFooter className='flex justify-between'>
                    <p>มีบัญชีอยู่แล้ว? <Link href='/' className='text-blue-500 hover:underline'>เข้าสู่ระบบ</Link></p>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Register