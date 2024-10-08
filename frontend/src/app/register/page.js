'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardBody, Heading, FormLabel, Input, InputGroup, InputRightElement, Textarea, Button, Stack, Flex } from '@chakra-ui/react'
import { toast } from 'react-toastify'

function Page() {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [email, setEmail] = useState("")
    const [tel, setTel] = useState("")
    const [address, setAddress] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(password != confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน!")
            return;
        }

        if(!firstname || !lastname || !email || !tel || !address || !username || !password || !confirmPassword) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!")
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname, lastname, email, tel, address, username, password
                })
            })

            if(res.ok) {
                const form = e.target
                form.reset()
                toast.success("ลงทะเบียนสำเร็จแล้ว", {
                    autoClose: 1500
                })

                setTimeout(() => {
                    router.push('/')
                }, 1500)
                    
            }
            else {
                toast.warn("อีเมลหรือชื่อผู้ใช้นี้ ได้รับการลงทะเบียนแล้ว")
                return;
            }
        }
        catch (err) {
            console.log("Error", err)
        }
    }

    return(
        <Stack className="w-[100vw] h-[100vh]">
            <Card className="m-auto w-1/2 drop-shadow-2xl bg-blend-darken">
                <CardHeader>
                    <Heading size='lg'>สมัครสมาชิก</Heading>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
                        <Flex gap='4'>
                            <FormLabel className='mt-2'>ชื่อจริง</FormLabel>
                            <Input onChange={(e) => setFirstname(e.target.value)} placeholder='ชื่อจริง' size='md' className='w-1' />

                            <FormLabel className='mt-2'>นามสกุล</FormLabel>
                            <Input onChange={(e) => setLastname(e.target.value)} placeholder='นามสกุล' size='md' />
                        </Flex>
                        <Flex>
                            <FormLabel className='mt-2'>อีเมล</FormLabel>
                            <Input onChange={(e) => setEmail(e.target.value)} type='email' placeholder='อีเมล' size='md' />
                            &emsp;
                            <FormLabel className='mt-2'>เบอร์โทรศัพท์</FormLabel>
                            <Input onChange={(e) => setTel(e.target.value)} placeholder='เบอร์โทรศัพท์' size='md' />
                        </Flex>
                        <br />
                        <FormLabel className='mt-2'>ที่อยู่</FormLabel>
                        <Textarea onChange={(e) => setAddress(e.target.value)} placeholder='ที่อยู่' />
                        <br /><br />
                        <FormLabel>ชื่อผู้ใช้</FormLabel>
                        <Input onChange={(e) => setUsername(e.target.value)} placeholder='ชื่อผู้ใช้' size='md' />
                        <br /><br />
                        <FormLabel>รหัสผ่าน</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                onChange={(e) => setPassword(e.target.value)}
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='รหัสผ่าน'
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'ซ่อน' : 'แสดง'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <br />
                        <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                        <InputGroup size='md'>
                            <Input
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='ยืนยันรหัสผ่าน'
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'ซ่อน' : 'แสดง'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <br />
                        <Button colorScheme='blue' type='submit' className='w-full'>สมัครสมาชิก</Button>
                    </form>
                </CardBody>
                    
            </Card>
        </Stack>
    )
}

export default Page