// data.js
const CSC = [
  {
    pillarId: "enabling-infrastructure",
    pillarTitle: "Enabling Infrastructure",
    groups: [
      {
        groupId: "energy-system",
        groupTitle: "Energy System",
        items: [
          { id: "renewable-energy-generation", title: "Renewables" },
          { id: "transmission-network", title: "Transmission" },
          { id: "distribution-network", title: "Distribution" },
          { id: "energy-storage", title: "Storage" },
          { id: "hydrogen-network", title: "Hydrogen" },
          { id: "energy-system-orchestration", title: "Orchestration" },
        ],
      },
      {
        groupId: "transport-system",
        groupTitle: "Transport System",
        items: [
          { id: "port", title: "Port" },
          { id: "rail", title: "Rail" },
          { id: "road", title: "Road" },
        ],
      },
      {
        groupId: "water-waste",
        groupTitle: "Water System & Waste Management",
        items: [
          { id: "water-and-wastewater", title: "Water & Wastewater" },
          { id: "solid-waste-resource-recovery", title: "Solid waste" },
        ],
      },
      {
        groupId: "social-infrastructure",
        groupTitle: "Social Infrastructure",
        items: [
          { id: "housing", title: "Housing" },
          { id: "health", title: "Health" },
          { id: "education", title: "Education" },
        ],
      },
      {
        groupId: "communications-infrastructure",
        groupTitle: "Communications Infrastructure",
        items: [{ id: "digital-infrastructure", title: "Digital" }],
      },
    ],
  },

  {
    pillarId: "industry-capability-capacity",
    pillarTitle: "Industry Capability & Capacity",
    groups: [
      {
        groupId: "industry-decarbonisation",
        groupTitle: "Industry Decarbonisation",
        items: [{ id: "industry-decarbonisation-plans", title: "Decarb plans" }],
      },
      {
        groupId: "workforce-capacity",
        groupTitle: "Workforce Capacity to Deliver",
        items: [
          { id: "existing-workforce-capacity", title: "Existing capacity" },
          { id: "reskilling-upskilling", title: "Reskilling" },
        ],
      },
      {
        groupId: "innovation-knowledge",
        groupTitle: "Innovation & Knowledge Development",
        items: [
          { id: "innovation", title: "Innovation" },
          { id: "commercialisation", title: "Commercialisation" },
          { id: "knowledge-generation-sharing", title: "Knowledge sharing" },
        ],
      },
      {
        groupId: "collaboration-ecosystems",
        groupTitle: "Collaboration & Industrial Ecosystems",
        items: [
          { id: "industrial-symbiosis", title: "Symbiosis" },
          { id: "coordinated-infrastructure-plan", title: "Common user infra" },
          { id: "supply-chain-resilience", title: "Supply chains" },
          { id: "international-linkages", title: "International linkages" },
        ],
      },
    ],
  },

  {
    pillarId: "policy-governance",
    pillarTitle: "Policy & Governance",
    groups: [
      {
        groupId: "federal-policy",
        groupTitle: "Federal Policy",
        items: [
          { id: "federal-emissions-commitment", title: "Emissions commitment" },
          { id: "federal-skills-training", title: "Skills" },
          { id: "federal-approvals", title: "Approvals" },
          { id: "federal-investment-framework", title: "Investment framework" },
          { id: "federal-rd", title: "R&D" },
          { id: "federal-procurement", title: "Procurement" },
        ],
      },
      {
        groupId: "state-policy",
        groupTitle: "State Policy",
        items: [
          { id: "state-emissions-commitment", title: "Emissions commitment" },
          { id: "state-skills-training", title: "Skills" },
          { id: "state-approvals", title: "Approvals" },
          { id: "state-investment-framework", title: "Investment framework" },
          { id: "state-rd", title: "R&D" },
          { id: "state-procurement", title: "Procurement" },
        ],
      },
      {
        groupId: "local-government-policy",
        groupTitle: "Local Government Policy",
        items: [
          { id: "lga-decarbonisation-plans", title: "LGA decarb plans" },
          { id: "regional-adaptation-resilience", title: "Adaptation plan" },
        ],
      },
      {
        groupId: "governance",
        groupTitle: "Governance",
        items: [
          { id: "regional-coordination", title: "Coordination" },
          { id: "agency-representation", title: "Agency representation" },
          { id: "policy-alignment", title: "Policy alignment" },
        ],
      },
    ],
  },

  {
    pillarId: "social-acceptance",
    pillarTitle: "Social Acceptance",
    groups: [
      {
        groupId: "community-benefits-impacts",
        groupTitle: "Community Benefits & Impacts",
        items: [
          { id: "strategic-nature-positive-planning", title: "Land-use planning" },
          { id: "first-nations-benefit-sharing", title: "First Nations benefits" },
          { id: "wider-community-benefit-sharing", title: "Community benefits" },
                  ],
      },
      {
        groupId: "engagement-participation",
        groupTitle: "Engagement & Participation of Communities",
        items: [
          { id: "effective-first-nations-engagement", title: "First Nations engagement" },
          { id: "effective-community-engagement", title: "Community engagement" },
              ],
      },
    ],
  },

  {
    pillarId: "financing-transition",
    pillarTitle: "Financing the Transition",
    groups: [
      {
        groupId: "investment",
        groupTitle: "Investment",
        items: [
          { id: "public-finance-commitment", title: "Public finance" },
          { id: "attracting-private-investment", title: "Private investment" },
        ],
      },
      {
        groupId: "risk-resilience",
        groupTitle: "Risk & Resilience",
        items: [{ id: "risk-and-resilience", title: "Risk & resilience" }],
      },
    ],
  },
];

// Helper: find by item id
function findItemById(id) {
  for (const pillar of CSC) {
    for (const group of pillar.groups) {
      for (const item of group.items) {
        if (item.id === id) return { pillar, group, item };
      }
    }
  }
  return null;
}
