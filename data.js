function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `KEYFOB-${i + 1}`);
    const fuelData = [];
    const today = new Date();
    let tankLevel = 47000; // Start at 47,000 liters

    for (let i = 0; i < 500; i++) {  // Generate 500 random entries
        const randomKeyfob = keyfobs[Math.floor(Math.random() * keyfobs.length)];
        const randomFuel = Math.floor(Math.random() * 100) + 50; // 50 to 150 Liters per transaction

        const randomDate = new Date(today);
        randomDate.setDate(today.getDate() - Math.floor(Math.random() * 365)); // Past year data

        // Reduce tank level while ensuring it never goes negative
        tankLevel = Math.max(0, tankLevel - randomFuel);

        fuelData.push({
            keyfob_id: randomKeyfob,
            fuel_pumped: randomFuel,
            tank_level: tankLevel,
            timestamp: randomDate.toISOString().split('T')[0] + " " + randomDate.toLocaleTimeString()
        });
    }

    return fuelData;
}
