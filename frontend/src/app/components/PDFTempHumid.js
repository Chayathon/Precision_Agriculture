// components/PdfDocument.js
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
        width: '40%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        fontSize: 10,
        textAlign: 'left'
    },
    cellTempHumid: {
        width: '30%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        fontSize: 10,
        textAlign: 'center'
    },
});  

const PDFTempHumid = ({ data = [] }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>รายงานค่าอุณหภูมิและความชื้น</Text>
            <View style={styles.table}>
                {/* Header */}
                <View style={[styles.row, styles.header]}>
                    <Text style={styles.cellDate}>วันที่</Text>
                    <Text style={styles.cellTempHumid}>อุณหภูมิ (°C)</Text>
                    <Text style={styles.cellTempHumid}>ความชื้น (%)</Text>
                </View>

                {/* Data */}
                {data.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.cellDate}>{moment(item.receivedAt).locale('th').format('LL')}</Text>
                        <Text style={styles.cellTempHumid}>{item.temperature}</Text>
                        <Text style={styles.cellTempHumid}>{item.humidity}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default PDFTempHumid;