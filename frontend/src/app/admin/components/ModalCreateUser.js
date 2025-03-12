import { useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalCreateUser({ isOpen, onOpenChange, setRefresh }) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [tel, setTel] = useState('');
    const [address, setAddress] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if(password != confirmPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน!");
            setIsLoading(false);
            return;
        }

        if(!firstname || !lastname || !email || !tel || !address || !username || !password || !confirmPassword) {
            toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:4000/api/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstname, lastname, email, tel, address, username, password
                })
            });

            if(res.status === 200) {
                const form = e.target;
                form.reset();

                toast.success("เพิ่มข้อมูลเรียบร้อยแล้ว");
                onOpenChange(false);
                setRefresh(true);
                    
            }
            else {
                toast.warn("อีเมลหรือชื่อผู้ใช้นี้ มีอยู่แล้ว")
                return;
            }
        }
        catch (err) {
            console.log("Error", err)
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
                            <ModalHeader className="flex flex-col gap-1">เพิ่มข้อมูล</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit}>
                                    <div className='flex mb-4 gap-4'>
                                        <Input onChange={(e) => setFirstname(e.target.value)} type='text' label='ชื่อจริง' isClearable isRequired />

                                        <Input onChange={(e) => setLastname(e.target.value)} type='text' label='นามสกุล' isClearable isRequired />
                                    </div>
                                    <div className='flex my-4 gap-4'>
                                        <Input onChange={(e) => setEmail(e.target.value)} type='email' label='อีเมล' isClearable isRequired />

                                        <Input onChange={(e) => setTel(e.target.value)} type='text' label='เบอร์โทรศัพท์' maxLength='10' isClearable isRequired />
                                    </div>
                                    <div className='my-4'>
                                        <Textarea onChange={(e) => setAddress(e.target.value)} label='ที่อยู่' isRequired />
                                    </div>
                                    <div className='my-4'>
                                        <Input onChange={(e) => setUsername(e.target.value)} type='text' label='ชื่อผู้ใช้' isClearable isRequired />
                                    </div>
                                    <div className='my-4'>
                                        <Input
                                            onChange={(e) => setPassword(e.target.value)}
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
                                            isRequired
                                        />
                                    </div>
                                    <div className='mt-4'>
                                        <Input
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            label="ยืนยันรหัสผ่าน"
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
                                            isRequired
                                        />
                                    </div>
                                    <ModalFooter>
                                        <Button variant="flat" onPress={onClose}>
                                            ยกเลิก
                                        </Button>
                                        <Button
                                            type='submit'
                                            color="success"
                                            isLoading={isLoading}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'กำลังเพิ่มข้อมูล...' : 'เพิ่ม'}
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

export default ModalCreateUser