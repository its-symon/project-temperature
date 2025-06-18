import { Grid, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

const CurrentReadings = ({ latestCelsius, latestFahrenheit }) => {
    return (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
            <Grid container spacing={2} justifyContent="center" maxWidth="md">
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Celsius</Typography>
                            <Typography variant="h4">{latestCelsius}°C</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2, textAlign: 'center' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Fahrenheit</Typography>
                            <Typography variant="h4">{latestFahrenheit}°F</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CurrentReadings;
