import React, { useEffect, useState, useRef } from 'react';
// import { Grid, Box, Switch, FormControlLabel, Skeleton } from '@mui/material';
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
                return `<span style="color:${this.point.color}">${this.point.name}</span><br/><b>${(this.point.y).toLocaleString('ko-KR')}</b>`;
            },
        },
    })
    useEffect(() => {
        const chartData = () => {
            if (Select === 'Genre') {
                return data.length > 0 ? data[0].amount.map(item => ({ name: item.period, y: item.totalPrice })) : [];
            } else if (Select === 'Period') {
                return data.length > 0 ? data.map(item => ({ name: item.period, y: item.totalPrice })) : [];
            }
        };
        setChartOptions({
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
                        return (this.point.y).toLocaleString('ko-KR');
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
        <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
        />
    );
};

