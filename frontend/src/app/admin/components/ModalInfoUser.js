import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Link } from '@nextui-org/react'
import moment from "moment";
import 'moment/locale/th';
import { FaMapLocationDot } from 'react-icons/fa6';

function ModalInfoUser({ isOpen, onOpenChange, id }) {
    const [user, setUser] = useState('');
    const [plant, setPlant] = useState([]);

    useEffect(() => {
        if(isOpen) {
            const fetchUserData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getUsername/${id}`);

                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setUser(data.resultData.username);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }
            
            const fetchPlantData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantUserId/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setPlant(data.resultData);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchUserData();
            fetchPlantData();
        }
    }, [isOpen, id]);

    const convertDate = (dateConvert) => {
        const date = moment(dateConvert).locale('th');

        // เพิ่ม 543 ปีเข้าไปในปี
        const buddhistYearDate = date.format('D MMMM') + ' ' + (date.year() + 543);

        return (buddhistYearDate)
    }

    return (
        <>
            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                size='2xl'
                scrollBehavior='inside'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">ข้อมูลพืชที่ปลูกของ {user}</ModalHeader>
                            <ModalBody>
                                <Table aria-label="User Plant Info">
                                    <TableHeader>
                                        <TableColumn key="plantedAt">วันที่ปลูก</TableColumn>
                                        <TableColumn key="plantname">พืชที่ปลูก</TableColumn>
                                        <TableColumn key="place">สถานที่ปลูก</TableColumn>
                                    </TableHeader>
                                    <TableBody items={plant} emptyContent="ไม่มีข้อมูล">
                                        {(item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{convertDate(item.plantedAt)}</TableCell>
                                                <TableCell>{item.plantname}</TableCell>
                                                <TableCell>
                                                    {item.latitude && item.longitude ? (
                                                        <Link
                                                            href={`https://www.google.com/maps/place/${item.latitude},${item.longitude}`}
                                                            className="flex items-center"
                                                            underline='hover'
                                                            isExternal
                                                        >
                                                            <FaMapLocationDot />&nbsp;Maps
                                                        </Link>
                                                    ) : (
                                                        "ไม่มีข้อมูลสถานที่ปลูก"
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
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
        </>
    )
}

export default ModalInfoUser