// Educational content for Learn section

export const learnTopics = [
  {
    id: 'what-is-ewaste',
    title: 'What is E-Waste?',
    icon: '📱',
    color: 'blue',
    summary: 'Electronic waste is any discarded device with a plug, battery, or circuit.',
    content: [
      {
        heading: 'The Definition',
        text: 'E-waste (electronic waste) refers to any discarded electrical or electronic device — from smartphones to refrigerators, from batteries to printers. If it has a plug, a battery, or a circuit board and you no longer want it, it is e-waste.'
      },
      {
        heading: 'The Scale',
        text: 'The world generated 53.6 million metric tonnes of e-waste in 2019 alone — and less than 20% was formally collected and recycled. That\'s roughly 7.3 kg of discarded electronics for every person on Earth.'
      },
      {
        heading: 'Why It\'s Growing',
        text: 'Faster product cycles, cheaper devices, and limited repairability mean electronics are replaced more often. Many devices are designed without considering end-of-life — making them harder to repair, refurbish, or recycle.'
      },
      {
        heading: 'Common Sources',
        text: 'Smartphones, laptops, tablets, chargers, batteries, printers, TVs, gaming consoles, kitchen appliances, and office equipment are the most common contributors to global e-waste.'
      }
    ],
    quickFacts: [
      '53.6 Mt of e-waste generated annually worldwide',
      'Only 17.4% is formally collected and recycled',
      'E-waste is the fastest growing waste stream globally',
      'Over 1000 substances — some hazardous — are found in electronics'
    ]
  },
  {
    id: 'why-dangerous',
    title: 'Why is E-Waste Dangerous?',
    icon: '⚠️',
    color: 'red',
    summary: 'Electronics contain hazardous materials that harm humans and the environment.',
    content: [
      {
        heading: 'Hazardous Materials',
        text: 'Electronics contain lead, mercury, cadmium, arsenic, brominated flame retardants, and other toxic substances. When improperly disposed of, these leach into soil and groundwater, contaminating drinking water and food chains.'
      },
      {
        heading: 'Open Burning',
        text: 'Informal recycling often involves burning cables to recover copper. This releases dioxins and furans — highly toxic compounds — into the air. Communities near informal recycling sites face serious long-term health risks.'
      },
      {
        heading: 'Data Security',
        text: 'Discarded devices that haven\'t been properly wiped can expose personal photos, banking details, business data, and passwords. Data recovery from "broken" devices is easier than most people think.'
      },
      {
        heading: 'Battery Hazards',
        text: 'Lithium-ion batteries in landfill can cause underground fires that burn for years. Swollen or damaged batteries can explode or catch fire — even inside garbage collection vehicles.'
      }
    ],
    quickFacts: [
      'Lead damages the nervous system and brain development',
      'Mercury affects kidneys and the nervous system',
      'Cadmium is a known carcinogen',
      'Swollen Li-ion batteries can spontaneously catch fire'
    ]
  },
  {
    id: 'what-can-be-repaired',
    title: 'What Can Be Repaired?',
    icon: '🔧',
    color: 'green',
    summary: 'Most devices can be repaired — extending life and reducing waste.',
    content: [
      {
        heading: 'The Repair Priority',
        text: 'Repair is always the first option to consider before recycling or disposing of an electronic device. Extending a device\'s life by just 2 years can reduce its total carbon footprint by up to 50%.'
      },
      {
        heading: 'Commonly Repairable Devices',
        text: 'Smartphones (screens, batteries), laptops (keyboards, RAM, storage, batteries, screens), headphones (cables, drivers), speakers (batteries), and printers (rollers, heads) are all regularly repairable at reasonable cost.'
      },
      {
        heading: 'Finding Repair Options',
        text: 'Look for authorized service centers, local repair shops, or community repair cafes. Many cities now have "Right to Repair" initiatives. Online repair guides (like iFixit) provide step-by-step instructions for many devices.'
      },
      {
        heading: 'When NOT to Repair',
        text: 'If the repair cost exceeds 70% of the replacement cost, or if the device is more than 10 years old with full failure, recycling through authorized channels may be more appropriate.'
      }
    ],
    quickFacts: [
      'Replacing a phone battery costs $30-70 vs $400+ for a new phone',
      'Screen replacement extends phone life by 2-3 years on average',
      'An SSD upgrade can make a 7-year-old laptop work like new',
      'Many repair shops offer warranties on repaired devices'
    ]
  },
  {
    id: 'what-can-be-reused',
    title: 'What Can Be Reused?',
    icon: '🔄',
    color: 'green',
    summary: 'Working devices can find new life through donation or resale.',
    content: [
      {
        heading: 'Reuse Before Recycling',
        text: 'If a device is functional, it is better to find a new user than to recycle it. Reuse preserves the embedded energy and materials in the device — much more efficient than breaking it down for materials.'
      },
      {
        heading: 'Donation Options',
        text: 'Schools, libraries, community centers, NGOs, and refurbishment programs accept working electronics. A working 5-year-old laptop might be ideal for a student who otherwise cannot afford one.'
      },
      {
        heading: 'Data Must Come First',
        text: 'Before donating or selling any device, always perform a factory reset and verify data erasure. For business devices, use certified data destruction software. Simply deleting files is not sufficient.'
      },
      {
        heading: 'Condition Matters',
        text: 'Devices suitable for reuse should be fully functional, with working batteries, screens, and charging ports. Devices with safety issues (swollen batteries, cracked screens exposing electronics) need repair first.'
      }
    ],
    quickFacts: [
      'A donated working laptop can last 3-5 more productive years',
      'Reuse avoids all manufacturing impacts of a replacement',
      'Always erase data before donating — factory reset alone is often not enough',
      'Many telecom companies have trade-in or donation programs'
    ]
  },
  {
    id: 'battery-handling',
    title: 'How Should Batteries Be Handled?',
    icon: '🔋',
    color: 'amber',
    summary: 'Batteries require special care — they are both valuable and hazardous.',
    content: [
      {
        heading: 'Never in Regular Trash',
        text: 'Batteries — whether AA, AAA, lithium-ion, or lead-acid — should never go in household garbage. They contain reactive chemicals that can start fires in garbage trucks and landfills, and leak toxic heavy metals into soil.'
      },
      {
        heading: 'Battery Collection Points',
        text: 'Most supermarkets, electronics stores, and municipalities have battery collection bins. Many device manufacturers and retailers are legally required to accept old batteries. Look for the crossed-out bin symbol on the battery.'
      },
      {
        heading: 'Swollen Batteries',
        text: 'A swollen or puffy battery indicates a chemical reaction inside that produces gas. This is dangerous. Do not compress, puncture, or charge a swollen battery. Take it directly to a hazardous waste collection point.'
      },
      {
        heading: 'Value Recovery',
        text: 'Lithium-ion batteries contain cobalt, lithium, nickel, and manganese — valuable materials used in electric vehicles and energy storage. Proper recycling recovers these materials, reducing the need for new mining.'
      }
    ],
    quickFacts: [
      'Never throw lithium batteries in household garbage — they can cause fires',
      'Cobalt recovered from batteries reduces need for new mining',
      'The crossed-out bin symbol means "do not put in regular garbage"',
      'Li-ion battery recycling rate is only about 5% globally'
    ]
  },
  {
    id: 'data-erasure',
    title: 'Why Data Erasure Matters?',
    icon: '🛡️',
    color: 'purple',
    summary: 'Your data can survive "deleted" files and even factory resets.',
    content: [
      {
        heading: 'The Real Risk',
        text: 'When you delete files or do a basic factory reset, the data is not truly gone — only the file index is removed. The actual data remains on the storage until it is overwritten. Anyone with basic recovery tools can retrieve it.'
      },
      {
        heading: 'What Should Be Erased',
        text: 'Before disposing of any device: contacts, messages, banking apps, passwords stored in browsers, personal photos, work documents, and app data — all of these can contain sensitive information.'
      },
      {
        heading: 'How to Properly Erase',
        text: 'For smartphones: use the "Erase all data" option with encryption enabled first. For laptops: use certified software like DBAN (Darik\'s Boot and Nuke) or drive encryption before reset. For SSDs: use manufacturer\'s secure erase tools.'
      },
      {
        heading: 'Physical Destruction Is NOT Enough',
        text: 'Simply breaking a screen, bending a device, or hitting it with a hammer does not destroy data. Professional data recovery can retrieve data from physically damaged drives unless the platters are fully destroyed or the chips are melted.'
      }
    ],
    quickFacts: [
      'A factory reset alone does NOT permanently delete your data',
      'Data recovery from "deleted" drives is a professional service',
      'Enable full-disk encryption before a factory reset for best protection',
      'Authorized e-waste centers include data destruction as standard practice'
    ]
  },
  {
    id: 'responsible-recycling',
    title: 'What Is Responsible Recycling?',
    icon: '♻️',
    color: 'green',
    summary: 'Not all recycling is equal — authorized channels make all the difference.',
    content: [
      {
        heading: 'Authorized vs. Informal',
        text: 'Authorized e-waste recyclers are certified facilities that follow safety standards for workers, use proper equipment to handle hazardous materials, and track material flows. Informal "recyclers" often use dangerous methods that harm both workers and the environment.'
      },
      {
        heading: 'What Happens at a Certified Center',
        text: 'Devices are sorted, disassembled by hand using proper protective equipment, components are separated (metals, plastics, glass, PCBs), hazardous materials like batteries and mercury lamps are handled specially, and recoverable materials are sent to smelters or manufacturers.'
      },
      {
        heading: 'The R Hierarchy',
        text: 'Follow this order: Refuse (buy less) → Reduce (use longer) → Repair → Reuse → Recycle → Responsible disposal. Recycling is the last resort before disposal, not the first response to an unwanted device.'
      },
      {
        heading: 'Finding Certified Recyclers',
        text: 'Look for certification marks like e-Stewards or R2 (Responsible Recycling) when choosing a recycler. Many manufacturers have take-back programs. In India, look for authorized e-waste collection centers registered under the E-Waste Management Rules.'
      }
    ],
    quickFacts: [
      'Certified recyclers must meet health and environmental standards',
      'Gold, silver, palladium, and copper are all recovered from electronics',
      '1 tonne of smartphones contains 300g of gold — vs 5g per tonne of ore',
      'E-Stewards and R2 are the two main certifications for responsible recyclers'
    ]
  }
];

export const realWorldActions = [
  {
    icon: '🔧',
    action: 'Repair Before Replacing',
    detail: 'Get a cracked screen fixed, replace a battery, upgrade RAM. These cost a fraction of a new device.'
  },
  {
    icon: '🤝',
    action: 'Donate Working Electronics',
    detail: 'Schools, libraries, and NGOs accept working laptops and phones. Always erase your data first.'
  },
  {
    icon: '🔋',
    action: 'Separate Batteries',
    detail: 'Never put batteries in household trash. Use battery collection bins at supermarkets and electronics stores.'
  },
  {
    icon: '🛡️',
    action: 'Erase Personal Data',
    detail: 'Use certified erasure methods before giving away or recycling any device. A factory reset is not enough.'
  },
  {
    icon: '♻️',
    action: 'Use Authorized E-Waste Channels',
    detail: 'Find certified e-waste collection drives, manufacturer take-back programs, or R2/e-Stewards certified recyclers.'
  },
  {
    icon: '🚫',
    action: 'Never Burn Electronic Waste',
    detail: 'Burning releases highly toxic chemicals including dioxins. It is illegal and seriously harmful to health.'
  },
  {
    icon: '📦',
    action: 'Buy Less, Choose Durable',
    detail: 'The most sustainable device is the one you already have. Choose repairable, long-lasting products.'
  },
  {
    icon: '🏪',
    action: 'Use Take-Back Programs',
    detail: 'Many retailers and manufacturers offer trade-in or take-back programs — ensuring proper handling.'
  }
];
