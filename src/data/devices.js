// Devices data for the game

export const devices = [
  {
    id: 'smartphone',
    name: 'Smartphone',
    emoji: '📱',
    icon: 'Smartphone',
    age: '6 years',
    condition: 'Working but slow',
    battery: 'Damaged — swollen',
    data: 'Personal information detected',
    materials: ['Lithium', 'Copper', 'Gold traces', 'Rare Earth Elements'],
    additionalClue: 'Device becomes unusually warm while charging.',
    hazardLevel: 'MEDIUM',
    hazardColor: 'amber',
    recoveryValue: 'HIGH',
    repairability: 78,
    location: 'tech-district',
    description: 'An older generation smartphone. Battery is swollen which poses a fire risk. Contains recoverable rare earth materials.',
    decisions: {
      repair: {
        score: 80,
        ecoImpact: +12,
        resourceRecovery: +8,
        cityRisk: -4,
        feedback: 'Excellent decision! Repairing the battery and resetting the phone extends its life by 2-3 years, avoiding 70kg of CO₂ emissions from manufacturing a new device.',
        correct: true
      },
      reuse: {
        score: 60,
        ecoImpact: +8,
        resourceRecovery: +4,
        cityRisk: -2,
        feedback: 'Good thinking, but the swollen battery makes direct reuse unsafe. A battery replacement first would make this ideal.',
        correct: true
      },
      recycle: {
        score: 70,
        ecoImpact: +10,
        resourceRecovery: +12,
        cityRisk: -5,
        feedback: 'Correct choice. Sending to authorized recycling recovers lithium, copper, and rare earth elements safely.',
        correct: true
      },
      garbage: {
        score: 0,
        ecoImpact: -15,
        resourceRecovery: -10,
        cityRisk: +12,
        feedback: 'Wrong! Smartphones in regular garbage leak lithium and heavy metals into soil and water. The battery can also cause fires in garbage trucks.',
        correct: false
      }
    }
  },
  {
    id: 'laptop',
    name: 'Laptop',
    emoji: '💻',
    icon: 'Laptop',
    age: '8 years',
    condition: 'Screen cracked',
    battery: 'Degraded',
    data: 'Company files detected — SENSITIVE',
    materials: ['Aluminum', 'Copper', 'Steel', 'Lithium', 'PCB Components'],
    additionalClue: 'Storage drive shows repeated read errors during testing.',
    hazardLevel: 'MEDIUM',
    hazardColor: 'amber',
    recoveryValue: 'VERY HIGH',
    repairability: 65,
    location: 'tech-district',
    description: 'An 8-year-old business laptop with a cracked screen and degraded battery. Contains sensitive company data that must be wiped before any disposal.',
    decisions: {
      repair: {
        score: 90,
        ecoImpact: +14,
        resourceRecovery: +10,
        cityRisk: -6,
        feedback: 'Smart! Screen replacement and battery upgrade can give this laptop 3-4 more productive years. Always wipe data first.',
        correct: true
      },
      reuse: {
        score: 40,
        ecoImpact: +5,
        resourceRecovery: +2,
        cityRisk: +3,
        feedback: 'Data security concern! Company files were detected. Data must be securely erased before handing to another user.',
        correct: false
      },
      recycle: {
        score: 75,
        ecoImpact: +11,
        resourceRecovery: +15,
        cityRisk: -5,
        feedback: 'Good choice. But remember — data wipe is mandatory before recycling. Authorized e-waste centers handle this correctly.',
        correct: true
      },
      garbage: {
        score: 0,
        ecoImpact: -20,
        resourceRecovery: -15,
        cityRisk: +15,
        feedback: 'Terrible decision! Company data exposed, aluminum and copper lost forever, hazardous lead in landfill.',
        correct: false
      }
    }
  },
  {
    id: 'battery',
    name: 'Lithium Battery Pack',
    emoji: '🔋',
    icon: 'Battery',
    age: '4 years',
    condition: 'Swollen — HAZARDOUS',
    battery: 'IS the battery',
    data: 'N/A',
    materials: ['Lithium', 'Cobalt', 'Manganese', 'Nickel'],
    additionalClue: 'Casing displays slight outward bulging along seam.',
    hazardLevel: 'HIGH',
    hazardColor: 'red',
    recoveryValue: 'VERY HIGH',
    repairability: 20,
    location: 'tech-district',
    description: 'A lithium-ion battery pack, visibly swollen. Swollen batteries contain highly reactive chemicals and pose a serious fire and explosion risk.',
    decisions: {
      repair: {
        score: 10,
        ecoImpact: -2,
        resourceRecovery: 0,
        cityRisk: +5,
        feedback: 'Batteries cannot be repaired. This requires specialized handling and should go to a certified battery collection point.',
        correct: false
      },
      reuse: {
        score: 0,
        ecoImpact: -5,
        resourceRecovery: 0,
        cityRisk: +10,
        feedback: 'Dangerous! A swollen battery should never be reused. It poses a fire and explosion risk.',
        correct: false
      },
      recycle: {
        score: 100,
        ecoImpact: +15,
        resourceRecovery: +20,
        cityRisk: -8,
        feedback: 'Perfect! Swollen lithium batteries go directly to specialized battery recycling. Lithium, cobalt, and nickel are recovered safely. Never put in regular bins!',
        correct: true
      },
      garbage: {
        score: 0,
        ecoImpact: -25,
        resourceRecovery: -20,
        cityRisk: +20,
        feedback: 'Extremely dangerous! Lithium batteries in garbage can cause fires. This is also illegal in most regions. Cobalt and lithium contaminate groundwater.',
        correct: false
      }
    }
  },
  {
    id: 'charger',
    name: 'Old Charger',
    emoji: '🔌',
    icon: 'Zap',
    age: '5 years',
    condition: 'Cable frayed',
    battery: 'N/A',
    data: 'N/A',
    materials: ['Copper', 'Plastic', 'Tin', 'Small circuit board'],
    additionalClue: 'Charging becomes intermittent when cable flexes near connector.',
    hazardLevel: 'LOW',
    hazardColor: 'green',
    recoveryValue: 'MEDIUM',
    repairability: 85,
    location: 'tech-district',
    description: 'A frayed charger cable. The fraying poses an electrical hazard. Contains recoverable copper and should not go in regular trash.',
    decisions: {
      repair: {
        score: 90,
        ecoImpact: +8,
        resourceRecovery: +5,
        cityRisk: -3,
        feedback: 'Great choice! Cable repair or replacement is simple and extends the charger life by years. Much better than discarding.',
        correct: true
      },
      reuse: {
        score: 50,
        ecoImpact: +5,
        resourceRecovery: +2,
        cityRisk: +2,
        feedback: 'The frayed cable is a safety hazard for direct reuse. Repair first, then reuse — that would be the ideal path.',
        correct: false
      },
      recycle: {
        score: 70,
        ecoImpact: +7,
        resourceRecovery: +8,
        cityRisk: -3,
        feedback: 'Good. Copper recovery from cables is valuable. Authorized e-waste centers handle this. Better to repair first if possible.',
        correct: true
      },
      garbage: {
        score: 0,
        ecoImpact: -8,
        resourceRecovery: -8,
        cityRisk: +6,
        feedback: 'Wrong. Plastic from cables takes 400+ years to decompose. Copper is lost. Always recycle electronic accessories.',
        correct: false
      }
    }
  },
  {
    id: 'headphones',
    name: 'Wireless Headphones',
    emoji: '🎧',
    icon: 'Headphones',
    age: '3 years',
    condition: 'One ear broken',
    battery: 'Still functional',
    data: 'N/A',
    materials: ['Plastic', 'Copper', 'Lithium (small)', 'Magnets', 'Rare earth'],
    additionalClue: 'Left ear driver silent; right driver produces clear audio.',
    hazardLevel: 'LOW',
    hazardColor: 'green',
    recoveryValue: 'MEDIUM',
    repairability: 90,
    location: 'tech-district',
    description: 'Wireless headphones with only one broken driver. Highly repairable — replacement drivers are widely available.',
    decisions: {
      repair: {
        score: 100,
        ecoImpact: +10,
        resourceRecovery: +6,
        cityRisk: -4,
        feedback: 'Excellent! Headphones are among the most repairable consumer electronics. A single driver replacement costs a fraction of buying new.',
        correct: true
      },
      reuse: {
        score: 70,
        ecoImpact: +7,
        resourceRecovery: +3,
        cityRisk: -2,
        feedback: 'Good idea, but with one broken ear they are not fully functional for reuse. Repair first would make this perfect.',
        correct: true
      },
      recycle: {
        score: 55,
        ecoImpact: +6,
        resourceRecovery: +4,
        cityRisk: -2,
        feedback: 'Acceptable, but recycling should be the last resort here. This is highly repairable — repair extends life by years.',
        correct: true
      },
      garbage: {
        score: 0,
        ecoImpact: -10,
        resourceRecovery: -6,
        cityRisk: +7,
        feedback: 'Wrong. Plastics, rare earth magnets, and lithium all go to waste. Headphones are very repairable — this was avoidable.',
        correct: false
      }
    }
  },
  {
    id: 'printer',
    name: 'Inkjet Printer',
    emoji: '🖨️',
    icon: 'Printer',
    age: '10 years',
    condition: 'Non-functional',
    battery: 'N/A',
    data: 'Print history stored',
    materials: ['Plastic', 'Steel', 'Copper', 'Ink cartridge residue', 'Circuit board'],
    additionalClue: 'Paper feed mechanism repeatedly jams during testing.',
    hazardLevel: 'MEDIUM',
    hazardColor: 'amber',
    recoveryValue: 'HIGH',
    repairability: 30,
    location: 'tech-district',
    description: 'A decade-old inkjet printer that is no longer functional. Repair cost exceeds replacement cost. Contains hazardous ink and should be properly recycled.',
    decisions: {
      repair: {
        score: 30,
        ecoImpact: +2,
        resourceRecovery: 0,
        cityRisk: 0,
        feedback: 'At 10 years with full failure, repair cost exceeds value. Authorized recycling is more appropriate here.',
        correct: false
      },
      reuse: {
        score: 10,
        ecoImpact: +1,
        resourceRecovery: 0,
        cityRisk: +2,
        feedback: 'Non-functional. Cannot be reused as-is. Recycling is the right path for this old printer.',
        correct: false
      },
      recycle: {
        score: 100,
        ecoImpact: +12,
        resourceRecovery: +14,
        cityRisk: -6,
        feedback: 'Correct! Old printers go to specialized e-waste facilities. Steel, copper, and plastics are recovered. Ink residue is handled safely.',
        correct: true
      },
      garbage: {
        score: 0,
        ecoImpact: -18,
        resourceRecovery: -14,
        cityRisk: +14,
        feedback: 'Printer ink contains hazardous chemicals. In landfill, these leach into groundwater. Always recycle electronics through authorized channels.',
        correct: false
      }
    }
  }
];

export const repairLabDevices = [
  {
    id: 'repair-phone',
    name: 'Cracked Screen Phone',
    condition: 'Screen cracked, rest functional',
    repairability: 95,
    expectedLifespanRepair: '+3 years',
    repairCost: '$45',
    replacementCost: '$400+',
    ecoRepair: { ecoImpact: +12, resourceRecovery: +7, cityRisk: -5, score: 80 },
    ecoReplace: { ecoImpact: -18, resourceRecovery: -12, cityRisk: +10, score: 10 },
    repairFeedback: 'Screen replacement extends this phone\'s life by 3 years, saving 50kg of CO₂ equivalent emissions.',
    replaceFeedback: 'Manufacturing a new phone requires 70+ materials including rare earth elements. Repair was clearly the better choice.'
  },
  {
    id: 'repair-laptop',
    name: 'Slow Old Laptop',
    condition: 'Slow due to old HDD, rest functional',
    repairability: 88,
    expectedLifespanRepair: '+4 years',
    repairCost: '$60',
    replacementCost: '$700+',
    ecoRepair: { ecoImpact: +15, resourceRecovery: +9, cityRisk: -6, score: 90 },
    ecoReplace: { ecoImpact: -22, resourceRecovery: -15, cityRisk: +12, score: 10 },
    repairFeedback: 'An SSD upgrade transforms this laptop. 4 more productive years, no new manufacturing impact.',
    replaceFeedback: 'A laptop upgrade (RAM + SSD) costs a fraction of replacement and avoids enormous manufacturing waste.'
  },
  {
    id: 'repair-speaker',
    name: 'Bluetooth Speaker',
    condition: 'Battery dead, audio good',
    repairability: 80,
    expectedLifespanRepair: '+2 years',
    repairCost: '$20',
    replacementCost: '$80+',
    ecoRepair: { ecoImpact: +8, resourceRecovery: +5, cityRisk: -3, score: 75 },
    ecoReplace: { ecoImpact: -10, resourceRecovery: -6, cityRisk: +7, score: 15 },
    repairFeedback: 'Battery replacement is simple and cheap. This speaker has years left in it.',
    replaceFeedback: 'A $20 battery repair was all this needed. Replacing it generates unnecessary plastic and electronic waste.'
  }
];

export const sortingItems = [
  { id: 'sort-phone', name: 'Working Smartphone', category: 'reuse', icon: '📱' },
  { id: 'sort-battery', name: 'Li-ion Battery', category: 'special', icon: '🔋' },
  { id: 'sort-keyboard', name: 'Functioning Keyboard', category: 'reuse', icon: '⌨️' },
  { id: 'sort-mouse', name: 'Plastic Mouse (broken)', category: 'recycle', icon: '🖱️' },
  { id: 'sort-crt', name: 'CRT Monitor', category: 'special', icon: '🖥️' },
  { id: 'sort-laptop', name: 'Old Laptop (slow)', category: 'repair', icon: '💻' },
  { id: 'sort-charger', name: 'USB Charger', category: 'reuse', icon: '🔌' },
  { id: 'sort-headphones', name: 'Broken Headphones', category: 'repair', icon: '🎧' },
  { id: 'sort-tablet', name: 'Cracked Tablet', category: 'repair', icon: '📲' },
  { id: 'sort-printer', name: 'Old Printer', category: 'recycle', icon: '🖨️' },
];
