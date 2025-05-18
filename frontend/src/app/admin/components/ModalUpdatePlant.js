import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalUpdateRole({ isOpen, onOpenChange, id, setRefresh }) {
    const [plantName, setPlantName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantAvaliableById/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setPlantName(data.resultData.plantname);
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

        if(!plantName) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/updatePlantAvaliable/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plantName
                })
            })

            if(res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว"); 
                onOpenChange(false);
                setRefresh(true);
            }
            else {
                toast.error("แก้ไขข้อมูลล้มเหลว");
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
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>แก้ไขข้อมูล</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    autoFocus
                                    label="ชื่อพืช"
                                    value={plantName}
                                    onChange={(e) => setPlantName(e.target.value)}
                                />
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
    )
}

export default ModalUpdateRole