import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DateInput, useDisclosure, DatePicker, Select, SelectItem } from '@nextui-org/react';
import { getLocalTimeZone, today } from "@internationalized/date";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function ModalCreatePlant({ isOpen, onOpenChange, setRefresh }) {

    const [plantName, setPlantName] = useState('');
    const [plantAt, setPlantAt] = useState('');

    // ฟังก์ชัน handleDateChange ถูกประกาศในขอบเขตเดียวกับคอมโพเนนต์
    const handleDateChange = (date) => {
        setPlantAt(date?.toString() || ''); // แปลงเป็น string หรือฟอร์แมตตามที่ต้องการ
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!plantName || !plantAt) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
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
                    plantName,
                    plantAt,
                    userId: parsedUserData.id,  // ส่ง userId ที่ได้จาก parsedUserData
                })
            });

            if (res.ok) {
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
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="flex flex-col gap-2">เพิ่มข้อมูล</ModalHeader>
                        <ModalBody>
                                <div>
                                    {/* <Input
                                        autoFocus
                                        label="พืช"
                                        variant="bordered"
                                        onChange={(e) => setPlantName(e.target.value)}
                                    /> */}
                                    <Select
                                        isRequired
                                        onChange={(e) => setPlantName(e.target.value)}
                                        label="พืช"
                                        placeholder="เลือกพืชที่ปลูก"
                                        >
                                            <SelectItem key="ข้าว">ข้าว</SelectItem>
                                            <SelectItem key="ข้าวโพด">ข้าวโพด</SelectItem>
                                            <SelectItem key="มันสำปะหลัง">มันสำปะหลัง</SelectItem>
                                            <SelectItem key="ทุเรียน">ทุเรียน</SelectItem>
                                    </Select>
                                </div>
                                <div>
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
                                    <Button type='submit' color="primary">
                                        เพิ่ม
                                    </Button>
                                </ModalFooter>
                        </ModalBody>
                    </form>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ModalCreatePlant;
