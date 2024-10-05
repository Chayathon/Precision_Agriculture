'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Cookies from 'js-cookie';
import { Flex, Card, CardHeader, CardBody, Heading, FormLabel, Input, InputGroup, InputRightElement, Button, Stack, Text, Alert, AlertIcon, AlertTitle } from '@chakra-ui/react'
import { toast } from 'react-toastify';

function Page() {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!username || !password) {
            toast.error("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน")
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username, password
                })
            })

            const data = await res.json()

            if(res.ok && data.message == 'Login Successfully') {
                Cookies.set('Token', data.token, { expires: 1 })
                Cookies.set('UserData', JSON.stringify(data.resultData), { expires: 1 })
                localStorage.setItem("Token", data.token);
                localStorage.setItem("UserData", JSON.stringify(data.resultData))
                
                toast.success("เข้าสู่ระบบแล้ว")
                router.push(data.path)
                // const form = e.target
                // form.reset()
            }
            else {
                toast.error("ชื่อผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง!")
                return;
            }
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    return(
        <Stack className="w-[100vw] h-[100vh]">
            <Card className="m-auto w-1/3 drop-shadow-2xl bg-blend-darken">
                <CardHeader>
                    <Heading size='lg'>เข้าสู่ระบบ</Heading>
                </CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit}>
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
                        <Button colorScheme='green' type='submit' className='w-full'>เข้าสู่ระบบ</Button><br />
                        <Flex className='justify-between'>
                            <Text>ยังไม่มีบัญชี? <Link href='/register' className='text-blue-500 hover:underline'>สมัครสมาชิก</Link></Text>
                            <Link href='/forgotPassword' className='text-blue-600 hover:underline'>ลืมรหัสผ่าน</Link>
                        </Flex>
                    </form>
                </CardBody>
            </Card>
        </Stack>
    )
}

export default Page