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
        width: '28%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        fontSize: 10,
        textAlign: 'left'
    },
    cellVariables: {
        width: '24%',
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

const PDFVariables = ({ plant, data = [] }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>รายงานค่าตัวแปรที่เกี่ยวข้องของ{plant}</Text>
            <View style={styles.table}>
                {/* Header */}
                <View style={[styles.row, styles.header]}>
                    <Text style={styles.cellDate}>วันที่</Text>
                    <Text style={styles.cellVariables}>ค่าความเป็นกรด-ด่าง (pH)</Text>
                    <Text style={styles.cellVariables}>ค่าการนำไฟฟ้า (dS/m)</Text>
                    <Text style={styles.cellVariables}>ค่าความเข้มแสง (lux)</Text>
                </View>

                {/* Data */}
                {data.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.cellDate}>{convertDate(item.receivedAt)}</Text>
                        <Text style={styles.cellVariables}>{item.pH}</Text>
                        <Text style={styles.cellVariables}>{item.salinity}</Text>
                        <Text style={styles.cellVariables}>{item.lightIntensity}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default PDFVariables;