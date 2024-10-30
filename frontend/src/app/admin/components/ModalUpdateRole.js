import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalUpdateRole({ isOpen, onClose, id, setRefresh }) {
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
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">เพิ่มข้อมูล</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    autoFocus
                                    label="ตำแหน่ง"
                                    variant="bordered"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                />
                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button type='submit' color="warning">
                                        แก้ไข
                                    </Button>
                                </ModalFooter>
                            </form>
                        </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

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