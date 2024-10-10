import React, { useState, useRef } from 'react'
import { Flex, FormLabel, Input, InputGroup, InputRightElement, Textarea, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, } from '@chakra-ui/react'
import { toast } from 'react-toastify'

function ModalCreateRole({ isOpen, onClose, setRefresh }) {
    const initialRef = useRef(null)
    const finalRef = useRef(null)

    const [roleName, setRoleName] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!roleName) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!")
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/createRole', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roleName
                })
            })

            if(res.ok) {
                const form = e.target
                form.reset()

                toast.success("เพิ่มข้อมูลเรียบร้อยแล้ว")
                onClose();
                setRefresh(true)

                setTimeout(() => {
                    setRefresh(false)
                }, 1000)
                    
            }
            else {
                toast.warn("เพิ่มข้อมูลล้มเหลว")
                return;
            }
        }
        catch (err) {
            console.log("Error", err)
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
                    <ModalHeader>เพิ่มข้อมูล</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <FormLabel>ตำแหน่ง</FormLabel>
                            <Input onChange={(e) => setRoleName(e.target.value)} placeholder='ตำแหน่ง' size='md' />

                            <div className='flex justify-end pt-4 pb-2 '>
                                <Button type='submit' colorScheme='green' mr={3}>
                                    เพิ่ม
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

export default ModalCreateRole