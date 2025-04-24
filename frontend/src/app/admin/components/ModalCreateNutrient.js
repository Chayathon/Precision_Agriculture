import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { NumberInput } from '@heroui/number-input';
import { toast } from 'react-toastify';

function ModalCreateNutrient({ isOpen, onOpenChange, setRefresh, id }) {
    const [age, setAge] = useState('');
    const [nitrogen, setNitrogen] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [potassium, setPotassium] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!nitrogen || !phosphorus || !potassium) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/createNutrient`, {
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

            setTimeout(() => {
                setRefresh(false);
            }, 1000);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='lg'>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">เพิ่มค่าสารอาหารที่พืชต้องการ</ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <div className="flex mb-4 gap-4">
                            <NumberInput
                                value={age}
                                onValueChange={setAge}
                                defaultValue={0}
                                minValue={0}
                                label="อายุตั้งแต่ (วัน) ขึ้นไป"
                                isRequired
                            />
                            <Input
                                onChange={(e) => setNitrogen(e.target.value)}
                                type="text"
                                label="(N) ไนโตรเจน (mg/kg)"
                                isRequired
                            />
                        </div>
                        <div className="flex mb-4 gap-4">
                            <Input
                                onChange={(e) => setPhosphorus(e.target.value)}
                                type="text"
                                label="(P) ฟอสฟอรัส (mg/kg)"
                                isRequired
                            />
                            <Input
                                onChange={(e) => setPotassium(e.target.value)}
                                type="text"
                                label="(K) โพแทสเซียม (mg/kg)"
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
                                {isLoading ? 'กำลังเพิ่มข้อมูล...' : 'เพิ่ม'}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default ModalCreateNutrient;