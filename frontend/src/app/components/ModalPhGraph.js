import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Card, CardHeader, CardBody, CardFooter, useDisclosure, ButtonGroup } from "@nextui-org/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
import { Line } from "react-chartjs-2";

function ModalPhGraph({ isOpen, onOpenChange, id }) {
    const [plantData, setPlantData] = useState(null);

    const fetchPlantVariables7day = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables7day/${plantId}`
        );
  
        if (res.ok) {
          const data = await res.json();
          setPlantData(data.resultData);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
  
    const fetchPlantVariables14day = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables14day/${plantId}`
        );
  
        if (res.ok) {
          const data = await res.json();
          setPlantData(data.resultData);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
  
    const fetchPlantVariables1month = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables1month/${plantId}`
        );
  
        if (res.ok) {
          const data = await res.json();
          setPlantData(data.resultData);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
  
    const fetchPlantVariables3month = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables3month/${plantId}`
        );
  
        if (res.ok) {
          const data = await res.json();
          setPlantData(data.resultData);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
  
    const fetchPlantVariables6month = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables6month/${plantId}`
        );
  
        if (res.ok) {
          const data = await res.json();
          setPlantData(data.resultData);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
  
    const fetchPlantVariables9month = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables9month/${plantId}`
        );
  
        if (res.ok) {
          const data = await res.json();
          setPlantData(data.resultData);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
  
    const fetchPlantVariables1year = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables1year/${plantId}`
        );
  
        if (res.ok) {
          const data = await res.json();
          console.log(data.resultData); // Log the first item in resultData
          setPlantData(data.resultData); // Set the first item
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };
    
    useEffect(() => {
      if (id) {
        fetchPlantVariables7day(id);
      }
    }, [id]);
  
    ChartJS.register(
      CategoryScale,
      LinearScale,
      LineElement,
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
  
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: '2-digit',
        year: 'numeric'
      });
    };
  
    const createChartData = (data) => {
      if (!data) {
        return {
          labels: [],
          datasets: []
        };
      }
      return {
        labels: data.map(item => formatDate(item.receivedAt)),
        datasets: [
          {
            label: "ค่าความเป็นกรด-ด่าง (pH)",
            data: data.map(item => item.pH),
            backgroundColor: "rgba(220, 255, 25, 0.81)",
            borderColor: "rgba(216, 241, 72, 0.86)",
            borderWidth: 2,
            fill: false,
          }
        ],
      }
    };
  
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl" placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">กราฟค่าความเป็นกรด-ด่าง</ModalHeader>
              {plantData &&(
                <ModalBody>
                  <div className="flex justify-end mb-4">
                    <ButtonGroup>
                      <Button onPress={() => fetchPlantVariables7day(id)} className="focus:bg-gray-400">7 วัน</Button>
                      <Button onPress={() => fetchPlantVariables14day(id)} className="focus:bg-gray-400">14 วัน</Button>
                      <Button onPress={() => fetchPlantVariables1month(id)} className="focus:bg-gray-400">1 เดือน</Button>
                      <Button onPress={() => fetchPlantVariables3month(id)} className="focus:bg-gray-400">3 เดือน</Button>
                      <Button onPress={() => fetchPlantVariables6month(id)} className="focus:bg-gray-400">6 เดือน</Button>
                      <Button onPress={() => fetchPlantVariables9month(id)} className="focus:bg-gray-400">9 เดือน</Button>
                      <Button onPress={() => fetchPlantVariables1year(id)} className="focus:bg-gray-400">1 ปี</Button>
                    </ButtonGroup>
                  </div>
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

export default ModalPhGraph