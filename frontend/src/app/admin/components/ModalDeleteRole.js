import React, { useState, useEffect } from 'react'
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button } from '@chakra-ui/react'
import { toast } from 'react-toastify'

function ModalDelete({ isOpen, onClose, cancelRef, id, setRefresh }) {
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
                    setRoleName(data.resultData.role_name)
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData()
        }
    }, [isOpen])

    const handleSubmit = async () => {
        try{
            const res = await fetch(`http://localhost:4000/api/deleteRole/${id}`, {
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
            <AlertDialog
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
                            ยืนยันที่จะลบข้อมูล <b>{roleName}</b> ?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <div className='flex justify-end pt-4 pb-2 '>
                                <Button ref={cancelRef} onClick={onClose}>
                                    ยกเลิก
                                </Button>
                                <Button colorScheme='red' onClick={handleSubmit} ml={3}>
                                    ลบ
                                </Button>
                            </div>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default ModalDelete