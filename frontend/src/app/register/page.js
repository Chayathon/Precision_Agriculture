'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import {Card, CardHeader, CardBody, CardFooter, Input, Textarea, Button, Autocomplete, AutocompleteItem, Select, SelectItem} from "@nextui-org/react";
import { toast } from 'react-toastify'

function Page() {
    const router = useRouter();

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

    const fetchProvinces = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/provinces`);

            if(res.status === 200) {
                const data = await res.json();
                setProvinces(data.resultData);
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        }
    }

    const fetchDistricts = async (provinceId) => {
        try {
            const res = await fetch(`http://localhost:4000/api/province/${provinceId}/districts`);

            if(res.status === 200) {
                const data = await res.json();
                setDistricts(data.resultData);
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        }
    }

    const fetchSubdistricts = async (districtId) => {
        try {
            const res = await fetch(`http://localhost:4000/api/district/${districtId}/subdistricts`);

            if(res.status === 200) {
                const data = await res.json();
                setSubdistricts(data.resultData);
            }
        } catch (error) {
            console.error("Failed to fetch", error);
        }
    }

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        console.log("Province:", address?.province);
        if(address?.province) {
            fetchDistricts(address?.province);
        }
    }, [address?.province]);

    useEffect(() => {
        console.log("District:", address?.district);
        if(address?.district) {
            fetchSubdistricts(address?.district);
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
            const res = await fetch('http://localhost:4000/api/register', {
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

            if(res.ok) {
                const form = e.target;
                form.reset();
                toast.success("ลงทะเบียนสำเร็จแล้ว", {
                    autoClose: 1500,
                });

                setTimeout(() => {
                    router.push('/');
                }, 1500)
                    
            }
            else {
                toast.warn("อีเมลหรือชื่อผู้ใช้นี้ ได้รับการลงทะเบียนแล้ว", {
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.log("Error", err)
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="grid w-[100vw] h-[100vh]">
            <Card className="m-auto w-1/2 drop-shadow-2xl bg-blend-darken">
                <CardHeader className='text-2xl font-bold justify-center'>
                    สมัครสมาชิก
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <div className='flex my-4 gap-4'>
                            <Input onChange={(e) => setFirstname(e.target.value)} type='text' label='ชื่อจริง' autoFocus isClearable isRequired />

                            <Input onChange={(e) => setLastname(e.target.value)} type='text' label='นามสกุล' isClearable isRequired />
                        </div>
                        <div className='flex my-4 gap-4'>
                            <Input onChange={(e) => setEmail(e.target.value)} type='email' label='อีเมล' isClearable isRequired />

                            <Input onChange={(e) => setTel(e.target.value)} type='text' label='เบอร์โทรศัพท์' maxLength='10' isClearable isRequired />
                        </div>
                        {/* <div className='my-4'>
                            <Textarea onChange={(e) => setAddress(e.target.value)} label='ที่อยู่' isRequired />
                        </div> */}
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
                                isRequired
                            />
                        </div>
                        <div className='flex my-4 gap-4'>
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
                                onChange={(e) => setAddress(prev => ({
                                    ...prev,
                                    district: e.target.value
                                }))}
                                items={districts}
                                label='เขต/อำเภอ'
                                placeholder='เลือกเขต/อำเภอ'
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
                                isDisabled={!address.district}
                                isRequired
                            >
                                {(item) => <SelectItem key={item.subdistrict_id}>{item.name_th}</SelectItem>}
                            </Select>
                        </div>
                        <div className='my-4'>
                            <Input onChange={(e) => setUsername(e.target.value)} type='text' label='ชื่อผู้ใช้' isClearable isRequired />
                        </div>
                        <div className='my-4'>
                            <Input
                                onChange={(e) => setPassword(e.target.value)}
                                label="รหัสผ่าน"
                                endContent={
                                    <Button type="button" size="sm" className='bg-gray-300' onPress={toggleVisibility} aria-label="toggle password visibility">
                                    {isVisible ? (
                                        'ซ่อน'
                                    ) : (
                                        'แสดง'
                                    )}
                                    </Button>
                                }
                                type={isVisible ? "text" : "password"}
                                isRequired
                            />
                        </div>
                        <div className='my-4'>
                            <Input
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                label="ยืนยันรหัสผ่าน"
                                endContent={
                                    <Button type="button" size="sm" className='bg-gray-300' onPress={toggleVisibility} aria-label="toggle password visibility">
                                    {isVisible ? (
                                        'ซ่อน'
                                    ) : (
                                        'แสดง'
                                    )}
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
                        >
                            {isLoading ? 'กำลังสมัครสมาชิก' : 'สมัครสมาชิก'}
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

export default Page