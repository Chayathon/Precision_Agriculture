import React, { useState, useEffect, useRef } from 'react'
import { Flex, FormLabel, Input, InputGroup, InputRightElement, Textarea, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, } from '@chakra-ui/react'
import { toast } from 'react-toastify'

function ModalUpdateUser({ isOpen, onClose, id, setRefresh }) {
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
            const fetchData = async () => {
                try {
                    const res = await fetch(`http://localhost:4000/api/getUser/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setFirstname(data.resultData.firstname)
                    setLastname(data.resultData.lastname)
                    setEmail(data.resultData.email)
                    setTel(data.resultData.tel)
                    setAddress(data.resultData.address)
                    setUsername(data.resultData.username)
                    setPassword(data.resultData.password)
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData()
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!firstname || !lastname || !email || !tel || !address) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!")
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/updateUser/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname, lastname, email, tel, address
                })
            })

            if(res.ok) {
                const form = e.target
                form.reset()

                toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว")  
                onClose();
                setRefresh(true)

                setTimeout(() => {
                    setRefresh(false)
                }, 1000)
            }
            else {
                toast.error("แก้ไขข้อมูลล้มเหลว")
                return;
            }
        } catch (err) {
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
                    <ModalHeader>แก้ไขข้อมูล</ModalHeader>
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
                            <Input value={username} placeholder='ชื่อผู้ใช้' size='md' disabled />
                            <br /><br />
                            <FormLabel>รหัสผ่าน</FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    value={password}
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='รหัสผ่าน'
                                    disabled
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                                        {show ? 'ซ่อน' : 'แสดง'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <br />

                            <div className='flex justify-end pt-4 pb-2 '>
                                <Button type='submit' colorScheme='blue' mr={3}>
                                    แก้ไข
                                </Button>
                                <Button onClick={onClose}>ยกเลิก</Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalUpdateUser