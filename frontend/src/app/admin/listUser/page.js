'use client'

import React from "react";
import Cookies from "js-cookie";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination,
    useDisclosure
} from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import ModalCreateUser from "../components/ModalCreateUser";
import ModalUpdateUser from "../components/ModalUpdateUser";
import ModalDeleteUser from "../components/ModalDeleteUser";

export default function App() {
    const [users, setUsers] = React.useState([]);

    const [refresh, setRefresh] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const [selectedId, setSelectedId] = React.useState(null);
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onOpenChange: onOpenChangeCreate } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "", // เพิ่ม default value
        direction: "ascending" // เพิ่ม default value
    });

    // Filter items based on search
    const filteredItems = React.useMemo(() => {
        let filteredUsers = [...users];

        if (filterValue) {
            filteredUsers = filteredUsers.filter((user) =>
                user.firstname?.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.lastname?.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.tel?.toLowerCase().includes(filterValue.toLowerCase()) ||
                user.username?.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredUsers;
    }, [users, filterValue]);

    // Calculate pagination
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    // Sort items
    const sortedItems = React.useMemo(() => {
        if (!sortDescriptor.column) return items;

        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            
            // Handle null/undefined values
            if (first === null || first === undefined) return 1;
            if (second === null || second === undefined) return -1;
            
            // Convert to strings for comparison
            const firstString = first.toString().toLowerCase();
            const secondString = second.toString().toLowerCase();
            
            // Compare values
            if (firstString < secondString) {
                return sortDescriptor.direction === "ascending" ? -1 : 1;
            }
            if (firstString > secondString) {
                return sortDescriptor.direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
    }, [items, sortDescriptor]);

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, []);

    // Fetch users data
    const fetchUser = async (role_id) => {
        try {
            const token = Cookies.get("Token");
            const res = await fetch(`http://localhost:4000/api/listUser/${role_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(data.resultData);
                setIsLoading(false);
                setPage(1);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    React.useEffect(() => {
        fetchUser(1)
    }, [refresh]);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<FaSearch />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Button onPress={() => {onOpenCreate()}} color="primary" endContent={<FaPlus />}>
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Total {users.length} users</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, onRowsPerPageChange, users.length, onSearchChange]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                    ? "All items selected"
                    : `${selectedKeys.size} of ${filteredItems.length} selected`}
                </span>
                {!isLoading && (
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={setPage}
                    />
                )}
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, onPreviousPage, onNextPage]);

    return (
        <div className='m-4'>
            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader>
                    <TableColumn allowsSorting key="firstname">First Name</TableColumn>
                    <TableColumn allowsSorting key="lastname">Last Name</TableColumn>
                    <TableColumn allowsSorting key="email">Email</TableColumn>
                    <TableColumn allowsSorting key="tel">Phone</TableColumn>
                    <TableColumn allowsSorting key="address">Address</TableColumn>
                    <TableColumn allowsSorting key="username">Username</TableColumn>
                    <TableColumn key="tools">Tools</TableColumn>
                </TableHeader>
                <TableBody 
                    isLoading={isLoading}
                    loadingContent={<div>Loading...</div>}
                    emptyContent={!isLoading ? "No users found" : null}
                    items={sortedItems}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.firstname}</TableCell>
                            <TableCell>{item.lastname}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.tel}</TableCell>
                            <TableCell>{item.address}</TableCell>
                            <TableCell>{item.username}</TableCell>
                            <TableCell>
                                <Button onPress={() => {setSelectedId(item.id); onOpenUpdate();}}>
                                    แก้ไข
                                </Button>
                                <Button onPress={() => {setSelectedId(item.id); onOpenDelete();}}>
                                    ลบ
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            
            {isOpenCreate && (
                <ModalCreateUser isOpen={isOpenCreate} onOpenChange={onOpenChangeCreate} setRefresh={setRefresh} />
            )}
            {isOpenUpdate && (
                <ModalUpdateUser isOpen={isOpenUpdate} onOpenChange={onOpenChangeUpdate} id={selectedId} setRefresh={setRefresh} />
            )}
            {isOpenDelete && (
                <ModalDeleteUser isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete} id={selectedId} setRefresh={setRefresh} />
            )}
        </div>
    );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import Cookies from "js-cookie";
// import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Button, ButtonGroup, Stack, Flex, useDisclosure } from "@nextui-org/react";
// import { TailSpin } from "react-loader-spinner";
// // import ModalCreateUser from "../components/ModalCreateUser";
// // import ModalUpdateUser from "../components/ModalUpdateUser";
// // import ModalDeleteUser from "../components/ModalDeleteUser";

// function Page() {
//     const [users, setUsers] = useState([]);
//     const [selectedId, setSelectedId] = useState(null);
//     const [refresh, setRefresh] = useState(false)

//     const { isOpen: isOpenCreate, onOpen: onOpenCreate, onClose: onCloseCreate } = useDisclosure();
//     const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onClose: onCloseUpdate } = useDisclosure();
//     const { isOpen: isOpenDelete, onOpen: onOpenDelete, onClose: onCloseDelete } = useDisclosure();
//     const cancelRef = useRef();

//     const fetchUser = async (role_id) => {
//         try {
//             const token = Cookies.get("Token");
//             const res = await fetch(`http://localhost:4000/api/listUser/${role_id}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             if (res.ok) {
//                 const data = await res.json();
//                 setUsers(data.resultData);
            
//             }
//         } catch (error) {
//             console.error("Error fetching data: ", error);
//         }
//     };

//     useEffect(() => {
//         fetchUser(1)
//     }, [refresh])

//     return (
//         <>
//             <div className="flex justify-end px-4 pt-2">
//                 <Button onClick={() => {onOpenCreate()}} colorScheme='green'>
//                     เพิ่ม
//                     {isOpenCreate && (
//                         <ModalCreateUser isOpen={isOpenCreate} onClose={onCloseCreate} setRefresh={setRefresh} />
//                     )}
//                 </Button>
//             </div>
//             <TableContainer>
//                 <Table size='lg'>
//                     <Thead>
//                         <Tr>
//                             <Th>ชื่อจริง</Th>
//                             <Th>นามสกุล</Th>
//                             <Th>อีเมล</Th>
//                             <Th>เบอร์โทรศัพท์</Th>
//                             <Th>ที่อยู่</Th>
//                             <Th>ชื่อผู้ใช้</Th>
//                             <Th>จัดการ</Th>
//                         </Tr>
//                     </Thead>
//                     <Tbody>
//                         {users && users.length > 0 ? (
//                             users.map((user) => (
//                                 <Tr key={user.id}>
//                                     <Td>{user.firstname}</Td>
//                                     <Td>{user.lastname}</Td>
//                                     <Td>{user.email}</Td>
//                                     <Td>{user.tel}</Td>
//                                     <Td>{user.address}</Td>
//                                     <Td>{user.username}</Td>
//                                     <Td>
//                                         <ButtonGroup size='sm' colorScheme='gray' isAttached>
//                                             <Button onClick={() => {setSelectedId(user.id); onOpenUpdate();}}>
//                                                 แก้ไข
//                                                 {isOpenUpdate && (
//                                                     <ModalUpdateUser isOpen={isOpenUpdate} onClose={onCloseUpdate} id={selectedId} setRefresh={setRefresh} />
//                                                 )}
//                                             </Button>
//                                             <Button onClick={() => {setSelectedId(user.id); onOpenDelete();}}>
//                                                 ลบ
//                                                 {isOpenDelete && (
//                                                     <ModalDeleteUser isOpen={isOpenDelete} onClose={onCloseDelete} cancelRef={cancelRef} id={selectedId} setRefresh={setRefresh} />
//                                                 )}
//                                             </Button>
//                                         </ButtonGroup>
//                                     </Td>
//                                 </Tr>
//                             ))
//                         ) : (
//                             <Tr>
//                                 <Td colSpan='8' className="text-center">
//                                     <Flex className="justify-center">
//                                         Loading Data... &emsp; <TailSpin
//                                             height="25"
//                                             width="25"
//                                             color="gray"
//                                             ariaLabel="tail-spin-loading"
//                                         />
//                                     </Flex>
//                                 </Td>
//                             </Tr>
//                         )}
//                     </Tbody>
//                 </Table>
//             </TableContainer>
//         </>
//     );
// }

// export default Page;