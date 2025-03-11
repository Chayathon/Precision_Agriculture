import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalDeletePlant({ isOpen, onOpenChange, id, setRefresh }) {
    const [plantName, setPlantName] = useState('');

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`http://localhost:4000/api/getPlantAvaliableById/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setPlantName(data.resultData.plantname);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData()
        }
    }, [isOpen])

    const handleSubmit = async () => {
        try{
            const res = await fetch(`http://localhost:4000/api/deletePlantAvaliable/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                toast.success("ลบข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);

                setTimeout(() => {
                    setRefresh(false);
                }, 1000);
            }
            else {
                toast.error("ลบข้อมูลล้มเหลว");
                return;
            }
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">ลบข้อมูล</ModalHeader>
                        <ModalBody>
                            <p>ยืนยันที่จะลบพืช <b>{plantName}</b> ?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                ยกเลิก
                            </Button>
                            <Button color="danger" onPress={handleSubmit}>
                                ลบ
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ModalDeletePlant