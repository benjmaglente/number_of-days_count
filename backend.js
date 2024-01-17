const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/calculateDays', (req, res) => {
    const { state, checkInDate, checkOutDate } = req.body;
    const holidays = getHolidays(state);
    const result = countDays(new Date(checkInDate), new Date(checkOutDate), holidays);

    res.json(result);
});

function getHolidays(state) {
    // Modify this function to fetch holidays based on the selected state
    if (state === "Gold Coast") {
        return [new Date("2024-01-01"), new Date("2024-01-26"), new Date("2024-03-29"), new Date("2024-03-30"), new Date("2024-03-31"), new Date("2024-04-01"), new Date("2024-04-25"), new Date("2024-05-06"), new Date("2024-10-07"), new Date("2024-12-25"), new Date("2024-12-26")];
    } else if (state === "Victoria") {
        return [new Date("2024-01-01"), new Date("2024-01-26"),new Date("2024-03-11"), new Date("2024-03-29"), new Date("2024-03-30"), new Date("2024-03-31"), new Date("2024-04-01"), new Date("2024-04-25"), new Date("2024-06-10"), new Date("2024-09-27"), new Date("2024-11-05"), new Date("2024-12-25"), new Date("2024-12-26")];
    } else {
        return [];
    }
}

function countDays(checkIn, checkOut, holidays) {
    let currentDate = new Date(checkIn);
    let totalWeekdays = 0;
    let totalSaturdays = 0;
    let totalSundays = 0;
    let totalHolidays = 0;

    while (currentDate <= checkOut) {
        const dayOfWeek = currentDate.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // Weekday (Monday to Friday)
            totalWeekdays++;
        } else if (dayOfWeek === 6) {
            // Saturday
            totalSaturdays++;
        } else if (dayOfWeek === 0) {
            // Sunday
            totalSundays++;
        }

        // Check if the current date is a holiday
        const formattedCurrentDate = formatDate(currentDate);
        if (holidays.includes(formattedCurrentDate)) {
            totalHolidays++;
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
        totalWeekdays,
        totalSaturdays,
        totalSundays,
        totalHolidays,
        totalDays: calculateTotalDays(checkIn, checkOut)
    };
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function calculateTotalDays(checkIn, checkOut) {
    const millisecondsInOneDay = 24 * 60 * 60 * 1000;
    const diffInMilliseconds = Math.abs(checkOut - checkIn);
    return Math.round(diffInMilliseconds / millisecondsInOneDay) + 1; // Add 1 to include the check-in day
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
