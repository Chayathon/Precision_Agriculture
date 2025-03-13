import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalDeleteUser({ isOpen, onOpenChange, id, setRefresh }) {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`http://localhost:4000/api/getUser/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setUsername(data.resultData.username);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData();
        }
    }, [isOpen, id])

    const handleDelete = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`http://localhost:4000/api/deleteUser/${id}`, {
                method: 'DELETE'
            });

            if (res.status === 200) {
                toast.success("ลบข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);
            }
            else {
                toast.error("ลบข้อมูลล้มเหลว")
                return;
            }
        } catch (err) {
            console.error("Error: ", err);
        } finally {
            setIsLoading(false);

            setTimeout(() => {
                setRefresh(false);
            }, 1000);
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
                            <Button variant="flat" onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button
                                color="danger"
                                onPress={handleDelete}
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'กำลังลบข้อมูล...' : 'ลบ'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalDeleteUser