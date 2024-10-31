import React, { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalDeleteUser({ isOpen, onClose, onOpenChange, id, setRefresh }) {
    const [username, setUsername] = useState('')

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`http://localhost:4000/api/getUser/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setUsername(data.resultData.username)
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData()
        }
    }, [isOpen])

    const handleClick = async () => {
        try{
            const res = await fetch(`http://localhost:4000/api/deleteUser/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("ลบข้อมูลเรียบร้อยแล้ว")  
                onClose();
                setRefresh(true)

                setTimeout(() => {
                    setRefresh(false)
                }, 1000)
            }
            else {
                toast.error("ลบข้อมูลล้มเหลว")
                return;
            }
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                {(onClose) => (
                    <>
                    <ModalHeader className="flex flex-col gap-1">ลบข้อมูล</ModalHeader>
                    <ModalBody>
                        <p>ยืนยันที่จะลบข้อมูล <b>{username}</b> ?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose}>
                            ยกเลิก
                        </Button>
                        <Button color="danger" onPress={handleClick}>
                            ลบ
                        </Button>
                    </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>

            {/* <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            ลบข้อมูล
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            ยืนยันที่จะลบข้อมูล <b>{username}</b> ?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <div className='flex justify-end pt-4 pb-2 '>
                                <Button ref={cancelRef} onClick={onClose}>
                                    ยกเลิก
                                </Button>
                                <Button colorScheme='red' onClick={handleClick} ml={3}>
                                    ลบ
                                </Button>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog> */}
        </>
    )
}

export default ModalDeleteUser