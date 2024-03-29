// Variables
// burial Depth H = 0.2825 m
// distance Btw PipeAxes D = 0.565 m ,
// ground Heat Conductivity λg = 1.2 W/(mK)
// insulation Heat Conductivity λi = 0.027 W/(mK)
// outer Insulation Diameter do = 0.315 m
// inner Insulation Diameter di = 0.219 m
// supply Temperataure Ts = 133 °C
// return Temperature Tr = 60 °C
// ground Temperature Tg = 0.8 °C

// β=λg/λi ln(d0/di)

// I added this
// I added this too
// I added the last

const calculateBeta = (
  groundHeatConductivity,
  insulationHeatConductivity,
  outerInsulationDiameter,
  innerInsulationDiameter
) => {
  const beta =
    (groundHeatConductivity / insulationHeatConductivity) *
    Math.log(outerInsulationDiameter / innerInsulationDiameter);
  return beta;
};

//hsym = ln(4H/d0) + β + ln(√(1+(H/D)^2)) - ((d0/4D)^2 + (d0/4H)^2 + (d0^2)/(16*(D^2+H^2))) / ((1+β)/(1-β) + [d0/4D]^2)
const calculateSymHeatGainFactor = (
  burialDepth,
  distanceBtwPipeAxes,
  groundHeatConductivity,
  insulationHeatConductivity,
  outerInsulationDiameter,
  innerInsulationDiameter
) => {
  const term1 = Math.log((4 * burialDepth) / outerInsulationDiameter); // ln(4H/d0)

  const term2 = calculateBeta(
    groundHeatConductivity,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  ); // β

  const term3 = Math.log(
    Math.sqrt(1 + Math.pow(burialDepth / distanceBtwPipeAxes, 2))
  ); // ln(√(1+(H/D)^2))

  const term4a = -Math.pow(
    outerInsulationDiameter / (4 * distanceBtwPipeAxes),
    2
  ); // -(d0/4D)^2

  const term4b = Math.pow(outerInsulationDiameter / (4 * burialDepth), 2); // (d0/4H)^2

  const term4c =
    Math.pow(outerInsulationDiameter, 2) /
    (16 * (Math.pow(distanceBtwPipeAxes, 2) + Math.pow(burialDepth, 2))); // (d0^2)/(16⋅(D^2+H^2))

  const term4d = (1 + term2) / (1 - term2); // (1+β)/(1-β)

  const term4e = Math.pow(
    outerInsulationDiameter / (4 * distanceBtwPipeAxes),
    2
  ); // [d0/4D]^2

  const term4 = (term4a + term4b + term4c) / (term4d + term4e);

  const SymHeatGainFactor = term1 + term2 + term3 + term4;

  return SymHeatGainFactor;
};

// console.log(
//   "symHeatGainFactor",
//   calculateSymHeatGainFactor(0.9575, 0.285, 1.2, 0.027, 0.315, 0.219)
// );

// ha = ln(4H/d0) + β - ln(√(1+(H/D)^2)) - ((d0/4D)^2 + (d0/4H)^2 - (3(d0^2))/(16*(D^2+H^2))) / ((1+β)/(1-β) - [d0/4D]^2)
const calculateAntiSymHeatGainFactor = (
  burialDepth,
  distanceBtwPipeAxes,
  groundHeatConductivity,
  insulationHeatConductivity,
  outerInsulationDiameter,
  innerInsulationDiameter
) => {
  const term1 = Math.log((4 * burialDepth) / outerInsulationDiameter); // ln(4H/d0)

  const term2 = calculateBeta(
    groundHeatConductivity,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  ); // β

  const term3 = Math.log(
    Math.sqrt(1 + Math.pow(burialDepth / distanceBtwPipeAxes, 2))
  ); // ln(√(1+(H/D)^2))

  const term4a = Math.pow(
    outerInsulationDiameter / (4 * distanceBtwPipeAxes),
    2
  ); // -(d0/4D)^2

  const term4b = Math.pow(outerInsulationDiameter / (4 * burialDepth), 2); // (d0/4H)^2

  const term4c =
    (3 * Math.pow(outerInsulationDiameter, 2)) /
    (16 * (Math.pow(distanceBtwPipeAxes, 2) + Math.pow(burialDepth, 2))); // (3d0^2)/(16⋅(D^2+H^2))

  const term4d = (1 + term2) / (1 - term2); // (1+β)/(1-β)

  const term4e = Math.pow(
    outerInsulationDiameter / (4 * distanceBtwPipeAxes),
    2
  ); // [d0/4D]^2

  const term4 = (term4a + term4b - term4c) / (term4d - term4e);

  const antiSymHeatGainFactor = term1 + term2 - term3 - term4;

  return antiSymHeatGainFactor;
};

// console.log(
//   "antiSymHeatGainFactor",
//   calculateAntiSymHeatGainFactor(0.9575, 0.285, 1.2, 0.027, 0.315, 0.219)
// );

// Tsym=(Ts + Tr)/2
const calculateSymTemperature = (supplyTempertaure, returnTemperature) => {
  return (supplyTempertaure + returnTemperature) / 2;
};

// console.log("symtemperature", calculateSymTemperature(133, 60));

// Tsym=(Ts - Tr)/2
const calculateAntiSymTemperature = (supplyTempertaure, returnTemperature) =>
  (supplyTempertaure - returnTemperature) / 2;

// console.log("antiSymtemperature", calculateAntiSymTemperature(133, 60));

// qsym= (Tsym - Tg )⋅2πλg⋅ hsym
const calculateSymHeatGain = (
  supplyTempertaure,
  returnTemperature,
  groundHeatConductivity,
  groundTemperature,
  burialDepth,
  distanceBtwPipeAxes,
  insulationHeatConductivity,
  outerInsulationDiameter,
  innerInsulationDiameter
) =>
  (calculateSymTemperature(supplyTempertaure, returnTemperature) -
    groundTemperature) *
  (2 * Math.PI * groundHeatConductivity) *
  (1 /
    calculateSymHeatGainFactor(
      burialDepth,
      distanceBtwPipeAxes,
      groundHeatConductivity,
      insulationHeatConductivity,
      outerInsulationDiameter,
      innerInsulationDiameter
    ));

console.log(
  "calculateSymHeatGain",
  calculateSymHeatGain(6, 12, 1.43, 17.8, 1.0, 0.565, 0.027, 0.315, 0.219)
);

// qa= Ta⋅2πλg⋅ ha
const calculateAntiSymHeatGain = (
  supplyTempertaure,
  returnTemperature,
  groundHeatConductivity,
  groundTemperature,
  burialDepth,
  distanceBtwPipeAxes,
  insulationHeatConductivity,
  outerInsulationDiameter,
  innerInsulationDiameter
) =>
  calculateAntiSymTemperature(supplyTempertaure, returnTemperature) *
  (2 * Math.PI * groundHeatConductivity) *
  (1 /
    calculateAntiSymHeatGainFactor(
      burialDepth,
      distanceBtwPipeAxes,
      groundHeatConductivity,
      insulationHeatConductivity,
      outerInsulationDiameter,
      innerInsulationDiameter
    )); // Equation 4: The anti–symmetrical heat gains

console.log(
  "calculateantiSymHeatGain",
  calculateAntiSymHeatGain(6, 12, 1.43, 17.8, 1.0, 0.565, 0.027, 0.315, 0.219)
);

// qsupply = qsym + qa
const calculateSupplyHeatGain = (
  supplyTempertaure,
  returnTemperature,
  groundHeatConductivity,
  groundTemperature,
  burialDepth,
  distanceBtwPipeAxes,
  insulationHeatConductivity,
  outerInsulationDiameter,
  innerInsulationDiameter
) => {
  const symHeatGain = calculateSymHeatGain(
    supplyTempertaure,
    returnTemperature,
    groundHeatConductivity,
    groundTemperature,
    burialDepth,
    distanceBtwPipeAxes,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  );

  const antiSymHeatGain = calculateAntiSymHeatGain(
    supplyTempertaure,
    returnTemperature,
    groundHeatConductivity,
    groundTemperature,
    burialDepth,
    distanceBtwPipeAxes,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  );

  return symHeatGain + antiSymHeatGain;
};

console.log(
  "supplyHeatGain",
  calculateSupplyHeatGain(6, 12, 1.43, 17.8, 1.0, 0.565, 0.027, 0.315, 0.219)
);

// qreturn = qsym + qa
const calculateReturnHeatGain = (
  supplyTempertaure,
  returnTemperature,
  groundHeatConductivity,
  groundTemperature,
  burialDepth,
  distanceBtwPipeAxes,
  insulationHeatConductivity,
  outerInsulationDiameter,
  innerInsulationDiameter
) => {
  const symHeatGain = calculateSymHeatGain(
    supplyTempertaure,
    returnTemperature,
    groundHeatConductivity,
    groundTemperature,
    burialDepth,
    distanceBtwPipeAxes,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  );

  const antiSymHeatGain = calculateAntiSymHeatGain(
    supplyTempertaure,
    returnTemperature,
    groundHeatConductivity,
    groundTemperature,
    burialDepth,
    distanceBtwPipeAxes,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  );

  return symHeatGain - antiSymHeatGain;
};

console.log(
  "returnHeatGain",
  calculateReturnHeatGain(6, 12, 1.43, 17.8, 1.0, 0.565, 0.027, 0.315, 0.219)
);
