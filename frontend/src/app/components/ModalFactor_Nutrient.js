import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure, Tabs, Tab } from '@nextui-org/react';
import { toast } from 'react-toastify';

function ModalFactor_Nutrient({ isOpen, onOpenChange, setRefresh, id }) {

  //p_factor
  const [ph, setPh] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [lightIntensity, setLightIntensity] = useState('');
  const [salinity, setSalinity] = useState('');

  //p_nutrient
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');

  const [plantId, setPlantId] = useState('');  // เก็บ id ของพืช
  const [plantName, setPlantName] = useState('');

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

  console.log({
    ph,
    temperature,
    humidity,
    lightIntensity,
    salinity,
    plantId,  // ตรวจสอบว่า plantId มีค่าหรือไม่
  });

  e.preventDefault();

  if (!ph || !temperature || !humidity || !lightIntensity || !salinity || !plantId) {
    toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/createFactor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ph,
        temperature,
        humidity,
        lightIntensity,
        salinity,
        plantId,  // ส่ง id ของพืชไปแทนชื่อพืช
        
      }),
    });

    if (res.ok) {
      toast.success("เพิ่มข้อมูล Factor เรียบร้อยแล้ว");
      setRefresh(true);
      onOpenChange(false);
    } else {
      toast.warn("เพิ่มข้อมูล Factor ล้มเหลว");
    }
  } catch (err) {
    console.log("Error:", err);
  }
};

 // Handle Submit สำหรับฟอร์ม Nutrient
 const handleSubmitNutrient = async (e) => {
  e.preventDefault();

  if (!nitrogen || !phosphorus || !potassium || !plantId) {
    toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/createNutrient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nitrogen,
        phosphorus,
        potassium,
        plantId,  // ส่ง id ของพืชไปแทนชื่อพืช
      }),
    });

    if (res.ok) {
      toast.success("เพิ่มข้อมูล Nutrient เรียบร้อยแล้ว");
      setRefresh(true);
      onOpenChange(false);
    } else {
      toast.warn("เพิ่มข้อมูล Nutrient ล้มเหลว");
    }
  } catch (err) {
    console.log("Error:", err);
  }
};

return (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
    <ModalContent>
      <ModalHeader className="flex flex-col gap-1">เพิ่มข้อมูล</ModalHeader>
      <ModalBody>
        <Tabs aria-label="Options">
          <Tab key="Factor" title="Factor">
            <form onSubmit={handleSubmitFactor}>
              <div className="flex mb-4 gap-4">
                <Input
                  onChange={(e) => setPh(e.target.value)}
                  type="text"
                  label="pH"
                  isRequired
                />
                <Input
                  onChange={(e) => setTemperature(e.target.value)}
                  type="text"
                  label="Temperature"
                  isRequired
                />
              </div>
              <div className="flex my-4 gap-4">
                <Input
                  onChange={(e) => setHumidity(e.target.value)}
                  type="text"
                  label="Humidity"
                  isRequired
                />
                  <Input
                  onChange={(e) =>  setLightIntensity(e.target.value)}
                  type="text"
                  label="LightIntensity"
                  isRequired
                />
              </div>
              <div className="flex my-4 gap-4">
                <Input
                  onChange={(e) =>  setSalinity(e.target.value)}
                  type="text"
                  label="Salinity"
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

          <Tab key="Nutrient" title="Nutrient">
              {/* ฟอร์มสำหรับ Nutrient */}
              <form onSubmit={handleSubmitNutrient}>
                <div className="flex mb-4 gap-4">
                  <Input
                    onChange={(e) => setNitrogen(e.target.value)}
                    type="text"
                    label="Nitrogen"
                    isRequired
                  />
                  <Input
                    onChange={(e) => setPhosphorus(e.target.value)}
                    type="text"
                    label="Phosphorus"
                    isRequired
                  />
                </div>
                <div className="flex my-4 gap-4">
                  <Input
                    onChange={(e) => setPotassium(e.target.value)}
                    type="text"
                    label="Potassium"
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
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalFactor_Nutrient;