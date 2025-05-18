import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react';
import { NumberInput } from '@heroui/number-input';
import { toast } from 'react-toastify';

function ModalCreateFactor({ isOpen, onOpenChange, setRefresh, id }) {
    const [age, setAge] = useState('');
    const [ph, setPh] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [salinity, setSalinity] = useState('');
    const [lightIntensity, setLightIntensity] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!ph || !temperature || !humidity || !salinity || !lightIntensity) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/createOtherFactor`, {
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
            
            setTimeout(() => {
                setRefresh(false);
            }, 1000);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='lg'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>เพิ่มค่าตัวแปรที่พืชต้องการ</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col sm:flex-row mb-3 gap-3">
                                    <NumberInput
                                        value={age}
                                        onValueChange={setAge}
                                        defaultValue={0}
                                        minValue={0}
                                        label="อายุตั้งแต่ (วัน) ขึ้นไป"
                                        isRequired
                                    />
                                    <Input
                                        onChange={(e) => setPh(e.target.value)}
                                        type="text"
                                        label="ค่าความเป็นกรด-ด่าง (pH)"
                                        isRequired
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row mb-3 gap-3">
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
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Input
                                        onChange={(e) => setSalinity(e.target.value)}
                                        type="text"
                                        label="ค่าการนำไฟฟ้า (µS/cm)"
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
                                        {isLoading ? 'กำลังเพิ่มข้อมูล...' : 'เพิ่ม'}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ModalCreateFactor;