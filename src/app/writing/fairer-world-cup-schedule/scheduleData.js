export const venues = {
  VAN: { id: "VAN", city: "Vancouver", lat: 49.2767, lon: -123.1119 },
  SEA: { id: "SEA", city: "Seattle", lat: 47.5952, lon: -122.3316 },
  SFO: { id: "SFO", city: "San Francisco", lat: 37.4031, lon: -121.97 },
  LAX: { id: "LAX", city: "Los Angeles", lat: 33.9531, lon: -118.3389 },
  GDL: { id: "GDL", city: "Guadalajara", lat: 20.6817, lon: -103.4628 },
  MEX: { id: "MEX", city: "Mexico City", lat: 19.303, lon: -99.1505 },
  MTY: { id: "MTY", city: "Monterrey", lat: 25.6692, lon: -100.2444 },
  HOU: { id: "HOU", city: "Houston", lat: 29.6847, lon: -95.4108 },
  DAL: { id: "DAL", city: "Dallas", lat: 32.7478, lon: -97.0928 },
  KAN: { id: "KAN", city: "Kansas City", lat: 39.0489, lon: -94.4839 },
  ATL: { id: "ATL", city: "Atlanta", lat: 33.7556, lon: -84.4 },
  MIA: { id: "MIA", city: "Miami", lat: 25.9581, lon: -80.2389 },
  TOR: { id: "TOR", city: "Toronto", lat: 43.6333, lon: -79.4186 },
  BOS: { id: "BOS", city: "Boston", lat: 42.0911, lon: -71.2639 },
  PHI: { id: "PHI", city: "Philadelphia", lat: 39.9008, lon: -75.1675 },
  NYC: { id: "NYC", city: "New York", lat: 40.8135, lon: -74.0744 },
};

export const routeComparison = [
  {
    id: "bosnia",
    team: "Bosnia and Herzegovina",
    label: "Longest itinerary",
    route: ["TOR", "LAX", "SEA"],
    travelKm: 5057.61379756168,
    color: "#c75d66",
    local: false,
  },
  {
    id: "egypt",
    team: "Egypt",
    label: "Shortest itinerary",
    route: ["SEA", "VAN", "SEA"],
    travelKm: 391.2643315248999,
    color: "#47a377",
    local: true,
  },
];

export const policies = [
  {
    id: "official",
    label: "FIFA official",
    control: "FIFA schedule",
    route: ["KAN", "SFO", "KAN"],
    routeKm: 4797.5810298172555,
    maxKm: 5057.61379756168,
    totalKm: 98814.1793909177,
    pctMax: 0,
    pctTotal: 0,
    changed: 0,
    improved: 0,
    color: "#a8a29e",
    proof: "This is FIFA’s published baseline.",
  },
  {
    id: "model-1a",
    label: "Model 1A",
    control: "same kickoff times",
    route: ["HOU", "LAX", "MTY"],
    routeKm: 4182.297269546549,
    maxKm: 4544.249604427247,
    totalKm: 69592.41028702584,
    pctMax: -10.2,
    pctTotal: -29.6,
    changed: 45,
    improved: 40,
    color: "#d59b43",
    proof: "The solver proved that no better schedule exists under these rules.",
  },
  {
    id: "model-1b",
    label: "Model 1B",
    control: "full schedule moves",
    route: ["KAN", "LAX", "DAL"],
    routeKm: 4173.565346275262,
    maxKm: 4173.565346275262,
    totalKm: 65986.17311582982,
    pctMax: -17.5,
    pctTotal: -33.2,
    changed: 41,
    improved: 36,
    color: "#47a377",
    proof: "The solver proved that no better schedule exists under these rules.",
  },
];

export const budgetSeries = [
  { k: 0, maxKm: 5057.61379756168, proven: true },
  { k: 5, maxKm: 4544.249604427247, proven: true },
  { k: 10, maxKm: 3527.619973707694, proven: true },
  { k: 15, maxKm: 3356.7747271685785, proven: true },
  { k: 20, maxKm: 3356.7747271685785, proven: true },
  { k: 24, maxKm: 3356.7747271685785, proven: false },
];

export const infeasibleResult = {
  restHours: 96,
  constraints: 108530,
  upperKm: 419.6757140480347,
  gapPct: 100,
};

export const corrections = [
  {
    title: "The first model allowed a move that could not happen in real life",
    body: "I had allowed a match to move to another stadium while keeping its original kickoff time. That could create a stadium and time pairing FIFA never published, so I split the work into two models with consistent rules.",
  },
  {
    title: "My first fairness score was measuring each schedule differently",
    body: "Each schedule was being judged against its own scale. That was like measuring one route in miles and another in kilometres. I replaced those moving scales with fixed physical units before comparing results.",
  },
  {
    title: "A two-metre disagreement was small enough to ignore and important enough not to",
    body: "My independent calculation differed from the model by 0.002 km. The number was tiny, but tracing it led me to tighten the solver settings and treat the external calculation as the final authority.",
  },
];
