"use client";

import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, ButtonGroup, Stack, Flex, useDisclosure } from "@chakra-ui/react";
import { TailSpin } from "react-loader-spinner";
import ModalUpdateRole from "../components/ModalUpdateRole";
import ModalDeleteRole from "../components/ModalDeleteRole";

function Page() {
    const [roles, setRoles] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [refresh, setRefresh] = useState(false)

    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
    const cancelRef = useRef();

    const fetchRole = async () => {
        try {
            const token = Cookies.get("Token");
            const res = await fetch(`http://localhost:4000/api/listRole/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setRoles(data.resultData);
            
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchRole()
    }, [refresh])

    return (
        <>
        <TableContainer>
            <Table size='lg'>
                <Thead>
                    <Tr>
                        <Th>ไอดี</Th>
                        <Th>ตำแหน่ง</Th>
                        <Th>จัดการ</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {roles && roles.length > 0 ? (
                        roles.map((role) => (
                            <Tr key={role.id}>
                                <Td>{role.id}</Td>
                                <Td>{role.role_name}</Td>
                                <Td>
                                    <ButtonGroup size='sm' colorScheme='gray' isAttached>
                                        <Button onClick={() => {setSelectedId(role.id); onOpenUpdate();}}>
                                            แก้ไข
                                            {isOpenUpdate && (
                                                <ModalUpdateRole isOpen={isOpenUpdate} onClose={onCloseUpdate} id={selectedId} setRefresh={setRefresh} />
                                            )}
                                            
                                        </Button>
                                        <Button onClick={() => {setSelectedId(role.id); onOpenDelete();}}>
                                            ลบ
                                            {isOpenDelete && (
                                                <ModalDeleteRole isOpen={isOpenDelete} onClose={onCloseDelete} cancelRef={cancelRef} id={selectedId} setRefresh={setRefresh} />
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