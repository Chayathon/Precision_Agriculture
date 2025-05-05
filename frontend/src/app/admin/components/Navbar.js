'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, User, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, useDisclosure, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Select, SelectItem } from "@nextui-org/react";
import { FaRightFromBracket, FaUserGear } from "react-icons/fa6";
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/th';
import { ThemeSwitcher } from '@/app/components/ThemeSwitcher';

function AdminNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });
    
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

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
    const [password, setPassword] = useState('');

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    
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
                    setFirstname(data.resultData.firstname)
                    setLastname(data.resultData.lastname)
                    setEmail(data.resultData.email)
                    setTel(data.resultData.tel)
                    setAddress({
                        detail: data.resultData.address,
                        province: data.resultData.province,
                        district: data.resultData.district,
                        subdistrict: data.resultData.subdistrict,
                    });
                    setUsername(data.resultData.username)
                    setPassword(data.resultData.password)
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData();
        }
    }, [isOpen, id])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!firstname || !lastname || !email || !tel || !address) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!")
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
            })

            if(res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
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
        }
    }

    const handleLogout = () => {
        Cookies.remove('UserData');
        Cookies.remove('Token');

        toast.success("ออกจากระบบสำเร็จ")
        router.push('/')
    }

    const isActiveLink = (path) => {
        return pathname === path;
    };
    
    return (
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
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            isBordered
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="md:hidden"
                />
                <NavbarBrand>
                    <div className='flex flex-col'>
                        <div className='text-sm'>{currentDateTime.date}</div>
                        <div className='text-xl font-bold'>{currentDateTime.time}</div>
                    </div>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden md:flex gap-4" justify="center">
                <NavbarItem isActive={isActiveLink('/admin')}>
                    <Link href="/admin">
                        หน้าแรก
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={isActiveLink('/admin/listPlant')}>
                    <Link href="/admin/listPlant">
                        ข้อมูลพืช
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={isActiveLink('/admin/listAdmin')}>
                    <Link href="/admin/listAdmin">
                        ข้อมูลผู้ดูแลระบบ
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={isActiveLink('/admin/listUser')}>
                    <Link href="/admin/listUser">
                        ข้อมูลเกษตรกร
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={isActiveLink('/admin/listRole')}>
                    <Link href="/admin/listRole">
                        ข้อมูลบทบาท
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <User
                                showFallback
                                src='https://images.unsplash.com/broken'
                                as="button"
                                name={<span className="lg:inline hidden">{name}</span>}
                                description={<span className="lg:inline hidden">{userEmail}</span>}
                                className="transition-transform"
                            />
                        </div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="theme">
                            <p className='flex justify-between items-center'>ธีม<ThemeSwitcher size="sm" /></p>
                        </DropdownItem>
                        <DropdownItem key="settings" onPress={onOpen}>
                            <p className='flex justify-between items-center'>แก้ไขโปรไฟล์<FaUserGear size={18} /></p>
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
                                    <form onSubmit={handleSubmit}>
                                        <div className='sm:flex  mb-4 gap-4'>
                                            <Input onChange={(e) => setFirstname(e.target.value)} className='max-sm:my-4' type='text' value={firstname} label='ชื่อจริง' isClearable isRequired />

                                            <Input onChange={(e) => setLastname(e.target.value)} type='text' value={lastname} label='นามสกุล' isClearable isRequired />
                                        </div>
                                        <div className='sm:flex  my-4 gap-4'>
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
                                        <div className='my-4'>
                                            <Input onChange={(e) => setUsername(e.target.value)} type='text' value={username} label='ชื่อผู้ใช้' isClearable isDisabled />
                                        </div>
                                        <div className='mt-4'>
                                            <Input
                                                onChange={(e) => setPassword(e.target.value)}
                                                value={password}
                                                label="รหัสผ่าน"
                                                endContent={
                                                    <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibility} aria-label="toggle password visibility">
                                                        {isVisible ? 'ซ่อน' : 'แสดง'}
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
            <NavbarMenu>
                <Link href="/admin" className='w-full px-1' size='lg' onClick={() => setIsMenuOpen(false)}>
                    <NavbarMenuItem
                        isActive={isActiveLink('/admin')}
                        className={isActiveLink('/admin') ? 'text-blue-600' : 'foreground'}
                    >
                        หน้าแรก
                    </NavbarMenuItem>
                </Link>
                <Link href="/admin/listPlant" className='w-full px-1' size='lg' onClick={() => setIsMenuOpen(false)}>
                    <NavbarMenuItem
                        isActive={isActiveLink('/admin/listPlant')}
                        className={isActiveLink('/admin/listPlant') ? 'text-blue-600' : 'foreground'}
                    >
                        ข้อมูลพืช
                    </NavbarMenuItem>
                </Link>
                <Link href="/admin/listAdmin" className='w-full px-1' size='lg' onClick={() => setIsMenuOpen(false)}>
                    <NavbarMenuItem
                        isActive={isActiveLink('/admin/listAdmin')}
                        className={isActiveLink('/admin/listAdmin') ? 'text-blue-600' : 'foreground'}
                    >
                        ข้อมูลผู้ดูแลระบบ
                    </NavbarMenuItem>
                </Link>
                <Link href="/admin/listUser" className='w-full px-1' size='lg' onClick={() => setIsMenuOpen(false)}>
                    <NavbarMenuItem
                        isActive={isActiveLink('/admin/listUser')}
                        className={isActiveLink('/admin/listUser') ? 'text-blue-600' : 'foreground'}
                    >
                        ข้อมูลเกษตรกร
                    </NavbarMenuItem>
                </Link>
                <Link href="/admin/listRole" className='w-full px-1' size='lg' onClick={() => setIsMenuOpen(false)}>
                    <NavbarMenuItem
                        isActive={isActiveLink('/admin/listRole')}
                        className={isActiveLink('/admin/listRole') ? 'text-blue-600' : 'foreground'}
                    >
                        ข้อมูลบทบาท
                    </NavbarMenuItem>
                </Link>
            </NavbarMenu>
        </Navbar>
    )
}

export default AdminNavbar