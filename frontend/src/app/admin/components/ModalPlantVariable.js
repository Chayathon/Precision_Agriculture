import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tabs, Tab, useDisclosure } from '@nextui-org/react'
import moment from "moment";
import 'moment/locale/th';
import { FaPlus } from 'react-icons/fa6';
import ModalCreatePlant from './ModalCreatePlant';

function ModalPlantVariable({ isOpen, onOpenChange, id }) {
    const [plant, setPlant] = useState('');
    const [factor, setFactor] = useState([]);
    const [nutrient, setNutrient] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onOpenChange: onOpenChangeCreate } = useDisclosure();
    
    const fetchPlant = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/getPlantAvaliableById/${id}`);
                
            if (!res.ok) {
                throw new Error("Failed to fetch");
            }

            const data = await res.json();
            setPlant(data.resultData.plantname);
        } catch (err) {
            console.error("Error fetching data: ", err);
        }
    }

    const fetchFactorData = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/getFactorById/${id}`);
                
            if (!res.ok) {
                throw new Error("Failed to fetch");
            }

            const data = await res.json();
            setFactor(data.resultData);
        } catch (err) {
            console.error("Error fetching data: ", err);
        }
    }

    const fetchNutrientData = async () => {
        try {
            const res = await fetch(`http://localhost:4000/api/getNutrientById/${id}`);
                
            if (!res.ok) {
                throw new Error("Failed to fetch");
            }

            const data = await res.json();
            setNutrient(data.resultData);
        } catch (err) {
            console.error("Error fetching data: ", err);
        }
    }

    useEffect(() => {
        if(isOpen) {
            fetchPlant();
            fetchFactorData();
            fetchNutrientData();
        }
    }, [isOpen]);

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
                size='4xl'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">ค่าตัวแปรที่ {plant} ต้องการ</ModalHeader>
                            <ModalBody>
                                <Tabs aria-label="Options">
                                    <Tab key="Factor" title="ค่าตัวแปรที่เกี่ยวข้อง">
                                        <div className="flex justify-end mb-2">
                                            <Button  onPress={() => {onOpenCreate()}} color='success' endContent={<FaPlus />}>เพิ่ม</Button>
                                        </div>
                                        <Table aria-label="Factor Data">
                                            <TableHeader>
                                                <TableColumn key="age">ตั้งแต่ (วัน) ขึ้นไป</TableColumn>
                                                <TableColumn key="temperature">อุณหภูมิ (°C)</TableColumn>
                                                <TableColumn key="humidity">ความชื่น (%)</TableColumn>
                                                <TableColumn key="ph">ค่าความเป็นกรด-ด่าง (pH)</TableColumn>
                                                <TableColumn key="salinity">ค่าการนำไฟฟ้า (dS/m)</TableColumn>
                                                <TableColumn key="lightIntensity">ค่าความเข้มแสง (lux)</TableColumn>
                                                <TableColumn key="tools">จัดการ</TableColumn>
                                            </TableHeader>
                                            <TableBody items={factor}>
                                                {(item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.age}</TableCell>
                                                        <TableCell>{item.temperature}</TableCell>
                                                        <TableCell>{item.humidity}</TableCell>
                                                        <TableCell>{item.pH}</TableCell>
                                                        <TableCell>{item.salinity}</TableCell>
                                                        <TableCell>{item.lightIntensity}</TableCell>
                                                        <TableCell>แก้ไข</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Tab>
                                    <Tab key="Nutrient" title="ค่าสารอาหาร">
                                        <div className="flex justify-end mb-2">
                                            <Button  onPress={() => {onOpenCreate()}} color='success' endContent={<FaPlus />}>เพิ่ม</Button>
                                        </div>
                                        <Table aria-label="Nutrient Data">
                                            <TableHeader>
                                                <TableColumn key="age">ตั้งแต่ (วัน) ขึ้นไป</TableColumn>
                                                <TableColumn key="temperature">(N) ไนโตรเจน (mg/L)</TableColumn>
                                                <TableColumn key="humidity">(P) ฟอสฟอรัส (mg/L)</TableColumn>
                                                <TableColumn key="ph">(K) โพแทสเซียม (mg/L)</TableColumn>
                                                <TableColumn key="tools">จัดการ</TableColumn>
                                            </TableHeader>
                                            <TableBody items={nutrient}>
                                                {(item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.age}</TableCell>
                                                        <TableCell>{item.nitrogen}</TableCell>
                                                        <TableCell>{item.phosphorus}</TableCell>
                                                        <TableCell>{item.potassium}</TableCell>
                                                        <TableCell>แก้ไข</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Tab>
                                </Tabs>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>
                                    ปิด
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {isOpenCreate && (
                <ModalCreatePlant isOpen={isOpenCreate} onOpenChange={onOpenChangeCreate} setRefresh={setRefresh} />
            )}
        </>
    )
}

export default ModalPlantVariable