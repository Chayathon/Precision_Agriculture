'use client'

import { useState, useEffect, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, ButtonGroup, Pagination, Tooltip, useDisclosure, Spinner } from "@nextui-org/react";
import { FaPlus, FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { HiOutlineTrash } from "react-icons/hi2";
import ModalCreateRole from "../components/ModalCreateRole";
import ModalUpdateRole from "../components/ModalUpdateRole";
import ModalDeleteRole from "../components/ModalDeleteRole";
import ModalMultiDeleteRole from "../components/ModalMultiDeleteRole";

export default function ListRole() {
    const [roles, setRoles] = useState([]);

    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedId, setSelectedId] = useState(null);
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onOpenChange: onOpenChangeCreate } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
    const { isOpen: isOpenMultiDelete, onOpen: onOpenMultiDelete, onOpenChange: onOpenChangeMultiDelete } = useDisclosure();

    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(1);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "",
        direction: "ascending"
    });

    // Filter items based on search
    const filteredItems = useMemo(() => {
        let filteredUsers = [...roles];

        if (filterValue) {
            filteredUsers = filteredUsers.filter((role) =>
                role.role_name?.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredUsers;
    }, [roles, filterValue]);

    // Calculate pagination
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    // Sort items
    const sortedItems = useMemo(() => {
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

    const onNextPage = useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, []);

    // Fetch users data
    const fetchRole = async () => {
        try {
            const token = Cookies.get("Token");
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/listRole`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
                const data = await res.json();
                setRoles(data.resultData);
                setPage(1);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRole();
    }, [refresh]);

    // Top content of table
    const topContent = useMemo(() => {
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
                    <span className="text-default-400 text-small">ทั้งหมด {roles.length} รายการ</span>
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
    }, [filterValue, onRowsPerPageChange, roles.length, onSearchChange, selectedKeys.size, onClear, onOpenCreate, onOpenMultiDelete]);

    // Bottom content of table
    const bottomContent = useMemo(() => {
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
    }, [selectedKeys, filteredItems.length, isLoading, page, pages, onPreviousPage, onNextPage]);

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
                    <TableColumn allowsSorting key="id">ไอดี</TableColumn>
                    <TableColumn allowsSorting key="role_name">บทบาท</TableColumn>
                    <TableColumn key="tools">จัดการ</TableColumn>
                </TableHeader>
                <TableBody 
                    isLoading={isLoading}
                    loadingContent={<Spinner size="lg" label="กำลังโหลดข้อมูล..." />}
                    emptyContent={!isLoading ? "ไม่มีข้อมูล" : null}
                    items={sortedItems}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.role_name}</TableCell>
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
                <ModalCreateRole isOpen={isOpenCreate} onOpenChange={onOpenChangeCreate} setRefresh={setRefresh} />
            )}
            {isOpenUpdate && (
                <ModalUpdateRole isOpen={isOpenUpdate} onOpenChange={onOpenChangeUpdate} id={selectedId} setRefresh={setRefresh} />
            )}
            {isOpenDelete && (
                <ModalDeleteRole isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete} id={selectedId} setRefresh={setRefresh} />
            )}
            {isOpenMultiDelete && (
                <ModalMultiDeleteRole
                    isOpen={isOpenMultiDelete}
                    onOpenChange={onOpenChangeMultiDelete}
                    selectedKeys={Array.from(selectedKeys)}
                    setRefresh={setRefresh}
                    deleteSuccess={() => {
                        setSelectedKeys(new Set());
                    }}
                />
            )}
        </div>
    );
}