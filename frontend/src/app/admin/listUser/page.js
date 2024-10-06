"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, ButtonGroup, Stack, Flex, useDisclosure } from "@chakra-ui/react";
import { TailSpin } from "react-loader-spinner";

import ModalUpdate from "../components/ModalUpdate";

function Page() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const [users, setUsers] = useState([]);

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
                        <Th>Firstname</Th>
                        <Th>Lastname</Th>
                        <Th>Email</Th>
                        <Th>Tel</Th>
                        <Th>Address</Th>
                        <Th>Username</Th>
                        <Th>Role</Th>
                        <Th>Tool</Th>
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
                                <Td>{user.role.role_name}</Td>
                                <Td>
                                    <Stack direction="row" spacing={1}>
                                    <Button
                                        colorScheme="teal"
                                        variant="outline"
                                        onClick={onOpen}
                                    >Edit
                                        <Modleedit isOpen={isOpen} onClose={onClose} cancelRef={cancelRef} id={user.id} />
                                    </Button>
                                    
                                    <Button colorScheme="teal" variant="outline">
                                        Delete
                                    </Button>
                                    S
                                    </Stack>
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
