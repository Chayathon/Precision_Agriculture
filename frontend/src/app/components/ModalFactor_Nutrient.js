import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure, Tabs, Tab } from '@nextui-org/react';
import { toast } from 'react-toastify';

function ModalFactor_Nutrient({ isOpen, onOpenChange, setRefresh, id }) {
  const [age, setAge] = useState('');
  //p_factor
  const [ph, setPh] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [salinity, setSalinity] = useState('');
  const [lightIntensity, setLightIntensity] = useState('');

  //p_nutrient
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');

  const [plantId, setPlantId] = useState('');  // เก็บ id ของพืช
  const [plantName, setPlantName] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(isOpen) {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/getPlant/${id}`);
                    
                if (!res.ok) {
                    throw new Error("Failed to fetch");
                }

                const data = await res.json();
                setPlantName(data.resultData.plantname);
                setPlantId(data.resultData.id);     // เก็บ id ของพืช
            } catch (err) {
                console.error("Error fetching data: ", err);
            }
        }

        fetchData()
    }
}, [isOpen])

 // Handle Submit สำหรับฟอร์ม Factor
 const handleSubmitFactor = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  if (!age || !ph || !temperature || !humidity || !salinity || !lightIntensity || !plantId) {
    toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
    setIsLoading(false);
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/createFactor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age,
        ph,
        temperature,
        humidity,
        salinity,
        lightIntensity,
        plantId,  // ส่ง id ของพืชไปแทนชื่อพืช
        
      }),
    });

    if (res.status === 200) {
      toast.success("เพิ่มข้อมูลค่าตัวแปรที่เกี่ยวข้องเรียบร้อยแล้ว");
      setRefresh(true);
      onOpenChange(false);
    } else {
      toast.warn("เพิ่มข้อมูลค่าตัวแปรที่เกี่ยวข้องล้มเหลว");
    }
  } catch (err) {
    console.log("Error:", err);
  } finally {
    setIsLoading(false);
  }
};

 // Handle Submit สำหรับฟอร์ม Nutrient
 const handleSubmitNutrient = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  if (!age || !nitrogen || !phosphorus || !potassium || !plantId) {
    toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
    setIsLoading(false);
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/createNutrient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age,
        nitrogen,
        phosphorus,
        potassium,
        plantId,  // ส่ง id ของพืชไปแทนชื่อพืช
      }),
    });

    if (res.ok) {
      toast.success("เพิ่มข้อมูลค่าสารอาหารเรียบร้อยแล้ว");
      setRefresh(true);
      onOpenChange(false);
    } else {
      toast.warn("เพิ่มข้อมูลค่าสารอาหารล้มเหลว");
    }
  } catch (err) {
    console.log("Error:", err);
  } finally {
    setIsLoading(false);
  }
};

return (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='lg'>
    <ModalContent>
      <ModalHeader className="flex flex-col gap-1">เพิ่มค่าตัวแปรที่พืชต้องการ</ModalHeader>
      <ModalBody>
        <Tabs aria-label="Options">
          <Tab key="Factor" title="ค่าตัวแปรที่เกี่ยวข้อง">
            <form onSubmit={handleSubmitFactor}>
            <div className="flex mb-4 gap-4">
                <Input
                  onChange={(e) => setAge(e.target.value)}
                  type="number"
                  label="อายุน้อยกว่า (วัน)"
                  isRequired
                />
                <Input
                  onChange={(e) => setPh(e.target.value)}
                  type="text"
                  label="ค่าความเป็นกรด-ด่าง (pH)"
                  isRequired
                />
              </div>
              <div className="flex mb-4 gap-4">
                <Input
                  onChange={(e) => setTemperature(e.target.value)}
                  type="text"
                  label="อุณหภูมิ (°C)"
                  isRequired
                />
                <Input
                  onChange={(e) => setHumidity(e.target.value)}
                  type="text"
                  label="ความชื้น (%)"
                  isRequired
                />
              </div>
              <div className="flex my-4 gap-4">
                <Input
                  onChange={(e) =>  setSalinity(e.target.value)}
                  type="text"
                  label="ค่าการนำไฟฟ้า (dS/m)"
                  isRequired
                />
                  <Input
                  onChange={(e) =>  setLightIntensity(e.target.value)}
                  type="text"
                  label="ค่าความเข้มแสง (lux)"
                  isRequired
                />
              </div>
              <div className="flex my-4 gap-4">
                <Input
                    label="พืช"
                    variant="bordered"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    isReadOnly 
                />
              </div>
              <ModalFooter>
                <Button variant="flat" onPress={onOpenChange}>ยกเลิก</Button>
                <Button type="submit" color="primary">เพิ่ม</Button>
              </ModalFooter>
            </form>
          </Tab>

          <Tab key="Nutrient" title="ค่าสารอาหาร">
              <form onSubmit={handleSubmitNutrient}>
                <div className="flex mb-4 gap-4">
                  <Input
                    onChange={(e) => setAge(e.target.value)}
                    type="number"
                    label="อายุน้อยกว่า (วัน)"
                    isRequired
                  />
                  <Input
                    onChange={(e) => setNitrogen(e.target.value)}
                    type="text"
                    label="ไนโตรเจน (mg/L)"
                    isRequired
                  />
                </div>
                <div className="flex my-4 gap-4">
                  <Input
                    onChange={(e) => setPhosphorus(e.target.value)}
                    type="text"
                    label="ฟอสฟอรัส (mg/L)"
                    isRequired
                  />
                  <Input
                    onChange={(e) => setPotassium(e.target.value)}
                    type="text"
                    label="โพแทสเซียม (mg/L)"
                    isRequired
                  />
                </div>
                <div className="flex my-4 gap-4">
                  <Input
                    label="พืช"
                    variant="bordered"
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    isReadOnly 
                  />
                </div>
                <ModalFooter>
                  <Button variant="flat" onPress={onOpenChange}>ยกเลิก</Button>
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'กำลังเพิ่มข้อมูล...' : 'เพิ่ม'}
                  </Button>
                </ModalFooter>
              </form>
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalFactor_Nutrient;