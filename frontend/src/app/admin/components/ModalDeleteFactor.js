import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalDeleteFactor({ isOpen, onOpenChange, id, setRefresh }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`http://localhost:4000/api/deleteFactor/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("ลบข้อมูลค่าตัวแปรที่เกี่ยวข้องเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);
            }
            else {
                toast.error("ลบข้อมูลค่าตัวแปรที่เกี่ยวข้องล้มเหลว");
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
                                <p>ยืนยันที่จะลบข้อมูล?</p>
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
                                    ลบ
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalDeleteFactor