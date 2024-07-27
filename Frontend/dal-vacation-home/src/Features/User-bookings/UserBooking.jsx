import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card, CardContent, CardMedia, Typography, Box, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const getBookings = async (userId) => {
    const bookings = await axios.post('https://nsnt7wi5x9.execute-api.us-east-1.amazonaws.com/prod/bookingsList', 
        {
            userId
        }
    )
    const userBookingsList = JSON.parse(bookings.data.body)
    return userBookingsList;
    // const bookings = BOOKINGS.filter(item => item.userId === userId);
    // console.log(bookings);
    // console.log(JSON.parse(bookings.data.body));
    
    // return new Promise(res => setTimeout(() => res(bookings), 1000));
}

export default function UserBooking() {
    const [bookings, setBookings] = useState([]);
    const userId = Cookies.get("user_id");
    // const userId = "84b894d8-2091-70e2-69ff-6c0f39cd59c4";
    console.log(userId);
    
    const fetchUserBookings = async () => {
        const userBookings = await getBookings(userId);
        console.log(userBookings);
        if (userBookings.length > 0) {
            setBookings(userBookings);
        }
    }

    useEffect(() => {
        fetchUserBookings();
    }, []);

    console.log(bookings);
    return (
        <Container style={{ padding: '2rem 0' }}>
            <Typography variant="h4" gutterBottom>
                Your Bookings
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <Card key={booking.roomId} sx={{ maxWidth: 1000, marginBottom: 2, width: '100%', boxShadow: 3 }}>
                            <Link to={`/rooms/${booking.roomId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }}>
                                    <CardMedia
                                        component="img"
                                        image={booking.imageurl}
                                        alt={`Room ${booking.roomNumber}`}
                                        sx={{ width: { xs: '100%', sm: 300 }, height: { xs: 200, sm: 'auto' } }}
                                    />
                                    <CardContent sx={{ flex: 1 }}>
                                        <Typography variant="h6" gutterBottom>
                                            {booking.roomType === 'Rooms' ? 'Room' : 'Recreation Room'} {booking.roomNumber}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Booked from {booking.startDate} to {booking.endDate}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            {booking.bookingStatus.toUpperCase()}
                                        </Typography>
                                        <Typography variant="body1" color="textPrimary" paragraph>
                                            {booking.roomDescription}
                                        </Typography>
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            component={Link} 
                                            to={`/rooms/${booking.roomId}`}
                                            sx={{ marginTop: 2 }}
                                        >
                                            Add a Review
                                        </Button>
                                    </CardContent>
                                </Box>
                            </Link>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body1">
                        You have no bookings at the moment.
                    </Typography>
                )}
                <Button variant="contained" color="primary" sx={{ marginTop: 3 }} component={Link} to="/">
                    Book a New Room
                </Button>
            </Box>
        </Container>
    );
}