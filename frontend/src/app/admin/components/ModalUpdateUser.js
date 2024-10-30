import React, { useState, useEffect, useRef } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, user } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalUpdateUser({ isOpen, onClose, id, setRefresh }) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

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
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                size={"2xl"}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">เพิ่มข้อมูล</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit}>
                                    <div className='flex my-4 gap-4'>
                                        <Input onChange={(e) => setFirstname(e.target.value)} type='text' value={firstname} label='ชื่อจริง' isClearable isRequired />

                                        <Input onChange={(e) => setLastname(e.target.value)} type='text' value={lastname} label='นามสกุล' isClearable isRequired />
                                    </div>
                                    <div className='flex my-4 gap-4'>
                                        <Input onChange={(e) => setEmail(e.target.value)} type='email' value={email} label='อีเมล' isClearable isRequired />

                                        <Input onChange={(e) => setTel(e.target.value)} type='text' value={tel} label='เบอร์โทรศัพท์' maxLength='10' isClearable isRequired />
                                    </div>
                                    <div className='my-4'>
                                        <Textarea onChange={(e) => setAddress(e.target.value)} value={address} label='ที่อยู่' isRequired />
                                    </div>
                                    <div className='my-4'>
                                        <Input onChange={(e) => setUsername(e.target.value)} type='text' value={username} label='ชื่อผู้ใช้' isClearable disabled />
                                    </div>
                                    <div className='my-4'>
                                        <Input
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            label="รหัสผ่าน"
                                            endContent={
                                                <Button type="button" size="sm" className='bg-gray-300' onClick={toggleVisibility} aria-label="toggle password visibility">
                                                {isVisible ? (
                                                    'ซ่อน'
                                                ) : (
                                                    'แสดง'
                                                )}
                                                </Button>
                                            }
                                            type={isVisible ? "text" : "password"}
                                            disabled
                                        />
                                    </div>
                                    <ModalFooter>
                                        <Button variant="flat" onPress={onClose}>
                                            ยกเลิก
                                        </Button>
                                        <Button color="success" onPress={handleSubmit}>
                                            แก้ไข
                                        </Button>
                                    </ModalFooter>
                                </form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* <Modal
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
            </Modal> */}
        </>
    )
}

export default ModalUpdateUser