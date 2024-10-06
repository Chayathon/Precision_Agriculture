import React, { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import {
        Flex,
        FormLabel,
        Input,
        InputGroup,
        InputRightElement,
        Textarea,
        Modal,
        ModalOverlay,
        ModalContent,
        ModalHeader,
        ModalFooter,
        ModalBody,
        ModalCloseButton,
        Button,
    } from '@chakra-ui/react'

function ModalUpdateAdmin({ isOpen, onClose, id }) {
    const initialRef = useRef(null)
    const finalRef = useRef(null)

    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [tel, setTel] = useState('')
    const [address, setAddress] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        if(isOpen) {
            const fetchData = async (id) => {
                try {
                    const res = await fetch(`http://localhost:4000/api/getUser/${id}`);
                        const data = await res.json();
                        
                        setFirstname(data.firstname)
                        setLastname(data.lastname)
                        setEmail(data.email)
                        setTel(data.tel)
                        setAddress(data.address)
                        setUsername(data.username)
                        setPassword(data.password)

                        console.log(data.firstname)
                        console.log(data.lastname)
                        console.log(data.email)
                        console.log(data.tel)
                        console.log(data.address)
                        console.log(data.username)
                        console.log(data.password)
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }
                }
                catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData(id)
        }
    }, [isOpen, id])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!firstname || !lastname || !email || !tel || !address || !username || !password) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!")
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/updateAdmin/${id}`, {
                method: 'PUT',
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
                toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว")  
            }
            else {
                toast.error("แก้ไขข้อมูลล้มเหลว")
                return;
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                size={'xl'}
                isOpen={isOpen}
                onClose={onClose}
            >

                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>แก้ไขข้อมูล {id}</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <Flex gap='4'>
                                <FormLabel className='mt-2'>ชื่อจริง</FormLabel>
                                <Input onChange={(e) => setFirstname(e.target.value)} value={firstname} placeholder='ชื่อจริง' size='md' className='w-1' />

                                <FormLabel className='mt-2'>นามสกุล</FormLabel>
                                <Input onChange={(e) => setLastname(e.target.value)} value={lastname} placeholder='นามสกุล' size='md' />
                            </Flex>
                            <Flex>
                                <FormLabel className='mt-2'>อีเมล</FormLabel>
                                <Input onChange={(e) => setEmail(e.target.value)} value={email} type='email' placeholder='อีเมล' size='md' />
                                &emsp;
                                <FormLabel className='mt-2'>เบอร์โทรศัพท์</FormLabel>
                                <Input onChange={(e) => setTel(e.target.value)} value={tel} placeholder='เบอร์โทรศัพท์' size='md' />
                            </Flex>
                            <br />
                            <FormLabel className='mt-2'>ที่อยู่</FormLabel>
                            <Textarea onChange={(e) => setAddress(e.target.value)} value={address} placeholder='ที่อยู่' />
                            <br /><br />
                            <FormLabel>ชื่อผู้ใช้</FormLabel>
                            <Input onChange={(e) => setUsername(e.target.value)} value={username} placeholder='ชื่อผู้ใช้' size='md' />
                            <br /><br />
                            <FormLabel>รหัสผ่าน</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
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
                        </form>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3}>
                            แก้ไข
                        </Button>
                        <Button onClick={onClose}>ยกเลิก</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalUpdateAdmin