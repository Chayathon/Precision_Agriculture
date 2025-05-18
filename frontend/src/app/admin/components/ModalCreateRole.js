import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalCreateRole({ isOpen, onOpenChange, setRefresh }) {
    const [roleName, setRoleName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(!roleName) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/createRole`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roleName
                })
            });

            if(res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("เพิ่มข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);
                    
            }
            else {
                toast.warn("เพิ่มข้อมูลล้มเหลว");
                return;
            }
        }
        catch (err) {
            console.log("Error", err)
        } finally {
            setIsLoading(false);

            setTimeout(() => {
                setRefresh(false);
            }, 1000);
        }
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>เพิ่มข้อมูล</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    autoFocus
                                    label="บทบาท"
                                    onChange={(e) => setRoleName(e.target.value)}
                                />
                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        type='submit'
                                        color="primary"
                                        isLoading={isLoading}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'กำลังเพิ่มข้อมูล...' : 'เพิ่ม'}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default ModalCreateRole