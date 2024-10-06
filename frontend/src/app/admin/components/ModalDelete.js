import React, { useState, useEffect } from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    Button
  } from '@chakra-ui/react'
  import { toast } from 'react-toastify'

function ModalDelete({ isOpen, onClose, cancelRef, id }) {
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
                    
                    setUsername(data.username)
                }
                catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData()
        }
    }, [isOpen, id])

    const handleSubmit = async () => {
        try{
            const res = await fetch(`http://localhost:4000/api/delete/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("ลบข้อมูลเรียบร้อยแล้ว")  
                onClose();
                location.reload();
            }
            else {
                toast.error("ลบข้อมูลล้มเหลว")
                return;
            }
        }
        catch (err) {
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
                            ลบข้อมูล {id}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? to delete {username}.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                ยกเลิก
                            </Button>
                            <Button colorScheme='red' onClick={handleSubmit} ml={3}>
                                ลบ
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

export default ModalDelete