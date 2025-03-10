import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalCreatePlant({ isOpen, onOpenChange, setRefresh }) {
    const [plantName, setPlantName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!plantName) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/createPlantAvaliable', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plantName
                })
            })

            if(res.ok) {
                const form = e.target;
                form.reset();

                toast.success("เพิ่มข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);

                setTimeout(() => {
                    setRefresh(false);
                }, 1000);
                    
            }
            else {
                toast.warn("เพิ่มข้อมูลล้มเหลว");
                return;
            }
        }
        catch (err) {
            console.log("Error", err);
        }
    }

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">เพิ่มข้อมูล</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    autoFocus
                                    label="ชื่อพืช"
                                    variant="bordered"
                                    onChange={(e) => setPlantName(e.target.value)}
                                />
                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button type='submit' color="primary">
                                        เพิ่ม
                                    </Button>
                                </ModalFooter>
                            </form>
                        </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalCreatePlant