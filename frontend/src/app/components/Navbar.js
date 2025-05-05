'use client';

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Select, SelectItem, Badge, User, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { FaBell, FaUserGear , FaDownload, FaRightFromBracket, FaLock } from "react-icons/fa6";
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/th';
import { ThemeSwitcher } from './ThemeSwitcher';

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

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [subdistricts, setSubdistricts] = useState([]);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [address, setAddress] = useState({
        detail: "",
        province: "",
        district: "",
        subdistrict: "",
    });
    const [username, setUsername] = useState('');

    const [isChecked, setIsChecked] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {isOpen: isOpenPassword, onOpen: onOpenPassword, onOpenChange: onOpenChangePassword} = useDisclosure();

    useEffect(() => {
        const updateDateTime = () => {
            const now = moment();
    
            setCurrentDateTime({
                date: 'วัน' + now.locale('th').format('dddd Do MMMM ') + (now.year() + 543),
                time: now.locale('th').format('LTS')
            });
        };
    
        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);
    
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
        if (id) {
            const fetchPlantByUserId = async () => {
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
    
            fetchPlantByUserId();
        }
    }, [id]);

    useEffect(() => {
        if (selectedKeys.size > 0) {
            router.push(`/home/dashboard/${selectedPlantId}`);
        }
    }, [selectedKeys, router, selectedPlantId]);

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
        if(isOpen) {
            const fetchProvinces = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/provinces`);
        
                    if(res.status === 200) {
                        const data = await res.json();
                        setProvinces(data.resultData);
                    }
                } catch (error) {
                    console.error("Failed to fetch", error);
                }
            }
            fetchProvinces();
        }

    }, [isOpen]);

    useEffect(() => {
        if (address?.province) {
            const fetchDistricts = async (provinceId) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/province/${provinceId}/districts`);
        
                    if(res.status === 200) {
                        const data = await res.json();
                        setDistricts(data.resultData);
                    }
                } catch (error) {
                    console.error("Failed to fetch", error);
                }
            }

            fetchDistricts(address?.province);
        } else {
            setAddress(prev => ({
                ...prev,
                district: "",
                subdistrict: ""
            }));
        }

    }, [address?.province]);

    useEffect(() => {
        if (address?.district) {
            const fetchSubdistricts = async (districtId) => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/district/${districtId}/subdistricts`);
        
                    if(res.status === 200) {
                        const data = await res.json();
                        setSubdistricts(data.resultData);
                    }
                } catch (error) {
                    console.error("Failed to fetch", error);
                }
            }

            fetchSubdistricts(address?.district);
        } else {
            setAddress(prev => ({
                ...prev,
                subdistrict: ""
            }));
        }

    }, [address?.district]);
        
    useEffect(() => {
        if(isOpen) {
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
                    setAddress({
                        detail: data.resultData.address,
                        province: data.resultData.province,
                        district: data.resultData.district,
                        subdistrict: data.resultData.subdistrict,
                    });
                    setUsername(data.resultData.username);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }
            fetchData();
        }
    }, [id, isOpen]);

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
                    firstname,
                    lastname,
                    email,
                    tel,
                    address: address.detail,
                    province: address.province,
                    district: address.district,
                    subdistrict: address.subdistrict,
                })
            });

            if(res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
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

    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if(!isChecked) {
                const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/checkPassword/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        currentPassword
                    })
                });
    
                if (res.status === 200) {
                    const form = e.target;
                    form.reset();

                    setIsChecked(true);
                    toast.success("รหัสผ่านปัจจุบันถูกต้อง")
                } else if (res.status === 401) {
                    toast.error("รหัสผ่านปัจจุบันไม่ถูกต้อง!");
                } else {
                    toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
                }
            } else {
                if (password != confirmPassword) {
                    toast.error("รหัสผ่านไม่ตรงกัน!");
                    setIsLoading(false);
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/changePassword/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        password
                    })
                });
                
                if (res.status === 200) {
                    const form = e.target;
                    form.reset();

                    toast.success("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
                    onOpenChangePassword(false);
                    setIsChecked(false);
                } else {
                    toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleRemoveItem = (key) => {
        localStorage.removeItem(key); // ลบจาก localStorage
        setNotifications(prev => prev.filter(item => item.key !== key)); // อัพเดท state
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = "/apk/kasetapp.apk";
        link.download = "kasetapp.apk";
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

    const isActiveLink = (path) => {
        if (path === '/home/dashboard') {
            return pathname.startsWith('/home/dashboard');
        }
        return pathname === path;
    };

    return (
        <>
            <Navbar
                classNames={{
                    base: "bg-slate-200 dark:bg-zinc-800",
                    item: [
                        "flex",
                        "relative",
                        "h-full",
                        "items-center",
                        "data-[active=true]:after:absolute",
                        "data-[active=true]:after:bottom-0",
                        "data-[active=true]:after:left-0",
                        "data-[active=true]:after:right-0",
                        "data-[active=true]:after:h-[2px]",
                        "data-[active=true]:after:rounded-[2px]",
                        "data-[active=true]:after:bg-primary",
                    ],
                }}
                isBlurred={false}
                isBordered
            >
                <NavbarContent>
                    <NavbarBrand>
                        <div className='flex-col hidden sm:flex'>
                            <div className='text-sm'>{currentDateTime.date}</div>
                            <div className='text-xl font-bold'>{currentDateTime.time}</div>
                        </div>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="flex gap-4" justify="center">
                    <NavbarItem isActive={isActiveLink('/home')}>
                        <Link href="/home">
                            หน้าแรก
                        </Link>
                    </NavbarItem>
                    <Dropdown>
                        <NavbarItem isActive={isActiveLink('/home/dashboard')}>
                            <DropdownTrigger>
                                <Button
                                    variant="bordered" 
                                    className="capitalize"
                                >
                                    {selectedValue}
                                </Button>
                            </DropdownTrigger>
                        </NavbarItem>
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
                    <NavbarItem isActive={isActiveLink('/home/listPlant')}>
                        <Link href="/home/listPlant">
                            ข้อมูลพืช
                        </Link>
                    </NavbarItem>
                </NavbarContent>

                <NavbarContent as="div" justify="end">
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger className='flex items-center'>
                            <div>
                                <Badge content={notifications.length} size="sm" color="danger">
                                    <FaBell className="size-6 cursor-pointer" />
                                </Badge>
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label='Notifications'>
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
                                    name={<span className="md:inline hidden">{name}</span>}
                                    description={<span className="md:inline hidden">{userEmail}</span>}
                                    className="transition-transform"
                                />
                            </div>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Profile Actions" variant="flat">
                            <DropdownItem key="theme">
                                <p className='flex justify-between items-center'>ธีม<ThemeSwitcher size='sm' /></p>
                            </DropdownItem>
                            <DropdownItem key="download" onPress={handleDownload}>
                                <p className='flex justify-between items-center'>ดาวน์โหลดแอปพลิเคชัน<FaDownload size={18} /></p>
                            </DropdownItem>
                            <DropdownItem key="settings" onPress={onOpen}>
                                <p className='flex justify-between items-center'>แก้ไขโปรไฟล์<FaUserGear size={18} /></p>
                            </DropdownItem>
                            <DropdownItem key="changePassword" onPress={onOpenPassword}>
                                <p className='flex justify-between items-center'>เปลี่ยนรหัสผ่าน<FaLock size={18} /></p>
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                                <p className='flex justify-between items-center'>ออกจากระบบ<FaRightFromBracket size={18} /></p>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <Modal 
                        isOpen={isOpen} 
                        onOpenChange={onOpenChange}
                        size={"2xl"}
                        scrollBehavior='inside'
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูล</ModalHeader>
                                    <ModalBody>
                                        <form onSubmit={handleSubmitEdit}>
                                            <div className='sm:flex mb-4 gap-4'>
                                                <Input onChange={(e) => setFirstname(e.target.value)} className='max-sm:my-4' type='text' value={firstname} label='ชื่อจริง' isClearable isRequired />

                                                <Input onChange={(e) => setLastname(e.target.value)} type='text' value={lastname} label='นามสกุล' isClearable isRequired />
                                            </div>
                                            <div className='sm:flex my-4 gap-4'>
                                                <Input onChange={(e) => setEmail(e.target.value)} className='max-sm:my-4' type='email' value={email} label='อีเมล' isClearable isRequired />

                                                <Input onChange={(e) => setTel(e.target.value)} type='text' value={tel} label='เบอร์โทรศัพท์' maxLength='10' isClearable isRequired />
                                            </div>
                                            <div className='my-4'>
                                                <Textarea
                                                    onChange={(e) => setAddress(prev => ({
                                                        ...prev,
                                                        detail: e.target.value
                                                    }))}
                                                    type='text'
                                                    value={address.detail}
                                                    label='ที่อยู่'
                                                    placeholder='บ้านเลขที่, ซอย, ถนน, หมู่ที่...'
                                                    maxRows={2}
                                                    isClearable
                                                    isRequired
                                                />
                                            </div>
                                            <div className='md:flex my-4 gap-4'>
                                                <Select
                                                    onChange={(e) => setAddress(prev => ({
                                                        ...prev,
                                                        province: e.target.value
                                                    }))}
                                                    selectedKeys={address.province ? [String(address.province)] : []}
                                                    items={provinces}
                                                    label='จังหวัด'
                                                    placeholder='เลือกจังหวัด'
                                                    isRequired
                                                >
                                                    {(item) => <SelectItem key={item.province_id}>{item.name_th}</SelectItem>}
                                                </Select>
                                                
                                                <Select
                                                    className='max-md:my-4'
                                                    onChange={(e) => setAddress(prev => ({
                                                        ...prev,
                                                        district: e.target.value
                                                    }))}
                                                    items={districts}
                                                    selectedKeys={address.district ? [String(address.district)] : []}
                                                    label='เขต/อำเภอ'
                                                    placeholder='เลือกเขต/อำเภอ'
                                                    isDisabled={!address?.province}
                                                    isRequired
                                                >
                                                    {(item) => <SelectItem key={item.district_id}>{item.name_th}</SelectItem>}
                                                </Select>
                                                
                                                <Select
                                                    onChange={(e) => setAddress(prev => ({
                                                        ...prev,
                                                        subdistrict: e.target.value
                                                    }))}
                                                    items={subdistricts}
                                                    selectedKeys={address.subdistrict ? [String(address.subdistrict)] : []}
                                                    label='แขวง/ตำบล'
                                                    placeholder='เลือกแขวง/ตำบล'
                                                    isDisabled={!address?.district}
                                                    isRequired
                                                >
                                                    {(item) => <SelectItem key={item.subdistrict_id}>{item.name_th}</SelectItem>}
                                                </Select>
                                            </div>
                                            <div className='mt-4'>
                                                <Input onChange={(e) => setUsername(e.target.value)} type='text' value={username} label='ชื่อผู้ใช้' isClearable isDisabled />
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

                    <Modal 
                        isOpen={isOpenPassword} 
                        onOpenChange={onOpenChangePassword}
                    >
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">เปลี่ยนรหัสผ่าน</ModalHeader>
                                    <ModalBody>
                                        <form onSubmit={handleSubmitPassword}>
                                            {!isChecked ? (
                                                <>
                                                    <Input
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                        label="รหัสผ่านปัจจุบัน"
                                                        endContent={
                                                            <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibility} aria-label="toggle password visibility">
                                                                {isVisible ? 'ซ่อน' : 'แสดง'}
                                                            </Button>
                                                        }
                                                        type={isVisible ? "text" : "password"}
                                                        autoFocus
                                                        isRequired
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <div className='mb-4'>
                                                        <Input
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            label="รหัสผ่านใหม่"
                                                            endContent={
                                                                <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibility} aria-label="toggle password visibility">
                                                                    {isVisible ? 'ซ่อน' : 'แสดง'}
                                                                </Button>
                                                            }
                                                            type={isVisible ? "text" : "password"}
                                                            autoFocus
                                                            isRequired
                                                        />
                                                    </div>
                                                    <div className='mt-4'>
                                                        <Input
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                            label="ยืนยันรหัสผ่านใหม่"
                                                            endContent={
                                                                <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibility} aria-label="toggle password visibility">
                                                                    {isVisible ? 'ซ่อน' : 'แสดง'}
                                                                </Button>
                                                            }
                                                            type={isVisible ? "text" : "password"}
                                                            isRequired
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            
                                            <ModalFooter>
                                                <Button variant="flat" onPress={onClose}>
                                                    ยกเลิก
                                                </Button>
                                                <Button
                                                    type='submit'
                                                    color='success'
                                                    isLoading={isLoading}
                                                    disabled={isLoading}
                                                >
                                                    {isChecked ? 'เปลี่ยนรหัสผ่าน' : 'ยืนยัน'}
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
        </>
    )
}

export default UserNavbar