import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardHeader, CardBody, CardFooter, useDisclosure } from "@nextui-org/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,  // ลงทะเบียน LineElement
    PointElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
import { Line } from "react-chartjs-2";

  function ModalGraph({ isOpen, onOpenChange, id }) {

    const [plantData, setPlantData] = useState(null);

    const fetchPlantVariables = async (plantId) => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/getPlantVariables/${plantId}`
        );
  
        if (res.ok) {
          const data = await res.json();
          console.log(data.resultData[0]); // Log the first item in resultData
          setPlantData(data.resultData[0]); // Set the first item
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
  
    useEffect(() => {
      if (id) {
        fetchPlantVariables(id);
      }
    }, [id]);

     ChartJS.register(
        CategoryScale,
        LinearScale,
        LineElement,  // ลงทะเบียน LineElement
        PointElement,
        Title,
        Tooltip,
        Legend
      );
    
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      };
 // Generate labels based on current time
 const generateTimeLabels = () => {
    const now = new Date();
    const labels = [];
    for (let i = 0; i < 9; i++) {
      const time = new Date(now.getTime() - (8 - i) * 2 * 60 * 60 * 1000);
      labels.push(
        time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
    return labels;
  };

  const labels = generateTimeLabels();

  // Function to generate chart data
  const createChartData = (data) => ({
    labels,
    datasets: [
      {
        label: "ค่าความเข้มแสง (lux)",
        data: Array(9).fill(data.lightIntensity),
        backgroundColor: "rgba(220, 255, 25, 0.81)",
        borderColor: "rgba(216, 241, 72, 0.86)",
        borderWidth: 2,
        fill: false,
      }
    ],
  });

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">กราฟค่าความเข้มแสง</ModalHeader>
                {plantData &&(
            <ModalBody>
          
            <div className="grid grid-cols-2 gap-4">
              <Line
                options={options}
                data={createChartData(plantData)}  // ส่ง plantData ทั้งหมดที่ได้มาจาก API
              />
             </div>

            </ModalBody>
                )}
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>ปิด</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default ModalGraph;
