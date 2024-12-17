import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, DateInput, useDisclosure, Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import { CalendarDate } from "@internationalized/date";
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function ModalFactor_Nutrient({ isOpen, onOpenChange, setRefresh }) {

  const [nitrogen, setNitrogen] = useState('')
  const [phosphorus, setPhosphorus] = useState('')
  const [potassium, setPotassium] = useState('')

  const [ph, setPh] = useState('')
  const [temperature, setTemperature] = useState('')
  const [humidity, setHumidity] = useState('')
  const [lightIntensity, setLightIntensity] = useState('')
  const [salinity, setSalinity] = useState('')

   // Handle Submit สำหรับ Form 1
  const handleSubmitFactor = async (e) => {
    e.preventDefault();

    if (!nitrogen || !phosphorus || !potassium) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/createRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nitrogen,
          phosphorus,
          potassium,
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

  // Handle Submit สำหรับ Form 2
  const handleSubmitNutrient = async (e) => {
    e.preventDefault();

    if (!ph || !temperature || !humidity || !lightIntensity || !salinity) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/createRole", {
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
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">เพิ่มข้อมูล</ModalHeader>
            <ModalBody>
              <Tabs aria-label="Options">
                <Tab key="Factor" title="Factor">
                  {/* Form 1: Factor */}
                  <form onSubmit={handleSubmitFactor}>
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
                    <ModalFooter>
                      <Button variant="flat" onPress={onClose}>
                        ยกเลิก
                      </Button>
                      <Button type="submit" color="primary">
                        เพิ่ม
                      </Button>
                    </ModalFooter>
                  </form>
                </Tab>

                <Tab key="Nutrient" title="Nutrient">
                  {/* Form 2: Nutrient */}
                  <form onSubmit={handleSubmitNutrient}>
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
                        onChange={(e) => setLightIntensity(e.target.value)}
                        type="text"
                        label="Light Intensity"
                        isRequired
                      />
                    </div>
                    <div className="flex my-4 gap-4">
                      <Input
                        onChange={(e) => setSalinity(e.target.value)}
                        type="text"
                        label="Salinity"
                        isRequired
                      />
                    </div>
                    <ModalFooter>
                      <Button variant="flat" onPress={onClose}>
                        ยกเลิก
                      </Button>
                      <Button type="submit" color="primary">
                        เพิ่ม
                      </Button>
                    </ModalFooter>
                  </form>
                </Tab>
              </Tabs>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalFactor_Nutrient;