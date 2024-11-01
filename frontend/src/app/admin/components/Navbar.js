'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu, Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, useDisclosure } from "@nextui-org/react";
import { FaArrowRightFromBracket, FaUserGear } from "react-icons/fa6";
import { toast } from 'react-toastify';

function AdminNavbar() {
    const router = useRouter()
    const user = JSON.parse(localStorage.getItem('UserData'))
    const [name, setName] = useState('')
    const [id, setId] = useState('')

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

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
        if(localStorage.getItem('UserData')) {
            setName(user.username);
            setId(user.id);
        }
    }, [user])

    useEffect(() => {
        if(isOpen) {
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
    }, [isOpen])

    const handleSubmit = async (e) => {
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
                onOpenChange(false);
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

        toast.success("ออกจากระบบสำเร็จ")
        router.push('/')
    }
    
    return (
        <Navbar className='bg-gray-800 text-white'>
            <NavbarBrand>
                <p className="font-bold text-inherit">Precision Agriculture</p>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                    <Link href="/admin/listAdmin">
                        ข้อมูลผู้ดูแลระบบ
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/admin/listUser">
                        ข้อมูลสมาชิก
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href="/admin/listRole">
                        ข้อมูลตำแหน่ง
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent as="div" justify="end">
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar
                                showFallback src='https://images.unsplash.com/broken'
                                as="button"
                                size="sm"
                                className="transition-transform"
                            />
                            <b>{name}</b>
                        </div>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="settings" onPress={onOpen}>
                            <p className='flex justify-between'>แก้ไขโปรไฟล์<FaUserGear className='text-lg' /></p>
                        </DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                            <p className='flex justify-between'>ออกจากระบบ<FaArrowRightFromBracket className='text-lg' /></p>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Modal 
                    isOpen={isOpen} 
                    onOpenChange={onOpenChange}
                    size={"2xl"}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูล</ModalHeader>
                                <ModalBody>
                                    <form onSubmit={handleSubmit}>
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

export default AdminNavbar