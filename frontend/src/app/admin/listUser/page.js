'use client'

import React from "react";
import Cookies from "js-cookie";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, ButtonGroup, Pagination, Tooltip, useDisclosure } from "@nextui-org/react";
import { FaPlus, FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { HiOutlineTrash } from "react-icons/hi2";
import ModalCreateUser from "../components/ModalCreateUser";
import ModalUpdateUser from "../components/ModalUpdateUser";
import ModalDeleteUser from "../components/ModalDeleteUser";
import ModalMultiDelete from "../components/ModalMultiDelete";

export default function App() {
    const [users, setUsers] = React.useState([]);

    const [refresh, setRefresh] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const [selectedId, setSelectedId] = React.useState(null);
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onOpenChange: onOpenChangeCreate } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
    const { isOpen: isOpenMultiDelete, onOpen: onOpenMultiDelete, onOpenChange: onOpenChangeMultiDelete } = useDisclosure();

    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "",
        direction: "ascending"
    });

    console.log(Array.from(selectedKeys))

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

    // const handleMultiDelete = async () => {
    //     try {
    //         const token = Cookies.get("Token");
    //         const selectedUsers = Array.from(selectedKeys);
            
    //         // สร้าง array ของ promises สำหรับการลบแต่ละ user
    //         const deletePromises = selectedUsers.map(userId => 
    //             fetch(`http://localhost:4000/api/deleteUser/${userId}`, {
    //                 method: 'DELETE',
    //                 headers: { 
    //                     Authorization: `Bearer ${token}`,
    //                     'Content-Type': 'application/json'
    //                 }
    //             })
    //         );

    //         // รอให้ทุก request เสร็จสิ้น
    //         await Promise.all(deletePromises);
            
    //         // รีเฟรชข้อมูลและรีเซ็ตการเลือก
    //         setRefresh(prev => !prev);
    //         setSelectedKeys(new Set([]));
    //         onOpenChangeMultiDelete(false);
            
    //     } catch (error) {
    //         console.error("Error deleting users: ", error);
    //     }
    // };

    // const ModalMultiDelete = ({ isOpen, onOpenChange }) => {
    //     return (
    //         <div
    //             className={`fixed inset-0 z-50 flex items-center justify-center ${
    //                 isOpen ? "visible" : "hidden"
    //             }`}
    //         >
    //             <div className="fixed inset-0 bg-black/50"></div>
    //             <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
    //                 <h3 className="text-lg font-semibold mb-4">ยืนยันการลบผู้ใช้</h3>
    //                 <p>คุณต้องการลบผู้ใช้ที่เลือกจำนวน {selectedKeys.size} รายการใช่หรือไม่?</p>
    //                 <div className="flex justify-end gap-2 mt-6">
    //                     <Button color="default" variant="light" onPress={() => onOpenChange(false)}>
    //                         ยกเลิก
    //                     </Button>
    //                     <Button color="danger" onPress={handleMultiDelete}>
    //                         ลบ
    //                     </Button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // };

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
                        placeholder="ค้นหา..."
                        startContent={<FaSearch />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        {selectedKeys.size > 0 && (
                            <Button 
                                onPress={onOpenMultiDelete} 
                                color="danger" 
                                variant="flat"
                                endContent={<HiOutlineTrash />}
                            >
                                ลบ ({selectedKeys.size}) รายการ
                            </Button>
                        )}
                        <Button onPress={() => {onOpenCreate()}} color="primary" endContent={<FaPlus />}>
                            เพิ่ม
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">ทั้งหมด {users.length} รายการ</span>
                    <label className="flex items-center text-default-400 text-small">
                        รายการ/หน้า:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue, onRowsPerPageChange, users.length, onSearchChange, selectedKeys.size]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                    ? "เลือกทั้งหมด"
                    : `${selectedKeys.size} จาก ${filteredItems.length} กำลังเลือก`}
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
                        <FaAngleLeft className="text-lg" /> ย้อนกลับ
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        ถัดไป <FaAngleRight className="text-lg" />
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
                    wrapper: "max-h-[600px]",
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
                    <TableColumn allowsSorting key="firstname">ชื่อจริง</TableColumn>
                    <TableColumn allowsSorting key="lastname">นามสกุล</TableColumn>
                    <TableColumn allowsSorting key="email">อีเมล</TableColumn>
                    <TableColumn allowsSorting key="tel">เบอร์โทรศัพท์</TableColumn>
                    <TableColumn allowsSorting key="address">ที่อยู่</TableColumn>
                    <TableColumn allowsSorting key="username">ชื่อผู้ใช้</TableColumn>
                    <TableColumn key="tools">จัดการ</TableColumn>
                </TableHeader>
                <TableBody 
                    isLoading={isLoading}
                    loadingContent={<div>กำลังโหลดข้อมูล...</div>}
                    emptyContent={!isLoading ? "ไม่มีข้อมูล" : null}
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
                                <ButtonGroup>
                                    <Tooltip content="แก้ไข" color="warning">
                                        <Button onPress={() => {setSelectedId(item.id); onOpenUpdate();}} variant="light" size='sm'>
                                            <CiEdit className="text-xl text-amber-500" />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip content="ลบ" color="danger">
                                        <Button onPress={() => {setSelectedId(item.id); onOpenDelete();}} variant="light" size='sm'>
                                            <HiOutlineTrash className="text-xl text-red-500" />
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
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
            {isOpenMultiDelete && (
                <ModalMultiDelete isOpen={isOpenMultiDelete} onOpenChange={onOpenChangeMultiDelete} selectedKeys={Array.from(selectedKeys)} setRefresh={setRefresh} />
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