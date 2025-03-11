import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalDeleteNutrient({ isOpen, onOpenChange, id, setRefresh }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`http://localhost:4000/api/deleteOtherNutrient/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("ลบข้อมูลค่าสารอาหารเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);
            }
            else {
                toast.error("ลบข้อมูลค่าสารอาหารล้มเหลว");
                return;
            }
        } catch (err) {
            console.error("Error: ", err);
        } finally {
            setIsLoading(false);
            setRefresh(false);
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

export default ModalDeleteNutrient