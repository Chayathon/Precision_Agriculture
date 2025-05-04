"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, ButtonGroup, Pagination, Tooltip, useDisclosure, Spinner, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { FaPlus, FaAngleLeft, FaAngleRight, FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { CiEdit, CiMenuKebab, CiViewList } from "react-icons/ci";
import { HiOutlineTrash } from "react-icons/hi2";
import moment from "moment";
import 'moment/locale/th';
import ModalCreatePlant from "@/app/components/ModalCreatePlant";
import ModalUpdatePlant from "@/app/components/ModalUpdatePlant";
import ModalDeletePlant from "@/app/components/ModalDeletePlant";
import ModalMultiDeletePlant from "@/app/components/ModalMultiDeletePlant";
import ModalPlantVariable from "@/app/components/ModalPlantVariable";

export default function ListPlant() {
    const [userId, setUserId] = useState(null);
    const [plants, setPlants] = useState([]);

    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedId, setSelectedId] = useState(null);
    const { isOpen: isOpenCreate, onOpen: onOpenCreate, onOpenChange: onOpenChangeCreate } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();
    const { isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete } = useDisclosure();
    const { isOpen: isOpenMultiDelete, onOpen: onOpenMultiDelete, onOpenChange: onOpenChangeMultiDelete } = useDisclosure();
    const { isOpen: isOpenPlantVariable, onOpen: onOpenPlantVariable, onOpenChange: onOpenChangePlantVariable } = useDisclosure();

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
        let filteredUsers = [...plants];

        if (filterValue) {
            filteredUsers = filteredUsers.filter((plant) =>
                plant.plantname?.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredUsers;
    }, [plants, filterValue]);

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

    useEffect(() => {
        if(userId) {
            const fetchPlant = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/listPlant/${userId}`);
        
                    if (res.status === 200) {
                        const data = await res.json();
                        setPlants(data.resultData);
                        setIsLoading(false);
                        setPage(1);
                    }
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            };

            fetchPlant();
        }
    }, [refresh, userId])
    
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("UserData") || "{}");
        setUserId(userData.id);
    }, []);

    const convertDate = (dateConvert) => {
        const date = moment(dateConvert).locale('th');

        // เพิ่ม 543 ปีเข้าไปในปี
        const buddhistYearDate = date.format('D MMMM') + ' ' + (date.year() + 543);

        return (buddhistYearDate);
    }

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
                    <span className="text-default-400 text-small">ทั้งหมด {plants.length} รายการ</span>
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
    }, [filterValue, onRowsPerPageChange, plants.length, onSearchChange, selectedKeys.size, onClear, onOpenCreate, onOpenMultiDelete]);

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
                    <TableColumn allowsSorting key="plantedAt">วันที่ปลูก</TableColumn>
                    <TableColumn allowsSorting key="plantname">ชื่อพืช</TableColumn>
                    <TableColumn key="place">สถานที่ปลูก</TableColumn>
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
                            <TableCell>{convertDate(item.plantedAt)}</TableCell>
                            <TableCell>{item.plantname}</TableCell>
                            <TableCell>
                                {item.latitude && item.longitude ? (
                                    <a
                                        href={`https://www.google.com/maps/place/${item.latitude},${item.longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-blue-600 hover:underline"
                                    >
                                        <FaLocationDot />&nbsp;Google Maps
                                    </a>
                                ) : (
                                    "ไม่มีข้อมูลสถานที่ปลูก"
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="hidden sm:block">
                                    <ButtonGroup>
                                        {item.plant_id === 1 && (
                                            <>
                                                <Tooltip content="เพิ่มค่าตัวแปร" color="success">
                                                    <Button onPress={() => {setSelectedId(item.id); onOpenPlantVariable();}} variant="light" size='sm'>
                                                        <CiViewList  className="text-xl text-success-500" />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip content="แก้ไข" color="warning">
                                                    <Button onPress={() => {setSelectedId(item.id); onOpenUpdate();}} variant="light" size='sm'>
                                                        <CiEdit className="text-xl text-amber-500" />
                                                    </Button>
                                                </Tooltip>
                                            </>
                                        )}
                                        <Tooltip content="ลบ" color="danger">
                                            <Button onPress={() => {setSelectedId(item.id); onOpenDelete();}} variant="light" size='sm'>
                                                <HiOutlineTrash className="text-xl text-red-500" />
                                            </Button>
                                        </Tooltip>
                                    </ButtonGroup>
                                </div>

                                <div className="block sm:hidden">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button variant="light" size="sm">
                                                <CiMenuKebab className="text-xl" />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="ตัวเลือกการจัดการ">
                                            {item.plant_id === 1 && (
                                                <>
                                                    <DropdownItem
                                                        key="add-variable" 
                                                        onPress={() => {setSelectedId(item.id); onOpenPlantVariable();}}
                                                        startContent={<CiViewList className="text-success-500" />}
                                                    >
                                                        เพิ่มค่าตัวแปร
                                                    </DropdownItem>
                                                    <DropdownItem 
                                                        key="edit" 
                                                        onPress={() => {setSelectedId(item.id); onOpenUpdate();}}
                                                        startContent={<CiEdit className="text-amber-500" />}
                                                    >
                                                        แก้ไข
                                                    </DropdownItem>
                                                </>
                                            )}
                                            <DropdownItem 
                                                key="delete" 
                                                onPress={() => {setSelectedId(item.id); onOpenDelete();}}
                                                className="text-danger"
                                                startContent={<HiOutlineTrash className="text-red-500" />}
                                            >
                                                ลบ
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            
            {isOpenCreate && (
                <ModalCreatePlant isOpen={isOpenCreate} onOpenChange={onOpenChangeCreate} setRefresh={setRefresh} />
            )}
            {isOpenUpdate && (
                <ModalUpdatePlant isOpen={isOpenUpdate} onOpenChange={onOpenChangeUpdate} id={selectedId} setRefresh={setRefresh} />
            )}
            {isOpenDelete && (
                <ModalDeletePlant isOpen={isOpenDelete} onOpenChange={onOpenChangeDelete} id={selectedId} setRefresh={setRefresh} />
            )}
            {isOpenMultiDelete && (
                <ModalMultiDeletePlant
                    isOpen={isOpenMultiDelete}
                    onOpenChange={onOpenChangeMultiDelete}
                    selectedKeys={Array.from(selectedKeys)}
                    setRefresh={setRefresh}
                    deleteSuccess={() => {
                        setSelectedKeys(new Set());
                    }}
                />
            )}
            {isOpenPlantVariable && (
                <ModalPlantVariable isOpen={isOpenPlantVariable} onOpenChange={onOpenChangePlantVariable} id={selectedId} />
            )}
        </div>
    );
}