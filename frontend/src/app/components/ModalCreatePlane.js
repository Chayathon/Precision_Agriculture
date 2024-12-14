import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DateInput, useDisclosure } from '@nextui-org/react';
import { CalendarDate } from "@internationalized/date";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function ModalCreatePlane({ isOpen, onOpenChange, setRefresh }) {

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
                                        <div className='mb-4'>
                                            <Input
                                                autoFocus
                                                label="พืช"
                                                variant="bordered"
                                                onChange={(e) => setPlantName(e.target.value)}
                                            />
                                        </div>
                                        <div className='mb-4'>
                                            <DateInput
                                                label="วันที่ปลูก"
                                                placeholderValue={new CalendarDate(1995, 11, 6)}
                                                onChange={handleDateChange} // เพิ่มการเรียกฟังก์ชันเมื่อวันที่เปลี่ยน
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
                                    </form>
                                </ModalBody>


                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );

}

export default ModalCreatePlane;
