import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DatePicker, Select, SelectItem } from '@nextui-org/react'
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import { toast } from 'react-toastify'

function ModalUpdatePlant({ isOpen, onOpenChange, id, setRefresh }) {
    const [plantAvaliable, setPlantAvaliable] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState({ id: null, plantName: "" });
    const [customPlant, setCustomPlant] = useState('');
    const [plantAt, setPlantAt] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getPlant/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();

                    const selectedPlantId = data.resultData.plant_avaliable_id;
                    setSelectedPlant({ id: selectedPlantId });
                    selectedPlantId === 1 ? setCustomPlant(data.resultData.plantname) : setCustomPlant("");
                    const parsedDate = parseDate(data.resultData.plantedAt.split("T")[0]);
                    setPlantAt(parsedDate);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            const fetchPlantAvaliable = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantAvaliable`);

                    if(res.status === 200) {
                        const data = await res.json();
                        setPlantAvaliable(data.resultData);
                    }
                } catch (error) {
                    console.error("Failed to fetch: ", error);
                }
            }

            fetchData();
            fetchPlantAvaliable();
        }
    }, [isOpen, id])

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!selectedPlant || !plantAt) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        const plantName = selectedPlant.id === 1 ? customPlant : selectedPlant;

        if (!plantName) {
            toast.error("กรุณาระบุชื่อพืช!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/updatePlant/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plantName: selectedPlant.id === 1 ? customPlant : selectedPlant.plantname,
                    plantAt: plantAt.toString(),
                    plantId: selectedPlant.id
                })
            });

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
                                <Select
                                    isRequired
                                    onChange={(e) => handleSelectionChange(e.target.value)}
                                    items={plantAvaliable}
                                    selectedKeys={String(selectedPlant.id)}
                                    label="พืช"
                                >
                                    {(item) => <SelectItem key={item.id} value={item.plantname}>{item.plantname}</SelectItem>}
                                </Select>
                                {selectedPlant.id === 1 && (
                                    <Input
                                        autoFocus
                                        label="ชื่อพืช"
                                        placeholder="กรอกชื่อพืช"
                                        value={customPlant}
                                        onChange={(e) => setCustomPlant(e.target.value)}
                                        className='mt-3'
                                        isRequired
                                    />
                                )}
                                <DatePicker
                                    isRequired
                                    value={plantAt}
                                    maxValue={today(getLocalTimeZone())}
                                    onChange={setPlantAt}
                                    className='mt-3'
                                    label="วันที่ปลูก"
                                />
                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        type='submit'
                                        color='warning'
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

export default ModalUpdatePlant