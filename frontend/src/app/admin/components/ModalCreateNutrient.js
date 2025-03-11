import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure, Tabs, Tab } from '@nextui-org/react';
import { toast } from 'react-toastify';

function ModalCreateNutrient({ isOpen, onOpenChange, setRefresh, id }) {
    const [age, setAge] = useState('');
    const [nitrogen, setNitrogen] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [potassium, setPotassium] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    // Handle Submit สำหรับฟอร์ม Factor
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!age || !nitrogen || !phosphorus || !potassium) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:4000/api/createNutrient", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    age,
                    nitrogen,
                    phosphorus,
                    potassium,
                    plantId: id,
                }),
            });

            if (res.status === 200) {
                toast.success("เพิ่มข้อมูลค่าสารอาหารเรียบร้อยแล้ว");
                setRefresh(true);
                onOpenChange(false);
            } else {
                toast.warn("เพิ่มข้อมูลค่าสารอาหารล้มเหลว");
            }
        } catch (err) {
            console.log("Error:", err);
        } finally {
            setIsLoading(false);
            setRefresh(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='lg'>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">เพิ่มค่าสารอาหารที่พืชต้องการ</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <div className="flex mb-4 gap-4">
                            <Input
                                onChange={(e) => setAge(e.target.value)}
                                type="number"
                                label="อายุตั้งแต่กี่ (วัน) ขึ้นไป"
                                isRequired
                            />
                            <Input
                                onChange={(e) => setNitrogen(e.target.value)}
                                type="text"
                                label="(N) ไนโตรเจน (mg/L)"
                                isRequired
                            />
                        </div>
                        <div className="flex mb-4 gap-4">
                            <Input
                                onChange={(e) => setPhosphorus(e.target.value)}
                                type="text"
                                label="(P) ฟอสฟอรัส (mg/L)"
                                isRequired
                            />
                            <Input
                                onChange={(e) => setPotassium(e.target.value)}
                                type="text"
                                label="(K) โพแทสเซียม (mg/L)"
                                isRequired
                            />
                        </div>
                        <ModalFooter>
                            <Button variant="flat" onPress={onOpenChange}>ยกเลิก</Button>
                            <Button
                                type="submit"
                                color="success"
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                เพิ่ม
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default ModalCreateNutrient;