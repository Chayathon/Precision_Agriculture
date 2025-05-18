import { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalCreatePlant({ isOpen, onOpenChange, setRefresh }) {
    const [id, setId] = useState(null);
    const [plantName, setPlantName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('UserData')) {
            const user = JSON.parse(localStorage.getItem('UserData') || '{}')
            
            if(user) {
                setId(user.id);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(!plantName) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/createPlantAvaliable`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plantName, id
                })
            })

            if(res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("เพิ่มข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);
                    
            }
            else {
                toast.warn("เพิ่มข้อมูลล้มเหลว");
                return;
            }
        }
        catch (err) {
            console.log("Error", err);
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
                        <ModalHeader>เพิ่มข้อมูล</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    autoFocus
                                    label="ชื่อพืช"
                                    onChange={(e) => setPlantName(e.target.value)}
                                />
                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        type='submit'
                                        color="primary"
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
    )
}

export default ModalCreatePlant