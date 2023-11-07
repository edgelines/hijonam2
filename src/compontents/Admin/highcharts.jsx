import React, { useEffect, useState, useRef } from 'react';
import { Grid, Skeleton, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, } from '@mui/material';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
require('highcharts/modules/accessibility')(Highcharts)

export function Chart({ data, height, Select }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { type: 'column', height: height },
        title: { align: 'left', text: '', },
        credits: { text: "hijonam.com" },
        xAxis: { type: 'category' },
        yAxis: {
            title: { text: null },
            labels: {
                formatter: function () {
                    return (this.value).toLocaleString('ko-KR');
                },
            }

        },
        legend: { enabled: false },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return (this.point.y).toLocaleString('ko-KR');
                    },
                }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
            formatter: function () {
                // console.log(this.point);
                return `<span style="color:${this.point.color}">${this.point.name}</span><br/><b>${(this.point.y).toLocaleString('ko-KR')}</b>`;
            },
        },
    })
    useEffect(() => {
        const chartData = () => {
            if (Select === 'Genre') {
                return data.length > 0 ? data[0].amount.map(item => ({ name: item.period, y: item.totalPrice })) : [];
            } else if (Select === 'Period') {
                return data.length > 0 ? data.map(item => {
                    const periodSplit = item.period.split('-');
                    let color = '';
                    if (periodSplit.length === 2) {  // 월별 또는 분기별
                        if (periodSplit[1].startsWith('Q')) {  // 분기별
                            switch (periodSplit[1]) {
                                case 'Q1':
                                    color = '#1abc9c';
                                    break;
                                case 'Q2':
                                    color = 'dodgerblue';
                                    break;
                                case 'Q3':
                                    color = '#e74c3c';
                                    break;
                                case 'Q4':
                                    color = '#2c3e50';
                                    break;
                                default:
                                    break;
                            }
                        } else {  // 월별
                            color = 'dodgerblue';
                        }
                    } else {  // 년도별
                        const year = parseInt(periodSplit[0]);
                        const colorArray = ['#1abc9c', '#3498db', '#e74c3c', '#f39c12', '#8e44ad', '#2c3e50'];
                        color = colorArray[year % colorArray.length];  // 년도에 따라 6가지 색상 중 하나를 선택
                    }
                    return { name: item.period, y: item.totalPrice, color: color };  // 각 데이터 항목에 색상을 지정
                }) : [];
                // return data.length > 0 ? data.map(item => ({ name: item.period, y: item.totalPrice })) : [];
            }
        };
        // let colorsArray = [];
        // if (currentPage === '월별') {
        //     colorsArray = ['dodgerblue'];  // 모든 막대에 동일한 색상을 사용
        // } else if (currentPage === '분기별') {
        //     colorsArray = ['#1abc9c', '#3498db', '#e74c3c', '#f39c12'];  // 분기별로 4개의 색상을 회전
        // } else if (currentPage === '년도별') {
        //     colorsArray = ['#1abc9c', '#3498db', '#e74c3c', '#f39c12', '#8e44ad', '#2c3e50'];  // 연도별로 6개의 색상을 회전
        // }
        setChartOptions({
            // colors: colorsArray,  // 색상 배열 설정
            series: [
                {
                    name: 'Sales',
                    colorByPoint: true,
                    data: chartData()
                }
            ],
        })

    }, [data, Select]);
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    );
};

export function CombinationsChart({ data, height }) {
    const [chartOptions, setChartOptions] = useState({
        chart: { type: 'column', height: height },
        title: { align: 'left', text: '', },
        credits: { text: "hijonam.com" },
        xAxis: { type: 'category' },
        yAxis: {
            title: { text: null },
            labels: {
                formatter: function () {
                    return (this.value).toLocaleString('ko-KR');
                },
            }
        },
        legend: { enabled: true },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (this.point.y === 0) {
                            return ''
                        } else {
                            return (this.point.y).toLocaleString('ko-KR');
                        }
                    },
                }
            },
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>',
            formatter: function () {
                if (this.point.category) {
                    // Column Chart Tooltip
                    return `<span style="color:${this.point.color}">${this.point.series.name}</span><br/><b>${(this.point.y).toLocaleString('ko-KR')}</b>`;
                } else {
                    // Pie Chart Tooltip
                    return `<span style="color:${this.point.color}">${this.point.options.name}</span><br/><b>${(this.point.y).toLocaleString('ko-KR')}</b>`;
                }
            },
        },
    })
    useEffect(() => {
        setChartOptions({
            xAxis: { categories: data.categories },
            series: data.series,
        })

    }, [data]);
    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                    />
                </Grid>
            </Grid>
            {/* <Grid container>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>장르</TableCell>
                                <TableCell>판매액(원)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.series[data.series.length - 1].data.map((item) => (
                                <TableRow container key={item.name}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{(item.y).toLocaleString('ko-KR')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid> */}

        </>
    );
};

