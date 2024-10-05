'use client'

import { useState, useEffect } from 'react'
import Cookies from "js-cookie";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from '@chakra-ui/react'

function Page() {
    const [admins, setAdmins] = useState([])

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
                            <Th>Firstname</Th>
                            <Th>Lastname</Th>
                            <Th>Email</Th>
                            <Th>Tel</Th>
                            <Th>Address</Th>
                            <Th>Username</Th>
                            <Th>Role</Th>
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
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td>Loading Data...</Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Page