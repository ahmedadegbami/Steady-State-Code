// CALCULATE BETA
// values
// groundHeatConductivity λg = 1.2 W/(mK)
// insulationHeatConductivity λi = 0.027 W/(mK)
// outerInsulationDiameter do = 0.315 m
// innerInsulationDiameter di = 0.219 m

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

console.log("calculateBeta", calculateBeta(1.2, 0.027, 0.315, 0.219)); // Output: 16.15559595596143

//CALCULATE SYMMETRICAL HEAT LOSS FACTOR
// burialDepth H = 0.219 m
// distanceBtwPipeAxes D = 0.565 m ,
// groundHeatConductivity λg = 1.2 W/(mK)
// insulationHeatConductivity λi = 0.027 W/(mK)
// outerInsulationDiameter do = 0.315 m
// innerInsulationDiameter di = 0.219 m
const calculateSymHeatLossFactor = (
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

  const SymHeatLossFactor = term1 + term2 + term3 + term4;

  return SymHeatLossFactor;
};

console.log(
  "calculateSymHeatLossFactor",
  calculateSymHeatLossFactor(0.9575, 0.565, 1.2, 0.027, 0.315, 0.219)
);

const calculateAntiSymHeatLossFactor = (
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
    (3 * Math.pow(outerInsulationDiameter, 2)) /
    (16 * (Math.pow(distanceBtwPipeAxes, 2) + Math.pow(burialDepth, 2))); // (3d0^2)/(16⋅(D^2+H^2))

  const term4d = (1 + term2) / (1 - term2); // (1+β)/(1-β)

  const term4e = Math.pow(
    outerInsulationDiameter / (4 * distanceBtwPipeAxes),
    2
  ); // [d0/4D]^2

  const term4 = (term4a + term4b - term4c) / (term4d - term4e);

  const antiSymHeatLossFactor = term1 + term2 - term3 + term4;

  return antiSymHeatLossFactor;
};

// //The symmetrical and anti–symmetrical heat losses (3) and (4) can be calculated by applying the temperatures Tsym and Ta defined in Eq. (5) and Eq. (6).
const calculateSymTemperature = (supplyTempertaure, returnTemperature) => {
  return (supplyTempertaure + returnTemperature) / 2;
}; // Equation 5: The symmetrical Temperatures

const calculateAntiSymTemperature = (supplyTempertaure, returnTemperature) =>
  (supplyTempertaure - returnTemperature) / 2; //  Equation 6: The anti–symmetrical Temperature

const calculateSymHeatLoss = (
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
  calculateSymHeatLossFactor(
    burialDepth,
    distanceBtwPipeAxes,
    groundHeatConductivity,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  ); // Equation 3 : The symmetrical heat losses

console.log(
  "calculateSymHeatLoss",
  calculateSymHeatLoss(133, 60, 1.2, 0.8, 0.9575, 0.565, 0.027, 0.315, 0.219)
);

const calculateAntiSymHeatLoss = (
  supplyTempertaure,
  returnTemperature,
  groundHeatConductivity,
  burialDepth,
  distanceBtwPipeAxes,
  insulationHeatConductivity,
  outerInsulationDiameter,
  innerInsulationDiameter
) =>
  calculateAntiSymTemperature(supplyTempertaure, returnTemperature) *
  (2 * Math.PI * groundHeatConductivity) *
  calculateAntiSymHeatLossFactor(
    burialDepth,
    distanceBtwPipeAxes,
    groundHeatConductivity,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  ); // Equation 4: The anti–symmetrical heat losses

// The heat losses of the supply and return pipe can be calculated according to Eq. (1) and Eq. (2).

// Equation 1: The heat losses of the supply pipe
const calculateSupplyHeatLoss = (
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
  const symHeatLoss = calculateSymHeatLoss(
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

  const antiSymHeatLoss = calculateAntiSymHeatLoss(
    supplyTempertaure,
    returnTemperature,
    groundHeatConductivity,
    burialDepth,
    distanceBtwPipeAxes,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  );

  return symHeatLoss + antiSymHeatLoss;
};

// Equation 2: The heat losses of the return pipe
const calculateReturnHeatLoss = (
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
  const symHeatLoss = calculateSymHeatLoss(
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

  const antiSymHeatLoss = calculateAntiSymHeatLoss(
    supplyTempertaure,
    returnTemperature,
    groundHeatConductivity,
    burialDepth,
    distanceBtwPipeAxes,
    insulationHeatConductivity,
    outerInsulationDiameter,
    innerInsulationDiameter
  );

  return symHeatLoss - antiSymHeatLoss;
};

// The calculation of the relative heat loss

const calculateRelativeHeatLoss = (
  waterDensity,
  crossSectionArea,
  flowVelocity,
  heatCapacity,
  supplyTempertaure,
  returnTemperature
) => {
  const relativeHeatLoss =
    waterDensity *
    crossSectionArea *
    flowVelocity *
    heatCapacity *
    (supplyTempertaure - returnTemperature);
  return relativeHeatLoss;
};

// Estimation of Relative heat loss as a percentage heat loss per meter of pipe length === THERMAL EFFICENCY

const calculateThermalEfficiency = (
  supplyTempertaure,
  returnTemperature,
  groundHeatConductivity,
  groundTemperature,
  burialDepth,
  distanceBtwPipeAxes,
  insulationHeatConductivity,
  outerInsulationDiameter,
  innerInsulationDiameter,
  waterDensity,
  crossSectionArea,
  flowVelocity,
  heatCapacity
) => {
  const efficiency =
    ((calculateSupplyHeatLoss(
      supplyTempertaure,
      returnTemperature,
      groundHeatConductivity,
      groundTemperature,
      burialDepth,
      distanceBtwPipeAxes,
      insulationHeatConductivity,
      outerInsulationDiameter,
      innerInsulationDiameter
    ) *
      calculateReturnHeatLoss(
        supplyTempertaure,
        returnTemperature,
        groundHeatConductivity,
        groundTemperature,
        burialDepth,
        distanceBtwPipeAxes,
        insulationHeatConductivity,
        outerInsulationDiameter,
        innerInsulationDiameter
      )) /
      calculateRelativeHeatLoss(
        waterDensity,
        crossSectionArea,
        flowVelocity,
        heatCapacity,
        supplyTempertaure,
        returnTemperature
      )) *
    100;
  return efficiency;
};
