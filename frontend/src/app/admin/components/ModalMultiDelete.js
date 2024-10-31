import React from 'react'

function ModalMultiDelete( isOpen, onOpenChange, selectedKeys ) {
    const [selectedKeys, setSelectedKeys] = React.useState([]);
    const selectedUsers = Array.from(selectedKeys);

    const handleClick = async () => {
        try {
            // สร้าง array ของ promises สำหรับการลบแต่ละ user
            const deletePromises = selectedUsers.map(userId => 
                fetch(`http://localhost:4000/api/deleteUser/${userId}`, {
                    method: 'DELETE'
                })
            );

            // รอให้ทุก request เสร็จสิ้น
            await Promise.all(deletePromises);
            
            // รีเฟรชข้อมูลและรีเซ็ตการเลือก
            setRefresh(prev => !prev);
            onOpenChangeMultiDelete(false);
            
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
                    <p>ลบ ({selectedKeys.size}) รายการ</p>
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
    )
}

export default ModalMultiDelete