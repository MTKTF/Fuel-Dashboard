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

    const months = [...new Set(fuelData.map(entry => {
        const date = new Date(entry.timestamp.split(" ")[0]);
        return date.toLocaleString('default', { month: 'long' });
    }))];

    const monthOrder = {
        "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
        "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12
    };

    months.sort((a, b) => monthOrder[a] - monthOrder[b]);

    months.forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    monthSelect.value = months[months.length - 1]; // Preselect latest month
}

// Populate keyfob buttons dynamically
function populateKeyfobButtons() {
    const keyfobs = [...new Set(getDummyData().map(entry => entry.keyfob_id))];

    keyfobs.sort((a, b) => {
        const numA = parseInt(a.replace(/[^0-9]/g, ""), 10);
        const numB = parseInt(b.replace(/[^0-9]/g, ""), 10);
        return numA - numB;
    });

    const buttonContainer = document.getElementById("keyfob-buttons");
    buttonContainer.innerHTML = ""; // Clear any previous buttons

    keyfobs.forEach(keyfob => {
        const button = document.createElement("button");
        button.textContent = keyfob;
        button.onclick = () => filterFuelData(keyfob);
        buttonContainer.appendChild(button);
    });
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
