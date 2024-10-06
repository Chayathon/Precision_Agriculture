import React, { useState, useRef } from 'react'
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

function ModalUpdate({ isOpen, onClose, id }) {
    const initialRef = useRef(null)
    const finalRef = useRef(null)

    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const handleSubmit = () => {

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

export default ModalUpdate