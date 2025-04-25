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

function populateMonthDropdown() {
    const monthSelect = document.getElementById("monthSelect");
    const fuelData = getDummyData();

    // Extract unique months from transaction timestamps
    const months = [...new Set(fuelData.map(entry => {
        const date = new Date(entry.timestamp.split(" ")[0]);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }))];

    // Sort months in descending order (latest first)
    months.sort((a, b) => new Date(`1 ${b}`) - new Date(`1 ${a}`));

    // Populate dropdown with sorted months
    monthSelect.innerHTML = ""; // Clear existing options

    const showAllOption = document.createElement("option");
    showAllOption.value = "all";
    showAllOption.textContent = "Show All Months";
    monthSelect.appendChild(showAllOption);

    months.forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Preselect the current month
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    monthSelect.value = months.includes(currentMonth) ? currentMonth : months[0]; // Latest month first
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
