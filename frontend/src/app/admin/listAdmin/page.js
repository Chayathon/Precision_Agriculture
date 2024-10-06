'use client'

import { useState, useEffect, useRef } from 'react'
import Cookies from "js-cookie";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, ButtonGroup, Button, useDisclosure } from '@chakra-ui/react';
import { TailSpin } from "react-loader-spinner";
import ModalUpdate from '../components/ModalUpdate';
import ModalDelete from '../components/ModalDelete';

function Page() {
    const [admins, setAdmins] = useState([])
    
    const [selectedId, setSelectedId] = useState(null);
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const cancelRef = useRef()

    const fetchAdmin = async (role_id) => {
        try {
            const token = Cookies.get("Token");
            const res = await fetch(`http://localhost:4000/api/listAdmin/${role_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch");
            }

            const data = await res.json();
            setAdmins(data.resultData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchAdmin(2);
    }, []);

    return (
        <>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>ชื่อจริง</Th>
                            <Th>นามสกุล</Th>
                            <Th>อีเมล</Th>
                            <Th>เบอร์โทรศัพท์</Th>
                            <Th>ที่อยู่</Th>
                            <Th>ชื่อผู้ใช้</Th>
                            <Th>ตำแหน่ง</Th>
                            <Th>จัดการ</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {admins && admins.length > 0 ? (
                            admins.map((admin) => (
                                <Tr key={admin.id}>
                                    <Td>{admin.firstname}</Td>
                                    <Td>{admin.lastname}</Td>
                                    <Td>{admin.email}</Td>
                                    <Td>{admin.tel}</Td>
                                    <Td>{admin.address}</Td>
                                    <Td>{admin.username}</Td>
                                    <Td>{admin.role.role_name}</Td>
                                    <Td>
                                        <ButtonGroup size='sm' colorScheme='gray' isAttached>
                                            <Button onClick={() => {setSelectedId(admin.id); onOpenUpdate();}}>
                                                แก้ไข
                                                <ModalUpdate isOpen={isOpenUpdate} onClose={onCloseUpdate} id={selectedId} />
                                            </Button>
                                            <Button onClick={() => {setSelectedId(admin.id); onOpenDelete();}}>
                                                ลบ
                                                <ModalDelete isOpen={isOpenDelete} onClose={onCloseDelete} cancelRef={cancelRef} id={selectedId} />
                                            </Button>
                                        </ButtonGroup>
                                    </Td>
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td colSpan='8' className="text-center">
                                    <Flex className="justify-center">
                                        Loading Data... &emsp; <TailSpin
                                            height="25"
                                            width="25"
                                            color="gray"
                                            ariaLabel="tail-spin-loading"
                                        />
                                    </Flex>
                                </Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Page