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
        width: '34%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        fontSize: 10,
        textAlign: 'left'
    },
    cellNPK: {
        width: '22%',
        borderWidth: 1,
        borderColor: '#000',
        padding: 5,
        fontSize: 10,
        textAlign: 'center'
    },
});  

const PDFNutrients = ({ plant, data = [] }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>รายงานค่าสารอาหารของ{plant}</Text>
            <View style={styles.table}>
                {/* Header */}
                <View style={[styles.row, styles.header]}>
                    <Text style={styles.cellDate}>วันที่</Text>
                    <Text style={styles.cellNPK}>(N) ไนโตรเจน (mg/L)</Text>
                    <Text style={styles.cellNPK}>(P) ฟอสฟอรัส (mg/L)</Text>
                    <Text style={styles.cellNPK}>(K) โพแทสเซียม (mg/L)</Text>
                </View>

                {/* Data */}
                {data.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={styles.cellDate}>{moment(item.receivedAt).locale('th').format('LL')}</Text>
                        <Text style={styles.cellNPK}>{item.nitrogen}</Text>
                        <Text style={styles.cellNPK}>{item.phosphorus}</Text>
                        <Text style={styles.cellNPK}>{item.potassium}</Text>
                    </View>
                ))}
            </View>
        </Page>
    </Document>
);

export default PDFNutrients;