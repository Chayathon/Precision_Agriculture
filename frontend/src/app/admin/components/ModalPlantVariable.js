import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tabs, Tab, useDisclosure, Tooltip, ButtonGroup } from '@nextui-org/react'
import moment from "moment";
import 'moment/locale/th';
import { FaPlus } from 'react-icons/fa6';
import { CiEdit } from 'react-icons/ci';
import { HiOutlineTrash } from 'react-icons/hi2';
import ModalCreateFactor from './ModalCreateFactor';
import ModalUpdateFactor from './ModalUpdateFactor';
import ModalDeleteFactor from './ModalDeleteFactor';
import ModalCreateNutrient from './ModalCreateNutrient';
import ModalUpdateNutrient from './ModalUpdateNutrient';
import ModalDeleteNutrient from './ModalDeleteNutrient';

function ModalPlantVariable({ isOpen, onOpenChange, id }) {
    const [plant, setPlant] = useState('');
    const [factor, setFactor] = useState([]);
    const [nutrient, setNutrient] = useState([]);

    const [selectedId, setSelectedId] = useState(null);
    const [refresh, setRefresh] = useState(false);

    const { isOpen: isOpenCreateFactor, onOpen: onOpenCreateFactor, onOpenChange: onOpenChangeCreateFactor } = useDisclosure();
    const { isOpen: isOpenUpdateFactor, onOpen: onOpenUpdateFactor, onOpenChange: onOpenChangeUpdateFactor } = useDisclosure();
    const { isOpen: isOpenDeleteFactor, onOpen: onOpenDeleteFactor, onOpenChange: onOpenChangeDeleteFactor } = useDisclosure();
    const { isOpen: isOpenCreateNutrient, onOpen: onOpenCreateNutrient, onOpenChange: onOpenChangeCreateNutrient } = useDisclosure();
    const { isOpen: isOpenUpdateNutrient, onOpen: onOpenUpdateNutrient, onOpenChange: onOpenChangeUpdateNutrient } = useDisclosure();
    const { isOpen: isOpenDeleteNutrient, onOpen: onOpenDeleteNutrient, onOpenChange: onOpenChangeDeleteNutrient } = useDisclosure();
    
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
            const res = await fetch(`http://localhost:4000/api/getFactorByPlantId/${id}`);
                
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
            const res = await fetch(`http://localhost:4000/api/getNutrientByPlantId/${id}`);
                
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
    }, [isOpen, refresh]);

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                placement="top-center"
                size='5xl'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">ค่าตัวแปรที่พืชต้องการ</ModalHeader>
                            <ModalBody>
                                <Tabs aria-label="Options">
                                    <Tab key="Factor" title="ค่าตัวแปรที่เกี่ยวข้อง">
                                        <div className="flex justify-between mb-2">
                                            <p className='text-2xl font-bold'>{plant}</p>
                                            <Button onPress={() => {onOpenCreateFactor()}} color='success' endContent={<FaPlus />}>เพิ่ม</Button>
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
                                            <TableBody items={factor} emptyContent="ไม่มีข้อมูล">
                                                {(item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.age}</TableCell>
                                                        <TableCell>{item.temperature}</TableCell>
                                                        <TableCell>{item.humidity}</TableCell>
                                                        <TableCell>{item.pH}</TableCell>
                                                        <TableCell>{item.salinity}</TableCell>
                                                        <TableCell>{item.lightIntensity}</TableCell>
                                                        <TableCell>
                                                            <ButtonGroup>
                                                                <Tooltip content="แก้ไข" color="warning">
                                                                    <Button onPress={() => {setSelectedId(item.id); onOpenUpdateFactor();}} variant="light" size='sm'>
                                                                        <CiEdit className="text-xl text-amber-500" />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip content="ลบ" color="danger">
                                                                    <Button onPress={() => {setSelectedId(item.id); onOpenDeleteFactor();}} variant="light" size='sm'>
                                                                        <HiOutlineTrash className="text-xl text-red-500" />
                                                                    </Button>
                                                                </Tooltip>
                                                            </ButtonGroup>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Tab>
                                    <Tab key="Nutrient" title="ค่าสารอาหาร">
                                        <div className="flex justify-between mb-2">
                                        <p className='text-2xl font-bold'>{plant}</p>
                                            <Button onPress={() => {onOpenCreateNutrient()}} color='success' endContent={<FaPlus />}>เพิ่ม</Button>
                                        </div>
                                        <Table aria-label="Nutrient Data">
                                            <TableHeader>
                                                <TableColumn key="age">ตั้งแต่ (วัน) ขึ้นไป</TableColumn>
                                                <TableColumn key="temperature">(N) ไนโตรเจน (mg/L)</TableColumn>
                                                <TableColumn key="humidity">(P) ฟอสฟอรัส (mg/L)</TableColumn>
                                                <TableColumn key="ph">(K) โพแทสเซียม (mg/L)</TableColumn>
                                                <TableColumn key="tools">จัดการ</TableColumn>
                                            </TableHeader>
                                            <TableBody items={nutrient} emptyContent="ไม่มีข้อมูล">
                                                {(item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{item.age}</TableCell>
                                                        <TableCell>{item.nitrogen}</TableCell>
                                                        <TableCell>{item.phosphorus}</TableCell>
                                                        <TableCell>{item.potassium}</TableCell>
                                                        <TableCell>
                                                            <ButtonGroup>
                                                                <Tooltip content="แก้ไข" color="warning">
                                                                    <Button onPress={() => {setSelectedId(item.id); onOpenUpdateNutrient();}} variant="light" size='sm'>
                                                                        <CiEdit className="text-xl text-amber-500" />
                                                                    </Button>
                                                                </Tooltip>
                                                                <Tooltip content="ลบ" color="danger">
                                                                    <Button onPress={() => {setSelectedId(item.id); onOpenDeleteNutrient();}} variant="light" size='sm'>
                                                                        <HiOutlineTrash className="text-xl text-red-500" />
                                                                    </Button>
                                                                </Tooltip>
                                                            </ButtonGroup>
                                                        </TableCell>
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

            {isOpenCreateFactor && (
                <ModalCreateFactor isOpen={isOpenCreateFactor} onOpenChange={onOpenChangeCreateFactor} setRefresh={setRefresh} id={id} />
            )}
            {isOpenUpdateFactor && (
                <ModalUpdateFactor isOpen={isOpenUpdateFactor} onOpenChange={onOpenChangeUpdateFactor} setRefresh={setRefresh} id={selectedId} />
            )}
            {isOpenDeleteFactor && (
                <ModalDeleteFactor isOpen={isOpenDeleteFactor} onOpenChange={onOpenChangeDeleteFactor} setRefresh={setRefresh} id={selectedId} />
            )}
            {isOpenCreateNutrient && (
                <ModalCreateNutrient isOpen={isOpenCreateNutrient} onOpenChange={onOpenChangeCreateNutrient} setRefresh={setRefresh} id={id} />
            )}
            {isOpenUpdateNutrient && (
                <ModalUpdateNutrient isOpen={isOpenUpdateNutrient} onOpenChange={onOpenChangeUpdateNutrient} setRefresh={setRefresh} id={selectedId} />
            )}
            {isOpenDeleteNutrient && (
                <ModalDeleteNutrient isOpen={isOpenDeleteNutrient} onOpenChange={onOpenChangeDeleteNutrient} setRefresh={setRefresh} id={selectedId} />
            )}
        </>
    )
}

export default ModalPlantVariable