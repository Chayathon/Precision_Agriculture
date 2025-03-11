import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure, Tabs, Tab } from '@nextui-org/react';
import { toast } from 'react-toastify';

function ModalCreateFactor({ isOpen, onOpenChange, setRefresh, id }) {
    const [age, setAge] = useState('');
    const [ph, setPh] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [salinity, setSalinity] = useState('');
    const [lightIntensity, setLightIntensity] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    // Handle Submit สำหรับฟอร์ม Factor
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!age || !ph || !temperature || !humidity || !salinity || !lightIntensity) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:4000/api/createFactor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    age,
                    ph,
                    temperature,
                    humidity,
                    salinity,
                    lightIntensity,
                    plantId: id,
                }),
            });

            if (res.status === 200) {
                toast.success("เพิ่มข้อมูลค่าตัวแปรที่เกี่ยวข้องเรียบร้อยแล้ว");
                setRefresh(true);
                onOpenChange(false);
            } else {
                toast.warn("เพิ่มข้อมูลค่าตัวแปรที่เกี่ยวข้องล้มเหลว");
            }
        } catch (err) {
            console.log("Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='lg'>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">เพิ่มค่าตัวแปรที่พืชต้องการ</ModalHeader>
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
                                onChange={(e) => setPh(e.target.value)}
                                type="text"
                                label="ค่าความเป็นกรด-ด่าง (pH)"
                                isRequired
                            />
                        </div>
                        <div className="flex mb-4 gap-4">
                            <Input
                                onChange={(e) => setTemperature(e.target.value)}
                                type="text"
                                label="อุณหภูมิ (°C)"
                                isRequired
                            />
                            <Input
                                onChange={(e) => setHumidity(e.target.value)}
                                type="text"
                                label="ความชื้น (%)"
                                isRequired
                            />
                        </div>
                        <div className="flex my-4 gap-4">
                            <Input
                                onChange={(e) => setSalinity(e.target.value)}
                                type="text"
                                label="ค่าการนำไฟฟ้า (dS/m)"
                                isRequired
                            />
                            <Input
                                onChange={(e) => setLightIntensity(e.target.value)}
                                type="text"
                                label="ค่าความเข้มแสง (lux)"
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

export default ModalCreateFactor;