// learn-data.js — Editable library of indicator detail pages.
//
// Each key matches an item.id from data.js.
// Set a key to null (or omit it) to show the "content coming soon" placeholder.
//
// Structure for a fully-populated entry:
// {
//   purpose:        string   — one or two sentences describing the assessment goal
//   frameworkIntro: string   — intro sentence before the bullet list (optional)
//   frameworkItems: string[] — bullet items (may contain inline HTML such as <b>)
//   dataSources:    string[] — bullet items
//   scoringProcess: { label: string, desc: string }[]
//   weightingTable: { dimension: string, weight: number, scores: string[5] }[]
//   scoringDescriptions: { score: number, label: string, characteristics: string[] }[]
// }

const LEARN_DATA = {

  // ─── Pillar 1: Enabling Infrastructure ───────────────────────────────────────

  "renewable-energy-generation": {
      purpose: "To evaluate the readiness of renewable energy (RE) generation to meet the demand from clean industry and green exports by 2035. The assessment compares the regional renewable energy project pipeline against a grid approaching zero operational emissions, powered by nearly 100% renewable energy by 2035, consistent with the Green Energy Exports scenario in AEMO's Integrated System Plan.",

      frameworkIntro: "The assessment framework evaluates the energy system based on the following key dimensions:",
      frameworkItems: [
        "<b>Current Renewable Energy Share</b> – Percentage of electricity generation from renewables over the past 12 months.",
        "<b>Renewable Energy Pipeline Status</b> – Overall Pipeline: MW capacity of RE projects in operation, approved, or in design/planning relative to required capacity to meet forecast demand under a clean industry/green export scenario by 2035.",
        "<b>Approved Pipeline</b> – Percentage of required renewable energy projects (measured by capacity) that have secured planning approval.",
        "<b>Pipeline Progression</b> – Percentage of required renewable energy capacity that is in construction or operating.",
        "<b>Timing & Delivery Risk</b> – Feasibility of delivering the required renewable energy capacity on schedule, based on an assessment of current project approvals, lead times, and delivery timelines, as well as major bottlenecks and historical delays.",
      ],

      dataSources: [
        "OpenNEM for real-time renewable generation data (Renewable energy current generation status)",
        "AEMO ISP Generation & Storage Outlook",
        "Clean Energy Regulator (CER) data",
        "RenewMap for project pipeline progress data to track against the ISP data (a proprietary catalogue of Australia's energy projects)",
        "BRC-A's State of the Australian Corporate PPA Market Report",
        "AEMO's NEM Generation Information datasets",
        "Distribution Network Service Provider (DNSP) and Transmission Network Service Provider (TNSP) data for current electricity demand",
        "Forecasted energy demand under AEMO ISP Step Change and Green Energy Exports scenarios",
        "Regional energy demand modelling, e.g. BZE's REIP Briefing Papers",
      ],

      scoringProcess: [
        { label: "Current RE Share Assessment", desc: "Assess the current share of renewable energy generation using OpenNEM for the state the region is located in over the past 12 months." },
        { label: "Pipeline Analysis", desc: "Compare operational projects and current pipeline against a scenario aligned to the target of near 100% renewable generation by 2035 (Green Energy Exports). Define geographic scope (ISP REZs), analyse project pipeline using RenewMap, benchmark progress against 2035–36 requirements, and sense-check against electricity demand from large energy users." },
        { label: "Delay Assessment", desc: "Assess sources of delay by reviewing the historical incidence of project delays using AEMO's Generation Information database. Identify systematic constraints including development approval timelines, federal environmental approvals, community opposition, financing delays, government opposition, grid connection issues, workforce shortages, supply chain disruptions, and regulatory changes." },
        { label: "Score Calculation", desc: "Assign a weighted score based on the overall assessment across the evaluation dimensions." },
        { label: "Stakeholder Insights and Review", desc: "Validate findings through industry expert consultations and energy market assessments. Where relevant, integrate stakeholder insights to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Current Renewable Energy Share",
          weight: 0.1,
          scores: [
            "<10% of state's current electricity consumption",
            "≥10% to <30% of state's current electricity consumption",
            "≥30% to <55% of state's current electricity consumption",
            "≥55 to <90% of state's current electricity consumption",
            "≥90% of state's current electricity consumption",
          ],
        },
        {
          dimension: "Overall Pipeline",
          weight: 0.3,
          scores: [
            "<25% of 2035 green energy exports requirements",
            "≥25% to <50% of 2035 green energy exports requirements",
            "≥50% to <75% of 2035 green energy exports requirements",
            "≥75% to <100% of 2035 green energy exports requirements",
            "≥100% of 2035 green energy exports requirements",
          ],
        },
        {
          dimension: "Approved Pipeline",
          weight: 0.2,
          scores: [
            "<15% of 2035 green energy exports requirements",
            "≥15% to <40% of 2035 green energy exports requirements",
            "≥40% to <60% of 2035 green energy exports requirements",
            "≥60 to <85% of 2035 green energy exports requirements",
            "≥85% of 2035 green energy exports requirements",
          ],
        },
        {
          dimension: "Pipeline Progression",
          weight: 0.25,
          scores: [
            "<10% of 2035 green energy exports requirements",
            "≥10% to <25% of 2035 green energy exports requirements",
            "≥25% to <40% of 2035 green energy exports requirements",
            "≥40% to <50% of 2035 green energy exports requirements",
            "≥50% of 2035 green energy exports requirements",
          ],
        },
        {
          dimension: "Timing & Delivery Risk",
          weight: 0.15,
          scores: [
            "≥4 categories flagged",
            "3 categories flagged",
            "2 categories flagged",
            "1 category flagged",
            "No categories flagged",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Not Ready",
          characteristics: [
            "Less than 25% of required capacity is in development",
            "15% or less of required capacity is approved",
            "10% or less in construction or operating",
            "Numerous systemic issues contributing to delays",
          ],
        },
        {
          score: 2,
          label: "Basic Readiness",
          characteristics: [
            "Between 25% and 50% of required capacity is in development",
            "15-40% of required capacity approved",
            "10-25% of required capacity in construction or operating",
            "Several systemic factors contributing to delays",
          ],
        },
        {
          score: 3,
          label: "Developing Readiness",
          characteristics: [
            "Between 50% and 75% of required capacity is in development",
            "40-60% of required capacity approved",
            "25-40% in construction or operating",
            "A couple of systemic factors contributing to delays",
          ],
        },
        {
          score: 4,
          label: "Strong Readiness",
          characteristics: [
            "Between 75% and 100% of required capacity is in development",
            "60-85% of required capacity is approved",
            "40-50% in construction or operating",
            "Systemic issue contributing to delays",
          ],
        },
        {
          score: 5,
          label: "Exemplary Readiness",
          characteristics: [
            "More than 100% of required capacity is in development",
            "Over 85% of required capacity approved",
            "Over 50% in construction or operating",
            "Little risk of delay",
          ],
        },
      ],
  },
  "transmission-network": {
      purpose: "To evaluate the readiness of the high voltage transmission network to connect and deliver the RE generation required to meet demand from clean industry and green exports by 2035. The assessment considers whether current and planned transmission projects are sufficient to support a grid powered by nearly 100% renewable energy by 2035, aligned with the Green Energy Exports scenario in AEMO's 2024 ISP.",

      frameworkIntro: "Transmission network readiness is assessed based on the following key dimensions:",
      frameworkItems: [
        "<b>Transmission Network Service Provider (TNSP) Forecasting</b> – Is the TNSP using scenario-based modelling for future annual electricity consumption and peak demand, and is this in line with AEMO's forecasts?",
        "<b>Optimal Development Path Progression</b> – Are the committed, anticipated and actionable ISP optimal development path (ODP) projects relevant to the industrial precinct tracking to meet their Green Energy Exports optimal in-service dates?",
        "<b>Future Project Progression</b> – Are relevant projects designated as future in the ODP and actionable in the Green Energy Exports least-cost development path progressing according to their optimal in-service date?",
        "<b>REZ Rollout</b> – Is Renewable Energy Zones development proceeding effectively and transparently, and are REZ-delivery plans in-line with the Green Energy Exports scenario?",
      ],

      dataSources: [
        "AEMO ISP Appendix 5 Network Investments (Optimal Development Path and Green Energy Exports Least-Cost Development Path)",
        "Publicly available project information from transmission networks, e.g. EnergyCo for the Hunter Transmission Project",
        "TNSP Transmission Annual Planning Reports",
        "REZ planning updates",
        "AEMO's Electricity Forecasting Data Portal",
      ],

      scoringProcess: [
        { label: "Forecasting Assessment", desc: "Benchmark TNSP's 2035 forecast annual delivery electricity and peak demand for the state housing the REIP against AEMO's Green Energy Exports scenario." },
        { label: "Preliminary Analysis", desc: "Review existing transmission network data from identified sources, including size of REZ(s) powering the location and transmission-linked projects in AEMO ISP Appendix 5 Network Investments." },
        { label: "Major Transmission Project Assessments", desc: "Assess completion trajectory of each relevant project (1–5) with reference to anticipated lead time in AEMO ISP Appendix 5 and typical project timeline uncertainties. Aggregate scores weighted by additional transmission capacity and sense-check against estimated regional demand." },
        { label: "REZ Assessment", desc: "Review the state's official REZ plan and score each REZ's development status (5 = declared with upgrades approved/under construction and connection rights granted; 1 = little to no progress). Average REZ scores weighted by 2035 Green Energy Exports generation capacity." },
        { label: "Score Calculation", desc: "Assign a weighted score based on the overall assessment across the evaluation dimensions." },
        { label: "Stakeholder Insights and Review", desc: "Validate findings through transmission industry expert consultations and energy market assessments. Where relevant integrate stakeholder insights to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "TNSP Forecasting – Peak load growth",
          weight: 0.1,
          scores: [
            "<25% of state's 2035 green energy exports peak load",
            "≥25% to <50% of state's 2035 green energy exports peak load",
            "≥50% to <75% of state's 2035 green energy exports peak load",
            "≥75% to <100% of state's 2035 green energy exports peak load",
            "≥100% of state's 2035 green energy exports peak load",
          ],
        },
        {
          dimension: "TNSP Forecasting – Annual delivered electricity growth",
          weight: 0.1,
          scores: [
            "<25% of state's 2035 green energy exports annual consumption",
            "≥25% to <50% of state's 2035 green energy exports annual consumption",
            "≥50% to <75% of state's 2035 green energy exports annual consumption",
            "≥75% to <100% of state's 2035 green energy exports annual consumption",
            "≥100% of state's 2035 green energy exports annual consumption",
          ],
        },
        {
          dimension: "Optimal Development Path Progression",
          weight: 0.4,
          scores: [
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
          ],
        },
        {
          dimension: "Future Project Progression",
          weight: 0.2,
          scores: [
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
            "Calculated as average over scores for each project (weighted by additional transfer capacity into REIP)",
          ],
        },
        {
          dimension: "REZ Rollout",
          weight: 0.2,
          scores: [
            "Score each REZ by progress, then average (weighted by anticipated generation capacity in REZ)",
            "Score each REZ by progress, then average (weighted by anticipated generation capacity in REZ)",
            "Score each REZ by progress, then average (weighted by anticipated generation capacity in REZ)",
            "Score each REZ by progress, then average (weighted by anticipated generation capacity in REZ)",
            "Score each REZ by progress, then average (weighted by anticipated generation capacity in REZ)",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Limited Readiness",
          characteristics: [
            "Required AEMO Integrated System Plan (ISP) Optimal Development Path (ODP) projects well behind schedule",
            "Limited Renewable Energy Zone (REZ) development",
          ],
        },
        {
          score: 2,
          label: "Basic Readiness",
          characteristics: [
            "Some ODP actionable projects on schedule",
            "Preparatory REZ work underway but no declarations",
          ],
        },
        {
          score: 3,
          label: "Developing Readiness",
          characteristics: [
            "All ODP actionable projects on schedule",
            "No progress on additional transmission projects required for Green Energy Exports development path",
            "Moderate REZ progress with some declarations",
          ],
        },
        {
          score: 4,
          label: "Strong Readiness",
          characteristics: [
            "All actionable ISP projects on schedule",
            "Some progress on additional Green Energy Exports projects",
            "All relevant REZs are declared with connection rights and transmission buildout on track, but short of Green Energy Exports requirements",
          ],
        },
        {
          score: 5,
          label: "Exemplary Readiness",
          characteristics: [
            "All actionable Green Energy Exports transmission projects on schedule",
            "REZ development advanced to meet or exceed Green Energy Exports requirements",
          ],
        },
      ],
  },
  "distribution-network": {
      purpose: "To evaluate the readiness of the distribution network (the lower voltage power network) to manage two-way power flows and rising electrification from residential and commercial consumer energy resources (CER) through to 2035. This assessment considers whether distribution network planning is adequate to support CER uptake and residential and industrial electrification consistent with a grid powered by nearly 100% renewable energy by 2035, as represented by the Green Energy Exports scenario in AEMO's 2024 ISP.",

      frameworkIntro: "The assessment framework evaluates the low-voltage distribution network based on the following key dimensions:",
      frameworkItems: [
        "<b>CER Uptake Forecasts</b> – The extent to which DNSPs' forecasts of rooftop solar, behind-the-meter batteries and electric vehicle uptake align with the 2035 Green Energy Exports scenario.",
        "<b>CER Programs and Initiatives</b> – The strength of programs designed to support projected CER uptake and better network utilisation, such as dynamic household connections, appropriately priced community batteries, or favourable electric vehicle tariffs.",
        "<b>Hosting Capacity Data</b> – The availability, quality, granularity and completeness of network hosting capacity maps or databases for medium and low voltage feeders.",
        "<b>Network Demand Forecasting</b> – The availability, time horizon, transparency and spatial granularity of DNSP network demand forecasts.",
        "<b>Substation and Bulk Supply Point Forecasting</b> – The availability, time horizon and transparency of scenario-based forecasts for bulk supply points and zone substations.",
      ],

      dataSources: [
        "Distribution Annual Planning Reports from relevant distribution network service providers (DNSPs), e.g. Ergon Energy in regional Queensland",
        "Network development plans, investment roadmaps, and regulatory filings, e.g. RIT-D investment submissions",
        "AEMO's Electricity Forecasting Data Portal",
        "Government policy documents, climate roadmaps, and regulatory filings on electrification and grid modernisation",
        "Independent industry reports on network capacity constraints and expansion plans",
        "Expert analyses on grid integration challenges and opportunities",
        "Consultations with distribution service providers, energy market regulators, and major energy users",
      ],

      scoringProcess: [
        { label: "CER Uptake Forecasts", desc: "Analyse CER uptake forecasts used in most recent distribution annual planning report(s) and compare with 2035 Green Energy Exports values." },
        { label: "CER Programs", desc: "Catalogue DNSP's CER-related programs and tariffs and assess the extent to which they align with DNSP and AEMO forecasts." },
        { label: "Hosting Capacity Database/Map", desc: "Determine whether such a map exists and, if so, the frequency of updates, granularity, completeness and quality of data." },
        { label: "Study Network-Wide and Network Node Forecasts", desc: "Examine DNSP forecasts across the network, bulk supply points and zone substations. Determine whether long-horizon, scenario-based forecasts are publicly available with end-use categorisation and regional granularity." },
        { label: "Score Calculation and Review", desc: "Assign a weighted score based on the overall assessment across the evaluation dimensions. Validate findings through industry expert consultations and integrate stakeholder insights to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "CER Uptake Forecasts – Solar PV uptake",
          weight: 0.067,
          scores: [
            "<25% of 2035 green energy exports forecast",
            "≥25% to <50% of 2035 green energy exports forecast",
            "≥50% to <75% of 2035 green energy exports forecast",
            "≥75% to <100% of 2035 green energy exports forecast",
            "≥100% of 2035 green energy exports forecast",
          ],
        },
        {
          dimension: "CER Uptake Forecasts – EV uptake",
          weight: 0.067,
          scores: [
            "<25% of 2035 green energy exports forecast",
            "≥25% to <50% of 2035 green energy exports forecast",
            "≥50% to <75% of 2035 green energy exports forecast",
            "≥75% to <100% of 2035 green energy exports forecast",
            "≥100% of 2035 green energy exports forecast",
          ],
        },
        {
          dimension: "CER Uptake Forecasts – Battery uptake",
          weight: 0.067,
          scores: [
            "<25% of 2035 green energy exports forecast",
            "≥25% to <50% of 2035 green energy exports forecast",
            "≥50% to <75% of 2035 green energy exports forecast",
            "≥75% to <100% of 2035 green energy exports forecast",
            "≥100% of 2035 green energy exports forecast",
          ],
        },
        {
          dimension: "CER Programs and Initiatives",
          weight: 0.2,
          scores: [
            "Network policies not aligned with enabling CER",
            "Partial network policy alignment with enabling CER",
            "Moderate network policy alignment with enabling CER",
            "Good network policy alignment with enabling CER",
            "Full network policy alignment with enabling CER",
          ],
        },
        {
          dimension: "Hosting Capacity Data",
          weight: 0.2,
          scores: [
            "Feeder hosting capacity map/database not provided or limited in scope",
            "MV feeder hosting capacity database provided with 2 of: CER hosting capacity, Utilisation, End-use categorisation, Granularity down to local distribution transformers",
            "MV feeder hosting capacity database provided with 3 of: CER hosting capacity, Utilisation, End-use categorisation, Granularity down to local distribution transformers",
            "MV feeder hosting capacity database provided with all of: CER hosting capacity, Utilisation, End-use categorisation, Granularity down to local distribution transformers – with some gaps",
            "MV feeder hosting capacity database provided with all of: CER hosting capacity, Utilisation, End-use categorisation, Granularity down to local distribution transformers – with no gaps",
          ],
        },
        {
          dimension: "Network Demand Forecasting",
          weight: 0.2,
          scores: [
            "Network-wide forecasts available only",
            "Network-wide scenario-based forecasts publicly available with no categorisation",
            "Scenario-based forecasts available with either basic end-use/customer-type categorisation or regional breakdowns",
            "Regional scenario-based forecasts available with basic end-use categorisation",
            "Regional scenario-based forecasts available with full end-use categorisation",
          ],
        },
        {
          dimension: "Substation and Bulk Supply Point Forecasting",
          weight: 0.2,
          scores: [
            "Single, 5-year forecasts available",
            "Forecasts available with one of: 10-year period horizon, different scenarios, basic end-use categorisation",
            "Forecasts available with two of: 10-year period horizon, different scenarios, basic end-use categorisation",
            "10-year scenario-based forecasts available with basic end-use categorisation",
            "Long-term, scenario-based forecasts available with full end-use categorisation",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Limited Readiness",
          characteristics: [
            "No plans for household Consumer Energy Resources (CER) support",
            "No plans to support industrial electrification",
          ],
        },
        {
          score: 2,
          label: "Basic Readiness",
          characteristics: [
            "Planning for modest consumer energy resources (CER) uptake",
            "No plans to support industrial electrification",
            "Limited forecasting and network utilisation transparency",
          ],
        },
        {
          score: 3,
          label: "Developing Readiness",
          characteristics: [
            "Planning for high uptake of CER",
            "No plans to support industrial electrification",
            "Improving forecasting and network utilisation transparency",
          ],
        },
        {
          score: 4,
          label: "Strong Readiness",
          characteristics: [
            "Planning for high uptake of CER and a modest level of industry electrification",
            "Strong forecasting and network utilisation transparency",
          ],
        },
        {
          score: 5,
          label: "Exemplary Readiness",
          characteristics: [
            "Planning for high CER uptake and industrial electrification",
            "Comprehensive forecasting and network utilisation transparency",
          ],
        },
      ],
  },
  "energy-storage": {
      purpose: "To evaluate the readiness of regional energy storage systems to support a 100% renewable energy supply capable of meeting demand from clean industry and green exports by 2035. The assessment compares the regional energy storage project pipeline with Australia approaching a zero emissions grid powered by 100% renewable energy by 2035, generally consistent with AEMO's ISP Green Energy Exports scenario.",

      frameworkIntro: "The assessment framework evaluates the energy storage system based on the following key dimensions:",
      frameworkItems: [
        "<b>Renewable Energy Storage Pipeline Status – Overall Pipeline</b> – Cumulative size of storage projects in development or further progressed relative to required capacity to meet forecast demand under a clean industry/green export scenario by 2035 (evaluated by both charging/discharging capacity in MW and depth in MWh).",
        "<b>Approved Pipeline</b> – Percentage of required storage projects that have secured planning approval (evaluated by both capacity in MW and depth in MWh).",
        "<b>Pipeline Progression</b> – Percentage of required storage projects that are in construction or operation (evaluated by both capacity in MW and depth in MWh).",
        "<b>Timing & Delivery Risk</b> – Feasibility of delivering the required renewable storage on schedule, based on an assessment of current project approvals, lead times, and delivery timelines, as well as major bottlenecks and historical delays.",
      ],

      dataSources: [
        "OpenNEM for real-time renewable storage data",
        "Australian Energy Market Operator (AEMO) Integrated System Plan (ISP) for projected storage capacity",
        "RenewMap for project tracking of energy storage projects (operational, approved, in planning and announced)",
        "Aggregate data on utility storage energy projects at state and regional levels",
        "State databases for large-scale infrastructure projects like Pumped Hydro (e.g. Queensland Coordinated Project database)",
        "AEMO ISP Step Change Scenario for projected storage capacity",
        "AEMO ISP Green Energy Exports scenario targets for projected storage capacity",
        "Regional project pipeline data from RenewMap for storage infrastructure",
        "Independent energy storage assessments, e.g. Nexa Advisory",
      ],

      scoringProcess: [
        { label: "Pipeline Analysis", desc: "Compare operational projects and current pipeline against a scenario aligned to the target of near 100% renewable generation by 2035 (Green Energy Exports). Define geographic scope (ISP sub-regions), analyse storage projects in MW and MWh across development stages, and benchmark progress against 2035–36 requirements." },
        { label: "Assess Sources of Delay", desc: "Assess quantitative history of storage project delays in AEMO's Generation Information or other databases. Flag historical issues with development approval timelines, EPBC approval timelines, community opposition, financing delays, government opposition, grid connection issues, workforce shortages, supply chain disruptions, and changes in regulation." },
        { label: "Score Calculation", desc: "Assign a weighted score based on the overall assessment across the evaluation dimensions." },
        { label: "Stakeholder Insights and Review", desc: "Validate findings through industry expert consultations and energy market assessments. Where relevant, integrate stakeholder insights to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Overall Pipeline – Capacity (MW)",
          weight: 0.15,
          scores: [
            "<25% of 2035 Green Energy Exports requirements",
            "≥25% to <50% of 2035 Green Energy Exports requirements",
            "≥50% to <75% of 2035 Green Energy Exports requirements",
            "≥75% to <100% of 2035 Green Energy Exports requirements",
            "≥100% of 2035 Green Energy Exports requirements",
          ],
        },
        {
          dimension: "Overall Pipeline – Depth (MWh)",
          weight: 0.15,
          scores: [
            "<25% of 2035 Green Energy Exports requirements",
            "≥25% to <50% of 2035 Green Energy Exports requirements",
            "≥50% to <75% of 2035 Green Energy Exports requirements",
            "≥75% to <100% of 2035 Green Energy Exports requirements",
            "≥100% of 2035 Green Energy Exports requirements",
          ],
        },
        {
          dimension: "Pipeline Progression – Capacity (MW)",
          weight: 0.125,
          scores: [
            "<10% of 2035 Green Energy Exports requirements",
            "≥10% to <25% of 2035 Green Energy Exports requirements",
            "≥25% to <40% of 2035 Green Energy Exports requirements",
            "≥40% to <50% of 2035 Green Energy Exports requirements",
            "≥50% of 2035 Green Energy Exports requirements",
          ],
        },
        {
          dimension: "Pipeline Progression – Depth (MWh)",
          weight: 0.125,
          scores: [
            "<10% of 2035 Green Energy Exports requirements",
            "≥10% to <25% of 2035 Green Energy Exports requirements",
            "≥25% to <40% of 2035 Green Energy Exports requirements",
            "≥40% to <50% of 2035 Green Energy Exports requirements",
            "≥50% of 2035 Green Energy Exports requirements",
          ],
        },
        {
          dimension: "Approved Pipeline – Capacity (MW)",
          weight: 0.125,
          scores: [
            "<10% of 2035 Green Energy Exports requirements",
            "≥10% to <40% of 2035 Green Energy Exports requirements",
            "≥40% to <60% of 2035 Green Energy Exports requirements",
            "≥60 to <90% of 2035 Green Energy Exports requirements",
            "≥90% of 2035 Green Energy Exports requirements",
          ],
        },
        {
          dimension: "Approved Pipeline – Depth (MWh)",
          weight: 0.125,
          scores: [
            "<10% of 2035 Green Energy Exports requirements",
            "≥10% to <40% of 2035 Green Energy Exports requirements",
            "≥40% to <60% of 2035 Green Energy Exports requirements",
            "≥60 to <90% of 2035 Green Energy Exports requirements",
            "≥90% of 2035 Green Energy Exports requirements",
          ],
        },
        {
          dimension: "Timing & Delivery Risk",
          weight: 0.2,
          scores: [
            "4+ factors flagged",
            "3 factors flagged",
            "2 factors flagged",
            "1 factor flagged",
            "No factors flagged",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Limited Readiness",
          characteristics: [
            "Less than 25% of required capacity/depth is in development",
            "15% or less approved",
            "10% or less in construction or operating",
            "Numerous systemic issues contributing to delays",
          ],
        },
        {
          score: 2,
          label: "Basic Readiness",
          characteristics: [
            "Between 25% and 50% of required capacity/depth is in development",
            "15–40% approved",
            "10–25% in construction or operating",
            "Several systemic factors contributing to delays",
          ],
        },
        {
          score: 3,
          label: "Developing Readiness",
          characteristics: [
            "Between 50% and 75% of required capacity/depth is in development",
            "40–60% approved",
            "25–40% in construction or operating",
            "A couple of systemic factors contributing to delays",
          ],
        },
        {
          score: 4,
          label: "Strong Readiness",
          characteristics: [
            "Between 75% and 100% of required capacity/depth is in development",
            "60–85% approved",
            "40–50% in construction or operating",
            "Systemic issue contributing to delays",
          ],
        },
        {
          score: 5,
          label: "Exemplary Readiness",
          characteristics: [
            "Over 100% of required capacity/depth is in development",
            "More than 85% approved",
            "More than 50% in construction or operating",
            "Little risk of delay",
          ],
        },
      ],
  },
  "hydrogen-network": {
      purpose: "To evaluate the readiness of the green hydrogen supply and network to meet demand from clean industry and green exports by 2035. The assessment considers the adequacy of the green hydrogen supply and network pipeline, project approval status, and alignment with the Green Energy Exports scenario in AEMO's Integrated System Plan.",

      frameworkIntro: "The assessment framework evaluates the hydrogen energy supply and network based on the following key dimensions:",
      frameworkItems: [
        "<b>Hydrogen Pipeline Status – Overall Pipeline</b> – Production capacity (in kt per year) of hydrogen projects in development or beyond relative to required capacity to meet forecast demand under a clean industry/green export scenario by 2035.",
        "<b>Approved Pipeline</b> – Percentage of required hydrogen production capacity that has secured planning approval.",
        "<b>Pipeline Progression</b> – Percentage of required hydrogen production capacity that is in construction or operation.",
        "<b>Timing & Delivery Risk</b> – Feasibility of delivering the required hydrogen production capacity on schedule, based on an assessment of the status of individual projects, including approvals, lead times, and delivery timelines, as well as major bottlenecks and historical delays.",
      ],

      dataSources: [
        "Assessment of government and corporate hydrogen project plans and announcements (e.g. Australian Hydrogen Projects Dataset, Australia's Hydrogen Opportunities Tool)",
        "Capital allocation from government and private sector investments",
        "Project tracking databases detailing operational, approved, and planned hydrogen infrastructure, e.g. CSIRO's HyResource and the IEA's Hydrogen Production and Infrastructure Projects Database",
        "Transmission Network (Indicator 1.1.2): Evaluation of whether transmission infrastructure will be ready to supply sufficient electricity for hydrogen production",
        "Independent hydrogen network assessments from energy market analysts and industry stakeholders, e.g. ACIL Allen's Fuel Price Report",
        "Reports from regulatory agencies on hydrogen infrastructure policy and development",
      ],

      scoringProcess: [
        { label: "Current Hydrogen Energy Supply and Network Capacity", desc: "Analyse the existing operational hydrogen supply in the assessed REIP in relation to industrial and export demand." },
        { label: "Future Hydrogen Readiness", desc: "Compare planned hydrogen infrastructure development against projected demand in Green Energy Exports and Step Change scenarios." },
        { label: "Approval and Implementation Status", desc: "Determine the proportion of hydrogen network projects that have received approval and are under construction." },
        { label: "Timing & Delivery Risk", desc: "Examine each project and determine whether it is at risk of delay." },
        { label: "Score Calculation and Review", desc: "Assign a weighted score based on performance across the evaluation dimensions. Validate findings through industry expert consultations and integrate stakeholder insights to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Overall Pipeline",
          weight: 0.3,
          scores: [
            "<25% of 2035 requirements",
            "≥25% to <50% of 2035 requirements",
            "≥50% to <75% of 2035 requirements",
            "≥75% to <100% of 2035 requirements",
            "≥100% of 2035 requirements",
          ],
        },
        {
          dimension: "Approved Pipeline",
          weight: 0.25,
          scores: [
            "<15% of 2035 requirements",
            "≥15% to <40% of 2035 requirements",
            "≥40% to <60% of 2035 requirements",
            "≥60 to <80% of 2035 requirements",
            "≥80% of 2035 requirements",
          ],
        },
        {
          dimension: "Pipeline Progression",
          weight: 0.25,
          scores: [
            "<10% of 2035 requirements",
            "≥10% to <25% of 2035 requirements",
            "≥25% to <40% of 2035 requirements",
            "≥40% to <50% of 2035 requirements",
            "≥50% of 2035 requirements",
          ],
        },
        {
          dimension: "Timing & Delivery Risk",
          weight: 0.2,
          scores: [
            "<25% of 2035 requirements not at risk",
            "≥25% to <50% of 2035 requirements not at risk",
            "≥50% to <75% of 2035 requirements not at risk",
            "≥75% to <100% of 2035 requirements not at risk",
            "≥100% of 2035 requirements not at risk",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Limited Readiness",
          characteristics: [
            "Less than 25% of required production capacity in development",
            "15% or less approved",
            "10% or less in construction or operating",
            "More than 75% of required production capacity at risk of delay",
          ],
        },
        {
          score: 2,
          label: "Basic Readiness",
          characteristics: [
            "Between 25% and 50% of required production capacity in development",
            "15-40% approved",
            "10-25% in construction or operating",
            "50-75% of required production capacity at risk of delay",
          ],
        },
        {
          score: 3,
          label: "Developing Readiness",
          characteristics: [
            "Between 50% and 75% of required production capacity is in development, with 40-60% approved and 25-40% in construction or operating",
            "50-25% of required production capacity at risk of delay",
          ],
        },
        {
          score: 4,
          label: "Strong Readiness",
          characteristics: [
            "Between 75% and 100% of required production capacity in development",
            "60-80% approved",
            "40-50% in construction or operating",
            "Between 0% and 25% of required production capacity at risk of delay",
          ],
        },
        {
          score: 5,
          label: "Exemplary Readiness",
          characteristics: [
            "Over 100% of required production capacity in development",
            "Over 80% approved",
            "Over 50% in construction or operating",
          ],
        },
      ],
  },
  "energy-system-orchestration": null,

  "port": null,
  "rail": null,
  "road": null,
  "transport-networks": null,

  "water-supply": null,
  "wastewater-management": null,
  "solid-waste-resource-recovery": null,

  "housing": null,
  "health": null,
  "education": null,

  "digital-infrastructure": null,

  // ─── Pillar 2: Industry Capability & Capacity ─────────────────────────────────

  "industry-decarbonisation-plans": {
      purpose: "To evaluate the decarbonisation progress of energy-intensive manufacturing industries within the region. The assessment considers the presence of decarbonisation plans, target ambition, funding, and implementation progress.",

      frameworkIntro: "The assessment framework evaluates each industry stakeholder (facility) within the manufacturing sector with emission reductions above 25,000 tonnes CO2-e (Scope 1 and 2) against the existence of a decarbonisation plan and evidence of delivery, across the following dimensions:",
      frameworkItems: [
        "<b>Baseline Emissions Reduction Plans</b> – Does the company have a clear and measurable emissions reduction plan/pathway for the facility?",
        "<b>Alignment with 1.5°C Targets</b> – Are the company's targets in line with limiting global warming to 1.5°C (75% reduction in emissions by 2035 below 2005 levels)?",
        "<b>Supply Chain Emissions Considerations</b> – Does the plan address supply chain emissions?",
        "<b>Evidence of Action & Funding</b> – Are tangible steps being taken towards emissions reduction? Is there evidence of funded actions?",
        "<b>Energy Management and Demand Response</b> – Is the company addressing its energy efficiency and its ability to manage its energy more effectively especially for load shaping and ability to offer demand response?",
        "<b>Performance Incentives</b> – Are internal performance incentives (e.g. executive bonuses) linked to meeting emissions targets?",
      ],

      dataSources: [
        "Company Sustainability Reports – Corporate disclosures on emissions reduction targets and progress",
        "Public Commitments – Statements from companies outlining decarbonisation intentions",
        "Regulatory Filings & Compliance Reports – Industry obligations and regulatory adherence including National Greenhouse and Energy Reporting (NGER) Scheme and the Clean Energy Regulator (CER) Safeguard Mechanism reporting",
        "Government & Independent Industry Studies – Third-party assessments of industry performance, e.g. Climate Action 100, reports by other ENGOs",
        "Media Reports & Corporate Announcements – News coverage of corporate decarbonisation initiatives",
        "Industry Stakeholder & Expert Consultation Interviews – Insights from sectoral experts and industry representatives",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review corporate and regulatory disclosures on decarbonisation initiatives." },
        { label: "Indicator Evaluation", desc: "Assess targets, funding mechanisms, implementation strategies, and accountability measures." },
        { label: "Stakeholder Insights", desc: "Engage with industry representatives and sustainability experts to validate findings." },
        { label: "Score Calculation", desc: "Compile individual company assessments and stakeholder insights to determine an overall industry score." },
        { label: "Review", desc: "If major implementation gaps exist—such as technologies that lock in long-term use of fossil fuels, infrastructure delays, or medium-term reliance on fossil fuels—the final score is adjusted accordingly." },
      ],

      weightingTable: [
        {
          dimension: "Baseline Emissions Reduction Plans",
          weight: 0.25,
          scores: [
            "No clear decarbonisation plans",
            "Some companies have plans but lack clear targets",
            "Most companies have defined plans with targets",
            "All major companies have fully developed 1.5°C-aligned plans",
            "Industry-wide best practice targets and accountability",
          ],
        },
        {
          dimension: "Alignment with 1.5°C Targets",
          weight: 0.15,
          scores: [
            "No alignment with 1.5°C",
            "Some alignment, but limited scope",
            "Majority of companies have 1.5°C-aligned targets",
            "All major companies have 1.5°C-aligned targets",
            "Industry-wide adoption of science-based targets",
          ],
        },
        {
          dimension: "Supply Chain Emissions Consideration",
          weight: 0.1,
          scores: [
            "No supply chain emissions tracking",
            "Scope 1 & 2 emissions tracked but not addressed",
            "Some indirect emissions managed, Scope 3 plans emerging",
            "Fully developed Scope 1, 2 & 3 plans with partial implementation",
            "Comprehensive supply chain emissions reduction measures",
          ],
        },
        {
          dimension: "Evidence of Action & Funding",
          weight: 0.2,
          scores: [
            "No funding allocated for implementation",
            "Some plans exist, but funding mechanisms unclear",
            "Majority of companies have secured funding",
            "Fully funded decarbonisation plans with initial implementation",
            "Industry-wide funding mechanisms and large-scale action",
          ],
        },
        {
          dimension: "Energy Management & Demand Response",
          weight: 0.1,
          scores: [
            "No energy efficiency strategies in place",
            "Some energy management improvements planned",
            "Most companies implementing demand response & efficiency",
            "Industry-wide adoption of advanced energy management",
            "Leading global best practice in energy efficiency & flexibility",
          ],
        },
        {
          dimension: "Performance Incentives",
          weight: 0.1,
          scores: [
            "No internal incentives for emissions reduction",
            "Some sustainability commitments but no incentives",
            "Partial incentive structures linked to sustainability",
            "Full incentive mechanisms tied to emissions reductions",
            "Industry-leading financial incentives embedded in governance",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Limited Plan / Insufficient Targets",
          characteristics: [
            "Weak or symbolic decarbonisation plans",
            "No clear emissions reduction targets",
            "No allocated funding for implementation",
          ],
        },
        {
          score: 2,
          label: "Basic Plans / Uncertain Implementation Pathways",
          characteristics: [
            "Some decarbonisation plans exist but lack full alignment with climate targets",
            "Uncertain funding mechanisms or partial commitments",
            "Implementation pathways unclear or underdeveloped",
          ],
        },
        {
          score: 3,
          label: "Intermediate Plans / Developing Momentum",
          characteristics: [
            "Majority of companies have defined targets aligned with climate goals",
            "Funding secured for decarbonisation efforts",
            "Initial implementation efforts in place",
          ],
        },
        {
          score: 4,
          label: "Comprehensive Plans / Aligned with Regional Goals",
          characteristics: [
            "Fully developed and funded decarbonisation plans",
            "Industry-wide alignment with regional net-zero strategies",
            "Standardised reporting and compliance mechanisms",
          ],
        },
        {
          score: 5,
          label: "Best Practice / Exemplary Industry Leadership",
          characteristics: [
            "Industry-wide accountability for full scope 1, 2 and 3 emissions",
            "Best practice decarbonisation measures embedded in corporate governance",
            "Financial incentives tied to emissions reductions and sustainability performance",
          ],
        },
      ],
  },

  "existing-workforce-capacity": null,
  "reskilling-upskilling": null,

  "innovation": null,
  "commercialisation": null,
  "knowledge-generation-sharing": null,

  "industrial-symbiosis": null,
  "coordinated-infrastructure-plan": null,
  "supply-chain-resilience": null,
  "international-linkages": null,

  // ─── Pillar 3: Policy & Governance ───────────────────────────────────────────

  "federal-emissions-commitment": {
      purpose: "To evaluate the adequacy of government policies in delivering emissions reduction commitments and driving momentum towards industry decarbonisation and a clean economy. It focuses on target ambition, policy comprehensiveness, regional support, and alignment with the 1.5°C pathway and net-zero goals.",

      frameworkIntro: "Policies are evaluated across the following areas:",
      frameworkItems: [
        "<b>Target Ambition</b> – Are the emissions reduction targets aligned with current science-based pathways, such as the 1.5°C target?",
        "<b>Policy Development, Regulation and Implementation</b> – Does the government have detailed, actionable, and enforceable policies to achieve targets?",
        "<b>Sectoral Strategies</b> – Are sector-specific plans available, funded and integrated with national decarbonisation objectives?",
        "<b>Regional Support</b> – Is there sufficient support for regions and sectors heavily impacted by the transition?",
        "<b>Monitoring and Accountability</b> – Are there mechanisms in place for tracking, reporting, and adjusting targets based on performance?",
      ],

      dataSources: [
        "Climate action strategies and emissions reduction plans",
        "Budget allocations for climate-related initiatives",
        "Legislative documents such as climate acts and policy frameworks",
        "Climate Action Tracker and similar international rating agencies",
        "Reports from advisory bodies like the Climate Change Authority (CCA)",
        "Research from universities and independent think tanks",
        "Reports from peak industry bodies (e.g., Australian Industry Group)",
        "Sectoral performance reports (e.g., energy, transport, agriculture)",
        "Stakeholder consultations with affected communities",
        "Submissions to government consultations on climate policy",
        "Analysis of targets and policy frameworks in comparable economies",
        "UNFCCC reports and other international climate assessment documents",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review federal government emissions reduction policies and legal commitments." },
        { label: "Indicator Evaluation", desc: "Assess target ambition, enforcement mechanisms, and policy coverage." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Stakeholder Insights", desc: "Engage with government officials, independent agencies, industry representatives, and climate researchers." },
        { label: "Review", desc: "Where relevant, integrate stakeholder insights to finalise the assigned score and identify areas for improvement." },
      ],

      weightingTable: [
        {
          dimension: "Target Ambition",
          weight: 0.35,
          scores: [
            "Targets are outdated or unambitious, not aligned with science-based pathways",
            "Baseline targets exist but lack strategic clarity",
            "Mid-range targets with some scientific alignment",
            "Ambitious, science-based targets in place",
            "Targets exceed international benchmarks and are best-in-class",
          ],
        },
        {
          dimension: "Policy Development, Regulation & Implementation",
          weight: 0.25,
          scores: [
            "Symbolic policies with no enforceability",
            "Policies exist but are fragmented and lack funding",
            "Some enforceable measures, but implementation gaps exist",
            "Comprehensive, enforceable policies with clear implementation pathways",
            "Fully integrated policies with strong legal backing and enforcement",
          ],
        },
        {
          dimension: "Sectoral Strategies",
          weight: 0.15,
          scores: [
            "No sectoral strategies, national policies ignore sector-specific needs",
            "Some sectoral plans exist but are poorly integrated or underfunded",
            "Sectoral strategies emerging but inconsistent",
            "Well-developed, funded sectoral strategies aligned with national goals",
            "Comprehensive sectoral plans fully integrated with national and global frameworks",
          ],
        },
        {
          dimension: "Regional Support",
          weight: 0.1,
          scores: [
            "No regional support or investment in transition-affected areas",
            "Limited regional programs but insufficient to drive transition",
            "Growing regional investment in transition-affected areas, coverage remains uneven",
            "Strong regional investment programs in place, supporting affected industries",
            "Highly effective, well-funded regional support ensuring just transition",
          ],
        },
        {
          dimension: "Monitoring & Accountability",
          weight: 0.15,
          scores: [
            "No monitoring or tracking mechanisms in place",
            "Basic reporting mechanisms but lack independent oversight",
            "Some tracking exists, but no clear accountability framework",
            "Clear tracking and accountability mechanisms with enforcement measures",
            "Highly transparent and independently verified emissions tracking and reporting",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Commitment (Severe Deficiency)",
          characteristics: [
            "Targets are outdated or unambitious, with symbolic policies lacking enforcement or measurable outcomes",
            "Regional support is minimal",
            "No alignment with international standards",
          ],
        },
        {
          score: 2,
          label: "Basic Commitment (Moderate Deficiency)",
          characteristics: [
            "Baseline targets exist but lack strategic clarity",
            "Policies are fragmented, underfunded, and fail to drive significant regional engagement",
          ],
        },
        {
          score: 3,
          label: "Moderate Commitment (Developing)",
          characteristics: [
            "Mid-range targets with growing policy depth",
            "Sectoral strategies and regional initiatives are developing but remain inconsistent",
          ],
        },
        {
          score: 4,
          label: "Strong Commitment (Effective)",
          characteristics: [
            "Ambitious, science-based targets with comprehensive, funded policies",
            "Clear mechanisms for monitoring, enforcement, and regional support achieved",
          ],
        },
        {
          score: 5,
          label: "Exemplary Commitment (Leading Practice)",
          characteristics: [
            "Targets exceed international benchmarks with holistic, integrated policies",
            "Strong enforcement, consistent monitoring, and high-impact regional support is in place",
          ],
        },
      ],
  },
  "federal-skills-training": {
      purpose: "To evaluate federal government policies related to skills and workforce development for the zero-emissions transition. The assessment focuses on policy presence, effectiveness and investment with a view to identifying gaps and recommending improvements.",

      frameworkIntro: "Policies are evaluated across the following areas:",
      frameworkItems: [
        "<b>Policy Commitment</b> – Does the policy explicitly recognise skills development as a key driver of the energy transition? Has thorough analysis of the types of skills needed been undertaken?",
        "<b>Funding and Resources</b> – Are financial and structural resources sufficient to meet skills development needs? Are programs adequately resourced, including expanding training capacity/workforce to be able to deliver programs?",
        "<b>Industry and Education Collaboration</b> – Does the policy facilitate cooperation between government, industries, and educational institutions?",
        "<b>Workforce Planning and Strategy</b> – Is there a clear, strategic workforce transition plan that aligns with national and regional energy transition goals?",
        "<b>Implementation and Accessibility</b> – Are programs effectively delivered and accessible to affected sectors and communities?",
        "<b>Outcomes and Continuous Improvement</b> – Are there mechanisms to track progress, refine strategies, and adapt to emerging challenges?",
      ],

      dataSources: [
        "National and regional workforce development strategies",
        "Budget allocations for training programs",
        "Parliamentary reports and legislative initiatives",
        "Reports from key organisations (e.g. Clean Energy Council, Business Council of Australia, Jobs and Skills Australia)",
        "Labour market studies on skills shortages and emerging workforce trends",
        "Think tank research on workforce transition needs",
        "Availability and effectiveness of clean energy-related vocational training and university courses",
        "Industry partnerships with training institutions",
        "Regional skills hubs and their alignment with workforce needs",
        "Employment trends in renewable energy and decarbonised industries",
        "Transition challenges for fossil fuel workers in affected regions",
        "Consultations with government agencies, industry leaders, and education providers",
        "Input from workforce transition groups and unions",
        "Feedback from impacted workers and job seekers",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review government policies and workforce development strategies." },
        { label: "Indicator Evaluation", desc: "Assess funding, industry collaboration, and accessibility of training programs." },
        { label: "Case Study Analysis", desc: "Examine existing workforce transition initiatives and their effectiveness." },
        { label: "Scoring Aggregation", desc: "Assign a score based on performance across key criteria." },
        { label: "Stakeholder Insights", desc: "Engage with industry leaders, training institutions, and workforce representatives." },
        { label: "Review", desc: "Where relevant, integrate stakeholder insights to finalise the assigned score and identify areas for improvement." },
      ],

      weightingTable: [
        {
          dimension: "Policy Commitment",
          weight: 0.2,
          scores: [
            "No targeted programs or workforce transition recognition",
            "Some recognition but lacks integration with transition planning",
            "Recognises workforce skilling as important but lacks full coordination",
            "Strong commitment with structured policy integration",
            "Comprehensive, long-term commitment with strategic workforce alignment",
          ],
        },
        {
          dimension: "Funding & Resources",
          weight: 0.2,
          scores: [
            "No funding allocated for workforce transition",
            "Limited or one-off funding for training programs",
            "Some funding but lacks scalability or sustainability",
            "Well-funded, long-term workforce programs with strong institutional backing",
            "Sustainable funding model ensuring long-term industry and regional workforce transformation",
          ],
        },
        {
          dimension: "Industry & Education Collaboration",
          weight: 0.15,
          scores: [
            "No collaboration between government, industry, and education providers",
            "Some engagement but lacks depth and coordination",
            "Moderate collaboration with emerging industry partnerships",
            "Strong industry partnerships embedded in policy implementation",
            "Deeply integrated government, industry, and education partnerships with continuous feedback mechanisms",
          ],
        },
        {
          dimension: "Workforce Planning & Strategy",
          weight: 0.15,
          scores: [
            "No workforce transition plan or strategic direction",
            "Basic workforce initiatives exist but lack clear long-term planning",
            "Recognises workforce needs but implementation gaps remain",
            "Comprehensive workforce planning with sectoral strategies",
            "Best-practice workforce strategy, aligned with national and regional economic transitions",
          ],
        },
        {
          dimension: "Implementation & Accessibility",
          weight: 0.15,
          scores: [
            "No access to reskilling/upskilling programs for workers",
            "Limited access, with barriers for affected workers and communities",
            "Some training programs exist but not widely available or tailored",
            "Well-structured, inclusive training programs supporting multiple sectors",
            "Fully accessible, diverse workforce transition programs with national coverage",
          ],
        },
        {
          dimension: "Outcomes & Continuous Improvement",
          weight: 0.15,
          scores: [
            "No tracking or evaluation of program effectiveness",
            "Limited monitoring with no process for policy improvement",
            "Some tracking mechanisms but lacks transparent accountability",
            "Well-developed tracking systems with periodic review and improvements",
            "Leading model for adaptive policy, with iterative improvements based on real-world outcomes",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal support (Severe Deficiency)",
          characteristics: [
            "Lacks targeted programs, funding, or industry collaboration for zero-emissions skills",
            "No integration with workforce transition strategies",
            "No feedback mechanism to improve outcomes",
          ],
        },
        {
          score: 2,
          label: "Basic support (Moderate Deficiency)",
          characteristics: [
            "Some initiatives exist but lack depth, coordination, or sufficient funding",
            "Limited industry partnerships and workforce integration",
          ],
        },
        {
          score: 3,
          label: "Moderate support (Developing)",
          characteristics: [
            "Recognises workforce skilling as important and commits resources but lacks full-scale coordination, accessibility, or regional application",
            "Some alignment with transition strategies",
          ],
        },
        {
          score: 4,
          label: "Strong support (Effective)",
          characteristics: [
            "Well-developed programs with substantial funding, strong industry collaboration, and tailored workforce transition strategies",
            "Supports multiple sectors effectively",
          ],
        },
        {
          score: 5,
          label: "Exemplary support (Leading Practice)",
          characteristics: [
            "Comprehensive, holistic, and highly coordinated policies with sustainable funding, measurable outcomes, and a clear roadmap for a just transition",
            "Good feedback mechanism and process for building on learnings to ensure continuous improvement",
          ],
        },
      ],
  },
  "federal-approvals": {
      purpose: "To evaluate the ability of federal government approvals processes to provide a structured, transparent, and evidence-based framework to facilitate renewable energy and other major infrastructure projects required to deliver decarbonisation of regional industry. The assessment focuses on process efficiency, regulatory clarity, interlinkage with state government approvals and environmental integration to support timely, sustainable energy transition.",

      frameworkIntro: "Policies will be assessed based on the following dimensions:",
      frameworkItems: [
        "<b>Process Efficiency</b> – Are approval timelines predictable, efficient, and supportive of timely project delivery? Is there a 'one stop shop' for project approvals for generation and storage infrastructure projects?",
        "<b>Regulatory Clarity</b> – Are the processes and requirements well-defined and consistent across jurisdictions?",
        "<b>Environmental Integration</b> – Do the processes include comprehensive, science-based environmental and emissions criteria? Is the application process comprehensive with a balance between environmental concerns and complexity?",
        "<b>Support for Innovation</b> – Are emerging zero-emissions technologies accommodated with adaptive pathways?",
        "<b>Regional Adaptability</b> – Do processes reflect regional infrastructure needs and capacity differences? Do they support resources for smaller organisations/business/community organisations to navigate the approval process?",
        "<b>Monitoring and Continuous Improvement</b> – Are there systems in place for regular evaluation including independent third party evaluations and process optimisation?",
      ],

      dataSources: [
        "National and state-level planning legislation",
        "Climate change and infrastructure policy papers",
        "Regulatory guidelines for environmental approvals e.g. the EPBC Act",
        "Reports from regulatory agencies (e.g. Climate Change Authority, Infrastructure Australia, Clean Energy Regulator, Australian Energy Infrastructure Commissioner)",
        "Budget allocations for approval process improvements",
        "Research from think tanks (e.g. Beyond Zero Emissions)",
        "Industry submissions to government consultations",
        "International best practice comparisons",
        "Case studies from approved and delayed renewable energy projects",
        "Public submissions from community consultations",
        "Approvals process analysis from OECD and IEA reports",
        "Comparisons with leading international jurisdictions (e.g. UK, Germany, Canada)",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review government policies and regulatory documents on approval processes." },
        { label: "Indicator Evaluation", desc: "Assess efficiency, regulatory clarity, environmental integration, and adaptability to zero-emissions technology." },
        { label: "Stakeholder Insights", desc: "Engage with project developers, policymakers, and industry experts to gather feedback on approval processes." },
        { label: "Case Study Analysis", desc: "Examine approval timelines, regulatory challenges, and project outcomes from recent zero-emissions projects." },
        { label: "Scoring Aggregation", desc: "Assign a score based on performance across key criteria." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Process Efficiency",
          weight: 0.2,
          scores: [
            "Approval processes are inefficient, unpredictable, and lengthy",
            "Some structured approval processes exist but remain slow and complex",
            "Timelines are lengthy, but there are emerging efforts to improve predictability",
            "Moderate efficiency with streamlined pathways for common renewable projects",
            "Highly efficient, transparent, and expedited approval pathways for zero-emissions projects",
          ],
        },
        {
          dimension: "Regulatory Clarity",
          weight: 0.2,
          scores: [
            "Unclear, inconsistent, and overlapping regulatory requirements across jurisdictions",
            "Some standardisation exists, but guidance remains vague or outdated",
            "Increasing clarity with improvements in cross-jurisdictional coordination",
            "Well-defined, transparent, and easy-to-navigate regulatory framework",
            "Highly consistent, transparent, and well-coordinated regulatory system with national harmonisation",
          ],
        },
        {
          dimension: "Environmental Integration",
          weight: 0.15,
          scores: [
            "Environmental considerations are minimal or weakly enforced",
            "Some environmental safeguards exist, but they lack comprehensive enforcement",
            "Moderate consideration of environmental impacts, with emerging criteria to enhance protections",
            "Strong integration of environmental and emissions criteria in approval processes",
            "Fully embedded environmental and climate impact criteria with science-based decision-making",
          ],
        },
        {
          dimension: "Support for Innovation",
          weight: 0.15,
          scores: [
            "Approval processes do not accommodate emerging zero-emissions technologies",
            "Some flexibility for innovation, but pathways remain unclear or slow",
            "Emerging frameworks for innovative technologies, but challenges remain",
            "Defined pathways for emerging technologies with improved flexibility",
            "Adaptive and innovation-friendly processes, ensuring rapid approval for emerging clean technologies",
          ],
        },
        {
          dimension: "Regional Adaptability",
          weight: 0.15,
          scores: [
            "Processes do not consider regional infrastructure needs or resource limitations",
            "Limited support for regional variations, small businesses, and community organisations",
            "Some regional adaptability with occasional dedicated resources",
            "Approval processes include structured regional pathways and support programs",
            "Fully tailored regional approval processes ensuring local needs, small-business accessibility, and just transition support",
          ],
        },
        {
          dimension: "Monitoring & Continuous Improvement",
          weight: 0.15,
          scores: [
            "No tracking or assessment mechanisms to improve the approvals process",
            "Increasing monitoring with internal evaluations, but no independent oversight",
            "Some periodic reviews, but no transparent accountability mechanisms",
            "Strong tracking mechanisms with independent audits and regular policy adjustments",
            "Highly transparent, independent evaluation processes with ongoing optimisation and stakeholder feedback integration",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Alignment (Severe Deficiency)",
          characteristics: [
            "Approval processes are inefficient and inconsistent, with limited prioritisation of zero-emissions projects",
            "Environmental considerations are minimal",
          ],
        },
        {
          score: 2,
          label: "Basic Alignment (Moderate Deficiency)",
          characteristics: [
            "Basic provisions for zero-emissions projects exist but approval timelines remain lengthy and guidance lacks specificity",
          ],
        },
        {
          score: 3,
          label: "Moderate Alignment (Developing)",
          characteristics: [
            "Basic provisions for zero-emissions projects exist, but timelines are lengthy, and environmental criteria are insufficiently detailed (they do not identify and commit to measures to minimise environmental harm and maximise environmental benefits)",
          ],
        },
        {
          score: 4,
          label: "Strong Alignment (Effective)",
          characteristics: [
            "Processes demonstrate moderate efficiency with streamlined pathways for common renewable projects",
            "Challenges remain for innovative technologies",
          ],
        },
        {
          score: 5,
          label: "Exemplary Alignment (Leading Practice)",
          characteristics: [
            "Processes are highly efficient, transparent, and adaptive, fully integrating environmental and emissions considerations in decision-making",
          ],
        },
      ],
  },
  "federal-investment-framework": {
      purpose: "To evaluate the level of support provided by the federal government's investment framework for zero-emissions initiatives. The assessment considers funding availability, strategic alignment with net-zero targets, incentivisation mechanisms, and accessibility of investment streams across sectors.",

      frameworkIntro: "Investment frameworks are assessed based on the following core dimensions:",
      frameworkItems: [
        "<b>Funding Availability</b> – Are sufficient, diverse funding streams available for various zero-emissions projects?",
        "<b>Strategic Alignment</b> – Does the framework align with national, regional, and sectoral transition goals?",
        "<b>Incentivisation Mechanisms</b> – Are there incentives to attract private sector investment and encourage industry transition?",
        "<b>Accessibility and Equity</b> – Is funding accessible across regions, industries, and innovation stages? Is there sufficient support for SMEs to access these funds?",
        "<b>Monitoring and Adaptability</b> – Are funding programs monitored, evaluated, and adapted to evolving needs?",
        "<b>Public-Private Collaboration</b> – Does the framework support partnerships between government, industry, and/or research bodies?",
      ],

      dataSources: [
        "Federal budget allocations for net-zero initiatives",
        "Reports from government agencies overseeing clean energy investments (ARENA, CEFC, Department of Industry, Science and Resources)",
        "Stakeholder interviews with policymakers, industry representatives, and researchers",
        "Cross-referencing national targets with regional investment patterns",
        "Climate Change Authority's Sector Pathways Review",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Collect and review relevant policy documents and budget papers." },
        { label: "Indicator Evaluation", desc: "Score each indicator based on available data and observations." },
        { label: "Stakeholder Insights", desc: "Gather expert opinions to validate findings." },
        { label: "Scoring Aggregation", desc: "Calculate the average score across indicators." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Funding Availability",
          weight: 0.2,
          scores: [
            "Limited or fragmented funding for zero-emissions initiatives",
            "Basic, ad-hoc funding for selected technologies",
            "Structured funding for core renewable energy projects",
            "Robust, multi-stream funding across sectors",
            "Comprehensive funding for diverse zero-emissions technologies",
          ],
        },
        {
          dimension: "Strategic Alignment",
          weight: 0.2,
          scores: [
            "No strategic alignment with net-zero goals",
            "Partial alignment with regional needs",
            "Emerging alignment with sectoral decarbonisation goals",
            "Strong alignment with net-zero transition needs",
            "Full integration with national and regional strategies",
          ],
        },
        {
          dimension: "Incentivisation Mechanisms",
          weight: 0.15,
          scores: [
            "No industry-specific incentives",
            "Limited incentives, with bureaucratic challenges",
            "Some incentives available; accessibility varies",
            "Clear and accessible incentives for industry",
            "Innovative, well-integrated incentives that promote public-private collaboration",
          ],
        },
        {
          dimension: "Accessibility and Equity",
          weight: 0.15,
          scores: [
            "Funding inaccessible to SMEs or regional projects",
            "Some access, but barriers exist for smaller businesses",
            "Funding available but not consistently equitable",
            "Strong funding access across industry sizes and regions",
            "Fully inclusive funding with tailored SME and regional support",
          ],
        },
        {
          dimension: "Monitoring and Adaptability",
          weight: 0.15,
          scores: [
            "No monitoring or adaptation mechanisms",
            "Basic oversight, but no clear pathways for policy refinement",
            "Some review mechanisms, but lacks structured adaptation",
            "Regular evaluation with adjustments based on impact",
            "Dynamic, evidence-based funding evolution with continuous policy refinement",
          ],
        },
        {
          dimension: "Public-Private Collaboration",
          weight: 0.15,
          scores: [
            "No structured partnerships between government, industry, and research",
            "Some collaboration, but weak industry engagement",
            "Moderate engagement with growing collaboration efforts",
            "Strong industry-government partnerships for decarbonisation",
            "Fully integrated investment ecosystem fostering innovation and cross-sector cooperation",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Investment Support (Severe Deficiency)",
          characteristics: [
            "Funding: Limited or fragmented funding for zero-emissions initiatives",
            "Alignment: No strategic alignment with net-zero goals",
            "Incentivisation: No industry-specific incentives",
          ],
        },
        {
          score: 2,
          label: "Basic Investment Support (Moderate Deficiency)",
          characteristics: [
            "Funding: Basic, ad-hoc funding for selected technologies",
            "Alignment: Partial alignment with regional needs",
            "Incentivisation: Limited incentives, with bureaucratic challenges",
          ],
        },
        {
          score: 3,
          label: "Moderate Investment Support (Developing)",
          characteristics: [
            "Funding: Structured funding for core renewable energy projects",
            "Alignment: Emerging alignment with sectoral decarbonisation goals",
            "Incentivisation: Some incentives available; accessibility varies",
          ],
        },
        {
          score: 4,
          label: "Strong Investment Support (Effective)",
          characteristics: [
            "Funding: Robust, multi-stream funding across sectors",
            "Alignment: Strong alignment with net-zero transition needs",
            "Incentivisation: Clear and accessible incentives for industry",
          ],
        },
        {
          score: 5,
          label: "Exemplary Investment Support (Leading Practice)",
          characteristics: [
            "Funding: Comprehensive funding for diverse zero-emissions technologies",
            "Alignment: Full integration with national and regional strategies",
            "Incentivisation: Innovative, well-integrated incentives that promote public-private collaboration",
          ],
        },
      ],
  },
  "federal-rd": {
      purpose: "To evaluate the level of support provided by the Australian Government's research and development (R&D) framework for clean technologies and industrial decarbonisation initiatives. The assessment considers funding levels, strategic alignment with net-zero goals, incentivisation mechanisms, and collaboration with research institutions and industry.",

      frameworkIntro: "R&D policies are assessed based on the following core dimensions:",
      frameworkItems: [
        "<b>Funding Availability</b> – Are sufficient, diverse funding streams available for research targeting clean technologies? Are the universities/Cooperative Research Centres sufficiently funded to take the tech from conceptualisation to lab tests?",
        "<b>Strategic Alignment</b> – Does the framework align with national, regional, and sectoral transition goals?",
        "<b>Collaboration and Partnerships</b> – Are there strong partnerships between government, industry, and research institutions?",
        "<b>Commercialisation and Market Readiness</b> – Is there support for translating research into market-ready solutions?",
        "<b>Monitoring and Adaptability</b> – Are R&D programs reviewed and adapted based on technological advancements and climate goals?",
        "<b>International Engagement</b> – Does the policy foster international collaboration and position the country as a global leader in zero-emissions research?",
      ],

      dataSources: [
        "Federal budget allocations for zero-emissions R&D initiatives",
        "Reports from ARENA, CEFC, and the Department of Industry, Science and Resources, universities, CSIRO",
        "Stakeholder interviews with industry experts, policymakers, and researchers",
        "Collaboration levels between national and international research bodies",
        "Climate Change Authority's Sector Pathways Review",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review government policy documents and funding programs." },
        { label: "Indicator Evaluation", desc: "Assess funding levels, strategic alignment, and collaborations." },
        { label: "Stakeholder Insights", desc: "Gather input from experts in government, industry, and academia." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Funding Availability",
          weight: 0.2,
          scores: [
            "Limited funding for zero-emissions R&D, minimal support for universities and CRCs",
            "Some funding available, but lacks a comprehensive strategy",
            "Established funding streams for core zero-emissions technologies",
            "Robust, targeted funding for critical sectors and emerging technologies",
            "Extensive, diversified funding covering all facets of zero-emissions R&D",
          ],
        },
        {
          dimension: "Strategic Alignment",
          weight: 0.2,
          scores: [
            "No alignment with net-zero or decarbonisation strategies",
            "Some alignment, but gaps remain in key sectors",
            "Emerging alignment with national and sectoral decarbonisation goals",
            "Strong alignment with sector-specific and regional transition plans",
            "Fully integrated with national and global net-zero transition goals",
          ],
        },
        {
          dimension: "Collaboration & Partnerships",
          weight: 0.15,
          scores: [
            "Minimal engagement with industry and research institutions",
            "Some partnerships exist, but collaboration is limited",
            "Increasing partnerships with universities, industry, and CRCs",
            "Deep, structured collaborations across sectors",
            "Strong, well-integrated research ecosystem fostering national and international partnerships",
          ],
        },
        {
          dimension: "Commercialisation & Market Readiness",
          weight: 0.15,
          scores: [
            "No structured pathways for commercialising clean technologies",
            "Basic commercialisation support, but lacking market incentives",
            "Some commercialisation pathways exist, but challenges remain",
            "Well-developed funding and support for scaling emerging technologies",
            "Highly effective commercialisation pathways, accelerating clean tech adoption and industrial applications",
          ],
        },
        {
          dimension: "Monitoring & Adaptability",
          weight: 0.15,
          scores: [
            "No tracking or evaluation mechanisms for R&D initiatives",
            "Basic review structures exist, but no structured adaptability",
            "Some monitoring mechanisms, but limited policy refinement",
            "Well-established evaluation and feedback systems",
            "Dynamic, evidence-based policy refinements ensuring continuous R&D optimisation",
          ],
        },
        {
          dimension: "International Engagement",
          weight: 0.15,
          scores: [
            "No engagement in global research efforts or collaborations",
            "Limited participation in international partnerships",
            "Growing engagement in global cleantech research networks",
            "Strong international partnerships, fostering knowledge exchange",
            "Positioned as a global leader in zero-emissions research and innovation",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Support (Severe Deficiency)",
          characteristics: [
            "Limited funding for zero-emissions R&D, minimal engagement with industry and research institutions, lack of strategic direction for sustainable innovation",
          ],
        },
        {
          score: 2,
          label: "Basic Support (Moderate Deficiency)",
          characteristics: [
            "Some funding available but lacking a comprehensive strategy, modest collaboration with research institutions, fragmented support for early-stage low-emission technologies",
          ],
        },
        {
          score: 3,
          label: "Moderate Support (Developing)",
          characteristics: [
            "Established funding streams for core zero-emissions technologies, increasing prioritisation of climate-related R&D, emerging partnerships with universities, research bodies, and industry",
          ],
        },
        {
          score: 4,
          label: "Strong Support (Effective)",
          characteristics: [
            "Robust, targeted funding mechanisms for critical sectors, comprehensive R&D strategies aligned with net-zero goals, deep collaborations with industry, academia, and international stakeholders",
          ],
        },
        {
          score: 5,
          label: "Exemplary Support (Leading Practice)",
          characteristics: [
            "Extensive, diversified funding covering all facets of zero-emissions R&D, strong alignment with national net-zero transition plans, highly collaborative research ecosystem with rapid commercialisation pathways",
          ],
        },
      ],
  },
  "federal-procurement": {
      purpose: "To evaluate the effectiveness of federal government procurement policies in advancing zero-emissions objectives through a structured, transparent, and evidence-based framework. The assessment focuses on policy clarity, supplier incentives, implementation consistency, and contribution to sustainable market development.",

      frameworkIntro: "Procurement policies are assessed based on the following core dimensions:",
      frameworkItems: [
        "<b>Policy Clarity and Requirements</b> – Do procurement policies include clear, enforceable guidelines for zero-emissions products and services?",
        "<b>Supplier Incentives</b> – Are financial or preferential incentives provided to suppliers using sustainable practices and low-emission materials? Is there support (funding, training, equipment, staff) for local businesses and First Nations businesses to develop their capacity so they can take up procurement opportunities?",
        "<b>Implementation Consistency</b> – Are sustainability requirements applied uniformly across government departments and contracts?",
        "<b>Monitoring and Compliance</b> – Is there a system to track supplier adherence to zero-emissions procurement policies?",
        "<b>Demand-Side Market Development</b> – Does procurement create stable demand for zero-emissions goods and services?",
        "<b>Innovation and Collaboration</b> – Do policies encourage new technology adoption and collaboration with industry for improved sustainability practices?",
      ],

      dataSources: [
        "Federal procurement policies and sustainability mandates (e.g. Future Made in Australia Bill, Environmentally Sustainable Procurement Policy)",
        "Major government tenders and contract requirements, e.g. Infrastructure Australia guidelines for the Capacity Investment Scheme and Rewiring the Nation",
        "Studies from think tanks, reports on sustainable procurement best practices",
        "Global comparisons from OECD, UN, and other international bodies",
        "Supply chain assessments on procurement processes and barriers (e.g. BZE's Cleantech Supply Chains briefing papers and Make it Here report)",
        "Interviews with industry stakeholders and procurement officers",
        "Supplier compliance and monitoring mechanisms",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review government procurement policies and tender requirements." },
        { label: "Indicator Evaluation", desc: "Assess the extent of sustainability criteria and supplier incentives." },
        { label: "Stakeholder Insights", desc: "Gather input from procurement officers, suppliers, and policy experts." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Policy Clarity and Requirements",
          weight: 0.2,
          scores: [
            "Policies contain vague sustainability mentions, lack enforceable criteria",
            "Some sustainability criteria exist but lack enforcement",
            "Structured guidelines for low-emission products with emerging enforcement",
            "Increasing consistency in sustainability requirements across departments",
            "Comprehensive zero-emissions procurement policy with strict enforcement",
          ],
        },
        {
          dimension: "Supplier Incentives",
          weight: 0.2,
          scores: [
            "No financial or preferential support for zero-emissions suppliers",
            "Limited incentives exist, but are inconsistently applied",
            "Moderate incentives for sustainable suppliers, but with gaps in funding or access",
            "Strong financial and preferential incentives for sustainable suppliers",
            "Best-practice supplier incentives, including First Nations and SME support programs",
          ],
        },
        {
          dimension: "Implementation Consistency",
          weight: 0.15,
          scores: [
            "Sustainability requirements are applied inconsistently across departments",
            "Some procurement contracts include sustainability clauses, but enforcement is weak",
            "Some consistency across departments but room for improved enforcement",
            "Well-integrated procurement policy with cross-government alignment",
            "Fully harmonised and standardised sustainability procurement framework",
          ],
        },
        {
          dimension: "Monitoring & Compliance",
          weight: 0.15,
          scores: [
            "No tracking of supplier compliance with sustainability policies",
            "Limited monitoring, but no penalties or improvement mechanisms",
            "Moderate compliance tracking, but enforcement gaps remain",
            "Strong compliance enforcement with transparent reporting",
            "Highly structured compliance system with independent audits and full transparency",
          ],
        },
        {
          dimension: "Demand-Side Market Development",
          weight: 0.15,
          scores: [
            "Procurement does not create meaningful demand for zero-emissions products",
            "Some market creation, but weak industry engagement",
            "Procurement influences market development for key technologies",
            "Well-structured procurement programs supporting stable market demand",
            "Strong procurement leadership actively driving zero-emissions market expansion",
          ],
        },
        {
          dimension: "Innovation & Collaboration",
          weight: 0.15,
          scores: [
            "No focus on emerging zero-emissions technologies or industry collaboration",
            "Some engagement with industry, but weak incentives for innovation",
            "Moderate industry partnerships with pilot initiatives in place",
            "Strong collaboration with industry and research for sustainable innovation",
            "Fully integrated procurement policies that foster zero-emissions technology adoption and commercialisation",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Support (Severe Deficiency)",
          characteristics: [
            "Policies contain vague sustainability mentions, lack enforceable criteria, and provide little or no supplier incentives",
          ],
        },
        {
          score: 2,
          label: "Basic Support (Moderate Deficiency)",
          characteristics: [
            "Some sustainability criteria exist, but their application is inconsistent and offers limited incentives for suppliers",
          ],
        },
        {
          score: 3,
          label: "Moderate Support (Developing)",
          characteristics: [
            "Structured guidelines for low-emission products, with growing supplier incentives and moderate compliance enforcement",
          ],
        },
        {
          score: 4,
          label: "Strong Support (Effective)",
          characteristics: [
            "Well-integrated sustainability requirements, significant supplier incentives, and consistent monitoring and enforcement",
          ],
        },
        {
          score: 5,
          label: "Exemplary Support (Leading Practice)",
          characteristics: [
            "Procurement actively drives zero-emissions innovation, with strong supplier partnerships and comprehensive policy enforcement",
          ],
        },
      ],
  },

  "state-emissions-commitment": {
      purpose: "To evaluate the relevant state government's emissions reduction commitment in driving progress towards decarbonisation and alignment with the 1.5°C target and net-zero goals. The assessment focuses on target ambition, policy enforcement, funding allocation, sectoral coverage, and regulatory alignment.",

      frameworkIntro: "The assessment framework evaluates the state's emissions reduction commitment based on the following key categories:",
      frameworkItems: [
        "<b>Target Ambition</b> – Measures alignment with science-based pathways, interim targets, and zero emission goals. A target of 75% emissions reduction by 2035 below 2005 levels is used as a benchmark.",
        "<b>Policy Enforcement</b> – Examines the presence of legal mechanisms, accountability structures, and effectiveness of implementation.",
        "<b>Sectoral Coverage</b> – Assesses the inclusiveness of high-emission industries and the integration of multi-sectoral policies.",
        "<b>Economic Incentives</b> – Evaluates funding, subsidies, and financial support for emissions reduction initiatives.",
        "<b>Stakeholder Engagement</b> – Considers collaboration with industry, communities, and policymakers to ensure effective policy implementation.",
        "<b>Progress Monitoring</b> – Reviews the presence of independent oversight bodies and transparent reporting mechanisms.",
      ],

      dataSources: [
        "Climate Action Tracker and similar international rating agencies",
        "State emissions reduction targets and their legal enforcement mechanisms",
        "Policy alignment with state, national, and international net-zero goals",
        "Budget allocations and financial incentives for emissions reduction",
        "Sector-specific strategies, including energy, transport, industry, and land use",
        "Progress monitoring through independent commissions or reporting bodies",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review state emissions reduction policies and legal commitments." },
        { label: "Indicator Evaluation", desc: "Assess target ambition, enforcement mechanisms, and policy coverage." },
        { label: "Stakeholder Insights", desc: "Engage with government officials, industry representatives, and climate researchers." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Target Ambition",
          weight: 0.2,
          scores: [
            "Weak, outdated, or symbolic targets misaligned with 1.5°C pathway",
            "Partial net-zero alignment with limited ambition",
            "Legally binding targets, broadly aligned with net-zero by 2050",
            "Science-based targets with significant 2030 reduction goals",
            "Exceeds international benchmarks, detailed interim milestones",
          ],
        },
        {
          dimension: "Policy Enforcement",
          weight: 0.2,
          scores: [
            "No enforceable emissions reduction policies",
            "Some policies exist but with weak enforcement",
            "Policies in place with moderate regulatory oversight",
            "Comprehensive policies with strong accountability",
            "Strong regulatory framework with continuous enforcement and oversight",
          ],
        },
        {
          dimension: "Sectoral Coverage",
          weight: 0.15,
          scores: [
            "No sector-specific policies or industry coverage",
            "Limited sectoral coverage, with gaps in high-emission industries",
            "Multiple sectors addressed but implementation is inconsistent",
            "Comprehensive, enforceable policies across all sectors",
            "Fully integrated multi-sector approach with strong inter-agency coordination",
          ],
        },
        {
          dimension: "Economic Incentives",
          weight: 0.15,
          scores: [
            "No or minimal funding and incentives for decarbonisation",
            "Some subsidies and incentives exist but with limited reach",
            "Moderate funding for emissions reduction programs",
            "Significant financial incentives supporting industry transitions",
            "Fully funded incentives driving technological and industrial transformation",
          ],
        },
        {
          dimension: "Stakeholder Engagement",
          weight: 0.15,
          scores: [
            "No engagement with industry, communities, or experts",
            "Limited or one-time stakeholder engagement",
            "Ongoing engagement with industry and community, but inconsistent",
            "Strong collaboration with industry, communities, and academia",
            "Institutionalised stakeholder engagement ensuring continuous feedback and adaptation",
          ],
        },
        {
          dimension: "Progress Monitoring",
          weight: 0.15,
          scores: [
            "No tracking or independent oversight mechanisms",
            "Some tracking but lacks transparency or enforcement",
            "Periodic progress reporting with moderate oversight",
            "Strong independent monitoring and accountability frameworks",
            "Best-practice reporting mechanisms with third-party verification and adaptive policies",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Commitment (Severe Deficiency)",
          characteristics: [
            "Targets are outdated or unambitious, with symbolic policies lacking enforcement or measurable outcomes",
            "Few or no sector-specific policies or funding allocations",
            "Minimal regulatory enforcement and accountability mechanisms",
          ],
        },
        {
          score: 2,
          label: "Basic Commitment (Moderate Deficiency)",
          characteristics: [
            "Targets address some emissions sources but lack full net-zero alignment",
            "Limited integration of sectoral strategies and moderate resource allocation",
            "Some incentives for emissions reduction but inconsistently applied",
          ],
        },
        {
          score: 3,
          label: "Moderate Commitment (Developing)",
          characteristics: [
            "Legally binding emissions targets, generally aligning with net-zero by 2050",
            "Policies addressing multiple sectors with moderate financial support",
            "Industry and community partnerships for emissions reduction but uneven implementation",
          ],
        },
        {
          score: 4,
          label: "Strong Commitment (Effective)",
          characteristics: [
            "Ambitious, science-based targets aligning with significant reductions by 2030 and 2035 and net-zero by 2050",
            "Comprehensive, enforceable policies and strong regulatory frameworks",
            "Well-funded incentives for low emission technologies and sectoral transitions",
          ],
        },
        {
          score: 5,
          label: "Exemplary Commitment (Leading Practice)",
          characteristics: [
            "Targets exceed international benchmarks, with detailed interim milestones for 2030 and 2035 and net-zero by 2050",
            "Integrated policies with strong regulatory accountability and clean technology incentives",
            "Continuous policy review, stakeholder collaboration, and substantial investment in zero-emissions innovation",
          ],
        },
      ],
  },
  "state-skills-training": {
      purpose: "To evaluate the effectiveness of the relevant state government's skills and training policy in facilitating the workforce transition to a zero-emissions economy. The assessment focuses on funding, alignment with industry needs, workforce transition strategies, and long-term planning.",

      frameworkIntro: "State skills and training policies are assessed based on the following core dimensions:",
      frameworkItems: [
        "<b>Policy Alignment and Strategy</b> – Is there a clear, structured plan for training the workforce in zero-emissions sectors, aligned with state decarbonisation goals?",
        "<b>Funding and Resource Allocation</b> – Are there dedicated financial resources and incentives to support zero-emissions skills training, and workforce development and facilities?",
        "<b>Industry and Educational Collaboration</b> – Is there active engagement between government, industry, and educational institutions to develop sector-specific training?",
        "<b>Workforce Planning and Strategy</b> – Is there a clear, strategic workforce transition plan that aligns with national and regional energy transition goals?",
        "<b>Implementation and Accessibility</b> – Are programs effectively delivered and accessible to affected sectors and communities?",
        "<b>Outcomes and Continuous Improvement</b> – Are there mechanisms to track progress, refine strategies and adapt to emerging challenges?",
      ],

      dataSources: [
        "State government workforce development policies and investment plans",
        "Budget allocations for renewable energy training and skills initiatives",
        "Engaging with industry stakeholders, training institutions, and regional workforce development agencies",
        "Collaboration mechanisms between government, education providers, and industry partners",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review state workforce development policies and training programs." },
        { label: "Indicator Evaluation", desc: "Assess funding levels, strategic planning, and collaboration efforts." },
        { label: "Stakeholder Insights", desc: "Gather input from industry representatives, training institutions, and government bodies." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Policy Commitment",
          weight: 0.2,
          scores: [
            "No targeted programs or workforce transition recognition",
            "Some recognition but lacks integration with transition planning",
            "Recognises workforce skilling as important but lacks full coordination",
            "Strong commitment with structured policy integration",
            "Comprehensive, long-term commitment with strategic workforce alignment",
          ],
        },
        {
          dimension: "Funding & Resources",
          weight: 0.2,
          scores: [
            "No funding allocated for workforce transition",
            "Limited or one-off funding for training programs",
            "Some funding but lacks scalability or sustainability",
            "Well-funded, long-term workforce programs with strong institutional backing",
            "Sustainable funding model ensuring long-term industry and regional workforce transformation",
          ],
        },
        {
          dimension: "Industry & Education Collaboration",
          weight: 0.15,
          scores: [
            "No collaboration between government, industry, and education providers",
            "Some engagement but lacks depth and coordination",
            "Moderate collaboration with emerging industry partnerships",
            "Strong industry partnerships embedded in policy implementation",
            "Deeply integrated government, industry, and education partnerships with continuous feedback mechanisms",
          ],
        },
        {
          dimension: "Workforce Planning & Strategy",
          weight: 0.15,
          scores: [
            "No workforce transition plan or strategic direction",
            "Basic workforce initiatives exist but lack clear long-term planning",
            "Recognises workforce needs but implementation gaps remain",
            "Comprehensive workforce planning with sectoral strategies",
            "Best-practice workforce strategy, aligned with national and regional economic transitions",
          ],
        },
        {
          dimension: "Implementation & Accessibility",
          weight: 0.15,
          scores: [
            "No access to reskilling/upskilling programs for workers",
            "Limited access, with barriers for affected workers and communities",
            "Some training programs exist but not widely available or tailored",
            "Well-structured, inclusive training programs supporting multiple sectors",
            "Fully accessible, diverse workforce transition programs with national coverage",
          ],
        },
        {
          dimension: "Outcomes & Continuous Improvement",
          weight: 0.15,
          scores: [
            "No tracking or evaluation of program effectiveness",
            "Limited monitoring with no process for policy improvement",
            "Some tracking mechanisms but lacks transparent accountability",
            "Well-developed tracking systems with periodic review and improvements",
            "Leading model for adaptive policy, with iterative improvements based on real-world outcomes",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Support (Severe Deficiency)",
          characteristics: [
            "Isolated training initiatives lacking coordination with industry and education providers",
            "Minimal funding for renewables and low-emission technologies",
            "Few efforts to reskill workers from carbon-intensive sectors",
            "No investment in training facilities",
          ],
        },
        {
          score: 2,
          label: "Basic Support (Moderate Deficiency)",
          characteristics: [
            "General training programs for clean industries with limited coverage",
            "Some collaboration with institutions, but inconsistent application",
            "Limited funding for worker reskilling, particularly in regional areas",
            "No or low investment in training facilities",
          ],
        },
        {
          score: 3,
          label: "Moderate Support (Developing)",
          characteristics: [
            "Developed training initiatives for renewable energy, energy efficiency, and green industries",
            "Moderate collaboration with education and industry partners",
            "Available funding for workforce reskilling and upskilling",
            "Low to moderate investment in training facilities",
          ],
        },
        {
          score: 4,
          label: "Strong Support (Effective)",
          characteristics: [
            "Comprehensive, sector-specific training programs in renewable energy, green construction, and sustainability",
            "Strong partnerships with institutions, local councils, and industries",
            "Well-funded reskilling programs and training facilities in all regions",
          ],
        },
        {
          score: 5,
          label: "Exemplary Support (Leading Practice)",
          characteristics: [
            "Extensive funding and accessible training for all key zero-emissions sectors",
            "Integrated, holistic workforce strategy with ongoing industry collaboration",
            "Continuous policy evaluation and adaptability to workforce demands",
            "Strong investment in reskilling for carbon-intensive industries",
            "Active skills and training communications plan to attract uptake",
          ],
        },
      ],
  },
  "state-approvals": {
      purpose: "To evaluate the relevant state government's approvals processes for renewable energy and zero-emissions projects in supporting emissions reduction objectives. The assessment focuses on the efficiency, transparency, and consistency of approval mechanisms, as well as the prioritisation of decarbonisation goals.",

      frameworkIntro: "The assessment framework evaluates the state's approvals processes based on the following categories:",
      frameworkItems: [
        "<b>Efficiency</b> – Measures approval timelines and procedural streamlining.",
        "<b>Transparency</b> – Assesses clarity and accessibility of approval processes.",
        "<b>Sectoral Consistency</b> – Evaluates the uniform application of emissions reduction criteria across industries.",
        "<b>Flexibility for Innovation</b> – Considers adaptability for emerging zero-emissions technologies.",
        "<b>Inter-Agency Coordination</b> – Reviews collaboration between regulatory bodies to facilitate timely approvals.",
      ],

      dataSources: [
        "State approval policies for renewable energy projects and emissions reduction initiatives",
        "Approval timelines for various project types",
        "Engagement with government agencies, industry representatives, and independent advisory panels",
        "Coordination evidence between agencies and the integration of emissions reduction criteria",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review state approval frameworks and policies." },
        { label: "Indicator Evaluation", desc: "Assess efficiency, transparency, and emissions reduction integration." },
        { label: "Stakeholder Insights", desc: "Gather feedback from industry representatives, regulators, and experts." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Efficiency",
          weight: 0.3,
          scores: [
            "Lengthy and inconsistent approval timelines",
            "Some standardisation but approvals remain slow",
            "Predictable and transparent approval timelines",
            "Expedited approvals for renewables",
            "Fully streamlined, fast-track approvals for all zero-emissions projects",
          ],
        },
        {
          dimension: "Transparency",
          weight: 0.25,
          scores: [
            "Opaque processes with limited public access",
            "Some public reporting but lacks accessibility",
            "Increasing clarity in approval processes",
            "Fully transparent, well-documented public processes",
            "Open access to all approval decisions with real-time reporting",
          ],
        },
        {
          dimension: "Sectoral Consistency",
          weight: 0.2,
          scores: [
            "No prioritisation for zero-emissions projects",
            "Some prioritisation but inconsistently applied",
            "Prioritisation mechanisms exist but with gaps",
            "Strong prioritisation of low-carbon projects",
            "Universal prioritisation of decarbonisation across all project types",
          ],
        },
        {
          dimension: "Flexibility for Innovation",
          weight: 0.15,
          scores: [
            "No special consideration for emerging technologies",
            "Some pathways exist but are difficult to navigate",
            "Moderate adaptability for innovative zero-emissions tech",
            "Dedicated fast-track pathways for clean technology",
            "Fully integrated adaptive approvals for cutting-edge innovations",
          ],
        },
        {
          dimension: "Inter-Agency Coordination",
          weight: 0.1,
          scores: [
            "No collaboration between regulatory bodies",
            "Some inter-agency engagement, but unstructured",
            "Growing coordination, but efficiency gaps remain",
            "Strong inter-agency alignment reducing project delays",
            "Fully harmonised approvals process across all state regulatory bodies",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Alignment (Severe Deficiency)",
          characteristics: [
            "No prioritisation of renewable energy projects",
            "Lengthy and inconsistent approval timelines",
            "Minimal integration of emissions impact in assessment criteria",
          ],
        },
        {
          score: 2,
          label: "Basic Alignment (Moderate Deficiency)",
          characteristics: [
            "Standardised timelines exist, but without prioritisation mechanisms for zero-emissions projects",
            "Moderate emissions reduction considerations in decision-making",
            "Limited inter-agency coordination, leading to project delays",
          ],
        },
        {
          score: 3,
          label: "Moderate Alignment (Developing)",
          characteristics: [
            "Predictable and transparent approval timelines",
            "Growing focus on emissions reduction within decision-making frameworks",
            "Established but unevenly applied approval pathways for zero-emissions technologies",
          ],
        },
        {
          score: 4,
          label: "Strong Alignment (Effective)",
          characteristics: [
            "Expedited approvals for renewable energy and low-emission projects",
            "Consistent application of emissions reduction criteria across all sectors",
            "Strong inter-agency coordination to reduce project delays",
          ],
        },
        {
          score: 5,
          label: "Exemplary Alignment (Leading Practice)",
          characteristics: [
            "Fully streamlined, fast-track approvals for all zero-emissions projects",
            "Comprehensive integration of emissions reduction across all regulatory criteria",
            "High levels of inter-agency and stakeholder collaboration, with continuous process improvements",
          ],
        },
      ],
  },
  "state-investment-framework": {
      purpose: "To evaluate the relevant state government's investment framework for the zero-emissions transition in recognising and prioritising investment needs and opportunities through a reputable and future-focused approach. The assessment focuses on funding mechanisms, strategic planning, incentives, and support for clean energy infrastructure, innovative technology, and industry transformation.",

      frameworkIntro: "The assessment framework evaluates the state's investment approach based on the following categories:",
      frameworkItems: [
        "<b>Funding Mechanisms</b> – Availability, scale, and consistency of investment in zero-emissions projects.",
        "<b>Strategic Planning</b> – Alignment with net-zero goals and integration across economic sectors.",
        "<b>Industry Support</b> – Incentives for private sector investment and business transition.",
        "<b>Regional Impact</b> – Investment in high-emission regions and just transition initiatives.",
        "<b>Implementation and Adaptability</b> – Efficiency, monitoring, and responsiveness to evolving market needs.",
      ],

      dataSources: [
        "Reviewing state government investment policies for clean energy, industry decarbonisation, and emerging zero-emissions technologies",
        "Analysing funding commitments and financial mechanisms supporting zero-emissions projects",
        "Assessing the role of incentives and public-private partnerships in driving investment",
        "Evaluating the strategic alignment of investment frameworks with net-zero objectives",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review state investment policies and funding mechanisms." },
        { label: "Indicator Evaluation", desc: "Assess financial support, strategic planning, and incentives." },
        { label: "Stakeholder Insights", desc: "Engage with industry representatives, policymakers, and climate finance experts." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Funding Mechanisms",
          weight: 0.3,
          scores: [
            "Small, fragmented funding pools with low impact",
            "Some renewables funding, but inconsistent",
            "Established funding for clean energy transition",
            "Robust, diversified funding for clean industries",
            "Comprehensive, sustainable funding for all zero-emissions projects",
          ],
        },
        {
          dimension: "Strategic Planning",
          weight: 0.25,
          scores: [
            "No alignment with state net-zero goals",
            "Limited integration with economic sectors",
            "Emerging alignment with industry transformation needs",
            "Strong integration with net-zero and economic transition plans",
            "Fully aligned with national and regional decarbonisation strategies",
          ],
        },
        {
          dimension: "Industry Support",
          weight: 0.2,
          scores: [
            "No incentives for private investment",
            "Some incentives exist but lack impact",
            "Moderate industry incentives for clean tech and renewables",
            "Strong industry investment support and transition programs",
            "Best-practice incentives driving large-scale industrial transformation",
          ],
        },
        {
          dimension: "Regional Impact",
          weight: 0.15,
          scores: [
            "No support for high-emission or transitioning regions",
            "Some regional investment but lacks a just transition focus",
            "Moderate regional investment for emissions reduction",
            "Well-funded regional transition programs and job creation initiatives",
            "Full just transition funding ensuring economic resilience in affected regions",
          ],
        },
        {
          dimension: "Implementation & Adaptability",
          weight: 0.1,
          scores: [
            "No tracking of investment effectiveness",
            "Some monitoring but lacks adaptability",
            "Moderate evaluation mechanisms in place",
            "Strong monitoring with regular policy adjustments",
            "Best-practice, data-driven investment optimisation ensuring effectiveness",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Investment Support (Severe Deficiency)",
          characteristics: [
            "Small, isolated funding pools with low impact",
            "Minimal prioritisation of low-emission industries",
            "Limited alignment with regional and economic needs",
          ],
        },
        {
          score: 2,
          label: "Basic Investment Support (Moderate Deficiency)",
          characteristics: [
            "Some funding for renewables, but inconsistent",
            "Moderate alignment with net-zero goals",
            "Limited incentives for industry transition",
          ],
        },
        {
          score: 3,
          label: "Moderate Investment Support (Developing)",
          characteristics: [
            "Established funding for clean energy and sectoral transition",
            "Supportive policies but uneven implementation",
            "Some incentives for businesses, with improving accessibility",
          ],
        },
        {
          score: 4,
          label: "Strong Investment Support (Effective)",
          characteristics: [
            "Robust funding for renewables, energy storage, and clean industries",
            "Strong alignment with state economic and climate goals",
            "Significant incentives supporting industry innovation and regional growth",
          ],
        },
        {
          score: 5,
          label: "Exemplary Investment Support (Leading Practice)",
          characteristics: [
            "Extensive funding covering all facets of the zero-emissions economy",
            "Strong support for innovation and emerging technologies",
            "Sustainable funding mechanisms ensuring long-term transition success",
          ],
        },
      ],
  },
  "state-rd": {
      purpose: "To assess the relevant state government's research and development (R&D) policies in supporting the zero-emissions transition. The assessment focuses on funding mechanisms, strategic planning, industry collaboration, and support for clean energy technologies, innovation, and commercialisation.",

      frameworkIntro: "The assessment framework evaluates the State's R&D support based on the following categories:",
      frameworkItems: [
        "<b>Funding and Resources</b> – Availability, scale, and consistency of investment in zero-emissions research.",
        "<b>Strategic Planning</b> – Alignment with net-zero goals and integration across economic sectors.",
        "<b>Industry and Research Collaboration</b> – Support for partnerships between universities, research institutions, and industry.",
        "<b>Commercialisation and Innovation</b> – Pathways for bringing new technologies from research to market.",
        "<b>Policy Adaptability</b> – Mechanisms for ongoing evaluation and updates based on climate science and technological advancements.",
      ],

      dataSources: [
        "State investment policies for clean technology R&D and industry innovation",
        "Funding commitments and financial mechanisms supporting zero-emissions research",
        "Role of partnerships between government, industry, and research institutions",
        "Evaluating the alignment of R&D initiatives with net-zero objectives",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review state R&D policies and funding mechanisms." },
        { label: "Indicator Evaluation", desc: "Assess financial support, strategic planning, and collaboration efforts." },
        { label: "Stakeholder Insights", desc: "Engage with industry leaders, research institutions, and policymakers." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Funding and Resources",
          weight: 0.3,
          scores: [
            "Limited or fragmented funding for R&D",
            "Some funding but lacks consistency",
            "Established funding for core clean energy research",
            "Robust and diversified funding streams",
            "Comprehensive, long-term R&D funding strategy",
          ],
        },
        {
          dimension: "Strategic Planning",
          weight: 0.25,
          scores: [
            "No alignment with net-zero or innovation goals",
            "Some alignment but lacks coherence",
            "Growing alignment with clean energy innovation needs",
            "Strong integration with economic and sustainability strategies",
            "Fully embedded in national and global decarbonisation frameworks",
          ],
        },
        {
          dimension: "Industry and Research Collaboration",
          weight: 0.2,
          scores: [
            "No structured collaboration between industry and research",
            "Limited engagement with research institutions",
            "Moderate engagement in research partnerships",
            "Deep partnerships with industry and universities",
            "Best-practice innovation ecosystem with international partnerships",
          ],
        },
        {
          dimension: "Commercialisation and Innovation",
          weight: 0.15,
          scores: [
            "No pathways for clean technology commercialisation",
            "Basic commercialisation support with limited market pathways",
            "Moderate support for moving research to market",
            "Strong commercialisation funding and market readiness programs",
            "Leading global model for clean tech commercialisation",
          ],
        },
        {
          dimension: "Policy Adaptability",
          weight: 0.1,
          scores: [
            "No mechanisms for policy review or adaptation",
            "Some evaluation mechanisms but lacks transparency",
            "Moderate review processes in place",
            "Well-established evaluation with industry consultation",
            "Fully dynamic, evidence-based policy refinement processes",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Support (Severe Deficiency)",
          characteristics: [
            "Few or isolated programs with little impact",
            "Minimal funding or industry engagement",
            "Limited innovation and progress",
          ],
        },
        {
          score: 2,
          label: "Basic Support (Moderate Deficiency)",
          characteristics: [
            "Some funding and grants for clean energy research",
            "Limited collaboration with research institutions",
            "Fragmented support for early-stage development",
          ],
        },
        {
          score: 3,
          label: "Moderate Support (Developing)",
          characteristics: [
            "Established funding streams for renewable energy and energy storage research",
            "Moderate integration with net-zero objectives",
            "Partnerships with industry and academia",
          ],
        },
        {
          score: 4,
          label: "Strong Support (Effective)",
          characteristics: [
            "Robust funding across key sectors such as renewables, electrification, and green manufacturing",
            "Comprehensive strategy aligning with net-zero goals",
            "Deep industry-research partnerships supporting innovation",
          ],
        },
        {
          score: 5,
          label: "Exemplary Support (Leading Practice)",
          characteristics: [
            "Extensive, diversified funding for all aspects of clean technology research",
            "Strong collaboration with national and international stakeholders",
            "Ongoing evaluation and policy adaptation ensuring continuous innovation",
          ],
        },
      ],
  },
  "state-procurement": {
      purpose: "To assess the effectiveness of the relevant state government's local procurement policies in supporting zero-emissions objectives and local suppliers. The assessment focuses on policy integration, incentives, enforcement mechanisms, and alignment with state sustainability goals.",

      frameworkIntro: "The assessment framework evaluates the state's procurement policies based on the following categories:",
      frameworkItems: [
        "<b>Policy Integration</b> – Strength of sustainability and emissions reduction requirements in procurement guidelines.",
        "<b>Incentives for Suppliers</b> – Availability of financial and non-financial support for local and low-emission suppliers.",
        "<b>Enforcement and Transparency</b> – Mechanisms ensuring consistent application of procurement policies across departments.",
        "<b>Alignment with Net-Zero Goals</b> – Extent to which procurement policies contribute to regional and state-wide decarbonisation.",
        "<b>Supplier Engagement and Innovation</b> – Collaboration with suppliers to advance sustainable procurement practices.",
      ],

      dataSources: [
        "Reviewing state procurement policies for sustainability and local sourcing requirements",
        "Analysing financial mechanisms supporting zero-emissions suppliers",
        "Assessing monitoring and enforcement mechanisms ensuring compliance",
        "Evaluating alignment with state net-zero goals and regional economic development strategies",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review government policies and workforce development strategies." },
        { label: "Indicator Evaluation", desc: "Assess funding, industry collaboration, and accessibility of training programs." },
        { label: "Stakeholder Insights", desc: "Engage with industry leaders, training institutions, and workforce representatives." },
        { label: "Case Study Analysis", desc: "Examine existing workforce transition initiatives and their effectiveness." },
        { label: "Scoring Aggregation", desc: "Assign a score based on performance across key criteria." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score and identify areas for improvement." },
      ],

      weightingTable: [
        {
          dimension: "Policy Integration",
          weight: 0.25,
          scores: [
            "Basic sustainability guidelines without enforceable zero-emissions requirements",
            "Partial inclusion of emissions reduction in procurement policies",
            "Established criteria for sustainable products with moderate prioritisation of zero-emissions suppliers",
            "Clear guidelines requiring low-emission, local suppliers in key procurement areas",
            "Comprehensive mandates prioritising zero-emissions and local suppliers in all procurement decisions",
          ],
        },
        {
          dimension: "Incentives for Suppliers",
          weight: 0.2,
          scores: [
            "Weak incentives for local suppliers adopting green practices",
            "Modest prioritisation of local suppliers but with weak enforcement",
            "Incentives available for green suppliers, but not widely accessible",
            "Significant incentives for suppliers adopting sustainable practices",
            "Extensive financial and strategic support for suppliers transitioning to zero-emissions practices",
          ],
        },
        {
          dimension: "Enforcement and Transparency",
          weight: 0.2,
          scores: [
            "No enforcement mechanisms, policies applied inconsistently across departments",
            "Some consistency across departments but room for improved enforcement",
            "Consistent application across departments, but room for improved enforcement",
            "Strong compliance mechanisms ensuring sustainability standards are met across departments",
            "Full enforcement with independent auditing and transparent reporting",
          ],
        },
        {
          dimension: "Alignment with Net-Zero Goals",
          weight: 0.2,
          scores: [
            "Low prioritisation of zero-emissions procurement",
            "Moderate alignment with state net-zero goals",
            "Strong alignment with regional and state-wide decarbonisation targets",
            "Very strong alignment with regional and state-wide decarbonisation targets",
            "Policies fully aligned with state net-zero targets and regional economic development objectives",
          ],
        },
        {
          dimension: "Supplier Engagement and Innovation",
          weight: 0.15,
          scores: [
            "No collaboration or capacity-building programs for suppliers",
            "Moderate collaboration with suppliers to advance sustainable procurement practices",
            "Strong collaboration with suppliers including innovation incentives",
            "Very strong collaboration with suppliers including innovation incentives",
            "Extensive, ongoing collaboration and capacity building for suppliers to innovate and adopt zero-emissions practices",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Support (Severe Deficiency)",
          characteristics: [
            "Basic sustainability guidelines without enforceable low-emission requirements",
            "Weak incentives for local suppliers adopting green practices",
            "Low prioritisation of zero-emissions procurement",
          ],
        },
        {
          score: 2,
          label: "Basic Support (Moderate Deficiency)",
          characteristics: [
            "Partial inclusion of emissions reduction in procurement policies",
            "Modest prioritisation of local suppliers but with weak enforcement",
            "Limited financial incentives for suppliers to adopt green practices",
          ],
        },
        {
          score: 3,
          label: "Moderate Support (Developing)",
          characteristics: [
            "Established criteria for sustainable products, with moderate prioritisation of zero-emissions suppliers",
            "Incentives available for green suppliers, but not widely accessible",
            "Consistent policy application across departments but room for improved enforcement",
          ],
        },
        {
          score: 4,
          label: "Strong Support (Effective)",
          characteristics: [
            "Clear guidelines requiring low-emission, local suppliers in key procurement areas",
            "Significant incentives for suppliers adopting sustainable practices",
            "Strong compliance mechanisms ensuring sustainability standards are met across departments",
          ],
        },
        {
          score: 5,
          label: "Exemplary Support (Leading Practice)",
          characteristics: [
            "Comprehensive mandates prioritising zero-emissions and local suppliers in all procurement decisions",
            "Extensive financial and strategic support for suppliers transitioning to zero-emissions practices",
            "Continuous review and enhancement of procurement policies to support sustainable innovation",
          ],
        },
      ],
  },

  "lga-decarbonisation-plans": {
      purpose: "To assess the quality and effectiveness of Local Government Area (LGA) decarbonisation plans in driving emissions reduction. The evaluation focuses on targets, sectoral strategies, funding allocation, stakeholder engagement, and progress monitoring.",

      frameworkIntro: "LGA decarbonisation plans are assessed based on the following core dimensions:",
      frameworkItems: [
        "<b>Target Setting and Strategy</b> – Does the plan include clear, measurable emissions reduction targets with sectoral breakdowns?",
        "<b>Funding and Resource Allocation</b> – Are there dedicated financial resources, incentives, or external funding streams supporting implementation?",
        "<b>Sector-Specific Actions</b> – Does the plan address emissions reductions across energy, transport, buildings, industry, and waste sectors?",
        "<b>Stakeholder Engagement and Collaboration</b> – Is there strong engagement with local businesses, communities, and industry stakeholders?",
        "<b>Monitoring and Accountability</b> – Are there mechanisms in place for progress tracking, reporting, and adaptive improvements?",
        "<b>Social Equity and Just Transition</b> – Does the plan consider social impacts, ensuring an inclusive and fair transition for workers and communities?",
      ],

      dataSources: [
        "Official LGA decarbonisation strategies and associated policies",
        "Budget allocations for emissions reduction initiatives",
        "Interviews with council representatives and local stakeholders",
        "Monitoring and reporting mechanisms within LGA plans",
        "LGA climate action plans, policy documents, and budget reports",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review official LGA decarbonisation plans and related policies." },
        { label: "Indicator Evaluation", desc: "Assess emissions reduction targets, sectoral actions, and funding." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Stakeholder Insights", desc: "Gather input from LGA officials, businesses, and community groups." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Target Setting and Strategy",
          weight: 0.3,
          scores: [
            "No clear decarbonisation plans exist. Climate action is ad-hoc, reactive, or not considered a strategic priority by the council.",
            "A plan or strategy document exists, but it lacks clear, measurable, or time-bound emissions reduction targets. Goals are aspirational rather than quantitative.",
            "The council has defined, publicly stated emissions reduction targets for its own operations. The overall strategy is clear but may lack detailed sectoral pathways or ambitious alignment with a 1.5°C trajectory.",
            "A clear and comprehensive decarbonisation strategy is in place with ambitious, time-bound targets for both council operations and the wider community that are approaching a 1.5°C alignment.",
            "Best practice is demonstrated. The plan includes formally adopted, science-based targets for the entire LGA that are fully aligned with a 1.5°C pathway. A clear, funded roadmap with accountability for delivery is in place.",
          ],
        },
        {
          dimension: "Funding and Resource Allocation",
          weight: 0.2,
          scores: [
            "Severely limited or no dedicated funding for climate action. Initiatives are unfunded or entirely dependent on securing external grants.",
            "Some fragmented funding is available through various departmental budgets, but there is no dedicated or consistent central fund for climate action.",
            "The council makes adequate and consistent budget allocations for specific, planned climate projects (e.g., in waste or energy).",
            "Sufficient and stable internal funding mechanisms are established (e.g., a dedicated climate fund or levy), complemented by a proactive and successful strategy for securing external grants and partnerships.",
            "Extensive and diverse internal and external resourcing is secured. This includes a multi-year, protected climate action budget and the successful leveraging of private investment to ensure all strategic priorities are fully funded.",
          ],
        },
        {
          dimension: "Sector-Specific Actions",
          weight: 0.1,
          scores: [
            "Limited or no meaningful action in key emissions sectors. Any actions are isolated to a single area or are purely symbolic.",
            "Limited action underway, but major community emission sources (such as transport or buildings) are not being systematically addressed.",
            "Concrete action is underway in some sectors, but the scale and integration of these actions may be limited or still in pilot phases.",
            "There is evidence of meaningful action across most key sectors (e.g., energy, waste, transport), with clear evidence of scaled-up projects.",
            "Comprehensive, integrated, and transformative measures are active and scaled across all sectors. The council is a leader in implementing innovative, high-impact solutions.",
          ],
        },
        {
          dimension: "Stakeholder Engagement and Collaboration",
          weight: 0.2,
          scores: [
            "Poor or limited engagement. Decisions are made with minimal public consultation, and no established partnerships for climate action exist.",
            "Some collaboration exists, but it is inconsistent or misses key stakeholders such as major local industries, business chambers, or First Nations groups.",
            "The majority of key stakeholders are engaged, and some collaborative projects are occurring. Engagement is becoming more proactive but may not be consistently deep or continuous.",
            "Widespread and proactive stakeholder engagement is standard practice, with established partnerships that result in joint projects and shared outcomes.",
            "Best practice. The council facilitates extensive, wide-scale community and industry engagement that leads to co-designed, collaborative local action and widespread community buy-in.",
          ],
        },
        {
          dimension: "Monitoring and Accountability",
          weight: 0.1,
          scores: [
            "Limited or no public monitoring. Progress against any stated goals is not tracked or reported, and there is no accountability for delivery.",
            "Some internal reporting on metrics occurs, but it is not regular, public, or tied to specific emissions reduction targets.",
            "The council has clear benchmarks for action that can be tracked over time, with some public progress updates.",
            "Clear benchmarks are established and incorporated into regular, public, annual reporting requirements, showing progress against key actions and targets.",
            "Best practice. The council maintains and publishes a comprehensive, LGA-wide emissions inventory and provides annual public reports on progress against science-based climate benchmarks, ensuring full accountability.",
          ],
        },
        {
          dimension: "Social Equity and Just Transition",
          weight: 0.1,
          scores: [
            "Limited or no consideration is given to the social impacts of the transition or the needs of vulnerable community members.",
            "There is some consideration for social equity, but the approach is fragmented and not integrated across the overall strategy.",
            "Some specific social equity and just transition measures are in place, but an overarching strategy may be lacking.",
            "Social equity and just transition measures are proactively implemented and well-integrated into all aspects of decarbonisation planning and policy.",
            "The plan is built on a comprehensive and fully implemented social equity framework to ensure 'no-one is left behind,' with dedicated support for affected industries and workers and inclusive decision-making processes.",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal Plan (Severe Deficiency)",
          characteristics: [
            "Plan exists but lacks depth, funding, and clear sector-specific actions. Relies heavily on external funding.",
          ],
        },
        {
          score: 2,
          label: "Basic Plan (Moderate Deficiency)",
          characteristics: [
            "General emissions reduction targets exist with some actions, but there is limited coordination, funding, and monitoring.",
          ],
        },
        {
          score: 3,
          label: "Moderate Plan (Developing)",
          characteristics: [
            "Defined goals and active initiatives in key sectors, moderate funding, and growing stakeholder engagement.",
          ],
        },
        {
          score: 4,
          label: "Strong Plan (Effective)",
          characteristics: [
            "Comprehensive plan with ambitious targets, sectoral strategies, secured funding, and strong engagement.",
          ],
        },
        {
          score: 5,
          label: "Exemplary Plan (Leading Practice)",
          characteristics: [
            "Fully integrated strategy with ambitious targets, strong funding, innovative partnerships, and continuous adaptation.",
          ],
        },
      ],
  },
  "regional-adaptation-resilience": null,

  "regional-coordination": null,
  "agency-representation": null,
  "policy-alignment": null,

  // ─── Pillar 4: Social Acceptance ─────────────────────────────────────────────

  "strategic-nature-positive-planning": {
      purpose: "A just and effective transition requires renewable energy infrastructure to be developed in harmony with biodiversity, agriculture and other land uses. Strategic and nature-positive land-use planning provides a framework to balance these priorities, supporting a holistic and sustainable approach to large-scale infrastructure development while promoting strong social benefit practices.",

      frameworkIntro: "Strategic and nature-positive land-use planning is evaluated across the following key dimensions:",
      frameworkItems: [
        "<b>Data Availability and Quality – Renewable Energy Infrastructure</b>: The extent and reliability of data on renewable energy infrastructure (generation, storage and transmission).",
        "<b>Data Availability and Quality – Agriculture</b>: The extent and reliability of agricultural land use data.",
        "<b>Data Availability and Quality – Biodiversity</b>: The extent and reliability of biodiversity data.",
        "<b>Regional Strategic Planning</b>: The degree to which regional planning processes integrate biodiversity, agriculture, industry, renewable energy infrastructure, and community needs.",
        "<b>Biodiversity Prioritisation in Planning</b>: How well biodiversity priorities are understood, mapped, and incorporated into development and planning processes for renewable infrastructure.",
        "<b>Consensus and Collaboration</b>: The level of collaboration and consensus between local communities, state and federal governments, industry, and researchers in land-use planning.",
      ],

      dataSources: [
        "Regional and state biodiversity and agricultural land use and renewable infrastructure databases",
        "Academic and Non-government organisation (NGO) land-use planning reports",
        "State and federal government planning processes and legislation",
        "Local and regional strategic plans and pilots (e.g. Bioregional Plan pilots undertaken to support EPBC regional planning based decision making processes in partnership with state and federal governments)",
      ],

      scoringProcess: [
        { label: "Preliminary Analysis", desc: "Review regional datasets, planning processes, legislation, and strategic plans." },
        { label: "Indicator Evaluation", desc: "Assess the availability and quality of datasets, the strength of strategic planning, the degree of biodiversity prioritisation, and the extent of collaboration." },
        { label: "Scoring Aggregation", desc: "Calculate the overall assessment score based on weighted indicators." },
        { label: "Stakeholder Insights", desc: "Gather input from academia, environmental NGOs, government, and community groups." },
        { label: "Review", desc: "Conduct expert validation to finalise the assigned score." },
      ],

      weightingTable: [
        {
          dimension: "Data Availability & Quality – Biodiversity",
          weight: 0.16,
          scores: [
            "National granularity biodiversity value data sets available for public use",
            "State wide, state granularity biodiversity data sets available for public use",
            "Regional and state based data sets of biodiversity data available for public use",
            "Regional and state based data sets of biodiversity data available for public use, with additional information on ecological connectivity and other key requirements for Matters of National, State and regional Environmental Significance",
            "Comprehensive system in place to prioritise Matters of National, State and regional Environmental Significance at the regional level, underpinned by land use mapping with an understanding of what good looks like to maximise protection of MNES",
          ],
        },
        {
          dimension: "Data Availability & Quality – Agriculture",
          weight: 0.16,
          scores: [
            "National granularity agricultural land use value data sets available for public use",
            "State wide, state granularity agricultural land use data sets available for public use",
            "Regional and state based data sets of agricultural land use data available for public use",
            "Regional and state based data sets of agricultural land use data available for public use, with additional information on how to prioritise this land use based on agricultural and community values",
            "Comprehensive system in place to prioritise prime agricultural land at the regional level, underpinned by land use mapping with an understanding of what good looks like to maximise protection of prime agricultural land",
          ],
        },
        {
          dimension: "Data Availability & Quality – Renewable Energy",
          weight: 0.16,
          scores: [
            "No renewable energy infrastructure data available publicly",
            "Point/location based renewable energy infrastructure data available but hard to access",
            "Point/location based renewable energy infrastructure data available and easy to access for desktop analysis",
            "Infrastructure-footprint based renewable energy infrastructure data available and easy to access for desktop analysis",
            "Infrastructure-footprint based renewable energy infrastructure data available and easy to access for desktop analysis. Estimates available around supporting infrastructure such as roads, services, etc.",
          ],
        },
        {
          dimension: "Regional Strategic Planning",
          weight: 0.2,
          scores: [
            "No system in place to collate and compare datasets across these themes",
            "Pilot systems in place such as pilot bioregional planning process (e.g. EPBC related federal/state partnership pilot Bioregional Plans)",
            "Research community has progressed principles on good biodiversity planning approaches for renewable energy and other infrastructure but implementation is still not clear",
            "Integrated planning progressing, with impactful insights and clear directions, however implementation is still somewhat confusing and complicated",
            "An understanding of areas suitable or not suitable for renewable energy development, the buffers required around infrastructure to minimise impacts on biodiversity, along with best practice infrastructure design to minimise impacts on biodiversity and agriculture. Complemented by an understanding of critical energy, supporting and community infrastructure needs.",
          ],
        },
        {
          dimension: "Biodiversity Prioritisation in Planning",
          weight: 0.16,
          scores: [
            "No state wide biodiversity prioritisation in place",
            "Research community has developed state wide prioritisation of high biodiversity/Matters of State and National Environmental Significance however buy in from industry has not been obtained",
            "Research community has progressed principles on good biodiversity planning approaches for renewable energy and other infrastructure and this is enabling input into state planning processes",
            "Clear pathway for best placement of renewables is determined and being applied to prioritise biodiversity and Matters of State and National Environmental Significance",
            "Scaling up of strategic regional plans being implemented across the region",
          ],
        },
        {
          dimension: "Consensus and Collaboration",
          weight: 0.16,
          scores: [
            "No collaboration or process in place to build consensus on approach",
            "Community based or pilot government processes in place to build consensus on approach",
            "Progressing government processes in place to build consensus on approach",
            "Strong collaboration and buy in across land use sectors with consensus on approach",
            "Strong collaboration and buy in across land use sectors with consensus on approach, implementation enabled, trialed and applied",
          ],
        },
      ],

      scoringDescriptions: [
        {
          score: 1,
          label: "Minimal level of planning (Severe Deficiency)",
          characteristics: [
            "Agricultural and biodiversity databases only available at the national level, with no publicly available renewable energy database",
            "No system in place to compare databases",
            "No state-wide biodiversity prioritisation in place",
            "No collaboration between government, community, industry and researchers",
          ],
        },
        {
          score: 2,
          label: "Basic level of planning (Moderate Deficiency)",
          characteristics: [
            "State-level agricultural and biodiversity datasets are publicly available",
            "Location-based renewable infrastructure databases exist, but with access limitations",
            "Pilot programs in place for regional planning and community involvement",
            "Prioritisation principle developing in research, but with no implementation path",
          ],
        },
        {
          score: 3,
          label: "Moderate level of planning (Developing)",
          characteristics: [
            "Regional agricultural and biodiversity datasets are publicly available",
            "Location-based renewable infrastructure databases exist and are easily accessible",
            "Strategic planning pilots are scaling up",
            "Prioritisation principles established in research, but with no industry buy in",
            "Progressing government practices to involve communities",
          ],
        },
        {
          score: 4,
          label: "Strong level of planning (Effective)",
          characteristics: [
            "Regional agricultural and biodiversity datasets are publicly available, with transparency over government declarations",
            "Footprint-based renewable infrastructure databases exist and are easily accessible",
            "Integrated planning processes in place and progressing",
            "Strong collaboration across land-use sectors",
          ],
        },
        {
          score: 5,
          label: "Exemplary level of planning (Leading Practice)",
          characteristics: [
            "Regional agricultural and biodiversity datasets are publicly available, with clarity over what good looks like",
            "Footprint-based renewable infrastructure databases exist and are easily accessible, including surrounding infrastructure",
            "Well-established and comprehensive planning processes incorporating land-use planning best practice",
            "Clear pathway for best placement of renewables",
            "Strong collaboration across land-use sectors with consensus on approach",
          ],
        },
      ],
  },
  "first-nations-benefit-sharing": null,


  "wider-community-benefit-sharing": {
    purpose: "To measure the level to which the rewards of renewable energy developments are shared with the communities that host them. This assessment asks how well renewable energy projects are integrated into the local community and how they contribute to the future vitality and success of the region.",

    frameworkIntro: "Community Benefits are assessed against four dimensions that aim to provide a holistic view of whether REIP or renewables projects are effectively supporting their host communities through economic and social benefits:",
    frameworkItems: [
      "<b>Employment:</b> Evidence of local jobs, local being defined as within 100km.",
      "<b>Economic benefits:</b> How much of the economic benefit stays in the region versus economic benefit flowing offshore or interstate. Evidence of local training, local content and supply chain opportunities, ownership share in infrastructure, lease payments for land, or transmission easements, other payments such as to neighbours.",
      "<b>Specific Community Benefit Fund:</b> What payments are made to the community and how are they allocated.",
      "<b>Community Subsidiarity:</b> To what level can the local community have a say in what benefits they want to receive and how the benefits of the renewable energy infrastructure flow to the community.",
    ],

    dataSources: [
      "Annual reports of proponents and investors.",
      "Council minutes, regional reports and datasets.",
      "Stakeholder feedback documented through interviews, emails and meeting notes.",
      "Evidence of a community benefit fund and beneficiaries.",
      "Evidence of coordination and collaboration, eg MOUs, press releases, agreements.",
      "State or local benefits sharing plans and guidelines.",
    ],

    scoringProcess: [
      { label: "Preliminary Analysis",  desc: "Review data and evidence sources listed above for this indicator." },
      { label: "Indicator Evaluation",  desc: "Assess the evidence of consultation processes and the quality of messaging and leadership." },
      { label: "Scoring Aggregation",   desc: "Calculate the overall assessment score based on weighted indicators." },
      { label: "Stakeholder Insights",  desc: "Gather input from academia, environmental NGOs, government, and community groups." },
      { label: "Review",                desc: "Conduct expert validation to finalise the assigned score." },
    ],

    weightingTable: [
      {
        dimension: "Employment",
        weight: 0.25,
        scores: [
          "No local jobs, FIFO or DIDO workforces.",
          "Minimal local construction only, no ongoing jobs.",
          "Mandated local construction and O&M jobs in merit criteria.",
          "Construction jobs and some ongoing jobs beyond mandates.",
          "Local workforce is trained and upskilled and the RE has brought ongoing jobs to town/region.",
        ],
      },
      {
        dimension: "Economic benefits",
        weight: 0.25,
        scores: [
          "No apprenticeships, training or local content.",
          "Minimal local content and supply chain opportunities.",
          "Mandated training apprenticeships and supply chain opportunities in merit criteria. Lease payments for project life cycle.",
          "Local share offers and financial compensations of amenity for neighbours, jobs, training and local content, lease payments.",
          "Mandated local ownership share in RE infrastructure, financial compensations for neighbours, training and supply chain, lease payments. Long term economic benefits creating prosperity for the region.",
        ],
      },
      {
        dimension: "Specific Community Benefit funding arrangements",
        weight: 0.25,
        scores: [
          "Do not exist.",
          "Limited ad hoc payments, footy jersey.",
          "Project community benefit fund included in merit criteria. Initial benefit funds run by proponents for life cycle with small grants.",
          "Coordinated benefit funding distributed across affected regions and benefit funds supported by proponents.",
          "Partnership and regional coordination between developers, government and community to dedicated benefit fund co-designed and managed by the local community. Legacy outcomes are achieved.",
        ],
      },
      {
        dimension: "Subsidiarity – community empowerment and strong local, state and industry alignment",
        weight: 0.25,
        scores: [
          "Local community has no plan about what they want or need and the state assumes the community has no additional needs to host RE infrastructure.",
          "The community has some plans about what is needed and how to capture benefits but no coordination with state and/or developers.",
          "The community has a plan through shire or council and there is communication with the state and coordination with developers.",
          "The community has a plan and an SPV structure (community benefit fund) and coordination to capture benefits. There is a level of collaboration between community, state and industry to deliver aspects of the plan and contribute to fund.",
          "The community has a clear plan and a structure (community benefit fund (CBF)). State and industry agree to deliver aspects of the plan. Industry contributes to CBF at an agreed rate. State provides infrastructure upgrades that address community needs, e.g. water supply, rubbish dumps. Community needs are not displaced for RE and the community is better off from development.",
        ],
      },
    ],

    scoringDescriptions: [
      {
        score: 1,
        label: "Minimal level of community benefit (Severe Deficiency)",
        characteristics: [
          "Minimal or no framework for benefits to the community.",
          "Lack of local jobs.",
          "Lack of local training and apprenticeship opportunities.",
          "Lack of local content supply chain opportunities.",
        ],
      },
      {
        score: 2,
        label: "Basic level of community benefit (Moderate Deficiency)",
        characteristics: [
          "Some fragmented ad hoc community benefits are offered, such as footy jersey benefits.",
          "Limited local employment opportunities.",
          "Limited training, apprenticeship and supply chain opportunities.",
        ],
      },
      {
        score: 3,
        label: "Moderate level of community benefit (Developing)",
        characteristics: [
          "Mandated local construction and operational jobs.",
          "Mandated merit criteria provide training apprenticeships and supply chain opportunities.",
          "The community has been supported to generate a benefits plan as required by merit criteria.",
          "Economic and social benefits of projects meet some community needs over project timelines.",
        ],
      },
      {
        score: 4,
        label: "Strong level of community benefit (Effective)",
        characteristics: [
          "Relatively high proportion of jobs are local, beyond merit criteria mandate.",
          "High level of community involvement in opportunities to participate and coordinate, e.g. stagger development to ensure maximum local opportunity and minimise disruptions.",
          "Strategic place-based planning with high community input and many community needs met.",
          "SPV or community benefit fund with strategic and regional focus.",
          "Share options, neighbour payments.",
        ],
      },
      {
        score: 5,
        label: "Exemplary level of community benefit planning (Leading Practice)",
        characteristics: [
          "Very high relative proportion of jobs are local, beyond merit criteria mandate.",
          "Community benefits (supply chain, training, payments etc.) are coordinated, collaborative, strategic, place-based, participatory, and grounded in community needs.",
          "Mandated ownership and benefits for all of the community are exceeded.",
          "Proponents are respected and valued partners in the community.",
        ],
      },
    ],
  },

  "effective-first-nations-engagement": null,
  "effective-community-engagement": null,

  // ─── Pillar 5: Financing the Transition ──────────────────────────────────────

  "public-finance-commitment": null,
  "attracting-private-investment": null,
  "risk-and-resilience": null,
};
