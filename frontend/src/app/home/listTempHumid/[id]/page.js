"use client";

import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import moment from "moment";
import 'moment/locale/th';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function ListTempHumid({ params }) {
    const { id } = params;
    
    const [plantData, setPlantData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlantVariables7day = async (plantId) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT}/getPlantVariables7day/${plantId}`
            );
            if (res.ok) {
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
            setPlantData(data.resultData);
          }
        } catch (err) {
          console.error("Failed to fetch", err);
        }
      };

    useEffect(() => {
        fetchPlantVariables7day(id);
    }, [id]);

    const convertDate = (dateConvert) => {
        if (!dateConvert) return "วันที่ไม่ระบุ";
        const date = moment(dateConvert).locale('th');
        const buddhistYearDate = date.format('D MMMM') + ' ' + (date.year() + 543);
        return buddhistYearDate;
    };

    const exportToPDF = async () => {
      try {
        const element = document.getElementById('content-to-export');
        
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('temperature-humidity-data.pdf');
        
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    };

    return (
        <Table
            aria-label="List Temperature"
            id='content-to-export'
            topContent={
              <div className='flex justify-between'>
                <ButtonGroup>
                    <Button onPress={() => fetchPlantVariables7day(id)} className="focus:bg-gray-400">7 วัน</Button>
                    <Button onPress={() => fetchPlantVariables14day(id)} className="focus:bg-gray-400">14 วัน</Button>
                    <Button onPress={() => fetchPlantVariables1month(id)} className="focus:bg-gray-400">1 เดือน</Button>
                    <Button onPress={() => fetchPlantVariables3month(id)} className="focus:bg-gray-400">3 เดือน</Button>
                    <Button onPress={() => fetchPlantVariables6month(id)} className="focus:bg-gray-400">6 เดือน</Button>
                    <Button onPress={() => fetchPlantVariables9month(id)} className="focus:bg-gray-400">9 เดือน</Button>
                    <Button onPress={() => fetchPlantVariables1year(id)} className="focus:bg-gray-400">1 ปี</Button>
                </ButtonGroup>
                <ButtonGroup>
                <Button 
                  onPress={exportToPDF}
                  isLoading={isLoading}
                  disabled={isLoading || !plantData?.length}
                >
                  {isLoading ? 'กำลังสร้าง PDF...' : 'PDF'}
                </Button>
                </ButtonGroup>
              </div>
            }
            className='p-4'
            isHeaderSticky
            isStriped
        >
            <TableHeader>
                <TableColumn key="date">วันที่</TableColumn>
                <TableColumn key="temperature">อุณหภูมิ (°C)</TableColumn>
                <TableColumn key="humidity">ความชื้น (%)</TableColumn>
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
                        <TableCell>{item.temperature}</TableCell>
                        <TableCell>{item.humidity}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export default ListTempHumid;