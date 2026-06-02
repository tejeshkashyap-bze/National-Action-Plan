// scores.js — Assessment scores per city, organised by round.
//
// Each city maps to an array of rounds (newest first). Each round has a
// human-readable date and a scores object: item IDs (from data.js) → 1–5.
// Omit an indicator to leave its box unscored.
//
// To add a new assessment round:
//   1. Prepend a new { date, scores } object to the city's array.
//   2. Add matching entries to the evidence-{citykey}.js file.

const SCORES = {

  "hunter-valley": [
    {
      date: "April 2025",
      scores: {
        "renewable-energy-generation":    3,
        "transmission-network":           2,
        "distribution-network":           2,
        "energy-storage":                 2,
        "hydrogen-network":               1,
        "industry-decarbonisation-plans": 2,
        "federal-emissions-commitment":   3,
        "federal-skills-training":        3,
        "federal-approvals":              3,
        "federal-investment-framework":   3,
        "federal-rd":                     4,
        "federal-procurement":            3,
        "state-emissions-commitment":     3,
        "state-skills-training":          4,
        "state-approvals":                3,
        "state-investment-framework":     3,
        "state-rd":                       3,
        "state-procurement":              3,
        "lga-decarbonisation-plans":      2,
      },
    },
  ],

  "gladstone": [
    {
      date: "September 2025",
      scores: {
        "renewable-energy-generation":    3,
        "transmission-network":           2,
        "distribution-network":           2,
        "energy-storage":                 3,
        "hydrogen-network":               2,
        "industry-decarbonisation-plans": 3,
        "federal-emissions-commitment":   2,
        "federal-skills-training":        3,
        "federal-approvals":              3,
        "federal-investment-framework":   3,
        "federal-rd":                     4,
        "federal-procurement":            3,
        "state-emissions-commitment":     3,
        "state-skills-training":          3,
        "state-approvals":                2,
        "state-investment-framework":     3,
        "state-rd":                       2,
        "state-procurement":              3,
        "lga-decarbonisation-plans":      4,
        "strategic-nature-positive-planning": 3,
      },
    },
  ],

};
