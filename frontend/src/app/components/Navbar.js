'use client';

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Select, SelectSection, SelectItem, DateInput, Badge, User, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { FaBell, FaUserGear, FaArrowRightFromBracket, FaDownload } from "react-icons/fa6";
import { toast } from 'react-toastify';

function UserNavbar() {
    const router = useRouter();
    const pathname = usePathname();

    const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const [plants, setPlants] = useState([]);
    const [selectedPlantId, setSelectedPlantId] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));

    const selectedValue = useMemo(() => {
        const selectedId = Array.from(selectedKeys)[0];
        const selectedPlant = plants.find(plant => plant.id.toString() === selectedId);
        setSelectedPlantId(selectedId); // ถ้ายังต้องการเก็บ ID
        
        return selectedPlant ? selectedPlant.plantname : "เลือกพืช"; // Default text
    }, [selectedKeys, plants]);

    const [notifications, setNotifications] = useState([]);

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantUserId/${id}`);
                
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
    }, []);

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
        // แยก pathname ออกเป็น array โดยใช้ "/"
        const pathParts = pathname.split('/');
        
        // หา index ของ "dashboard" ใน path
        const dashboardIndex = pathParts.indexOf('dashboard');
        
        // ถ้ามี id หลัง dashboard (index + 1)
        if (dashboardIndex !== -1 && dashboardIndex + 1 < pathParts.length) {
            const id = pathParts[dashboardIndex + 1];
            
            // ถ้าเป็นหน้า dashboard และมี id
            if (pathname.includes('/home/dashboard') && id) {
                setSelectedKeys(new Set([id])); // set id เป็น selected key
                setSelectedPlantId(id); // set id เข้า plantId ด้วย
            } else {
                setSelectedKeys(new Set([]));
                setSelectedPlantId(null);
            }
        } else {
            // ถ้าไม่มี id
            setSelectedKeys(new Set([]));
            setSelectedPlantId(null);
        }
    }, [pathname]);

    useEffect(() => {
        if(id) {
            fetchPlantByUserId(id);
        }
    }, [id]);

    useEffect(() => {
        if (selectedKeys.size > 0) {
            router.push(`/home/dashboard/${selectedPlantId}`);
        }
    }, [selectedKeys, router, selectedPlantId]);

    useEffect(() => {
        const loadNotifications = () => {
            // รายการ key ที่เราเก็บใน localStorage จาก page.js
            const keys = [
                'temperature',
                'humidity',
                'nitrogen',
                'phosphorus',
                'potassium',
                'pH',
                'salinity',
                'lightIntensity'
            ];
            // ดึงข้อมูลจาก localStorage และกรองเฉพาะที่มีค่า
            const items = keys
                .map(key => ({
                    key: key,
                    message: localStorage.getItem(key)
                }))
                .filter(item => item.message !== null); // กรองเฉพาะที่มีข้อความ

                setNotifications(items);
        };
        
        loadNotifications();
    }, []);
        
    useEffect(() => {
        if(isOpenEdit) {
            const fetchData = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getUser/${id}`);
                        
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
    }, [isOpenEdit, id]);

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(!firstname || !lastname || !email || !tel || !address) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/updateUser/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname, lastname, email, tel, address
                })
            });

            if(res.status === 200) {
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
    };

    const handleRemoveItem = (key) => {
        localStorage.removeItem(key); // ลบจาก localStorage
        setNotifications(prev => prev.filter(item => item.key !== key)); // อัพเดท state
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/precision-agriculture.apk";
        link.download = "precision-agriculture.apk";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleLogout = () => {
        Cookies.remove('UserData');
        Cookies.remove('Token');

        toast.success("ออกจากระบบแล้ว");
        router.push('/');
    };

    return (
        <>
            <Navbar className='bg-gray-800 text-white'>
                <NavbarBrand>
                    <div className='flex-col hidden sm:flex'>
                        <div className='text-sm'>{currentDateTime.date}</div>
                        <div className='text-lg font-bold'>{currentDateTime.time}</div>
                    </div>
                </NavbarBrand>

                <NavbarContent className="flex gap-4" justify="center">
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
                            selectionMode="single"
                            items={plants}
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                            disallowEmptySelection
                        >
                            {(item) => (
                                <DropdownItem key={item.id}>{item.plantname}</DropdownItem>
                            )}
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
                                <Badge content={notifications.length} size="sm" color="danger">
                                    <FaBell className="size-6 cursor-pointer" />
                                </Badge>
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu>
                            {notifications.length > 0 ? (
                                notifications.map((item, index) => (
                                    <DropdownItem
                                        key={item.key}
                                        description={item.message.split('ต่ำกว่าค่าที่ต้องการ')[0] === item.message ? "ต่ำกว่าค่าที่ต้องการ" : item.message}
                                        showDivider={index < notifications.length - 1}
                                        className="flex justify-between items-center"
                                    >
                                        <span>
                                            {item.key === 'temperature' && 'อุณหภูมิ'}
                                            {item.key === 'humidity' && 'ความชื้น'}
                                            {item.key === 'nitrogen' && 'ไนโตรเจน'}
                                            {item.key === 'phosphorus' && 'ฟอสฟอรัส'}
                                            {item.key === 'potassium' && 'โพแทสเซียม'}
                                            {item.key === 'pH' && 'ค่าความเป็นกรด-ด่าง'}
                                            {item.key === 'salinity' && 'ค่าการนำไฟฟ้า'}
                                            {item.key === 'lightIntensity' && 'ค่าความเข้มแสง'}
                                        </span>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            variant="light"
                                            onPress={() => handleRemoveItem(item.key)}
                                        >
                                            ลบ
                                        </Button>
                                    </DropdownItem>
                                ))
                            ) : (
                                <DropdownItem isReadOnly>ไม่มีการแจ้งเตือน</DropdownItem>
                            )}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <User
                                    showFallback src='https://images.unsplash.com/broken'
                                    as="button"
                                    name={<span className="sm:inline hidden">{name}</span>}
                                    description={<span className="sm:inline hidden">{userEmail}</span>}
                                    className="transition-transform"
                                />
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="download" onPress={handleDownload}>
                                <p className='flex justify-between'>ดาวน์โหลดแอปพลิเคชัน<FaDownload className='text-lg' /></p>
                            </DropdownItem>
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
            {/* {selectedPlantId ? <Dashboard id={selectedPlantId} /> : "กรุณาเลือกพืช"} */}
        </>
    )
}

export default UserNavbar