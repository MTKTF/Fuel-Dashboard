function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `KEYFOB-${i + 1}`);
    const fuelData = [];
    const today = new Date();
    let tankLevel = 47000; // Start at 47000 liters

    const totalWeeks = 52;
    const entriesPerWeek = 60;

    for (let week = 0; week < totalWeeks; week++) {
        for (let entry = 0; entry < entriesPerWeek; entry++) {
            const randomKeyfob = keyfobs[Math.floor(Math.random() * keyfobs.length)];
            const randomFuel = Math.floor(Math.random() * 200) + 50;
            const randomDistance = Math.floor(Math.random() * 100) + 20;
            const randomDayOffset = Math.floor(Math.random() * 5);

            const transactionDate = new Date(today);
            transactionDate.setDate(today.getDate() - (week * 5 + randomDayOffset));

            if (transactionDate.getDate() === 3) {
                tankLevel = Math.min(tankLevel + 20000, 27000);
            }

            tankLevel = Math.max(0, tankLevel - randomFuel);

            fuelData.push({
                keyfob_id: randomKeyfob,
                fuel_pumped: randomFuel,
                distance_traveled: randomDistance,
                tank_level: tankLevel,
                timestamp: transactionDate.toISOString().split('T')[0] + " " + transactionDate.toLocaleTimeString()
            });
        }
    }

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

window.onload = function () {
    populateMonthDropdown();
    populateKeyfobButtons();
};
