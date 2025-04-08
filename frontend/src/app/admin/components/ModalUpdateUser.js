import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, Button, Select, SelectItem } from '@nextui-org/react'
import { toast } from 'react-toastify'

function ModalUpdateUser({ isOpen, onOpenChange, id, setRefresh }) {
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
                        subdistrict: data.resultData.subdistrict
                    });
                    setUsername(data.resultData.username);
                    setPassword(data.resultData.password);
                } catch (err) {
                    console.error("Error fetching data: ", err);
                }
            }

            fetchData();
        }
    }, [isOpen, id]);

    const handleSubmit = async (e) => {
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
                scrollBehavior='inside'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">แก้ไขข้อมูล</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit}>
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