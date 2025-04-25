// Generates simulated fuel transaction data for 20 keyfobs over the past 52 weeks
function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `Keyfob ${i + 1}`);
    const fuelData = [];
    const today = new Date();
    const maxTankCapacity = 47000;
    let tankLevel = 22000; // Starting tank level (in liters)
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 12); // 12 months ago from today
    let currentDate = startDate;

    let transactionCount = 0;

    // Generate data for each day in the last 12 months
    while (currentDate <= today) {
        const dayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)

        // Generate data only for weekdays (Mon to Fri)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // 20 transactions for this weekday
            for (let transaction = 0; transaction < 20; transaction++) {
                const randomKeyfob = keyfobs[Math.floor(Math.random() * keyfobs.length)];
                const randomFuel = Math.floor(Math.random() * 200) + 50; // 50-250L
                const randomDistance = Math.floor(Math.random() * 100) + 20; // 20-120 miles

                // Decrease tank level by the amount of fuel pumped
                tankLevel = Math.max(0, tankLevel - randomFuel);

                // Refill tank if it's the 3rd of the month (by 22,000 liters)
                if (currentDate.getDate() === 3) {
                    tankLevel = Math.min(maxTankCapacity, tankLevel + 22000); // Refilling tank
                }

                // Add transaction to fuelData
                fuelData.push({
                    keyfob_id: randomKeyfob,
                    fuel_pumped: randomFuel,
                    distance_traveled: randomDistance,
                    timestamp: formatDateTime(currentDate, getRandomTime()),
                    tank_level: tankLevel
                });

                transactionCount++;
            }
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Ensure we generated exactly 5220 transactions
    if (transactionCount !== 5220) {
        console.error(`Expected 5220 transactions, but got ${transactionCount}.`);
    }

    return fuelData;
}

// Helper function to format the date and time correctly (YYYY-MM-DD HH:MM:SS)
function formatDateTime(date, time) {
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return `${formattedDate} ${time}`;
}

// Helper function to generate a random time for transactions (between 8 AM and 6 PM)
function getRandomTime() {
    const hour = Math.floor(Math.random() * 10) + 8; // Random hour between 8 AM and 6 PM
    const minute = Math.floor(Math.random() * 60); // Random minute
    return `${hour < 10 ? '0' : ''}${hour}:${minute < 10 ? '0' : ''}${minute}:00`;
}




// Filters data by keyfob and optionally by month, then updates the fuel transactions table
function filterFuelData(selectedKeyfob) {
    document.getElementById("selectedKeyfob").textContent = selectedKeyfob;
    const selectedMonth = document.getElementById("monthSelect").value;

    // Filter by keyfob
    let filteredData = getDummyData().filter(entry => entry.keyfob_id === selectedKeyfob);

    // Filter by month if selected
    if (selectedMonth !== "all") {
        filteredData = filteredData.filter(entry => {
            const entryMonth = new Date(entry.timestamp.split(" ")[0])
                .toLocaleString('default', { month: 'long', year: 'numeric' });
            return entryMonth === selectedMonth;
        });
    }

    // Sort newest to oldest
    filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Populate table
    document.getElementById('fuel-log').innerHTML = filteredData.map(entry => {
        const [date, time] = entry.timestamp.split(" ");
        return `<tr>
            <td>${date}</td>
            <td>${time}</td>
            <td>${entry.keyfob_id}</td>
            <td>${entry.fuel_pumped} L</td>
            <td>${entry.distance_traveled} miles</td>
        </tr>`;
    }).join('');

    // Totals and MPG calculation
    const totalFuel = filteredData.reduce((sum, entry) => sum + entry.fuel_pumped, 0);
    const totalMileage = filteredData.reduce((sum, entry) => sum + entry.distance_traveled, 0);
    const monthlyMPG = totalFuel > 0 ? +(totalMileage / totalFuel).toFixed(2) : 0;

    document.getElementById("totalFuel").textContent = `${totalFuel} L`;
    document.getElementById("totalMileage").textContent = `${totalMileage} miles`;
    document.getElementById("monthlyMPG").textContent = `${monthlyMPG} MPG`;

    // MPG comparison with previous
    const previousMPG = parseFloat(localStorage.getItem("previousMPG")) || 0;
    localStorage.setItem("previousMPG", monthlyMPG);

    const mpgChange = previousMPG > 0
        ? (((monthlyMPG - previousMPG) / previousMPG) * 100).toFixed(2)
        : 0;

    const mpgChangeColor = mpgChange >= 0 ? "green" : "red";

    // Show MPG change indicator
    const changeText = previousMPG > 0 ? `(${mpgChange}% from last)` : '';
    const mpgChangeElement = document.getElementById("mpgChange");
    mpgChangeElement.textContent = changeText;
    mpgChangeElement.style.color = mpgChangeColor;
}
