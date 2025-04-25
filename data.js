function getDummyData() {
    const keyfobs = Array.from({ length: 20 }, (_, i) => `KEYFOB-${i + 1}`);
    const fuelData = [];
    const today = new Date();

    for (let i = 0; i < 500; i++) {  // Generate 500 random entries
        const randomKeyfob = keyfobs[Math.floor(Math.random() * keyfobs.length)];
        const randomFuel = Math.floor(Math.random() * 50) + 10; // 10 to 60 Liters
        const randomTankLevel = Math.floor(Math.random() * 500) + 100; // 100 to 600 Liters

        const randomDate = new Date(today);
        randomDate.setDate(today.getDate() - Math.floor(Math.random() * 365)); // Past 1 year

        fuelData.push({
            keyfob_id: randomKeyfob,
            fuel_pumped: randomFuel,
            tank_level: randomTankLevel,
            timestamp: randomDate.toISOString().split('T')[0] + " " + randomDate.toLocaleTimeString()
        });
    }

    return fuelData;
}
