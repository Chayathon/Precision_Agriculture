'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Select, SelectSection, SelectItem, DateInput, Badge, User, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { FaBell, FaUserGear, FaArrowRightFromBracket } from "react-icons/fa6";
import { toast } from 'react-toastify';
import Dashboard from '../home/dashboard/page';

function UserNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });

    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [userEmail, setUserEmail] = useState('')

    const [selectedPlantId, setSelectedPlantId] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [plants, setPlants] = useState([]);

    const selectedValue = useMemo(
        () => {
            if (selectedKeys.size === 0) return 'เลือกพืช';
            const selectedPlantId = Array.from(selectedKeys)[0];
            const selectedPlant = plants.find(item => item.id.toString() === selectedPlantId);
            return selectedPlant ? selectedPlant.plantname : 'เลือกพืช';
        },
        [selectedKeys, plants]
    );

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const { isOpen: isOpenEdit, onOpen: onOpenEdit, onOpenChange: onOpenChangeEdit } = useDisclosure();

    const fetchPlantByUserId = async (id) => {
        try {
            const res = await fetch(`http://localhost:4000/api/getPlantUserId/${id}`);
                
            if (!res.ok) {
                throw new Error("Failed to fetch");
            }

            const data = await res.json();
            setPlants(data.resultData);
        } catch (err) {
            console.error("Error fetching data: ", err);
        }
    }

    useEffect(() => {
        if(localStorage.getItem('UserData')) {
            const user = JSON.parse(localStorage.getItem('UserData') || '{}')
            
            if(user) {
                setId(user.id);
                setName(user.username);
                setUserEmail(user.email);
            }
        }
    }, [])

    useEffect(() => {
        const updateDateTime = () => {
          const now = new Date();

          setCurrentDateTime({
            date: now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }),
            time: now.toLocaleTimeString('th-TH', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
          });
        };
    
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);
      }, []);

    useEffect(() => {
        if(pathname !== "/home/dashboard") {
            setSelectedKeys(new Set([]));
            setSelectedPlantId(null);
        }
    }, [pathname])

    useEffect(() => {
        if(id) {
            fetchPlantByUserId(id);
        }
    }, [id]);

    useEffect(() => {
        if (selectedKeys.size > 0) {
            setSelectedPlantId(Array.from(selectedKeys)[0]);
            router.push('/home/dashboard');
        }
    }, [selectedKeys]);

    useEffect(() => {
        if(isOpenEdit) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`http://localhost:4000/api/getUser/${id}`);
                        
                    if (!res.ok) {
                        throw new Error("Failed to fetch");
                    }

                    const data = await res.json();
                    setFirstname(data.resultData.firstname);
                    setLastname(data.resultData.lastname);
                    setEmail(data.resultData.email);
                    setTel(data.resultData.tel);
                    setAddress(data.resultData.address);
                    setUsername(data.resultData.username);
                    setPassword(data.resultData.password);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }
            fetchData();
        }
    }, [isOpenEdit])

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(!firstname || !lastname || !email || !tel || !address) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
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
            });

            if(res.ok) {
                const form = e.target;
                form.reset();

                toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว");
                onOpenChangeEdit(false);
                setRefresh(true);

                setTimeout(() => {
                    setRefresh(false);
                }, 1000);
            }
            else {
                toast.error("แก้ไขข้อมูลล้มเหลว");
                return;
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogout = () => {
        Cookies.remove('UserData');
        Cookies.remove('Token');

        toast.success("ออกจากระบบแล้ว");
        router.push('/');
    }

    return (
        <>
            <Navbar className='bg-gray-800 text-white'>
                <NavbarBrand>
                    <div className='flex flex-col'>
                        <div className='text-sm'>{currentDateTime.date}</div>
                        <div className='text-lg font-bold'>{currentDateTime.time}</div>
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
                            {plants.map((item) => (
                                <DropdownItem key={item.id}>{item.plantname}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>

                <NavbarItem>
                    <Link href="/home/listPlant">
                        ข้อมูลพืช
                    </Link>
                </NavbarItem>

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
                            <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                                <p className='flex justify-between'>ออกจากระบบ<FaArrowRightFromBracket className='text-lg' /></p>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

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
                                                        <Button type="button" size="sm" className='bg-gray-300' onPress={toggleVisibility} aria-label="toggle password visibility">
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
                                                <Button
                                                    type='submit'
                                                    color='warning'
                                                    isLoading={isLoading}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? 'กำลังแก้ไขข้อมูล...' : 'แก้ไข'}
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
            {selectedPlantId && <Dashboard id={selectedPlantId} />}
        </>
    )
}

export default UserNavbar