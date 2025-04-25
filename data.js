function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `KEYFOB-${i + 1}`);
    const fuelData = [];
    const today = new Date();

    for (let week = 0; week < 52; week++) {
        for (let entry = 0; entry < 60; entry++) {
            const randomKeyfob = keyfobs[Math.floor(Math.random() * keyfobs.length)];
            const randomFuel = Math.floor(Math.random() * 200) + 50; // Ensure valid fuel values
            const randomDistance = Math.floor(Math.random() * 100) + 20; // Ensure valid mileage
            const transactionDate = new Date(today);
            transactionDate.setDate(today.getDate() - (week * 5 + Math.floor(Math.random() * 5)));

            fuelData.push({
                keyfob_id: randomKeyfob,
                fuel_pumped: randomFuel,
                distance_traveled: randomDistance,
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
    const months = [...new Set(fuelData.map(entry => new Date(entry.timestamp.split(" ")[0]).toLocaleString('default', { month: 'long' })))];

    months.sort((a, b) => new Date(`1 ${a} 2025`) - new Date(`1 ${b} 2025`));
    months.forEach(month => {
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    monthSelect.value = months[months.length - 1];
}

// Populate keyfob buttons dynamically
function populateKeyfobButtons() {
    const keyfobs = [...new Set(getDummyData().map(entry => entry.keyfob_id))];
    const buttonContainer = document.getElementById("keyfob-buttons");
    buttonContainer.innerHTML = "";

    keyfobs.forEach(keyfob => {
        const button = document.createElement("button");
        button.textContent = keyfob;
        button.onclick = () => filterFuelData(keyfob);
        buttonContainer.appendChild(button);
    });
}

// Filter fuel transactions & update summary row
function filterFuelData(selectedKeyfob) {
    document.getElementById("selectedKeyfob").textContent = selectedKeyfob;
    const selectedMonth = document.getElementById("monthSelect").value;
    let filteredData = getDummyData().filter(entry => entry.keyfob_id === selectedKeyfob);

    if (selectedMonth !== "all") {
        filteredData = filteredData.filter(entry => new Date(entry.timestamp.split(" ")[0]).toLocaleString('default', { month: 'long' }) === selectedMonth);
    }

    // Sort transactions by date (latest first)
    filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Debugging: Log filtered data
    console.log("Filtered Data:", filteredData);

    document.getElementById('fuel-log').innerHTML = filteredData.map(entry => {
        const [date, time] = entry.timestamp.split(" ");
        return `<tr><td>${date}</td><td>${time}</td><td>${entry.keyfob_id}</td><td>${entry.fuel_pumped} L</td><td>${entry.distance_traveled} miles</td></tr>`;
    }).join('');

    // Update summary row
    const totalFuel = filteredData.reduce((sum, entry) => sum + entry.fuel_pumped, 0);
    const totalMileage = filteredData.reduce((sum, entry) => sum + entry.distance_traveled, 0);
    document.getElementById("totalFuel").textContent = `${totalFuel} L`;
    document.getElementById("totalMileage").textContent = `${totalMileage} miles`;

    // Debugging: Check summary row values
    console.log("Total Fuel:", totalFuel, "Total Mileage:", totalMileage);
}

// Export to CSV
function exportToCSV() {
    const selectedKeyfob = document.getElementById("selectedKeyfob").textContent;
    const selectedMonth = document.getElementById("monthSelect").value;
    const filename = `Fuel_Transactions_${selectedKeyfob}_${selectedMonth}.csv`;
    let csvContent = "data:text/csv;charset=utf-8,Date,Time,Keyfob ID,Fuel Pumped (L),Mileage (Miles)\n";

    document.querySelectorAll("#fuel-log tr").forEach(row => {
        csvContent += Array.from(row.cells).map(cell => cell.textContent).join(",") + "\n";
    });

    csvContent += `Total,,${selectedKeyfob},${document.getElementById("totalFuel").textContent},${document.getElementById("totalMileage").textContent}\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
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
