import React from 'react';
import { Font, StyleSheet, Document, Page, Text, View } from '@react-pdf/renderer';
import moment from "moment";
import 'moment/locale/th';

Font.register({
    family: 'Kanit',
    src: '/fonts/Kanit-Regular.ttf',
});

const styles = StyleSheet.create({
    page: { padding: 20, fontFamily: 'Kanit' },
  
    table: { display: "table", width: "100%", marginTop: 10 },
    row: { flexDirection: "row" },
  
    header: {
        backgroundColor: '#f0f0f0',
    },
  
    cellDate: {
        width: '20%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        fontSize: 10,
        textAlign: 'left'
    },
    cellVariables: {
        width: `${80 / 3}%`,
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        fontSize: 10,
        textAlign: 'center'
    },
});

const convertDate = (dateConvert) => {
    if (!dateConvert) return "วันที่ไม่ระบุ";
    const date = moment(dateConvert).locale('th');
    const buddhistYearDate = date.format('D MMM') + ' ' + (date.year() + 543) + ' เวลา ' + date.format('LT');
    return buddhistYearDate;
};

const PDFVariables = ({ plant, data = [], visibleColumns, columns }) => {
    // กรองคอลัมน์ที่เลือกจาก visibleColumns
    const selectedColumns = columns.filter((column) =>
        visibleColumns.has(column.uid)
    );

    // คำนวณความกว้างของคอลัมน์ตัวแปร (80% หารด้วยจำนวนคอลัมน์ที่เลือก)
    const variableCellWidth = selectedColumns.length > 0 ? `${80 / selectedColumns.length}%` : '30%';

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>รายงานค่าตัวแปรที่เกี่ยวข้องของ{plant}</Text>
                <View style={styles.table}>
                    {/* Header */}
                    <View style={[styles.row, styles.header]}>
                        <Text style={styles.cellDate}>วันที่</Text>
                        {selectedColumns.map((column) => (
                            <Text key={column.uid} style={[styles.cellVariables, { width: variableCellWidth }]}>
                                {column.name}
                            </Text>
                        ))}
                    </View>

                    {/* Data */}
                    {data.map((item, index) => (
                        <View key={index} style={styles.row}>
                            <Text style={styles.cellDate}>{convertDate(item.receivedAt)}</Text>
                            {selectedColumns.map((column) => (
                                <Text
                                    key={column.uid}
                                    style={[styles.cellVariables, { width: variableCellWidth }]}
                                >
                                    {item[column.uid] !== undefined ? item[column.uid] : '-'}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};

export default PDFVariables;