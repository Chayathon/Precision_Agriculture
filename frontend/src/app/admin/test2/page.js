'use client'

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue} from "@nextui-org/react";

export default function App() {
    const [users, setUsers] = useState([]);
    const [refresh, setRefresh] = useState(false)

    const [page, setPage] = React.useState(1);
    const rowsPerPage = 4;

    const pages = Math.ceil(users.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return users.slice(start, end);
    }, [page, users]);

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
        <div className="flex flex-col gap-3">
            <Table 
                selectionMode="single" 
                aria-label="Example static collection table"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn>FIRSTNAME</TableColumn>
                    <TableColumn>LASTNAME</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>TEL</TableColumn>
                    <TableColumn>ADDRESS</TableColumn>
                    <TableColumn>USERNAME</TableColumn>
                </TableHeader>
                <TableBody>
                    {items.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.firstname}</TableCell>
                            <TableCell>{user.lastname}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.tel}</TableCell>
                            <TableCell>{user.address}</TableCell>
                            <TableCell>{user.username}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
