import React, { useState, useEffect, useRef } from 'react'
import { Flex, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, } from '@chakra-ui/react'
import { toast } from 'react-toastify'

function ModalUpdateRole({ isOpen, onClose, id, setRefresh }) {
    const initialRef = useRef(null)
    const finalRef = useRef(null)

    const [roleName, setRoleName] = useState('')

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`http://localhost:4000/api/getRole/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setRoleName(data.resultData.role_name);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData()
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!roleName) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!")
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/updateRole/${id}`, {
                method: 'PUT',
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
                            <FormLabel>ตำแหน่ง</FormLabel>
                            <Input onChange={(e) => setRoleName(e.target.value)} value={roleName} placeholder='ตำแหน่ง' size='md' />

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

export default ModalUpdateRole