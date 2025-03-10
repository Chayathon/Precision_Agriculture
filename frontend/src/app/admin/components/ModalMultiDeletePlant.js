import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalMultiDeleteRole({ isOpen, onOpenChange, selectedKeys, setRefresh, deleteSuccess }) {
    const handleClick = async () => {
        try {
            // สร้าง array ของ promises สำหรับการลบแต่ละ user
            const deletePromises = selectedKeys.map(roleId => 
                fetch(`http://localhost:4000/api/deletePlantAvaliable/${roleId}`, {
                    method: 'DELETE'
                })
            );

            // รอให้ทุก request เสร็จสิ้น
            await Promise.all(deletePromises);
            
            toast.success("ลบข้อมูลเรียบร้อยแล้ว")
            onOpenChange(false);
            setRefresh(true)
            deleteSuccess && deleteSuccess();

            setTimeout(() => {
                setRefresh(false)
            }, 1000)
            
        } catch (error) {
            console.error("Error deleting users: ", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">ลบข้อมูล</ModalHeader>
                    <ModalBody>
                        <p>ยืนยันที่จะลบข้อมูล <b>{selectedKeys.length}</b> รายการ</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onClose}>
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
    )
}

export default ModalMultiDeleteRole