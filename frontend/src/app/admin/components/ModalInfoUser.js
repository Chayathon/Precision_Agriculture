import React, { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import moment from "moment";
import 'moment/locale/th';

function ModalInfoUser({ isOpen, onOpenChange, id }) {
    const [user, setUser] = useState('');
    const [plant, setPlant] = useState([]);

    useEffect(() => {
        if(isOpen) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantUserId/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setPlant(data.resultData);
                    setUser(data.resultData[0].user.username);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData();
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
                                        <TableColumn key="date">วันที่ปลูก</TableColumn>
                                        <TableColumn key="plantname">พืชที่ปลูก</TableColumn>
                                    </TableHeader>
                                    <TableBody items={plant}>
                                        {(item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{convertDate(item.plantAt)}</TableCell>
                                                <TableCell>{item.plantname}</TableCell>
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