"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardBody, Button, useDisclosure, ButtonGroup, Select, SelectItem, Spinner } from "@nextui-org/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";
import { FaTable, FaChartLine, FaBan } from "react-icons/fa6";
import moment from "moment";
import 'moment/locale/th';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ModalPhGraph from "../../../components/ModalPhGraph";
import ModalSalinityGraph from "../../../components/ModalSalinityGraph";
import ModalLightIntensityGraph from "../../../components/ModalLightIntensityGraph";

function Dashboard({ params }) {
  const { id } = params;

  const [plantId, setPlantId] = useState(null);
  const [plantAge, setPlantAge] = useState("");
  const [plantData, setPlantData] = useState(null);
  const [plantDatas, setPlantDatas] = useState(null);
  const [nutrientData, setNutrientData] = useState(null);
  const [factorData, setFactorData] = useState(null);
  const [otherPlant, setOtherPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedId, setSelectedId] = useState(null);

  const { isOpen: isOpenPhGraph, onOpen: onOpenPhGraph, onOpenChange: onOpenPhChangeGraph } = useDisclosure();
  const { isOpen: isOpenSalinityGraph, onOpen: onOpenSalinityGraph, onOpenChange: onOpenSalinityChangeGraph } = useDisclosure();
  const { isOpen: isOpenLightIntensityGraph, onOpen: onOpenLightIntensityGraph, onOpenChange: onOpenLightIntensityChangeGraph } = useDisclosure();
  
  const calculateAge = (plantedAt) => {
    // แปลงวันที่ปลูกเป็นวัตถุ Date
    const plantedDate = new Date(plantedAt);
    // วันที่ปัจจุบัน
    const currentDate = new Date();
    
    // คำนวณความแตกต่างของเวลาในหน่วยมิลลิวินาที
    const timeDifference = currentDate - plantedDate;
    
    // แปลงมิลลิวินาทีเป็นวัน
    const ageInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
    return ageInDays;
  };

  useEffect(() => {
    const fetchNutrient = async (plantId) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getNutrient/${plantId}/${plantAge}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setNutrientData(data.resultData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    const fetchFactor = async (plantId) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getFactor/${plantId}/${plantAge}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setFactorData(data.resultData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    const fetchOtherNutrient = async (plantId) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getOtherNutrient/${plantId}/${plantAge}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setNutrientData(data.resultData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    const fetchOtherFactor = async (plantId) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getOtherFactor/${plantId}/${plantAge}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setFactorData(data.resultData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (otherPlant) {
      if (id) Promise.all([fetchOtherNutrient(id), fetchOtherFactor(id)]);
      
      console.log("Fetching other Plant");
    } else {
      if (plantId) Promise.all([fetchNutrient(plantId), fetchFactor(plantId)]);
      
      console.log("Fetching Plant");
    }
  }, [id, plantId, otherPlant, plantAge]);

  useEffect(() => {
    const fetchPlant = async (plantId) => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getPlant/${plantId}`);
  
        if(res.status === 200) {
          const data = await res.json();
          setPlantId(data.resultData.plant_id);
  
          const plantedAt = data.resultData.plantedAt;
          const ageInDays = calculateAge(plantedAt);
          setPlantAge(ageInDays);
  
          data.resultData.plant_id > 0 ? setOtherPlant(false) : setOtherPlant(true);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoading(false);
      }
    }
  
    const fetchPlantVariable = async (plantId) => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariable/${plantId}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setPlantData(data.resultData[0]);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    const fetchPlantVariables = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables7day/${plantId}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setPlantDatas(data.resultData);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      }
    };

    fetchPlant(id);
    fetchPlantVariable(id);
    fetchPlantVariables(id);
  }, [id]);
  
  const fetchPlantVariables7day = async (plantId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables7day/${plantId}`
      );

      if (res.status === 200) {
        const data = await res.json();
        setPlantDatas(data.resultData);
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

      if (res.status === 200) {
        const data = await res.json();
        setPlantDatas(data.resultData);
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

      if (res.status === 200) {
        const data = await res.json();
        setPlantDatas(data.resultData);
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

      if (res.status === 200) {
        const data = await res.json();
        setPlantDatas(data.resultData);
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

      if (res.status === 200) {
        const data = await res.json();
        setPlantDatas(data.resultData);
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

      if (res.status === 200) {
        const data = await res.json();
        setPlantDatas(data.resultData);
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

      if (res.status === 200) {
        const data = await res.json();
        setPlantDatas(data.resultData);
      }
    } catch (err) {
      console.error("Failed to fetch", err);
    }
  };

  useEffect(() => {
      AOS.init({
          duration: 500,
          once: true,
      });
  }, []);

  useEffect(() => {
    if(plantData && factorData && nutrientData) {
      plantData.temperature < factorData.temperature ? localStorage.setItem('temperature', 'อุณหภูมิต่ำกว่าค่าที่ต้องการ') : localStorage.removeItem('temperature');
      plantData.humidity < factorData.humidity ? localStorage.setItem('humidity', 'ความชื้นต่ำกว่าค่าที่ต้องการ') : localStorage.removeItem('humidity');
      plantData.nitrogen < nutrientData.nitrogen ? localStorage.setItem('nitrogen', 'ไนโตรเจนต่ำกว่าค่าที่ต้องการ') : localStorage.removeItem('nitrogen');
      plantData.phosphorus < nutrientData.phosphorus ? localStorage.setItem('phosphorus', 'ฟอสฟอรัสต่ำกว่าค่าที่ต้องการ') : localStorage.removeItem('phosphorus');
      plantData.potassium < nutrientData.potassium ? localStorage.setItem('potassium', 'โพแทสเซียมต่ำกว่าค่าที่ต้องการ') : localStorage.removeItem('potassium');
      plantData.pH < factorData.pH ? localStorage.setItem('pH', 'ค่าความเป็นกรด-ด่างต่ำกว่าค่าที่ต้องการ') : localStorage.removeItem('pH');
      plantData.salinity < factorData.salinity ? localStorage.setItem('salinity', 'ค่าการนำไฟฟ้าต่ำกว่าค่าที่ต้องการ') : localStorage.removeItem('salinity');
      plantData.lightIntensity < factorData.lightIntensity ? localStorage.setItem('lightIntensity', 'ค่าความเข้มแสงต่ำกว่าค่าที่ต้องการ') : localStorage.removeItem('lightIntensity');
    }
  }, [plantData, factorData, nutrientData]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
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

  const convertDate = (dateConvert) => {
    if (!dateConvert) return "วันที่ไม่ระบุ";
    const date = moment(dateConvert).locale('th');
    const buddhistYearDate = date.format('D/M/') + (date.year() + 543) + ' เวลา ' + date.format('LT');
    return buddhistYearDate;
  };

  const createEnvironmentData = (data) => {
    if (!data) {
      return {
        labels: [],
        datasets: []
      };
    }
    return {
      labels: data.map(item => convertDate(item.receivedAt)),
      datasets: [
        {
          label: "อุณหภูมิ (°C)",
          data: data.map(item => item.temperature),
          backgroundColor: "rgba(150, 150, 150, 0.5)",
          borderColor: "rgba(150, 150, 150, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "ความชื้น (%)",
          data: data.map(item => item.humidity),
          backgroundColor: "rgba(0, 229, 255, 0.5)",
          borderColor: "rgba(0, 229, 255, 1)",
          borderWidth: 2,
          fill: false,
        }
      ],
    }
  };

  // Create nutrient data
  const createNutrientData = (data) => {
    if (!data) {
      return {
        labels: [],
        datasets: []
      };
    }
    return {
      labels: data.map(item => convertDate(item.receivedAt)),
      datasets: [
        {
          label: "ไนโตรเจน (mg/L)",
          data: data.map(item => item.nitrogen),
          backgroundColor: "rgba(150, 0, 255, 0.5)",
          borderColor: "rgba(150, 0, 255, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "ฟอสฟอรัส (mg/L)",
          data: data.map(item => item.phosphorus),
          backgroundColor: "rgba(0, 255, 0, 0.5)",
          borderColor: "rgba(0, 255, 0, 1)",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "โพแทสเซียม (mg/L)",
          data: data.map(item => item.potassium),
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 2,
          fill: false,
        },
      ],
    }
  };
  
  return (
    <div className="m-4">
      {isLoading ? (
        <div className="flex justify-center pt-16">
          <Spinner size="lg" label="กำลังโหลดข้อมูล..." />
        </div>
      ) : (!isLoading && plantData && plantDatas && nutrientData && factorData) ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Card className="drop-shadow-xl md:col-span-2 lg:col-span-1" data-aos="fade-up">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">อายุ (วัน)</p>
              </CardHeader>
              <CardBody>
                <p className="text-center text-5xl lg:text-6xl font-bold">{plantAge}</p>
              </CardBody>
            </Card>
            <Link href={`/home/listVariables/${id}`}>
              <div data-aos="fade-up">
                <Card className="drop-shadow-xl hover:-translate-y-1 w-full" isPressable>
                  <CardHeader className="flex justify-center">
                    <p className="text-gray-500">อุณหภูมิ (°C)</p>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-center items-center gap-12">
                      <div className="text-center">
                        <p className="text-2xl">ค่าที่วัดได้</p>
                        <p className={`text-5xl font-bold ${
                            plantData.temperature < factorData.temperature
                            ? 'text-red-500'
                            : plantData.temperature > factorData.temperature * 1.25
                            ? 'text-amber-500'
                            : 'text-green-500'
                          }`}>
                          {plantData.temperature}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl ">ค่ามาตรฐาน</p>
                        <p className="text-5xl font-bold">{factorData.temperature}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Link>
            <Link href={`/home/listVariables/${id}`}>
              <div data-aos="fade-up">
                <Card className="drop-shadow-xl hover:-translate-y-1 w-full" isPressable>
                  <CardHeader className="flex justify-center">
                    <p className="text-gray-500">ความชื้น (%)</p>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-center items-center gap-12">
                      <div className="text-center">
                        <p className="text-2xl">ค่าที่วัดได้</p>
                        <p className={`text-5xl font-bold ${
                            plantData.humidity < factorData.humidity
                            ? 'text-red-500'
                            : plantData.humidity > factorData.humidity * 1.25
                            ? 'text-amber-500'
                            : 'text-green-500'
                          }`}>
                          {plantData.humidity}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl ">ค่ามาตรฐาน</p>
                        <p className="text-5xl font-bold">{factorData.humidity}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Link>

            <Link href={`/home/listVariables/${id}`}>
              <div data-aos="fade-up">
                <Card className="drop-shadow-xl hover:-translate-y-1 w-full" isPressable>
                  <CardHeader className="flex justify-center">
                    <p className="text-gray-500">ไนโตรเจน (mg/kg)</p>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-center items-center gap-12">
                      <div className="text-center">
                        <p className="text-2xl">ค่าที่วัดได้</p>
                        <p className={`text-5xl font-bold ${
                            plantData.nitrogen < nutrientData.nitrogen
                            ? 'text-red-500'
                            : plantData.nitrogen > nutrientData.nitrogen * 1.25
                            ? 'text-amber-500'
                            : 'text-green-500'
                          }`}>
                          {plantData.nitrogen}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl ">ค่ามาตรฐาน</p>
                        <p className="text-5xl font-bold">{nutrientData.nitrogen}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Link>
            <Link href={`/home/listVariables/${id}`}>
              <div data-aos="fade-up">
                <Card className="drop-shadow-xl hover:-translate-y-1 w-full" isPressable>
                  <CardHeader className="flex justify-center">
                    <p className="text-gray-500">ฟอสฟอรัส (mg/kg)</p>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-center items-center gap-12">
                      <div className="text-center">
                        <p className="text-2xl">ค่าที่วัดได้</p>
                        <p className={`text-5xl font-bold ${
                            plantData.phosphorus < nutrientData.phosphorus
                            ? 'text-red-500'
                            : plantData.phosphorus > nutrientData.phosphorus * 1.25
                            ? 'text-amber-500'
                            : 'text-green-500'
                          }`}>
                          {plantData.phosphorus}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl">ค่ามาตรฐาน</p>
                        <p className="text-5xl font-bold"> {nutrientData.phosphorus}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Link>
            <Link href={`/home/listVariables/${id}`}>
              <div data-aos="fade-up">
                <Card className="drop-shadow-xl hover:-translate-y-1 w-full" isPressable>
                  <CardHeader className="flex justify-center">
                    <p className="text-gray-500">โพแทสเซียม (mg/kg)</p>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-center items-center gap-12">
                      <div className="text-center">
                        <p className="text-2xl">ค่าที่วัดได้</p>
                        <p className={`text-5xl font-bold ${
                            plantData.potassium < nutrientData.potassium
                            ? 'text-red-500'
                            : plantData.potassium > nutrientData.potassium * 1.25
                            ? 'text-amber-500'
                            : 'text-green-500'
                          }`}>
                          {plantData.potassium}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl ">ค่ามาตรฐาน</p>
                        <p className="text-5xl font-bold">{nutrientData.potassium}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Link>

            <Link href={`/home/listVariables/${id}`}>
              <div data-aos="fade-up">
                <Card className="drop-shadow-xl hover:-translate-y-1 w-full" isPressable>
                  <CardHeader className="flex justify-between items-center">
                    <div className="flex justify-center flex-1"> 
                      <p className="text-gray-500">ค่าความเป็นกรด-ด่าง (pH)</p>
                    </div>
                    <div className="flex justify-end">
                      <ButtonGroup size="sm" variant="flat">
                        <Button onPress={() => {setSelectedId(id); onOpenPhGraph();}}>
                          <FaChartLine className="size-4 text-red-400" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-center items-center gap-12">
                      <div className="text-center">
                        <p className="text-2xl">ค่าที่วัดได้</p>
                        <p className={`text-5xl font-bold ${
                            plantData.pH < factorData.pH
                            ? 'text-red-500'
                            : plantData.pH > factorData.pH * 1.25
                            ? 'text-amber-500'
                            : 'text-green-500'
                          }`}>
                          {plantData.pH}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl ">ค่ามาตรฐาน</p>
                        <p className="text-5xl font-bold">{factorData.pH}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Link>
            <Link href={`/home/listVariables/${id}`}>
              <div data-aos="fade-up">
                <Card className="drop-shadow-xl hover:-translate-y-1 w-full" isPressable>
                  <CardHeader className="flex justify-between items-center">
                    <div className="flex justify-center flex-1"> 
                      <p className="text-gray-500">ค่าการนำไฟฟ้า (µS/cm)</p>
                    </div>
                    <div className="flex justify-end">
                      <ButtonGroup size="sm" variant="flat">
                        <Button onPress={() => {setSelectedId(id); onOpenSalinityGraph();}}>
                          <FaChartLine className="size-4 text-red-400" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-center items-center gap-12">
                      <div className="text-center">
                        <p className="text-2xl">ค่าที่วัดได้</p>
                        <p className={`text-5xl font-bold ${
                            plantData.salinity < factorData.salinity
                            ? 'text-red-500'
                            : plantData.salinity > factorData.salinity * 1.25
                            ? 'text-amber-500'
                            : 'text-green-500'
                          }`}>
                          {plantData.salinity}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl ">ค่ามาตรฐาน</p>
                        <p className="text-5xl font-bold">{factorData.salinity}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Link>
            <Link href={`/home/listVariables/${id}`}>
              <div data-aos="fade-up">
                <Card className="drop-shadow-xl hover:-translate-y-1 w-full" isPressable>
                  <CardHeader className="flex justify-between items-center">
                    <div className="flex justify-center flex-1"> 
                      <p className="text-gray-500">ค่าความเข้มแสง (lux)</p>
                    </div>
                    <div className="flex justify-end">
                      <ButtonGroup size="sm" variant="flat">
                        <Button onPress={() => {setSelectedId(id); onOpenLightIntensityGraph();}}>
                          <FaChartLine className="size-4 text-red-400" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-center items-center gap-12">
                      <div className="text-center">
                        <p className="text-2xl">ค่าที่วัดได้</p>
                        <p className={`text-5xl font-bold ${
                            plantData.lightIntensity < factorData.lightIntensity
                            ? 'text-red-500'
                            : plantData.lightIntensity > factorData.lightIntensity * 1.25
                            ? 'text-amber-500'
                            : 'text-green-500'
                          }`}>
                          {plantData.lightIntensity}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl ">ค่ามาตรฐาน</p>
                        <p className="text-5xl font-bold">{factorData.lightIntensity}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Link>
          </div>

          {isOpenPhGraph && (
            <ModalPhGraph isOpen={isOpenPhGraph} onOpenChange={onOpenPhChangeGraph} id={selectedId} />
          )}
          {isOpenSalinityGraph && (
            <ModalSalinityGraph isOpen={isOpenSalinityGraph} onOpenChange={onOpenSalinityChangeGraph} id={selectedId} />
          )}
          {isOpenLightIntensityGraph && (
            <ModalLightIntensityGraph isOpen={isOpenLightIntensityGraph} onOpenChange={onOpenLightIntensityChangeGraph} id={selectedId} />
          )}

          <div className="flex justify-between mb-4" data-aos="fade-up">
            <Button className="max-md:w-full" color="secondary">
              <Link
                href={`/home/listVariables/${id}`}
                className="flex items-center gap-2"
              >
                <FaTable className="size-4" /> ตารางข้อมูล
              </Link>
            </Button>
            <div className="hidden md:flex">
              <ButtonGroup className='max-sm:gap-y-2'>
                <Button onPress={() => fetchPlantVariables7day(id)} className="focus:bg-gray-400">7 วัน</Button>
                <Button onPress={() => fetchPlantVariables14day(id)} className="focus:bg-gray-400">14 วัน</Button>
                <Button onPress={() => fetchPlantVariables1month(id)} className="focus:bg-gray-400">1 เดือน</Button>
                <Button onPress={() => fetchPlantVariables3month(id)} className="focus:bg-gray-400">3 เดือน</Button>
                <Button onPress={() => fetchPlantVariables6month(id)} className="focus:bg-gray-400">6 เดือน</Button>
                <Button onPress={() => fetchPlantVariables9month(id)} className="focus:bg-gray-400">9 เดือน</Button>
                <Button onPress={() => fetchPlantVariables1year(id)} className="focus:bg-gray-400">1 ปี</Button>
              </ButtonGroup>
              </div>
          </div>

          <div className="block w-full mb-4 md:hidden" data-aos="fade-up">
            <Select
              onChange={(e) => {
                const value = e.target.value;
                if (value === '7day') fetchPlantVariables7day(id);
                if (value === '14day') fetchPlantVariables14day(id);
                if (value === '1month') fetchPlantVariables1month(id);
                if (value === '3month') fetchPlantVariables3month(id);
                if (value === '6month') fetchPlantVariables6month(id);
                if (value === '9month') fetchPlantVariables9month(id);
                if (value === '1year') fetchPlantVariables1year(id);
              }}
              className="w-full"
              placeholder="เลือกช่วงเวลา"
            >
              <SelectItem key="7day">7 วัน</SelectItem>
              <SelectItem key="14day">14 วัน</SelectItem>
              <SelectItem key="1month">1 เดือน</SelectItem>
              <SelectItem key="3month">3 เดือน</SelectItem>
              <SelectItem key="6month">6 เดือน</SelectItem>
              <SelectItem key="9month">9 เดือน</SelectItem>
              <SelectItem key="1year">1 ปี</SelectItem>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div data-aos="fade-up">
              <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
                <CardHeader className="flex justify-between items-center">
                  <div className="flex justify-center flex-1"> 
                    <p className="text-gray-500">กราฟแสดงข้อมูลอุณหภูมิ & ความชื้น</p>
                  </div>
                </CardHeader>
                <Line
                  options={options}
                  data={createEnvironmentData(plantDatas)}
                />
              </Card>
            </div>
              
            <div data-aos="fade-up">
              <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
                <CardHeader className="flex justify-between items-center">
                  <div className="flex justify-center flex-1"> 
                    <p className="text-gray-500">กราฟแสดงข้อมูลสารอาหาร</p>
                  </div>
                </CardHeader>
                <Line
                  options={options}
                  data={createNutrientData(plantDatas)}
                />
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center pt-16">
          <h2 className="flex items-center text-2xl text-gray-500"><FaBan size={22} />&ensp;ไม่มีข้อมูลสำหรับแสดงผล&ensp;<FaBan size={22} /></h2>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
