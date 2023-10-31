import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Typography } from '@mui/material';
import { Timeline, TimelineItem, timelineItemClasses, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent, timelineOppositeContentClasses } from '@mui/lab'
import { API } from '../util.jsx';


export default function ExhibitionPage({ loadDataUrl, name }) {
    const [data, setData] = useState([]);

    const colors = [
        { color: 'tomato', },
        { color: 'darkorange', },
        { color: 'goldenrod', },
        { color: 'green', },
        { color: 'dodgerblue', },
        { color: 'purple', },
        { color: 'amber', }]
    const fetchData = async () => {
        await axios.get(`${API}/${loadDataUrl}`).then((response) => {
            const dateFields = ['date'];
            const data = response.data.map(item => {
                dateFields.forEach(field => {
                    if (item[field]) {
                        const date = new Date(item[field]);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        item[field] = `${year}-${month}-${day}`;
                    }
                });
                return item;
            });
            const load = data.sort((a, b) => b.id - a.id);
            setData(load);
        }).catch((error) => {
            // setSeverity('error')
            console.error("Error fetching artworks:", error);
        });
    }
    useEffect(() => {
        fetchData();
    }, [name])

    return (
        <Grid container sx={{ mt: 4 }} >
            <Timeline
                sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.08,
                    },
                }}
            >
                {data.map((item, index) => (
                    <TimelineItem key={item.id}>
                        <TimelineOppositeContent sx={{ color: colors[index % colors.length].color, fontWeight: 600 }}>
                            {item.date}
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            {/* <TimelineDot color={colors[index % colors.length].color} /> */}
                            <TimelineDot sx={{ bgcolor: colors[index % colors.length].color }} />
                            <TimelineConnector sx={{ bgcolor: colors[index % colors.length].color }} />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Grid container>
                                <Typography variant="body1" component="span" sx={{ color: colors[index % colors.length].color, fontWeight: 600 }} >
                                    {item.subject}
                                </Typography>
                                {/* <Grid item xs={12} sx={{ color: colors[index % colors.length].color, fontWeight: 600 }}>
                                </Grid> */}
                                <Grid item xs={12}>
                                    {item.name}
                                </Grid>
                                <Grid item xs={12}>{item.email}</Grid>
                                <Grid item xs={12} sx={{ mt: 1 }}>
                                    <Typography variant="body2" component="span" >
                                        message
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ borderTop: `1px solid ${colors[index % colors.length].color}` }}>
                                    <Typography variant="body1" component="span" >
                                        {item.message}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </TimelineContent>
                    </TimelineItem>

                ))}
            </Timeline>
        </Grid >
    )
}
