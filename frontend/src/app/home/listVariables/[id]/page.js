"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, ButtonGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Select, SelectItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Spinner } from '@nextui-org/react';
import moment from "moment";
import 'moment/locale/th';
import { pdf } from '@react-pdf/renderer';
import { FaFileExport } from 'react-icons/fa6';
import PDFVariables from '@/app/components/PDFVariables';

export const columns = [
  {name: "อุณหภูมิ (°C)", uid: "temperature"},
  {name: "ความชื้น (%)", uid: "humidity"},
  {name: "ไนโตรเจน (mg/kg)", uid: "nitrogen"},
  {name: "ฟอสฟอรัส (mg/kg)", uid: "phosphorus"},
  {name: "โพแทสเซียม (mg/kg)", uid: "potassium"},
  {name: "กรด-ด่าง (pH)", uid: "pH"},
  {name: "ค่าความเค็ม (µS/cm)", uid: "salinity"},
  {name: "ค่าแสง (lux)", uid: "lightIntensity"},
];

const INITIAL_VISIBLE_COLUMNS = ["nitrogen", "phosphorus", "potassium"];

function ListVariables({ params }) {
    const { id } = params;

    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    
    const [plantName, setPlantName] = useState('');
    const [plantData, setPlantData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const headerColumns = React.useMemo(() => {
      if (visibleColumns === "all") return columns;
  
      return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

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

    const renderCell = useCallback((item, columnKey) => {
      const cellValue = item[columnKey];
  
      switch (columnKey) {
        case "temperature":
        case "humidity":
        case "nitrogen":
        case "phosphorus":
        case "potassium":
        case "pH":
        case "salinity":
        case "lightIntensity":
          return cellValue !== undefined ? cellValue : "-";
        default:
          return cellValue;
      }
    }, []);

    const topContent = useMemo(() => {
      const exportToPDF = async () => {
        const timestamp = moment().format('YYYYMMDD_HHmmss');
        const filename = `variables-report_${timestamp}.pdf`;
        const blob = await pdf(
          <PDFVariables
            plant={plantName}
            data={plantData}
            visibleColumns={visibleColumns}
            columns={columns}
          />
        ).toBlob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      };

      return (
        <div className='flex justify-between items-center'>
          <p className='text-lg sm:text-xl md:text-2xl font-bold'>
            {plantName}
          </p>
  
          <div className="hidden lg:block">
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
  
          <div className="block lg:hidden w-full px-4">
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
  
          <div className='flex gap-2'>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat">
                  คอลัมน์
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid}>
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
    
            <Button
              onPress={exportToPDF}
              color='primary'
              disabled={isLoading || !plantData?.length}
            >
              <FaFileExport className='size-4' /> PDF
            </Button>
          </div>
        </div>
      );
    }, [visibleColumns, plantName, plantData, isLoading, id]);

    return (
        <Table
            aria-label="List Temperature & Humidity"
            topContent={topContent}
            className='p-4'
            isHeaderSticky
            isStriped
        >
            <TableHeader>
                <TableColumn key="date">วันที่</TableColumn>
                {headerColumns.map((column) => (
                  <TableColumn key={column.uid}>{column.name}</TableColumn>
                ))}
            </TableHeader>
            <TableBody
                items={plantData || []}
                isLoading={isLoading}
                loadingContent={<Spinner size="md" label="กำลังโหลดข้อมูล..." />}
                emptyContent={!isLoading ? "ไม่มีข้อมูล" : null}
            >
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "date" ? convertDate(item.receivedAt) : renderCell(item, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export default ListVariables;