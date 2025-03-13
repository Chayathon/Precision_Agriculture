import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Button } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalUpdateUser({ isOpen, onOpenChange, id, setRefresh }) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if(isOpen) {
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
    }, [isOpen, id])

    const handleSubmit = async (e) => {
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

            if(res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("แก้ไขข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);
            }
            else {
                toast.error("แก้ไขข้อมูลล้มเหลว")
                return;
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);

            setTimeout(() => {
                setRefresh(false);
            }, 1000);
        }
    }

    return (
        <>
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
                                        <Button
                                            type='submit'
                                            color="warning"
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
        </>
    )
}

export default ModalUpdateUser