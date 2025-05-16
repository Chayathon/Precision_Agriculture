import { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalDeleteFactor({ isOpen, onOpenChange, id, setRefresh }) {
    const [plantAge, setPlantAge] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getOtherFactorById/${id}`);

                    const data = await res.json();
                    setPlantAge(data.resultData.age);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData();
        }
    }, [isOpen, id]);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/deleteOtherFactor/${id}`, {
                method: 'DELETE'
            });

            if (res.status === 200) {
                toast.success("ลบข้อมูลค่าตัวแปรที่เกี่ยวข้องเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);
            }
            else {
                toast.error("ลบข้อมูลค่าตัวแปรที่เกี่ยวข้องล้มเหลว");
                return;
            }
        } catch (err) {
            console.error("Error: ", err);
        } finally {
            setIsLoading(false);

            setTimeout(() => {
                setRefresh(false);
            }, 1000);
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>ลบข้อมูล</ModalHeader>
                            <ModalBody>
                                <p>ยืนยันที่จะลบข้อมูลที่อายุตั้งแต่ <b>{plantAge}</b> วันขึ้นไป?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    ยกเลิก
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={handleSubmit}
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'กำลังลบข้อมูล...' : 'ลบ'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalDeleteFactor