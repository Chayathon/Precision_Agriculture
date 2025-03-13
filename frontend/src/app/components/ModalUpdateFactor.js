import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalUpdateFactor({ isOpen, onOpenChange, id, setRefresh }) {
    const [age, setAge] = useState('');
    const [ph, setPh] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [salinity, setSalinity] = useState('');
    const [lightIntensity, setLightIntensity] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getOtherFactorById/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setAge(data.resultData.age);
                    setPh(data.resultData.pH);
                    setTemperature(data.resultData.temperature);
                    setHumidity(data.resultData.humidity);
                    setSalinity(data.resultData.salinity);
                    setLightIntensity(data.resultData.lightIntensity);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData();
        }
    }, [isOpen, id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/updateOtherFactor/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    age, ph, temperature, humidity, salinity, lightIntensity
                })
            });

            if(res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("แก้ไขข้อมูลค่าตัวแปรที่เกี่ยวข้องเรียบร้อยแล้ว"); 
                onOpenChange(false);
                setRefresh(true);
            }
            else {
                toast.error("แก้ไขข้อมูลค่าตัวแปรที่เกี่ยวข้องล้มเหลว");
                return;
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);

            setTimeout(() => {
                setRefresh(false);
            }, 1000);
        }
    }

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูล</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex mb-4 gap-4">
                                        <Input
                                            onChange={(e) => setAge(e.target.value)}
                                            value={age}
                                            type="number"
                                            label="อายุตั้งแต่กี่ (วัน) ขึ้นไป"
                                            isRequired
                                        />
                                        <Input
                                            onChange={(e) => setPh(e.target.value)}
                                            value={ph}
                                            type="text"
                                            label="ค่าความเป็นกรด-ด่าง (pH)"
                                            isRequired
                                        />
                                    </div>
                                    <div className="flex mb-4 gap-4">
                                        <Input
                                            onChange={(e) => setTemperature(e.target.value)}
                                            value={temperature}
                                            type="text"
                                            label="อุณหภูมิ (°C)"
                                            isRequired
                                        />
                                        <Input
                                            onChange={(e) => setHumidity(e.target.value)}
                                            value={humidity}
                                            type="text"
                                            label="ความชื้น (%)"
                                            isRequired
                                        />
                                    </div>
                                    <div className="flex my-4 gap-4">
                                        <Input
                                            onChange={(e) => setSalinity(e.target.value)}
                                            value={salinity}
                                            type="text"
                                            label="ค่าการนำไฟฟ้า (dS/m)"
                                            isRequired
                                        />
                                        <Input
                                            onChange={(e) => setLightIntensity(e.target.value)}
                                            value={lightIntensity}
                                            type="text"
                                            label="ค่าความเข้มแสง (lux)"
                                            isRequired
                                        />
                                    </div>
                                    <ModalFooter>
                                        <Button variant="flat" onPress={onClose}>
                                            ยกเลิก
                                        </Button>
                                        <Button
                                            type='submit'
                                            color="warning"
                                            isLoading={isLoading}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'กำลังแก้ไขข้อมูล...' : 'แก้ไข'}
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

export default ModalUpdateFactor