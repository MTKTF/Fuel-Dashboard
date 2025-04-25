function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `KEYFOB-${i + 1}`);
    const fuelData = [];
    const today = new Date();

    for (let week = 0; week < 52; week++) {
        for (let entry = 0; entry < 60; entry++) {
            const randomKeyfob = keyfobs[Math.floor(Math.random() * keyfobs.length)];
            const randomFuel = Math.floor(Math.random() * 200) + 50;
            const randomDistance = Math.floor(Math.random() * 100) + 20;
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

// Filter fuel transactions & update summary row
function filterFuelData(selectedKeyfob) {
    document.getElementById("selectedKeyfob").textContent = selectedKeyfob;
    const selectedMonth = document.getElementById("monthSelect").value;
    let filteredData = getDummyData().filter(entry => entry.keyfob_id === selectedKeyfob);

    if (selectedMonth !== "all") {
        filteredData = filteredData.filter(entry => new Date(entry.timestamp.split(" ")[0]).toLocaleString('default', { month: 'long' }) === selectedMonth);
    }

    filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    document.getElementById('fuel-log').innerHTML = filteredData.map(entry => {
        const [date, time] = entry.timestamp.split(" ");
        return `<tr><td>${date}</td><td>${time}</td><td>${entry.keyfob_id}</td><td>${entry.fuel_pumped} L</td><td>${entry.distance_traveled} miles</td></tr>`;
    }).join('');

    // Calculate Monthly MPG
    const totalFuel = filteredData.reduce((sum, entry) => sum + entry.fuel_pumped, 0);
    const totalMileage = filteredData.reduce((sum, entry) => sum + entry.distance_traveled, 0);
    const monthlyMPG = totalFuel > 0 ? (totalMileage / totalFuel).toFixed(2) : "N/A";

    document.getElementById("totalFuel").textContent = `${totalFuel} L`;
    document.getElementById("totalMileage").textContent = `${totalMileage} miles`;
    document.getElementById("monthlyMPG").textContent = `${monthlyMPG} MPG`;

    // Calculate MPG change percentage from the previous month
    let previousMPG = localStorage.getItem("previousMPG") || monthlyMPG;
    localStorage.setItem("previousMPG", monthlyMPG);

    let mpgChange = previousMPG > 0 ? (((monthlyMPG - previousMPG) / previousMPG) * 100).toFixed(2) : 0;
    let mpgChangeColor = mpgChange >= 0 ? "green" : "red";
    let mpgChangeIndicator = mpgChange >= 0 ? "⬆️" : "⬇️";

    document.getElementById("mpgChange").innerHTML = `(${mpgChange}% ${mpgChangeIndicator})`;
    document.getElementById("mpgChange").style.color = mpgChangeColor;
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
