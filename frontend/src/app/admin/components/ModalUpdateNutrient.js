import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { NumberInput } from '@heroui/number-input';
import { toast } from 'react-toastify'

function ModalUpdateNutrient({ isOpen, onOpenChange, id, setRefresh }) {
    const [age, setAge] = useState('');
    const [nitrogen, setNitrogen] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [potassium, setPotassium] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getNutrientById/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setAge(data.resultData.age);
                    setNitrogen(data.resultData.nitrogen);
                    setPhosphorus(data.resultData.phosphorus);
                    setPotassium(data.resultData.potassium);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData();
        }
    }, [isOpen, id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/updateNutrient/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    age, nitrogen, phosphorus, potassium
                })
            })

            if(res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("แก้ไขข้อมูลค่าสารอาหารเรียบร้อยแล้ว"); 
                onOpenChange(false);
                setRefresh(true);
            }
            else {
                toast.error("แก้ไขข้อมูลค่าสารอาหารล้มเหลว");
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
                                        <NumberInput
                                            value={age}
                                            onValueChange={setAge}
                                            minValue={0}
                                            label="อายุตั้งแต่ (วัน) ขึ้นไป"
                                            isRequired
                                        />
                                        <Input
                                            onChange={(e) => setNitrogen(e.target.value)}
                                            value={nitrogen}
                                            type="text"
                                            label="(N) ไนโตรเจน (mg/L)"
                                            isRequired
                                        />
                                    </div>
                                    <div className="flex mb-4 gap-4">
                                        <Input
                                            onChange={(e) => setPhosphorus(e.target.value)}
                                            value={phosphorus}
                                            type="text"
                                            label="(P) ฟอสฟอรัส (mg/L)"
                                            isRequired
                                        />
                                        <Input
                                            onChange={(e) => setPotassium(e.target.value)}
                                            value={potassium}
                                            type="text"
                                            label="(K) โพแทสเซียม (mg/L)"
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

export default ModalUpdateNutrient