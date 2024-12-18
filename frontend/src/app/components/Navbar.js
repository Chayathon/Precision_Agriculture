'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Select, SelectSection, SelectItem, DateInput, Badge, User, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { FaCirclePlus, FaBell, FaUserGear, FaArrowRightFromBracket } from "react-icons/fa6";
import { toast } from 'react-toastify';

function UserNavbar() {
    const router = useRouter()
    const [currentDate, setCurrentDate] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const [selectedKeys, setSelectedKeys] = useState(new Set(['มันสำปะหลัง']));

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
      );

    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [userEmail, setUserEmail] = useState('')

    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [tel, setTel] = useState('')
    const [address, setAddress] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            
            const formattedDate = now.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const formattedTime = now.toLocaleTimeString('th-TH', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            });
            
            setCurrentDate(formattedDate);
            setCurrentTime(formattedTime);
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000); // อัพเดททุกวินาที

        return () => clearInterval(intervalId); // เคลียร์ interval เมื่อ unmount
    }, []);

    useEffect(() => {
        if(localStorage.getItem('UserData')) {
            const user = JSON.parse(localStorage.getItem('UserData'))
            
            setId(user.id);
            setName(user.username);
            setUserEmail(user.email);
        }
    }, [localStorage.getItem('UserData')])

    useEffect(() => {
        if(isOpenEdit) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`http://localhost:4000/api/getUser/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setFirstname(data.resultData.firstname)
                    setLastname(data.resultData.lastname)
                    setEmail(data.resultData.email)
                    setTel(data.resultData.tel)
                    setAddress(data.resultData.address)
                    setUsername(data.resultData.username)
                    setPassword(data.resultData.password)
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData()
        }
    }, [isOpenEdit])

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        if(!firstname || !lastname || !email || !tel || !address) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!")
            return;
        }

        try {
            const res = await fetch(`http://localhost:4000/api/updateUser/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname, lastname, email, tel, address
                })
            })

            if(res.ok) {
                const form = e.target
                form.reset()

                toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว")
                onOpenChangeEdit(false);
                setRefresh(true)

                setTimeout(() => {
                    setRefresh(false)
                }, 1000)
            }
            else {
                toast.error("แก้ไขข้อมูลล้มเหลว")
                return;
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleLogout = () => {
        Cookies.remove('UserData');
        Cookies.remove('Token');

        toast.success("ออกจากระบบแล้ว")
        router.push('/')
    }

    return (
        <Navbar className='bg-gray-800 text-white'>
            <NavbarBrand>
                <div className='flex flex-col'>
                    <div className='text-sm'>{currentDate}</div>
                    <div className='text-lg font-bold'>{currentTime}</div>
                </div>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <Dropdown>
                    <DropdownTrigger>
                        <Button 
                            variant="bordered" 
                            className="capitalize"
                        >
                            {selectedValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu 
                        aria-label="Select plant"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                    >
                        <DropdownItem key="มันสำปะหลัง">มันสำปะหลัง</DropdownItem>
                        <DropdownItem  key="เพิ่มพืช" color="primary" endContent={<FaCirclePlus className='text-lg' />} onPress={onOpenAdd}>
                            เพิ่มพืช
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <div>
                            <Badge content="3" size="sm" color="danger">
                                <FaBell className='size-6 cursor-pointer' />
                            </Badge>
                        </div>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem
                            description="ต่ำกว่าค่าที่ต้องการ"
                            isReadOnly
                            showDivider
                        >
                            ไนโตรเจน
                        </DropdownItem>
                        <DropdownItem
                            description="ต่ำกว่าค่าที่ต้องการ"
                            isReadOnly
                            showDivider
                        >
                            ฟอสฟอรัส
                        </DropdownItem>
                        <DropdownItem
                            description="ต่ำกว่าค่าที่ต้องการ"
                            isReadOnly
                            showDivider
                        >
                            โพแทสเซียม
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <User
                                showFallback src='https://images.unsplash.com/broken'
                                as="button"
                                name={name}
                                description={userEmail}
                                className="transition-transform"
                            />
                        </div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="settings" onPress={onOpenEdit}>
                            <p className='flex justify-between'>แก้ไขโปรไฟล์<FaUserGear className='text-lg' /></p>
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                            <p className='flex justify-between'>ออกจากระบบ<FaArrowRightFromBracket className='text-lg' /></p>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Modal 
                    isOpen={isOpenAdd} 
                    onOpenChange={onOpenChangeAdd}
                    placement="top-center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">เพิ่มพืช</ModalHeader>
                                <ModalBody>
                                    <form>
                                        <div className='mb-4'>
                                            <Select label="พืช" isRequired>
                                                <SelectItem key="rice">ข้าว</SelectItem>
                                                <SelectItem key="corn">ข้าวโพดเลี้ยงสัตว์</SelectItem>
                                                <SelectItem key="cassava">มันสำปะหลัง</SelectItem>
                                                <SelectItem key="durian">ทุเรียน</SelectItem>
                                            </Select>
                                        </div>
                                        <div className='mt-4'>
                                            <DateInput label="วันที่ปลูก" isRequired />
                                        </div>
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="flat" onPress={onClose}>
                                        ยกเลิก
                                    </Button>
                                    <Button type='submit' color="primary">
                                        เพิ่ม
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Modal 
                    isOpen={isOpenEdit} 
                    onOpenChange={onOpenChangeEdit}
                    size={"2xl"}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูล</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={handleSubmitEdit}>
                                        <div className='flex mb-4 gap-4'>
                                            <Input onChange={(e) => setFirstname(e.target.value)} type='text' value={firstname} label='ชื่อจริง' isClearable isRequired />

                                            <Input onChange={(e) => setLastname(e.target.value)} type='text' value={lastname} label='นามสกุล' isClearable isRequired />
                                        </div>
                                        <div className='flex my-4 gap-4'>
                                            <Input onChange={(e) => setEmail(e.target.value)} type='email' value={email} label='อีเมล' isClearable isRequired />

                                            <Input onChange={(e) => setTel(e.target.value)} type='text' value={tel} label='เบอร์โทรศัพท์' maxLength='10' isClearable isRequired />
                                        </div>
                                        <div className='my-4'>
                                            <Textarea onChange={(e) => setAddress(e.target.value)} value={address} label='ที่อยู่' isRequired />
                                        </div>
                                        <div className='my-4'>
                                            <Input onChange={(e) => setUsername(e.target.value)} type='text' value={username} label='ชื่อผู้ใช้' isClearable isDisabled />
                                        </div>
                                        <div className='mt-4'>
                                            <Input
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                                label="รหัสผ่าน"
                                                endContent={
                                                    <Button type="button" size="sm" className='bg-gray-300' onClick={toggleVisibility} aria-label="toggle password visibility">
                                                    {isVisible ? (
                                                        'ซ่อน'
                                                    ) : (
                                                        'แสดง'
                                                    )}
                                                    </Button>
                                                }
                                                type={isVisible ? "text" : "password"}
                                                isDisabled
                                            />
                                        </div>
                                        <ModalFooter>
                                            <Button variant="flat" onPress={onClose}>
                                                ยกเลิก
                                            </Button>
                                            <Button type='submit' color="warning">
                                                แก้ไข
                                            </Button>
                                        </ModalFooter>
                                    </form>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </NavbarContent>
        </Navbar>
    )
}

export default UserNavbar