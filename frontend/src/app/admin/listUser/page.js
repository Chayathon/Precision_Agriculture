"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, ButtonGroup, Stack, Flex, useDisclosure } from "@chakra-ui/react";
import { TailSpin } from "react-loader-spinner";
import ModalUpdate from "../components/ModalUpdate";
import ModalDelete from "../components/ModalDelete";

function Page() {
    const [users, setUsers] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef()

    const fetchUser = async (role_id) => {
        try {
            const token = Cookies.get("Token");
            const res = await fetch(`http://localhost:4000/api/listUser/${role_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch");
            }

            const data = await res.json();
            setUsers(data.resultData);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchUser(1);
    }, []);

    return (
        <>
        <TableContainer>
            <Table size='lg'>
                <Thead>
                    <Tr>
                        <Th>ไอดี</Th>
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
                                <Td>{user.id}</Td>
                                <Td>{user.firstname}</Td>
                                <Td>{user.lastname}</Td>
                                <Td>{user.email}</Td>
                                <Td>{user.tel}</Td>
                                <Td>{user.address}</Td>
                                <Td>{user.username}</Td>
                                <Td>
                                    <ButtonGroup size='sm' colorScheme='gray' isAttached>
                                        <Button onClick={onOpen}>
                                            แก้ไข
                                            <ModalUpdate isOpen={isOpen} onClose={onClose} id={user.id} />
                                        </Button>
                                        <Button onClick={onOpen}>
                                            ลบ
                                            <ModalDelete isOpen={isOpen} onClose={onClose} cancelRef={cancelRef} id={user.id} />
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
