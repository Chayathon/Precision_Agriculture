import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalDeleteRole({ isOpen, onOpenChange, id, setRefresh }) {
    const [roleName, setRoleName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getRole/${id}`);
                        
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
    }, [isOpen, id])

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/deleteRole/${id}`, {
                method: 'DELETE'
            });

            if (res.status === 200) {
                toast.success("ลบข้อมูลเรียบร้อยแล้ว")  
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
                        <p>ยืนยันที่จะลบบทบาท <b>{roleName}</b> ?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose}>
                            ยกเลิก
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleSubmit}
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

export default ModalDeleteRole