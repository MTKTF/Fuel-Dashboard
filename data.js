function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `KEYFOB-${i + 1}`);
    const fuelData = [];
    const today = new Date();
    const monthlyConsumption = {};

    for (let week = 0; week < 52; week++) {
        for (let entry = 0; entry < 60; entry++) {
            const randomKeyfob = keyfobs[Math.floor(Math.random() * keyfobs.length)];
            const randomFuel = Math.floor(Math.random() * 200) + 50;
            const randomDistance = Math.floor(Math.random() * 100) + 20;
            const transactionDate = new Date(today);
            transactionDate.setDate(today.getDate() - (week * 5 + Math.floor(Math.random() * 5)));

            const monthYear = transactionDate.toLocaleString('default', { month: 'long', year: 'numeric' });

            // Track fuel consumption per month
            if (!monthlyConsumption[monthYear]) {
                monthlyConsumption[monthYear] = 0;
            }
            monthlyConsumption[monthYear] += randomFuel;

            fuelData.push({
                keyfob_id: randomKeyfob,
                fuel_pumped: randomFuel,
                distance_traveled: randomDistance,
                timestamp: transactionDate.toISOString().split('T')[0] + " " + transactionDate.toLocaleTimeString()
            });
        }
    }

    // Store monthly fuel consumption data
    localStorage.setItem("monthlyConsumption", JSON.stringify(monthlyConsumption));

    return fuelData;
}

// Populate month dropdown dynamically
function populateMonthDropdown() {
    const monthSelect = document.getElementById("monthSelect");
    const fuelData = getDummyData();
    const monthlyConsumption = JSON.parse(localStorage.getItem("monthlyConsumption")) || {};

    const months = [...new Set(fuelData.map(entry => {
        const date = new Date(entry.timestamp.split(" ")[0]);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }))];

    months.sort((a, b) => new Date(`1 ${a}`) - new Date(`1 ${b}`));

    let highestMonth = "";
    let highestFuel = 0;

    // Find the month with highest fuel consumption
    for (const [month, fuel] of Object.entries(monthlyConsumption)) {
        if (fuel > highestFuel) {
            highestFuel = fuel;
            highestMonth = month;
        }
    }

    months.forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        if (month === highestMonth) {
            option.style.color = "red"; // Highlight highest consumption month
        }
        monthSelect.appendChild(option);
    });

    // Preselect the current month
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    monthSelect.value = months.includes(currentMonth) ? currentMonth : months[months.length - 1];
}

// Ensure functionality runs on page load
window.onload = function () {
    populateMonthDropdown();
    populateKeyfobButtons();
    document.getElementById("monthSelect").addEventListener("change", function() {
        const selectedKeyfob = document.getElementById("selectedKeyfob").textContent;
        if (selectedKeyfob !== "Select a keyfob") filterFuelData(selectedKeyfob);
    });
};
