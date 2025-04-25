function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `KEYFOB-${i + 1}`);
    const fuelData = [];
    const today = new Date();
    let tankLevel = 47000; // Start at 47,000 liters

    const totalWeeks = 52;
    const entriesPerWeek = 60;

    for (let week = 0; week < totalWeeks; week++) {
        for (let entry = 0; entry < entriesPerWeek; entry++) {
            const randomKeyfob = keyfobs[Math.floor(Math.random() * keyfobs.length)];
            const randomFuel = Math.floor(Math.random() * 200) + 50; // 50 to 250 liters
            const randomDayOffset = Math.floor(Math.random() * 7); // Random day within the week

            const transactionDate = new Date(today);
            transactionDate.setDate(today.getDate() - (week * 7 + randomDayOffset));

            // Add monthly refuel on the 3rd, ensuring max tank level stays at 27,000 liters
            if (transactionDate.getDate() === 3) {
                tankLevel = Math.min(tankLevel + 20000, 27000);
            }

            // Reduce tank level (ensuring no negative values)
            tankLevel = Math.max(0, tankLevel - randomFuel);

            fuelData.push({
                keyfob_id: randomKeyfob,
                fuel_pumped: randomFuel,
                tank_level: tankLevel,
                timestamp: transactionDate.toISOString().split('T')[0] + " " + transactionDate.toLocaleTimeString()
            });
        }
    }

    return fuelData;
}
