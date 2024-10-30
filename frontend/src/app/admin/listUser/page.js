"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, ButtonGroup, Stack, Flex, useDisclosure } from "@nextui-org/react";
import { TailSpin } from "react-loader-spinner";
// import ModalCreateUser from "../components/ModalCreateUser";
// import ModalUpdateUser from "../components/ModalUpdateUser";
// import ModalDeleteUser from "../components/ModalDeleteUser";

function Page() {
    const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [refresh, setRefresh] = useState(false)

    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const cancelRef = useRef();

    const fetchUser = async (role_id) => {
        try {
            const token = Cookies.get("Token");
            const res = await fetch(`http://localhost:4000/api/listUser/${role_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(data.resultData);
            
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchUser(1)
    }, [refresh])

    return (
        <>
            <div className="flex justify-end px-4 pt-2">
                <Button onClick={() => {onOpenCreate()}} colorScheme='green'>
                    เพิ่ม
                    {isOpenCreate && (
                        <ModalCreateUser isOpen={isOpenCreate} onClose={onCloseCreate} setRefresh={setRefresh} />
                    )}
                </Button>
            </div>
            <TableContainer>
                <Table size='lg'>
                    <Thead>
                        <Tr>
                            <Th>ชื่อจริง</Th>
                            <Th>นามสกุล</Th>
                            <Th>อีเมล</Th>
                            <Th>เบอร์โทรศัพท์</Th>
                            <Th>ที่อยู่</Th>
                            <Th>ชื่อผู้ใช้</Th>
                            <Th>จัดการ</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <Tr key={user.id}>
                                    <Td>{user.firstname}</Td>
                                    <Td>{user.lastname}</Td>
                                    <Td>{user.email}</Td>
                                    <Td>{user.tel}</Td>
                                    <Td>{user.address}</Td>
                                    <Td>{user.username}</Td>
                                    <Td>
                                        <ButtonGroup size='sm' colorScheme='gray' isAttached>
                                            <Button onClick={() => {setSelectedId(user.id); onOpenUpdate();}}>
                                                แก้ไข
                                                {isOpenUpdate && (
                                                    <ModalUpdateUser isOpen={isOpenUpdate} onClose={onCloseUpdate} id={selectedId} setRefresh={setRefresh} />
                                                )}
                                            </Button>
                                            <Button onClick={() => {setSelectedId(user.id); onOpenDelete();}}>
                                                ลบ
                                                {isOpenDelete && (
                                                    <ModalDeleteUser isOpen={isOpenDelete} onClose={onCloseDelete} cancelRef={cancelRef} id={selectedId} setRefresh={setRefresh} />
                                                )}
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
    );
}

export default Page;