import { useEffect, useState } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalCreateUser({ isOpen, onOpenChange, setRefresh }) {
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
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
    const toggleVisibilityConfirm = () => setIsVisibleConfirm(!isVisibleConfirm);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
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
    }, []);
    
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

            setAddress(prev => ({
                ...prev,
                district: "",
                subdistrict: ""
            }));
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

            setAddress(prev => ({
                ...prev,
                subdistrict: ""
            }));
        } else {
            setAddress(prev => ({
                ...prev,
                subdistrict: ""
            }));
        }
    }, [address?.district]);

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
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/createUser`, {
                method: 'POST',
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
                    username,
                    password
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
        <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            size="2xl"
            scrollBehavior='inside'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>เพิ่มข้อมูล</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleSubmit}>
                                <div className='sm:flex gap-3'>
                                    <Input onChange={(e) => setFirstname(e.target.value)} className='max-sm:mb-3' type='text' label='ชื่อจริง' isClearable isRequired />

                                    <Input onChange={(e) => setLastname(e.target.value)} type='text' label='นามสกุล' isClearable isRequired />
                                </div>
                                <div className='sm:flex my-3 gap-3'>
                                    <Input onChange={(e) => setEmail(e.target.value)} className='max-sm:my-3' type='email' label='อีเมล' isClearable isRequired />

                                    <Input onChange={(e) => setTel(e.target.value)} type='text' label='เบอร์โทรศัพท์' maxLength='10' isClearable isRequired />
                                </div>
                                <div className='my-3'>
                                    <Textarea
                                        onChange={(e) => setAddress(prev => ({
                                            ...prev,
                                            detail: e.target.value
                                        }))}
                                        label='ที่อยู่'
                                        placeholder='บ้านเลขที่, ซอย, ถนน, หมู่ที่...'
                                        maxRows={2}
                                        isClearable
                                        isRequired
                                    />
                                </div>
                                <div className='md:flex my-3 gap-3'>
                                    <Select
                                        onChange={(e) => setAddress(prev => ({
                                            ...prev,
                                            province: e.target.value
                                        }))}
                                        items={provinces}
                                        label='จังหวัด'
                                        placeholder='เลือกจังหวัด'
                                        isRequired
                                    >
                                        {(item) => <SelectItem key={item.province_id}>{item.name_th}</SelectItem>}
                                    </Select>
                                    
                                    <Select
                                        className='max-md:my-3'
                                        onChange={(e) => setAddress(prev => ({
                                            ...prev,
                                            district: e.target.value
                                        }))}
                                        items={districts}
                                        label='เขต/อำเภอ'
                                        placeholder='เลือกเขต/อำเภอ'
                                        selectedKeys={address.district ? [address.district] : []}
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
                                        label='แขวง/ตำบล'
                                        placeholder='เลือกแขวง/ตำบล'
                                        selectedKeys={address.subdistrict ? [address.subdistrict] : []}
                                        isDisabled={!address?.district}
                                        isRequired
                                    >
                                        {(item) => <SelectItem key={item.subdistrict_id}>{item.name_th}</SelectItem>}
                                    </Select>
                                </div>
                                <div className='my-3'>
                                    <Input onChange={(e) => setUsername(e.target.value)} type='text' label='ชื่อผู้ใช้' isClearable isRequired />
                                </div>
                                <div className='sm:flex mt-3 gap-3'>
                                    <Input
                                        className='max-sm:my-3'
                                        onChange={(e) => setPassword(e.target.value)}
                                        label="รหัสผ่าน"
                                        endContent={
                                            <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibility} aria-label="toggle password visibility">
                                                {isVisible ? 'ซ่อน' : 'แสดง'}
                                            </Button>
                                        }
                                        type={isVisible ? "text" : "password"}
                                        isRequired
                                    />
        
                                    <Input
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        label="ยืนยันรหัสผ่าน"
                                        endContent={
                                            <Button type="button" size="sm" className='bg-gray-300 dark:bg-gray-500' onPress={toggleVisibilityConfirm} aria-label="toggle password visibility">
                                                {isVisibleConfirm ? 'ซ่อน' : 'แสดง'}
                                            </Button>
                                        }
                                        type={isVisibleConfirm ? "text" : "password"}
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
    )
}

export default ModalCreateUser