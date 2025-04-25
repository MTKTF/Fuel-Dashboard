// Generates simulated fuel transaction data for 20 keyfobs over the past 52 weeks
function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `Keyfob ${i + 1}`);
    const fuelData = [];
    const today = new Date();
    let tankLevel = 22000; // Starting tank level (in liters)
    const maxTankCapacity = 47000; // Maximum tank capacity

    // Calculate the start date as 12 months ago
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 12);

    // Function to generate random weekdays over the last 12 months
    let currentDate = startDate;
    while (currentDate <= today) {
        const dayOfWeek = currentDate.getDay();

        // Only generate data for weekdays (Monday = 1, Friday = 5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // Capture the fuel level at 7 AM
            const morningTransaction = {
                keyfob_id: "N/A", // No transaction at 7 AM
                fuel_pumped: 0,
                distance_traveled: 0,
                timestamp: formatDateTime(currentDate, "07:00:00"),
                tank_level: tankLevel // Tank level at 7 AM
            };
            fuelData.push(morningTransaction);

            for (let transaction = 0; transaction < 20; transaction++) {
                const randomKeyfob = keyfobs[Math.floor(Math.random() * keyfobs.length)];
                const randomFuel = Math.floor(Math.random() * 200) + 50; // 50-250L
                const randomDistance = Math.floor(Math.random() * 100) + 20; // 20-120 miles

                // Decrease tank level after each transaction, but cap it at 0
                tankLevel = Math.max(0, tankLevel - randomFuel);

                // If the date is the 3rd of the month, refill the tank by 22000 liters but not exceeding the max capacity
                if (currentDate.getDate() === 3) {
                    tankLevel = Math.min(maxTankCapacity, tankLevel + 22000); // Refill on the 3rd, max tank is 47,000
                }

                fuelData.push({
                    keyfob_id: randomKeyfob,
                    fuel_pumped: randomFuel,
                    distance_traveled: randomDistance,
                    timestamp: formatDateTime(currentDate, getRandomTime()),
                    tank_level: tankLevel // Track tank level after transaction
                });
            }

            // Capture the fuel level at 7 PM
            const eveningTransaction = {
                keyfob_id: "N/A", // No transaction at 7 PM
                fuel_pumped: 0,
                distance_traveled: 0,
                timestamp: formatDateTime(currentDate, "19:00:00"),
                tank_level: tankLevel // Tank level at 7 PM
            };
            fuelData.push(eveningTransaction);
        }

        // Move to the next day
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return fuelData;
}

// Helper function to format the date and time correctly
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
