"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, Button, useDisclosure, ButtonGroup, Select, SelectItem, Link, Skeleton } from "@nextui-org/react";
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
import { FaTable, FaChartLine, FaCircleExclamation } from "react-icons/fa6";
import DmsCoordinates from "dms-conversion";
import moment from "moment";
import 'moment/locale/th';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ModalPhGraph from "../../../components/ModalPhGraph";
import ModalSalinityGraph from "../../../components/ModalSalinityGraph";
import ModalLightIntensityGraph from "../../../components/ModalLightIntensityGraph";

function Dashboard({ params }) {
  const { id } = params;
  const router = useRouter();

  const [plantId, setPlantId] = useState(null);
  const [plantAge, setPlantAge] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [mapUrl, setMapUrl] = useState("");

  const [plantData, setPlantData] = useState(null);
  const [plantDatas, setPlantDatas] = useState(null);
  const [factorData, setFactorData] = useState(null);
  const [nutrientData, setNutrientData] = useState(null);

  const [otherPlant, setOtherPlant] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const { isOpen: isOpenPhGraph, onOpen: onOpenPhGraph, onOpenChange: onOpenPhChangeGraph } = useDisclosure();
  const { isOpen: isOpenSalinityGraph, onOpen: onOpenSalinityGraph, onOpenChange: onOpenSalinityChangeGraph } = useDisclosure();
  const { isOpen: isOpenLightIntensityGraph, onOpen: onOpenLightIntensityGraph, onOpenChange: onOpenLightIntensityChangeGraph } = useDisclosure();
  
  const calculateAge = (plantedAt) => {
    const plantedDate = moment(plantedAt);
    const currentDate = moment();
    const plantAge = currentDate.diff(plantedDate, 'days');
    
    return plantAge;
  };

  useEffect(() => {
    const fetchFactor = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getFactor/${plantId}/${plantAge}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setFactorData(data.resultData[0]);
        } else if (res.status === 404) {
          setFactorData(null);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoaded(true);
      }
    };

    const fetchNutrient = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getNutrient/${plantId}/${plantAge}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setNutrientData(data.resultData[0]);
        } else if (res.status === 404) {
          setNutrientData(null);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoaded(true);
      }
    };
  
    const fetchOtherFactor = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getOtherFactor/${plantId}/${plantAge}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setFactorData(data.resultData[0]);
        } else if (res.status === 404) {
          setFactorData(null);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoaded(true);
      }
    };
  
    const fetchOtherNutrient = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getOtherNutrient/${plantId}/${plantAge}`
        );
  
        if (res.status === 200) {
          const data = await res.json();
          setNutrientData(data.resultData[0]);
        } else if (res.status === 404) {
          setNutrientData(null);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoaded(true);
      }
    };

    if (otherPlant) {
      if (id) Promise.all([fetchOtherNutrient(id), fetchOtherFactor(id)]);
    } else {
      if (plantId) Promise.all([fetchNutrient(plantId), fetchFactor(plantId)]);
    }
  }, [id, plantId, otherPlant, plantAge]);

  useEffect(() => {
    const fetchPlant = async (plantId) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/getPlant/${plantId}`);
  
        if(res.status === 200) {
          const data = await res.json();
          setPlantId(data.resultData.plant_avaliable_id);
  
          const plantedAt = data.resultData.plantedAt;
          const ageInDays = calculateAge(plantedAt);
          setPlantAge(ageInDays);

          setLatitude(data.resultData.latitude);
          setLongitude(data.resultData.longitude);
  
          data.resultData.plant_avaliable_id === 1 ? setOtherPlant(true) : setOtherPlant(false);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoaded(true);
      }
    }
  
    const fetchPlantVariable = async (plantId) => {
      try {
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
        setIsLoaded(true);
      }
    };
  
    const fetchPlantVariables = async (plantId) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables7day/${plantId}`
        );
  
        const data = await res.json();
        if (res.status === 200) {
          setPlantDatas(data.resultData);
        } else if (res.status === 404) {
          setPlantDatas(null);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
      } finally {
        setIsLoaded(true);
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
    if(latitude && longitude) {
      const dmsCoords = new DmsCoordinates(latitude, longitude).toString();
      const pinned = Buffer.from(dmsCoords).toString("base64");
      setMapUrl(`https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3861.904509294199!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z${pinned}!5e0!3m2!1sth!2sth!4v1746197897815!5m2!1sth!2sth`);
    }
  }, [latitude, longitude]);

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
    maintainAspectRatio: true,
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <Card className="drop-shadow-xl md:col-span-2 lg:col-span-1" data-aos="fade-up">
              <CardHeader className="flex justify-center">
                <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                  <p>อายุ (วัน)</p>
                </Skeleton>
              </CardHeader>
              <CardBody>
                <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                  <p className="text-center text-5xl lg:text-6xl font-bold">{plantAge}</p>
                </Skeleton>
              </CardBody>
            </Card>
            <Card className="drop-shadow-xl hover:-translate-y-1 w-full" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>อุณหภูมิ (°C)</p>
                  </Skeleton>
                </div>
                {(plantData?.temperature < factorData?.temperature || plantData?.temperature > factorData?.temperature * 1.25) && (
                  <Link href="https://www.doa.go.th/share/" color="foreground" className="flex justify-end z-50" isExternal>
                    <FaCircleExclamation size={20} />
                  </Link>
                )}
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่าที่วัดได้</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className={`text-5xl font-bold ${
                        plantData?.temperature < factorData?.temperature
                        ? 'text-red-500'
                        : plantData?.temperature > factorData?.temperature * 1.25
                        ? 'text-amber-500'
                        : !plantData?.temperature
                        ? 'opacity-40'
                        : 'text-green-500'
                      }`}>
                        {plantData?.temperature ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                  
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่ามาตรฐาน</p>
                      <p
                        className={`text-5xl font-bold ${
                          !factorData?.temperature ? "opacity-40" : ""
                        }`}
                      >
                        {factorData?.temperature ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="drop-shadow-xl hover:-translate-y-1 w-full" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>ความชื้น (%)</p>
                  </Skeleton>
                </div>
                {(plantData?.humidity < factorData?.humidity || plantData?.humidity > factorData?.humidity * 1.25) && (
                  <Link href="https://www.doa.go.th/share/" color="foreground" className="flex justify-end z-50" isExternal>
                    <FaCircleExclamation size={20} />
                  </Link>
                )}
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่าที่วัดได้</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className={`text-5xl font-bold ${
                        plantData?.humidity < factorData?.humidity
                        ? 'text-red-500'
                        : plantData?.humidity > factorData?.humidity * 1.25
                        ? 'text-amber-500'
                        : !plantData?.humidity
                        ? 'opacity-40'
                        : 'text-green-500'
                      }`}>
                        {plantData?.humidity ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                  
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่ามาตรฐาน</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p
                        className={`text-5xl font-bold ${
                          !factorData?.humidity ? "opacity-40" : ""
                        }`}
                      >
                        {factorData?.humidity ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="drop-shadow-xl hover:-translate-y-1 w-full" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>ไนโตรเจน (mg/kg)</p>
                  </Skeleton>
                </div>
                {(plantData?.nitrogen < nutrientData?.nitrogen || plantData?.nitrogen > nutrientData?.nitrogen * 1.25) && (
                  <Link href="https://www.doa.go.th/share/" color="foreground" className="flex justify-end z-50" isExternal>
                    <FaCircleExclamation size={20} />
                  </Link>
                )}
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่าที่วัดได้</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className={`text-5xl font-bold ${
                        plantData?.nitrogen < nutrientData?.nitrogen
                        ? 'text-red-500'
                        : plantData?.nitrogen > nutrientData?.nitrogen * 1.25
                        ? 'text-amber-500'
                        : !plantData?.nitrogen
                        ? 'opacity-40'
                        : 'text-green-500'
                      }`}>
                        {plantData?.nitrogen ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                  
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่ามาตรฐาน</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p
                        className={`text-5xl font-bold ${
                          !nutrientData?.nitrogen ? "opacity-40" : ""
                        }`}
                      >
                        {nutrientData?.nitrogen ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="drop-shadow-xl hover:-translate-y-1 w-full" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>ฟอสฟอรัส (mg/kg)</p>
                  </Skeleton>
                </div>
                {(plantData?.phosphorus < nutrientData?.phosphorus || plantData?.phosphorus > nutrientData?.phosphorus * 1.25) && (
                  <Link href="https://www.doa.go.th/share/" color="foreground" className="flex justify-end z-50" isExternal>
                    <FaCircleExclamation size={20} />
                  </Link>
                )}
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่าที่วัดได้</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className={`text-5xl font-bold ${
                        plantData?.phosphorus < nutrientData?.phosphorus
                        ? 'text-red-500'
                        : plantData?.phosphorus > nutrientData?.phosphorus * 1.25
                        ? 'text-amber-500'
                        : !plantData?.phosphorus
                        ? 'opacity-40'
                        : 'text-green-500'
                      }`}>
                        {plantData?.phosphorus ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                  
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่ามาตรฐาน</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p
                        className={`text-5xl font-bold ${
                          !nutrientData?.phosphorus ? "opacity-40" : ""
                        }`}
                      >
                        {nutrientData?.phosphorus ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="drop-shadow-xl hover:-translate-y-1 w-full" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>โพแทสเซียม (mg/kg)</p>
                  </Skeleton>
                </div>
                {(plantData?.potassium < nutrientData?.potassium || plantData?.potassium > nutrientData?.potassium * 1.25) && (
                  <Link href="https://www.doa.go.th/share/" color="foreground" className="flex justify-end z-50" isExternal>
                    <FaCircleExclamation size={20} />
                  </Link>
                )}
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่าที่วัดได้</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className={`text-5xl font-bold ${
                        plantData?.potassium < nutrientData?.potassium
                        ? 'text-red-500'
                        : plantData?.potassium > nutrientData?.potassium * 1.25
                        ? 'text-amber-500'
                        : !plantData?.potassium
                        ? 'opacity-40'
                        : 'text-green-500'
                      }`}>
                        {plantData?.potassium ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                  
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่ามาตรฐาน</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p
                        className={`text-5xl font-bold ${
                          !nutrientData?.potassium ? "opacity-40" : ""
                        }`}
                      >
                        {nutrientData?.potassium ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="drop-shadow-xl hover:-translate-y-1 w-full" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>ค่าความเป็นกรด-ด่าง (pH)</p>
                  </Skeleton>
                </div>
                <div className="flex justify-end gap-2">
                  <ButtonGroup size="sm" variant="flat">
                    <Button onPress={() => {setSelectedId(id); onOpenPhGraph();}}>
                      <FaChartLine className="size-4 text-red-400" />
                    </Button>
                  </ButtonGroup>
                  {(plantData?.pH < factorData?.pH || plantData?.pH > factorData?.pH * 1.25) && (
                    <Link href="https://www.doa.go.th/share/" color="foreground" className="flex justify-end z-50" isExternal>
                      <FaCircleExclamation size={20} />
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่าที่วัดได้</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className={`text-5xl font-bold ${
                        plantData?.pH < factorData?.pH
                        ? 'text-red-500'
                        : plantData?.pH > factorData?.pH * 1.25
                        ? 'text-amber-500'
                        : !plantData?.pH
                        ? 'opacity-40'
                        : 'text-green-500'
                      }`}>
                        {plantData?.pH ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                  
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่ามาตรฐาน</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p
                        className={`text-5xl font-bold ${
                          !factorData?.pH ? "opacity-40" : ""
                        }`}
                      >
                        {factorData?.pH ?? "N/A"}
                      </p>
                    </Skeleton>
                    </div>
                </div>
              </CardBody>
            </Card>
            <Card className="drop-shadow-xl hover:-translate-y-1 w-full" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>ค่าการนำไฟฟ้า (µS/cm)</p>
                  </Skeleton>
                </div>
                <div className="flex justify-end gap-2">
                  <ButtonGroup size="sm" variant="flat">
                    <Button onPress={() => {setSelectedId(id); onOpenSalinityGraph();}}>
                      <FaChartLine className="size-4 text-red-400" />
                    </Button>
                  </ButtonGroup>
                  {(plantData?.salinity < factorData?.salinity || plantData?.salinity > factorData?.salinity * 1.25) && (
                    <Link href="https://www.doa.go.th/share/" color="foreground" className="flex justify-end z-50" isExternal>
                      <FaCircleExclamation size={20} />
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่าที่วัดได้</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className={`text-5xl font-bold ${
                        plantData?.salinity < factorData?.salinity
                        ? 'text-red-500'
                        : plantData?.salinity > factorData?.salinity * 1.25
                        ? 'text-amber-500'
                        : !plantData?.salinity
                        ? 'opacity-40'
                        : 'text-green-500'
                      }`}>
                        {plantData?.salinity ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                  
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่ามาตรฐาน</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p
                        className={`text-5xl font-bold ${
                          !factorData?.salinity ? "opacity-40" : ""
                        }`}
                      >
                        {factorData?.salinity ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="drop-shadow-xl hover:-translate-y-1 w-full" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>ค่าความเข้มแสง (lux)</p>
                  </Skeleton>
                </div>
                <div className="flex justify-end gap-2">
                  <ButtonGroup size="sm" variant="flat">
                    <Button onPress={() => {setSelectedId(id); onOpenLightIntensityGraph();}}>
                      <FaChartLine className="size-4 text-red-400" />
                    </Button>
                  </ButtonGroup>
                  {(plantData?.lightIntensity < factorData?.lightIntensity || plantData?.lightIntensity > factorData?.lightIntensity * 1.25) && (
                    <Link href="https://www.doa.go.th/share/" color="foreground" className="flex justify-end z-50" isExternal>
                      <FaCircleExclamation size={20} />
                    </Link>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่าที่วัดได้</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className={`text-5xl font-bold ${
                        plantData?.lightIntensity < factorData?.lightIntensity
                        ? 'text-red-500'
                        : plantData?.lightIntensity > factorData?.lightIntensity * 1.25
                        ? 'text-amber-500'
                        : !plantData?.lightIntensity
                        ? 'opacity-40'
                        : 'text-green-500'
                      }`}>
                        {plantData?.lightIntensity ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                  
                  <div className="text-center">
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p className="text-2xl text-gray-500 dark:text-gray-400">ค่ามาตรฐาน</p>
                    </Skeleton>
                    <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                      <p
                        className={`text-5xl font-bold ${
                          !factorData?.lightIntensity ? "opacity-40" : ""
                        }`}
                      >
                        {factorData?.lightIntensity ?? "N/A"}
                      </p>
                    </Skeleton>
                  </div>
                </div>
              </CardBody>
            </Card>
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
            <Button
              className="max-md:w-full"
              color="secondary"
              onPress={() => router.push(`/home/listVariables/${id}`)}
              endContent={<FaTable size={16} />}
            >
              ตารางข้อมูล
            </Button>
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
            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>กราฟแสดงข้อมูลอุณหภูมิ & ความชื้น</p>
                  </Skeleton>
                </div>
              </CardHeader>
                {plantDatas ? (
                  <Line
                    options={options}
                    data={createEnvironmentData(plantDatas)}
                  />
                ) : (
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p className="flex justify-center text-2xl font-bold opacity-40">ไม่มีข้อมูล</p>
                  </Skeleton>
                )}
            </Card>
              
            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>กราฟแสดงข้อมูลสารอาหาร</p>
                  </Skeleton>
                </div>
              </CardHeader>
                {plantDatas ? (
                  <Line
                    options={options}
                    data={createNutrientData(plantDatas)}
                  />
                ) : (
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p className="flex justify-center text-2xl font-bold opacity-40">ไม่มีข้อมูล</p>
                  </Skeleton>
                )}
            </Card>

            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1 lg:col-span-2" data-aos="fade-up">
              <CardHeader className="flex justify-between items-center">
                <div className="flex justify-center flex-1">
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p>แผนที่แสดงสถานที่ปลูกพืช</p>
                  </Skeleton>
                </div>
              </CardHeader>
              <CardBody>
                {mapUrl ? (
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <iframe
                      src={mapUrl}
                      className="rounded-xl w-full h-[20rem] md:h-[30rem] lg:h-[40rem]"
                      style={{ border: 0 }}
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </Skeleton>
                ) : (
                  <Skeleton className="text-center rounded-lg" isLoaded={isLoaded}>
                    <p className="flex justify-center text-4xl font-bold opacity-40">ไม่มีข้อมูล</p>
                  </Skeleton>
                )}
              </CardBody>
            </Card>
          </div>
        </>
    </div>
  );
}

export default Dashboard;
