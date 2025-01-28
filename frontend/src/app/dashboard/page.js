// 'use client'

// import React, { useEffect } from 'react'
// import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { Bar } from 'react-chartjs-2';

// function Page() {
//     const fetchPlantVariables = async (plant_id) => {
//         try {
//             const res = await fetch(`http://localhost:4000/api/getPlantVariables/${plant_id}`);

//             if (res.ok) {
//                 const data = await res.json();
//                 console.log(data.resultData);
//             }
//         } catch (err) {
//             console.error("Failed to fetch", err);
//         }
//     }

//     useEffect(() => {
//         fetchPlantVariables(3);
//     }, []);

//     ChartJS.register(
//         CategoryScale,
//         LinearScale,
//         BarElement,
//         Title,
//         Tooltip,
//         Legend
//     );

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//         },
//     };

//     const labels = ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'];

//     const dataTemp = {
//         labels,
//         datasets: [
//             {
//                 label: 'อุณหภูมิ',
//                 data: [24, 25, 26, 27, 29, 30, 29, 28, 27],
//                 backgroundColor: 'rgba(150, 150, 150, 0.5)',
//                 borderColor: 'rgba(150, 150, 150, 1)',
//                 borderWidth: 2
//             },
//         ],
//     };

//     const dataMoisture = {
//         labels,
//         datasets: [
//             {
//                 label: 'ความชื้น',
//                 data: [80, 78, 75, 70, 67, 75, 80, 83, 85],
//                 backgroundColor: 'rgba(0, 229, 255, 0.5)',
//                 borderColor: 'rgba(0, 229, 255, 1)',
//                 borderWidth: 2
//             },
//         ],
//     };

//     const dataPH = {
//         labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
//         datasets: [
//             {
//                 label: 'ค่าความเป็นกรด-ด่าง',
//                 data: [6.5, 6.4, 6.3, 6.2, 6.0, 5.8, 5.5, 5.8, 6.3],
//                 backgroundColor: 'rgba(255, 131, 0, 0.5)',
//                 borderColor: 'rgba(255, 131, 0, 1)',
//                 borderWidth: 2
//             },
//         ],
//     };

//     const dataEC = {
//         labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
//         datasets: [
//             {
//                 label: 'ค่าการนำไฟฟ้า',
//                 data: [1.5, 1.4, 1.1, 1.2, 1.45, 1.3, 1.1, 0.9, 0.7],
//                 backgroundColor: 'rgba(0, 0, 255, 0.5)',
//                 borderColor: 'rgba(0, 0, 255, 1)',
//                 borderWidth: 2
//             },
//         ],
//     };

//     const dataLight = {
//         labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
//         datasets: [
//             {
//                 label: 'ค่าความเข้มแสง',
//                 data: [10000, 12000, 14000, 17000, 20000, 19000, 18000, 17000, 16000],
//                 backgroundColor: 'rgba(255, 255, 0, 0.5)',
//                 borderColor: 'rgba(255, 255, 0, 1)',
//                 borderWidth: 2
//             },
//         ],
//     };

//     const dataNitrogen = {
//         labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
//         datasets: [
//             {
//                 label: 'ไนโตรเจน',
//                 data: [90, 85, 80, 73, 70, 68, 65, 62, 75],
//                 backgroundColor: 'rgba(150, 0, 255, 0.5)',
//                 borderColor: 'rgba(150, 0, 255, 1)',
//                 borderWidth: 2
//             },
//         ],
//     };

//     const dataPhosphorus = {
//         labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
//         datasets: [
//             {
//                 label: 'ฟอสฟอรัส',
//                 data: [50, 48, 45, 42, 40, 38, 35, 32, 45],
//                 backgroundColor: 'rgba(0, 255, 0, 0.5)',
//                 borderColor: 'rgba(0, 255, 0, 1)',
//                 borderWidth: 2
//             },
//         ],
//     };

//     const dataPotassium = {
//         labels: ['8.00','9.00','10.00', '11.00', '12.00', '13.00', '14.00', '15.00', '16.00'],
//         datasets: [
//             {
//                 label: 'โพแทสเซียม',
//                 data: [145, 142, 139, 135, 130, 124, 118, 110, 140],
//                 backgroundColor: 'rgba(255, 0, 0, 0.5)',
//                 borderColor: 'rgba(255, 0, 0, 1)',
//                 borderWidth: 2
//             },
//         ],
//     };

//     return (
//         <div className='m-4'>
//             <div className='grid grid-cols-6 gap-4 mb-4'>
//                 <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                     <CardHeader className='flex justify-center'>
//                         <p className='text-gray-500'>อายุ (วัน)</p>
//                     </CardHeader>
//                     <CardBody>
//                         <p className='text-center text-6xl font-bold'>30</p>
//                     </CardBody>
//                 </Card>
//                 <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                     <CardHeader className='flex justify-center'>
//                         <p className='text-gray-500'>อุณหภูมิ (°C)</p>
//                     </CardHeader>
//                     <CardBody>
//                         <p className='text-center text-6xl font-bold'>28</p>
//                     </CardBody>
//                 </Card>
//                 <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                     <CardHeader className='flex justify-center'>
//                         <p className='text-gray-500'>ความชื้น (%)</p>
//                     </CardHeader>
//                     <CardBody>
//                         <p className='text-center text-6xl font-bold'>70</p>
//                     </CardBody>
//                 </Card>
//                 <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                     <CardHeader className='flex justify-center'>
//                         <p className='text-gray-500'>ค่าความเป็นกรด-ด่าง (pH)</p>
//                     </CardHeader>
//                     <CardBody>
//                         <p className='text-center text-6xl font-bold'>5.5</p>
//                     </CardBody>
//                 </Card>
//                 <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                     <CardHeader className='flex justify-center'>
//                         <p className='text-gray-500'>ค่าการนำไฟฟ้า (dS/m)</p>
//                     </CardHeader>
//                     <CardBody>
//                         <p className='text-center text-6xl font-bold'>1.2</p>
//                     </CardBody>
//                 </Card>
//                 <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                     <CardHeader className='flex justify-center'>
//                         <p className='text-gray-500'>ค่าความเข้มแสง (lux)</p>
//                     </CardHeader>
//                     <CardBody>
//                         <p className='text-center text-6xl font-bold'>15000</p>
//                     </CardBody>
//                 </Card>
//             </div>
//             <div className='grid grid-cols-3 gap-4 mb-4'>
//                 <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                     <CardHeader className='flex justify-center'>
//                         <p className='text-gray-500'>ไนโตรเจน (mg/L)</p>
//                     </CardHeader>
//                     <CardBody>
//                         <p className='text-center text-6xl font-bold text-red-500'>75</p>
//                     </CardBody>
//                 </Card>
//                 <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                     <CardHeader className='flex justify-center'>
//                         <p className='text-gray-500'>ฟอสฟอรัส (mg/L)</p>
//                     </CardHeader>
//                     <CardBody>
//                         <p className='text-center text-6xl font-bold text-red-500'>40</p>
//                     </CardBody>
//                 </Card>
//                 <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                     <CardHeader className='flex justify-center'>
//                         <p className='text-gray-500'>โพแทสเซียม (mg/L)</p>
//                     </CardHeader>
//                     <CardBody>
//                         <p className='text-center text-6xl font-bold text-red-500'>125</p>
//                     </CardBody>
//                 </Card>
//             </div>
//             <div className='grid grid-cols-2 gap-4'>
//                 <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                     <CardHeader className='flex justify-center'>อุณหภูมิ (°C)</CardHeader>
//                         <Bar options={options} data={dataTemp} />
//                 </Card>
//                 <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                     <CardHeader className='flex justify-center'>ความชื้น (%)</CardHeader>
//                         <Bar options={options} data={dataMoisture} />
//                 </Card>
//                 <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                     <CardHeader className='flex justify-center'>ค่าความเป็นกรด-ด่าง (pH)</CardHeader>
//                         <Bar options={options} data={dataPH} />
//                 </Card>
//                 <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                     <CardHeader className='flex justify-center'>ค่าการนำไฟฟ้า (dS/m)</CardHeader>
//                         <Bar options={options} data={dataEC} />
//                 </Card>
//                 <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                     <CardHeader className='flex justify-center'>ค่าความเข้มแสง (lux)</CardHeader>
//                         <Bar options={options} data={dataLight} />
//                 </Card>
//                 <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                     <CardHeader className='flex justify-center'>ไนโตรเจน (mg/L)</CardHeader>
//                         <Bar options={options} data={dataNitrogen} />
//                 </Card>
//                 <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                     <CardHeader className='flex justify-center'>ฟอสฟอรัส (mg/L)</CardHeader>
//                         <Bar options={options} data={dataPhosphorus} />
//                 </Card>
//                 <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                     <CardHeader className='flex justify-center'>โพแทสเซียม (mg/L)</CardHeader>
//                         <Bar options={options} data={dataPotassium} />
//                 </Card>
//             </div>
//         </div>
//     )
// }

// export default Page

// 'use client'

// import React, { useState, useEffect } from 'react'
// import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import { Bar } from 'react-chartjs-2';

// function Page() {
//     const [plantData, setPlantData] = useState(null);

//     const fetchPlantVariables = async (plantId) => {
//         try {
//             const res = await fetch(`http://localhost:4000/api/getPlantVariables/${plantId}`);

//             if (res.ok) {
//                 const data = await res.json();
//                 console.log(data.resultData);
//                 setPlantData(data.resultData);
//             }
//         } catch (err) {
//             console.error("Failed to fetch", err);
//         }
//     }

//     useEffect(() => {
//         fetchPlantVariables(3);
//     }, []);

//     ChartJS.register(
//         CategoryScale,
//         LinearScale,
//         BarElement,
//         Title,
//         Tooltip,
//         Legend
//     );

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//         },
//     };

//     // Generate labels based on current time
//     const generateTimeLabels = () => {
//         const now = new Date();
//         const labels = [];
//         for (let i = 0; i < 9; i++) {
//             const time = new Date(now.getTime() - (8 - i) * 60 * 60 * 1000);
//             labels.push(time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
//         }
//         return labels;
//     };

//     const labels = generateTimeLabels();

//     // Function to generate chart data
//     const createChartData = (label, data, backgroundColor, borderColor) => ({
//         labels,
//         datasets: [
//             {
//                 label,
//                 data: Array(9).fill(data[0]), // Repeat the single data point
//                 backgroundColor,
//                 borderColor,
//                 borderWidth: 2
//             },
//         ],
//     });

//     return (
//         <div className='m-4'>
//             {plantData && (
//                 <>
//                     <div className='grid grid-cols-6 gap-4 mb-4'>
//                         <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                             <CardHeader className='flex justify-center'>
//                                 <p className='text-gray-500'>อายุ (วัน)</p>
//                             </CardHeader>
//                             <CardBody>
//                                 <p className='text-center text-6xl font-bold'>30</p>
//                             </CardBody>
//                         </Card>
//                         <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                             <CardHeader className='flex justify-center'>
//                                 <p className='text-gray-500'>อุณหภูมิ (°C)</p>
//                             </CardHeader>
//                             <CardBody>
//                                 <p className='text-center text-6xl font-bold'>{plantData.temperature}</p>
//                             </CardBody>
//                         </Card>
//                         <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                             <CardHeader className='flex justify-center'>
//                                 <p className='text-gray-500'>ความชื้น (%)</p>
//                             </CardHeader>
//                             <CardBody>
//                                 <p className='text-center text-6xl font-bold'>{plantData.humidity}</p>
//                             </CardBody>
//                         </Card>
//                         <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                             <CardHeader className='flex justify-center'>
//                                 <p className='text-gray-500'>ค่าความเป็นกรด-ด่าง (pH)</p>
//                             </CardHeader>
//                             <CardBody>
//                                 <p className='text-center text-6xl font-bold'>{plantData.pH}</p>
//                             </CardBody>
//                         </Card>
//                         <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                             <CardHeader className='flex justify-center'>
//                                 <p className='text-gray-500'>ค่าการนำไฟฟ้า (dS/m)</p>
//                             </CardHeader>
//                             <CardBody>
//                                 <p className='text-center text-6xl font-bold'>{plantData.salinity}</p>
//                             </CardBody>
//                         </Card>
//                         <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                             <CardHeader className='flex justify-center'>
//                                 <p className='text-gray-500'>ค่าความเข้มแสง (lux)</p>
//                             </CardHeader>
//                             <CardBody>
//                                 <p className='text-center text-6xl font-bold'>{plantData.lightIntensity}</p>
//                             </CardBody>
//                         </Card>
//                     </div>
//                     <div className='grid grid-cols-3 gap-4 mb-4'>
//                         <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                             <CardHeader className='flex justify-center'>
//                                 <p className='text-gray-500'>ไนโตรเจน (mg/L)</p>
//                             </CardHeader>
//                             <CardBody>
//                                 <p className='text-center text-6xl font-bold text-red-500'>{plantData.nitrogen}</p>
//                             </CardBody>
//                         </Card>
//                         <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                             <CardHeader className='flex justify-center'>
//                                 <p className='text-gray-500'>ฟอสฟอรัส (mg/L)</p>
//                             </CardHeader>
//                             <CardBody>
//                                 <p className='text-center text-6xl font-bold text-red-500'>{plantData.phosphorus}</p>
//                             </CardBody>
//                         </Card>
//                         <Card className='drop-shadow-xl hover:-translate-y-1 cursor-pointer'>
//                             <CardHeader className='flex justify-center'>
//                                 <p className='text-gray-500'>โพแทสเซียม (mg/L)</p>
//                             </CardHeader>
//                             <CardBody>
//                                 <p className='text-center text-6xl font-bold text-red-500'>{plantData.potassium}</p>
//                             </CardBody>
//                         </Card>
//                     </div>
//                     <div className='grid grid-cols-2 gap-4'>
//                         <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                             <CardHeader className='flex justify-center'>อุณหภูมิ (°C)</CardHeader>
//                             <Bar
//                                 options={options}
//                                 data={createChartData(
//                                     'อุณหภูมิ',
//                                     [plantData.temperature],
//                                     'rgba(150, 150, 150, 0.5)',
//                                     'rgba(150, 150, 150, 1)'
//                                 )}
//                             />
//                         </Card>
//                         <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                             <CardHeader className='flex justify-center'>ความชื้น (%)</CardHeader>
//                             <Bar
//                                 options={options}
//                                 data={createChartData(
//                                     'ความชื้น',
//                                     [plantData.humidity],
//                                     'rgba(0, 229, 255, 0.5)',
//                                     'rgba(0, 229, 255, 1)'
//                                 )}
//                             />
//                         </Card>
//                         <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                             <CardHeader className='flex justify-center'>ค่าความเป็นกรด-ด่าง (pH)</CardHeader>
//                             <Bar
//                                 options={options}
//                                 data={createChartData(
//                                     'ค่าความเป็นกรด-ด่าง',
//                                     [plantData.pH],
//                                     'rgba(255, 131, 0, 0.5)',
//                                     'rgba(255, 131, 0, 1)'
//                                 )}
//                             />
//                         </Card>
//                         <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                             <CardHeader className='flex justify-center'>ค่าการนำไฟฟ้า (dS/m)</CardHeader>
//                             <Bar
//                                 options={options}
//                                 data={createChartData(
//                                     'ค่าการนำไฟฟ้า',
//                                     [plantData.salinity],
//                                     'rgba(0, 0, 255, 0.5)',
//                                     'rgba(0, 0, 255, 1)'
//                                 )}
//                             />
//                         </Card>
//                         <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                             <CardHeader className='flex justify-center'>ค่าความเข้มแสง (lux)</CardHeader>
//                             <Bar
//                                 options={options}
//                                 data={createChartData(
//                                     'ค่าความเข้มแสง',
//                                     [plantData.lightIntensity],
//                                     'rgba(255, 255, 0, 0.5)',
//                                     'rgba(255, 255, 0, 1)'
//                                 )}
//                             />
//                         </Card>
//                         <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                             <CardHeader className='flex justify-center'>ไนโตรเจน (mg/L)</CardHeader>
//                             <Bar
//                                 options={options}
//                                 data={createChartData(
//                                     'ไนโตรเจน',
//                                     [plantData.nitrogen],
//                                     'rgba(150, 0, 255, 0.5)',
//                                     'rgba(150, 0, 255, 1)'
//                                 )}
//                             />
//                         </Card>
//                         <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                             <CardHeader className='flex justify-center'>ฟอสฟอรัส (mg/L)</CardHeader>
//                             <Bar
//                                 options={options}
//                                 data={createChartData(
//                                     'ฟอสฟอรัส',
//                                     [plantData.phosphorus],
//                                     'rgba(0, 255, 0, 0.5)',
//                                     'rgba(0, 255, 0, 1)'
//                                 )}
//                             />
//                         </Card>
//                         <Card className='px-4 pb-4 drop-shadow-xl hover:-translate-y-1'>
//                             <CardHeader className='flex justify-center'>โพแทสเซียม (mg/L)</CardHeader>
//                             <Bar
//                                 options={options}
//                                 data={createChartData(
//                                     'โพแทสเซียม',
//                                     [plantData.potassium],
//                                     'rgba(255, 0, 0, 0.5)',
//                                     'rgba(255, 0, 0, 1)'
//                                 )}
//                             />
//                         </Card>
//                     </div>
//                 </>
//             )}
//         </div>
//     )
// }

// export default Page

"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, useDisclosure } from "@nextui-org/react";
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
import { GoGraph } from "react-icons/go";
import ModalGraph from "../components/ModalGraph";

function Dashboard({ id }) {

  const [plantData, setPlantData] = useState(null);

  const [nutrienData, setnutrienData] = useState(null);

  const [factorData, setfactorData] = useState(null);
  
  const [refresh, setRefresh] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { isOpen: isOpenGraph, onOpen: onOpenGraph, onOpenChange: onOpenChangeGraph } = useDisclosure();

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

  //----------------------------------------------------------------

  const fetchNutrien = async (plantId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/getNutrien/${plantId}`
      );

      if (res.ok) {
        const data = await res.json();
        console.log(data.resultData[0]); // Log the first item in resultData
        setnutrienData(data.resultData[0]); // Set the first item
      }
    } catch (err) {
      console.error("Failed to fetch", err);
    }
  };

  useEffect(() => {
    if (id) {
        fetchNutrien(id);
    }
  }, [id]);

    //----------------------------------------------------------------

    const fetchFactor = async (plantId) => {
        try {
          const res = await fetch(
            `http://localhost:4000/api/getFactor/${plantId}`
          );
    
          if (res.ok) {
            const data = await res.json();
            console.log(data.resultData[0]); // Log the first item in resultData
            setfactorData(data.resultData[0]); // Set the first item
          }
        } catch (err) {
          console.error("Failed to fetch", err);
        }
      };
    
      useEffect(() => {
        if (id) {
            fetchFactor(id);
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
      const time = new Date(now.getTime() - (8 - i) * 60 * 60 * 1000);
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
        label: "อุณหภูมิ (°C)",
        data: Array(9).fill(data.temperature),
        backgroundColor: "rgba(150, 150, 150, 0.5)",
        borderColor: "rgba(150, 150, 150, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "ความชื้น (%)",
        data: Array(9).fill(data.humidity),
        backgroundColor: "rgba(0, 229, 255, 0.5)",
        borderColor: "rgba(0, 229, 255, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "ค่าความเป็นกรด-ด่าง (pH)",
        data: Array(9).fill(data.pH),
        backgroundColor: "rgba(255, 131, 0, 0.5)",
        borderColor: "rgba(255, 131, 0, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "ค่าการนำไฟฟ้า (dS/m)",
        data: Array(9).fill(data.salinity),
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        borderColor: "rgba(0, 0, 255, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "ค่าความเข้มแสง (lux)",
        data: Array(9).fill(data.lightIntensity),
        backgroundColor: "rgba(255, 255, 0, 0.5)",
        borderColor: "rgba(255, 255, 0, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  });

  const createChartDataNutrient = (data) => ({
    labels,
    datasets: [
      {
        label: "ไนโตรเจน (mg/L)",
        data: Array(9).fill(data.nitrogen),
        backgroundColor: "rgba(150, 0, 255, 0.5)",
        borderColor: "rgba(150, 0, 255, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "ฟอสฟอรัส (mg/L)",
        data: Array(9).fill(data.phosphorus),
        backgroundColor: "rgba(0, 255, 0, 0.5)",
        borderColor: "rgba(0, 255, 0, 1)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "โพแทสเซียม (mg/L)",
        data: Array(9).fill(data.potassium),
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        borderColor: "rgba(255, 0, 0, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  });
  

  return (
    <div className="m-4">
      {plantData && nutrienData && factorData && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="drop-shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">อายุ (วัน)</p>
              </CardHeader>
              <CardBody>
                <p className="text-center text-6xl font-bold">30</p>
              </CardBody>
            </Card>

            <Card className="drop-shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">อุณหภูมิ (°C)</p>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  {" "}
                  {/* ไม่มี gap */}
                  {/* ชุดข้อมูลที่ 1 */}
                  <div className="text-center">
                    <p className="text-2xl">ค่าที่วัดได้</p>
                    <p className="text-5xl font-bold ">{plantData.temperature}</p>
                  </div>
                  {/* ชุดข้อมูลที่ 2 */}
                  <div className="text-center">
                    <p className="text-2xl ">ค่ามาตรฐาน</p>
                    <p className="text-5xl font-bold">{factorData.temperature}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="drop-shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">ความชื้น (%)</p>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  {" "}
                  {/* ไม่มี gap */}
                  {/* ชุดข้อมูลที่ 1 */}
                  <div className="text-center">
                    <p className="text-2xl">ค่าที่วัดได้</p>
                    <p className="text-5xl font-bold ">{plantData.humidity}</p>
                  </div>
                  {/* ชุดข้อมูลที่ 2 */}
                  <div className="text-center">
                    <p className="text-2xl ">ค่ามาตรฐาน</p>
                    <p className="text-5xl font-bold">{factorData.humidity}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="drop-shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">ค่าความเป็นกรด-ด่าง (pH)</p>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  {" "}
                  {/* ไม่มี gap */}
                  {/* ชุดข้อมูลที่ 1 */}
                  <div className="text-center">
                    <p className="text-2xl">ค่าที่วัดได้</p>
                    <p className="text-5xl font-bold ">{plantData.pH}</p>
                  </div>
                  {/* ชุดข้อมูลที่ 2 */}
                  <div className="text-center">
                    <p className="text-2xl ">ค่ามาตรฐาน</p>
                    <p className="text-5xl font-bold">{factorData.pH}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="drop-shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">ค่าการนำไฟฟ้า (dS/m)</p>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  {" "}
                  {/* ไม่มี gap */}
                  {/* ชุดข้อมูลที่ 1 */}
                  <div className="text-center">
                    <p className="text-2xl">ค่าที่วัดได้</p>
                    <p className="text-5xl font-bold ">{plantData.salinity}</p>
                  </div>
                  {/* ชุดข้อมูลที่ 2 */}
                  <div className="text-center">
                    <p className="text-2xl ">ค่ามาตรฐาน</p>
                    <p className="text-5xl font-bold">{factorData.salinity}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="drop-shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">ไนโตรเจน (mg/L)</p>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  {" "}
                  {/* ไม่มี gap */}
                  {/* ชุดข้อมูลที่ 1 */}
                  <div className="text-center">
                    <p className="text-2xl">ค่าที่วัดได้</p>
                    <p className="text-5xl font-bold ">{plantData.nitrogen}</p>
                  </div>
                  {/* ชุดข้อมูลที่ 2 */}
                  <div className="text-center">
                    <p className="text-2xl ">ค่ามาตรฐาน</p>
                    <p className="text-5xl font-bold">{nutrienData.nitrogen}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="drop-shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">ฟอสฟอรัส (mg/L)</p>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  {" "}
                  {/* ไม่มี gap */}
                  {/* ชุดข้อมูลที่ 1 */}
                  <div className="text-center">
                    <p className="text-2xl">ค่าที่วัดได้</p>
                    <p className="text-5xl font-bold ">
                      {plantData.phosphorus}
                    </p>
                  </div>
                  {/* ชุดข้อมูลที่ 2 */}
                  <div className="text-center">
                    <p className="text-2xl">ค่ามาตรฐาน</p>
                    <p className="text-5xl font-bold"> {nutrienData.phosphorus}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="drop-shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">โพแทสเซียม (mg/L)</p>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  {" "}
                  {/* ไม่มี gap */}
                  {/* ชุดข้อมูลที่ 1 */}
                  <div className="text-center">
                    <p className="text-2xl">ค่าที่วัดได้</p>
                    <p className="text-5xl font-bold ">{plantData.potassium}</p>
                  </div>
                  {/* ชุดข้อมูลที่ 2 */}
                  <div className="text-center">
                    <p className="text-2xl ">ค่ามาตรฐาน</p>
                    <p className="text-5xl font-bold">{nutrienData.potassium}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card className="drop-shadow-xl hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex justify-center">
                <p className="text-gray-500">ค่าความเข้มแสง (lux)</p>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center items-center gap-12">
                  {" "}
                  {/* ไม่มี gap */}
                  {/* ชุดข้อมูลที่ 1 */}
                  <div className="text-center">
                    <p className="text-2xl">ค่าที่วัดได้</p>
                    <p className="text-5xl font-bold "> {plantData.lightIntensity}</p>
                  </div>
                  {/* ชุดข้อมูลที่ 2 */}
                  <div className="text-center">
                    <p className="text-2xl ">ค่ามาตรฐาน</p>
                    <p className="text-5xl font-bold">{factorData.lightIntensity}</p>
                  </div>
                </div>

                <Button onPress={() => {setSelectedId(item.id); onOpenGraph();}} variant="light" size='sm'>
                  <GoGraph  className="text-xl text-red-500 " />
                </Button>

              </CardBody>
            </Card>

            {isOpenGraph&& (
                <ModalGraph isOpen={isOpenGraph} onOpenChange={onOpenChangeGraph} id={selectedId} setRefresh={setRefresh} />
            )}

          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
              <CardHeader className="flex justify-center">
                อุณหภูมิ (°C)
              </CardHeader>
              <Line
                options={options}
                data={createChartData(plantData)}  // ส่ง plantData ทั้งหมดที่ได้มาจาก API
              />
            </Card>
            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
              <CardHeader className="flex justify-center">
                อุณหภูมิ (°C)
              </CardHeader>
              <Line
                options={options}
                data={createChartData([plantData.nitrogen, plantData.phosphorus, plantData.potassium])}  // ส่ง plantData ทั้งหมดที่ได้มาจาก API
              />
            </Card>
            {/* <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
              <CardHeader className="flex justify-center">
                ความชื้น (%)
              </CardHeader>
              <Line
                options={options}
                data={createChartData(
                  "ความชื้น",
                  plantData.humidity,
                  "rgba(0, 229, 255, 0.5)",
                  "rgba(0, 229, 255, 1)"
                )}
              />
            </Card>
            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
              <CardHeader className="flex justify-center">
                ค่าความเป็นกรด-ด่าง (pH)
              </CardHeader>
              <Line
                options={options}
                data={createChartData(
                  "ค่าความเป็นกรด-ด่าง",
                  plantData.pH,
                  "rgba(255, 131, 0, 0.5)",
                  "rgba(255, 131, 0, 1)"
                )}
              />
            </Card>
            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
              <CardHeader className="flex justify-center">
                ค่าการนำไฟฟ้า (dS/m)
              </CardHeader>
              <Line
                options={options}
                data={createChartData(
                  "ค่าการนำไฟฟ้า",
                  plantData.salinity,
                  "rgba(0, 0, 255, 0.5)",
                  "rgba(0, 0, 255, 1)"
                )}
              />
            </Card>
            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
              <CardHeader className="flex justify-center">
                ค่าความเข้มแสง (lux)
              </CardHeader>
              <Line
                options={options}
                data={createChartData(
                  "ค่าความเข้มแสง",
                  plantData.lightIntensity,
                  "rgba(255, 255, 0, 0.5)",
                  "rgba(255, 255, 0, 1)"
                )}
              />
            </Card> */}
            {/* <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
              <CardHeader className="flex justify-center">
                ไนโตรเจน (mg/L)
              </CardHeader>
              <Line
                options={options}
                data={createChartData(
                  "ไนโตรเจน",
                  plantData.nitrogen,
                  "rgba(150, 0, 255, 0.5)",
                  "rgba(150, 0, 255, 1)"
                )}
              />
            </Card>
            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
              <CardHeader className="flex justify-center">
                ฟอสฟอรัส (mg/L)
              </CardHeader>
              <Line
                options={options}
                data={createChartData(
                  "ฟอสฟอรัส",
                  plantData.phosphorus,
                  "rgba(0, 255, 0, 0.5)",
                  "rgba(0, 255, 0, 1)"
                )}
              />
            </Card>
            <Card className="px-4 pb-4 drop-shadow-xl hover:-translate-y-1">
              <CardHeader className="flex justify-center">
                โพแทสเซียม (mg/L)
              </CardHeader>
              <Line
                options={options}
                data={createChartData(
                  "โพแทสเซียม",
                  plantData.potassium,
                  "rgba(255, 0, 0, 0.5)",
                  "rgba(255, 0, 0, 1)"
                )}
              />
            </Card> */}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
