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
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
} from "@nextui-org/react";
import { FaPlus } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

export default function App() {
    const [users, setUsers] = React.useState([]);
    const [refresh, setRefresh] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
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
                      <Button color="primary" endContent={<FaPlus />}>
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
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

// 'use client'

// import React from "react";
// import Cookies from "js-cookie";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Input,
//   Button,
//   DropdownTrigger,
//   Dropdown,
//   DropdownMenu,
//   DropdownItem,
//   Chip,
//   User,
//   Pagination,
// } from "@nextui-org/react";
// import { FaPlus } from "react-icons/fa6";
// import { FaSearch } from "react-icons/fa";

// export default function App() {
//   const [users, setUsers] = React.useState([]);
//   const [refresh, setRefresh] = React.useState(false);
//   const [isLoading, setIsLoading] = React.useState(true);
//   const [filterValue, setFilterValue] = React.useState("");
//   const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
//   const [statusFilter, setStatusFilter] = React.useState("all");
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   const [sortDescriptor, setSortDescriptor] = React.useState({});
//   const [page, setPage] = React.useState(1);

//   const hasSearchFilter = Boolean(filterValue);

//   const filteredItems = React.useMemo(() => {
//     let filteredUsers = [...users];

//     if (hasSearchFilter) {
//       filteredUsers = filteredUsers.filter((user) =>
//         user.firstname.toLowerCase().includes(filterValue.toLowerCase()) ||
//         user.lastname.toLowerCase().includes(filterValue.toLowerCase()) ||
//         user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
//         user.tel.toLowerCase().includes(filterValue.toLowerCase()) ||
//         user.username.toLowerCase().includes(filterValue.toLowerCase())
//       );
//     }

//     return filteredUsers;
//   }, [users, filterValue]);

//   const pages = Math.ceil(filteredItems.length / rowsPerPage);

//   const items = React.useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;

//     return filteredItems.slice(start, end);
//   }, [page, filteredItems, rowsPerPage]);

//   const sortedItems = React.useMemo(() => {
//     return [...items].sort((a, b) => {
//       const first = a[sortDescriptor.column];
//       const second = b[sortDescriptor.column];
//       const cmp = first < second ? -1 : first > second ? 1 : 0;

//       return sortDescriptor.direction === "descending" ? -cmp : cmp;
//     });
//   }, [sortDescriptor, items]);

//   const onNextPage = React.useCallback(() => {
//     if (page < pages) {
//       setPage(page + 1);
//     }
//   }, [page, pages]);

//   const onPreviousPage = React.useCallback(() => {
//     if (page > 1) {
//       setPage(page - 1);
//     }
//   }, [page]);

//   const onRowsPerPageChange = React.useCallback((e) => {
//     setRowsPerPage(Number(e.target.value));
//     setPage(1);
//   }, []);

//   const onSearchChange = React.useCallback((value) => {
//     if (value) {
//       setFilterValue(value);
//       setPage(1);
//     } else {
//       setFilterValue("");
//     }
//   }, []);

//   const onClear = React.useCallback(()=>{
//     setFilterValue("")
//     setPage(1)
//   },[])

//   const topContent = React.useMemo(() => {
//     return (
//       <div className="flex flex-col gap-4">
//         <div className="flex justify-between gap-3 items-end">
//           <Input
//             isClearable
//             className="w-full sm:max-w-[44%]"
//             placeholder="Search by name..."
//             startContent={<FaSearch />}
//             value={filterValue}
//             onClear={() => onClear()}
//             onValueChange={onSearchChange}
//           />
//           <div className="flex gap-3">
//             <Button color="primary" endContent={<FaPlus />}>
//               Add New
//             </Button>
//           </div>
//         </div>
//         <div className="flex justify-between items-center">
//           <span className="text-default-400 text-small">Total {users.length} users</span>
//           <label className="flex items-center text-default-400 text-small">
//             Rows per page:
//             <select
//               className="bg-transparent outline-none text-default-400 text-small"
//               onChange={onRowsPerPageChange}
//             >
//               <option value="5">5</option>
//               <option value="10">10</option>
//               <option value="15">15</option>
//             </select>
//           </label>
//         </div>
//       </div>
//     );
//   }, [
//     filterValue,
//     statusFilter,
//     onRowsPerPageChange,
//     users.length,
//     onSearchChange,
//     hasSearchFilter,
//   ]);

//   const bottomContent = React.useMemo(() => {
//     return (
//       <div className="py-2 px-2 flex justify-between items-center">
//         <span className="w-[30%] text-small text-default-400">
//           {selectedKeys === "all"
//             ? "All items selected"
//             : `${selectedKeys.size} of ${filteredItems.length} selected`}
//         </span>
//         <Pagination
//           isCompact
//           showControls
//           showShadow
//           color="primary"
//           page={page}
//           total={pages}
//           onChange={setPage}
//         />
//         <div className="hidden sm:flex w-[30%] justify-end gap-2">
//           <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
//             Previous
//           </Button>
//           <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
//             Next
//           </Button>
//         </div>
//       </div>
//     );
//   }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

//   const fetchUser = async (role_id) => {
//     try {
//         const token = Cookies.get("Token");
//         const res = await fetch(`http://localhost:4000/api/listUser/${role_id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.ok) {
//             const data = await res.json();
//             setUsers(data.resultData);
//             setIsLoading(false);
        
//         }
//     } catch (error) {
//         console.error("Error fetching data: ", error);
//     }
//   };

//   React.useEffect(() => {
//       fetchUser(1)
//   }, [refresh])

//   return (
//     <Table
//       aria-label="Example table with custom cells, pagination and sorting"
//       isHeaderSticky
//       bottomContent={bottomContent}
//       bottomContentPlacement="outside"
//       classNames={{
//         wrapper: "max-h-[382px]",
//       }}
//       selectedKeys={selectedKeys}
//       selectionMode="multiple"
//       sortDescriptor={sortDescriptor}
//       topContent={topContent}
//       topContentPlacement="outside"
//       onSelectionChange={setSelectedKeys}
//       onSortChange={setSortDescriptor}
//     >
//       <TableHeader>
//         <TableColumn allowsSorting>firstname</TableColumn>
//         <TableColumn allowsSorting>lastname</TableColumn>
//         <TableColumn allowsSorting>email</TableColumn>
//         <TableColumn allowsSorting>tel</TableColumn>
//         <TableColumn allowsSorting>address</TableColumn>
//         <TableColumn allowsSorting>username</TableColumn>
//       </TableHeader>
//       <TableBody emptyContent={"No users found"} items={sortedItems}>
//         {sortedItems.map((user) => (
//           <TableRow key={user.id}>
//               <TableCell>{user.firstname}</TableCell>
//               <TableCell>{user.lastname}</TableCell>
//               <TableCell>{user.email}</TableCell>
//               <TableCell>{user.tel}</TableCell>
//               <TableCell>{user.address}</TableCell>
//               <TableCell>{user.username}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// }