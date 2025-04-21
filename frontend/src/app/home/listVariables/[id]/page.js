"use client";

import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Select, SelectItem } from '@nextui-org/react';
import moment from "moment";
import 'moment/locale/th';
import { pdf } from '@react-pdf/renderer';
import PDFTempHumid from '@/app/components/PDFTempHumid';
import { FaFileExport } from 'react-icons/fa6';
import PDFVariables from '@/app/components/PDFVariables';

function ListVariables({ params }) {
    const { id } = params;
    
    const [plantName, setPlantName] = useState('');
    const [plantData, setPlantData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlant = async (plantId) => {
      try {
          const res = await fetch(
              `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlant/${plantId}`
          );
          if (res.status === 200) {
              const data = await res.json();
              setPlantName(data.resultData.plantname);
          }
      } catch (err) {
          console.error("Failed to fetch", err);
      } finally {
          setIsLoading(false);
      }
    };

    const fetchPlantVariables7day = async (plantId) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables7day/${plantId}`
            );
            if (res.status === 200) {
                const data = await res.json();
                setPlantData(data.resultData || []);
            }
        } catch (err) {
            console.error("Failed to fetch", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPlantVariables14day = async (plantId) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables14day/${plantId}`
          );
    
          if (res.status === 200) {
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
    
          if (res.status === 200) {
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
    
          if (res.status === 200) {
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
    
          if (res.status === 200) {
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
    
          if (res.status === 200) {
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
    
          if (res.status === 200) {
            const data = await res.json();
            setPlantData(data.resultData);
          }
        } catch (err) {
          console.error("Failed to fetch", err);
        }
      };

    useEffect(() => {
        fetchPlant(id);
        fetchPlantVariables7day(id);
    }, [id]);

    const convertDate = (dateConvert) => {
        if (!dateConvert) return "วันที่ไม่ระบุ";
        const date = moment(dateConvert).locale('th');
        const buddhistYearDate = date.format('D MMM') + ' ' + (date.year() + 543) + ' เวลา ' + date.format('LT');
        return buddhistYearDate;
    };

    const exportToPDF = async () => {
      const blob = await pdf(<PDFVariables plant={plantName} data={plantData} />).toBlob();
    
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'variables-report.pdf';
      link.click();
    };

    return (
        <Table
            aria-label="List Temperature & Humidity"
            topContent={
              <div className='flex justify-between items-center'>
                <p className='text-lg sm:text-xl md:text-2xl font-bold'>
                  {plantName}
                </p>

                <div className="hidden md:block">
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

                <div className="block md:hidden w-full px-4">
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

                <Button
                  onPress={exportToPDF}
                  color='primary'
                  disabled={isLoading || !plantData?.length}
                >
                  <FaFileExport className='size-4' />PDF
                </Button>
              </div>
            }
            className='p-4'
            isHeaderSticky
            isStriped
        >
            <TableHeader>
                <TableColumn key="date">วันที่</TableColumn>
                <TableColumn key="ph">ค่าความเป็นกรด-ด่าง (pH)</TableColumn>
                <TableColumn key="salinity">ค่าการนำไฟฟ้า (dS/m)</TableColumn>
                <TableColumn key="lightIntensity">ค่าความเข้มแสง (lux)</TableColumn>
            </TableHeader>
            <TableBody
                items={plantData || []}
                isLoading={isLoading}
                loadingContent={<div>กำลังโหลดข้อมูล...</div>}
                emptyContent={!isLoading ? "ไม่มีข้อมูล" : null}
            >
                {(item) => (
                    <TableRow key={item.id}>
                        <TableCell>{convertDate(item.receivedAt)}</TableCell>
                        <TableCell>{item.pH}</TableCell>
                        <TableCell>{item.salinity}</TableCell>
                        <TableCell>{item.lightIntensity}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export default ListVariables;