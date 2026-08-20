// scores.js — Assessment scores per city, organised by round.
//
// Each city maps to an array of rounds (newest first). Each round has a
// human-readable date and a scores object: item IDs (from data.js) → 1–5.
// Omit an indicator to leave its box unscored.

const SCORES = {
  "hunter-valley": [
    {
      "date": "April 2025",
      "scores": {
        "renewable-energy-generation": 3,
        "transmission-network": 2,
        "distribution-network": 2,
        "energy-storage": 2,
        "hydrogen-network": 1,
        "industry-decarbonisation-plans": 2,
        "federal-emissions-commitment": 3,
        "federal-skills-training": 3,
        "federal-approvals": 3,
        "federal-investment-framework": 3,
        "federal-rd": 4,
        "federal-procurement": 3,
        "state-emissions-commitment": 3,
        "state-skills-training": 4,
        "state-approvals": 3,
        "state-investment-framework": 3,
        "state-rd": 3,
        "state-procurement": 3,
        "lga-decarbonisation-plans": 2
      }
    }
  ],
  "gladstone": [
    {
      "date": "September 2025",
      "scores": {
        "renewable-energy-generation": 3,
        "transmission-network": 2,
        "distribution-network": 2,
        "energy-storage": 3,
        "hydrogen-network": 2,
        "industry-decarbonisation-plans": 3,
        "federal-emissions-commitment": 2,
        "federal-skills-training": 3,
        "federal-approvals": 3,
        "federal-investment-framework": 3,
        "federal-rd": 4,
        "federal-procurement": 3,
        "state-emissions-commitment": 3,
        "state-skills-training": 3,
        "state-approvals": 2,
        "state-investment-framework": 3,
        "state-rd": 2,
        "state-procurement": 3,
        "lga-decarbonisation-plans": 4,
        "strategic-nature-positive-planning": 3
      }
    }
  ],
  "port-hedland": [
    {
      "date": "August 2026",
      "scores": {
        "renewable-energy-generation": 2,
        "transmission-network": 2,
        "distribution-network": 2,
        "energy-storage": 1,
        "hydrogen-network": 2,
        "water-and-wastewater": 2,
        "housing": 2,
        "industry-decarbonisation-plans": 2,
        "federal-emissions-commitment": 3,
        "federal-skills-training": 3,
        "federal-approvals": 3,
        "federal-investment-framework": 3,
        "federal-rd": 4,
        "federal-procurement": 3,
        "state-emissions-commitment": 2,
        "state-skills-training": 3,
        "state-approvals": 4,
        "state-investment-framework": 3,
        "state-rd": 4,
        "state-procurement": 2,
        "lga-decarbonisation-plans": 3,
        "strategic-nature-positive-planning": 2,
        "wider-community-benefit-sharing": 1,
        "effective-community-engagement": 2
      }
    }
  ],
  "kwinana": [
    {
      "date": "August 2026",
      "scores": {
        "renewable-energy-generation": 2,
        "transmission-network": 2,
        "distribution-network": 2,
        "energy-storage": 3,
        "hydrogen-network": 2,
        "water-and-wastewater": 2,
        "housing": 2,
        "industry-decarbonisation-plans": 2,
        "federal-emissions-commitment": 3,
        "federal-skills-training": 3,
        "federal-approvals": 3,
        "federal-investment-framework": 3,
        "federal-rd": 4,
        "federal-procurement": 3,
        "state-emissions-commitment": 2,
        "state-skills-training": 3,
        "state-approvals": 4,
        "state-investment-framework": 3,
        "state-rd": 4,
        "state-procurement": 2,
        "lga-decarbonisation-plans": 2,
        "strategic-nature-positive-planning": 2,
        "wider-community-benefit-sharing": 3,
        "effective-community-engagement": 3
      }
    }
  ]
};
