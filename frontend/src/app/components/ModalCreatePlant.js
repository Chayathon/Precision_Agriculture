import { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DateInput, useDisclosure, DatePicker, Select, SelectItem } from '@nextui-org/react';
import { getLocalTimeZone, today } from "@internationalized/date";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function ModalCreatePlant({ isOpen, onOpenChange, setRefresh }) {
    const [plantAvaliable, setPlantAvaliable] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState({ id: null, plantname: "" });
    const [customPlant, setCustomPlant] = useState('');
    const [plantAt, setPlantAt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchPlantAvaliable = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/getPlantAvaliable`);

            if(res.status === 200) {
                const data = await res.json();
                setPlantAvaliable(data.resultData);
            }
        } catch (error) {
            console.error("Failed to fetch: ", error);
        }
    }

    useEffect(() => {
        fetchPlantAvaliable();
    }, []);

    // ฟังก์ชัน handleDateChange ถูกประกาศในขอบเขตเดียวกับคอมโพเนนต์
    const handleDateChange = (date) => {
        setPlantAt(date?.toString() || ''); // แปลงเป็น string หรือฟอร์แมตตามที่ต้องการ
    };

    useEffect(() => {
        const dateNow = today(getLocalTimeZone()).toString();
        setPlantAt(dateNow);
    }, []);

    const handleSelectionChange = (key) => {
        // หา item ที่ตรงกับ key ที่เลือก
        const selectedItem = plantAvaliable.find((item) => item.id === Number(key));
        if (selectedItem) {
          // อัปเดต state ด้วยทั้ง id และ plantname
            setSelectedPlant({
                id: selectedItem.id,
                plantname: selectedItem.plantname,
            });
        } else {
            setSelectedPlant({
                id: key,
                plantname: "",
            })
        }
        console.log(selectedPlant);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!selectedPlant || !plantAt) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        const plantName = selectedPlant.plantname === "อื่นๆ" ? customPlant : selectedPlant;

        if (!plantName) {
            toast.error("กรุณาระบุชื่อพืช!");
            setIsLoading(false);
            return;
        }

        // ดึงค่า userId จาก cookies
        const userData = Cookies.get('UserData');
        const parsedUserData = userData ? JSON.parse(userData) : null;
        
        if (!parsedUserData || !parsedUserData.id) {
            toast.error("ไม่พบข้อมูลผู้ใช้!");
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/createPlant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plantName: selectedPlant.plantname === "อื่นๆ" ? customPlant : selectedPlant.plantname,
                    plantAt,
                    plantId: selectedPlant.id,
                    userId: parsedUserData.id,  // ส่ง userId ที่ได้จาก parsedUserData
                })
            });

            if (res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("เพิ่มข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);

                setTimeout(() => {
                    setRefresh(false);
                }, 1000);

            } else {
                toast.warn("เพิ่มข้อมูลล้มเหลว");
                return;
            }
        } catch (err) {
            console.log("Error", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col">เพิ่มข้อมูล</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <Select
                                        isRequired
                                        onChange={(e) => handleSelectionChange(e.target.value)}
                                        value={selectedPlant}
                                        label="พืช"
                                        placeholder="เลือกพืชที่ปลูก"
                                    >
                                        {plantAvaliable.map((item) => (
                                            <SelectItem key={item.id} value={item.plantname}>{item.plantname}</SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                {selectedPlant.plantname === "อื่นๆ" && (
                                    <div className='mb-3'>
                                        <Input
                                            isRequired
                                            label="ระบุพืชที่ปลูก"
                                            placeholder="กรอกชื่อพืช"
                                            onChange={(e) => setCustomPlant(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className='mt-3'>
                                    <DatePicker
                                        isRequired
                                        defaultValue={today(getLocalTimeZone())}
                                        maxValue={today(getLocalTimeZone())}
                                        onChange={handleDateChange} // เพิ่มการเรียกฟังก์ชันเมื่อวันที่เปลี่ยน
                                        label="วันที่ปลูก"
                                    />
                                </div>
                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        type='submit'
                                        color='primary'
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

export default ModalCreatePlant;
