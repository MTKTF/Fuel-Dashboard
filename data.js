const dummyData = [
    { keyfob_id: 1, fuel_pumped: 20, tank_level: 46500, timestamp: "2025-04-18 10:00" },
    { keyfob_id: 2, fuel_pumped: 15, tank_level: 46485, timestamp: "2025-04-18 12:00" },
    { keyfob_id: 3, fuel_pumped: 30, tank_level: 46455, timestamp: "2025-04-19 14:00" },
    { keyfob_id: 1, fuel_pumped: 25, tank_level: 46430, timestamp: "2025-04-20 16:00" },
    { keyfob_id: 2, fuel_pumped: 18, tank_level: 46412, timestamp: "2025-04-21 09:00" }
];

function getDummyData() {
    return [
        { keyfob_id: "ABC123", fuel_pumped: 10, tank_level: 50, timestamp: "2025-04-01 12:00:00" },
        { keyfob_id: "DEF456", fuel_pumped: 15, tank_level: 40, timestamp: "2025-04-02 15:30:00" },
        { keyfob_id: "GHI789", fuel_pumped: 20, tank_level: 30, timestamp: "2025-04-03 18:45:00" }
    ];
}
