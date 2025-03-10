import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalUpdateRole({ isOpen, onOpenChange, id, setRefresh }) {
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

            fetchData();
        }
    }, [isOpen])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!plantName) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/updatePlantAvaliable/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plantName
                })
            })

            if(res.ok) {
                const form = e.target;
                form.reset();

                toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว"); 
                onOpenChange(false);
                setRefresh(true);

                setTimeout(() => {
                    setRefresh(false);
                }, 1000);
            }
            else {
                toast.error("แก้ไขข้อมูลล้มเหลว");
                return;
            }
        } catch (err) {
            console.log(err);
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
                                    <Input
                                        autoFocus
                                        label="ชื่อพืช"
                                        variant="bordered"
                                        value={plantName}
                                        onChange={(e) => setPlantName(e.target.value)}
                                    />
                                    <ModalFooter>
                                        <Button variant="flat" onPress={onClose}>
                                            ยกเลิก
                                        </Button>
                                        <Button type='submit' color="warning">
                                            แก้ไข
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

export default ModalUpdateRole