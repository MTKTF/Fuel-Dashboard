// Generates simulated fuel transaction data for 20 keyfobs over the past 52 weeks
function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `Keyfob ${i + 1}`);
    const fuelData = [];
    const today = new Date();
    const maxTankCapacity = 47000;
    const refillAmount = 22000; // Refuel amount on the 3rd of each month
    let tankLevel = 23500; // Set to 50% of max capacity (23,500 liters)
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 12); // Start 12 months ago
    let currentDate = startDate;

    // Generate data for each day in the last 12 months
    while (currentDate <= today) {
        const dayOfWeek = currentDate.getDay(); // 0 (Sun) to 6 (Sat)

        // Generate data only for weekdays (Mon to Fri)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // Generate 20 transactions for this weekday
            for (let transaction = 0; transaction < 20; transaction++) {
                const keyfobIndex = Math.floor(Math.random() * 20); // Randomly select keyfob
                const randomFuel = Math.floor(Math.random() * 201) + 50; // Fuel pumped between 50-250 liters
                const randomDistance = Math.floor(Math.random() * 100) + 20; // Random distance between 20-120 miles

                // Decrease tank level by the amount of fuel pumped
                tankLevel = Math.max(0, tankLevel - randomFuel); // Ensure tank level doesn't go below 0

                // Refill the tank if it's the 3rd of the month (add 22,000 liters)
                if (currentDate.getDate() === 3) {
                    tankLevel = Math.min(maxTankCapacity, tankLevel + refillAmount); // Ensure tank doesn't exceed capacity
                }

                // Add transaction to fuelData
                fuelData.push({
                    keyfob_id: keyfobs[keyfobIndex], // Randomly assigned keyfob
                    fuel_pumped: randomFuel,
                    distance_traveled: randomDistance,
                    timestamp: formatDateTime(currentDate, getRandomTime(transaction)),
                    tank_level: tankLevel.toFixed(2) // Show tank level with 2 decimal places
                });
            }
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return fuelData;
}

// Helper function to format the timestamp as a string (date + time)
function formatDateTime(date, time) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day} ${time}`;
}

// Helper function to generate random time within the day
function getRandomTime(transactionIndex) {
    // Random time between 6:00 AM and 8:00 PM
    const baseHour = 6 + (transactionIndex % 14); // Spread transactions between 6 AM and 8 PM
    const minutes = Math.floor(Math.random() * 60);
    return `${String(baseHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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
