class Solution {
  constructor(data) {
    this.input = data;
    this.output = {
      data: this.input,
      impact: {},
      severeImpact: {}
    };

    let days = this.input.timeToElapse;
    if (this.input.periodType === 'weeks') {
      days *= 7;
    } else if (this.input.periodType === 'months') {
      days *= 30;
    }

    this.currentlyInfected()
      .days(days)
      .severeCasesByRequestedTime()
      .hospitalBedsByRequestedTime()
      .casesForICUByRequestedTime()
      .casesForVentilatorsByRequestedTime()
      .dollarsInFlight(days);
  }

  /**
     *
     * @param {*} reportedCases
     */
  currentlyInfected(reportedCases = this.input.reportedCases) {
    this.output.impact.currentlyInfected = reportedCases * 10;
    this.output.severeImpact.currentlyInfected = reportedCases * 50;
    return this;
  }

  /**
     * Calculate reported cases after x days
     * @param {*} days
     */
  days(days = this.input.timeToElapse) {
    const factor = Math.floor(days / 3);
    const impact = this.output.impact.currentlyInfected;
    const severeImpact = this.output.severeImpact.currentlyInfected;
    this.output.impact.infectionsByRequestedTime = impact * (2 ** factor);
    this.output.severeImpact.infectionsByRequestedTime = severeImpact * (2 ** factor);
    return this;
  }

  severeCasesByRequestedTime() {
    const impact = this.output.impact.infectionsByRequestedTime;
    const severeImpact = this.output.severeImpact.infectionsByRequestedTime;

    this.output.impact.severeCasesByRequestedTime = Math.floor(impact * (15 / 100));
    this.output.severeImpact.severeCasesByRequestedTime = Math.floor(severeImpact * (15 / 100));
    return this;
  }

  /**
     *
     */
  hospitalBedsByRequestedTime() {
    const severeImpact = this.output.severeImpact.severeCasesByRequestedTime;
    const impact = this.output.impact.severeCasesByRequestedTime;
    const impactCalc = Math.floor(((35 / 100) * this.input.totalHospitalBeds) - impact);
    const severeImpactCalc = Math.floor(((35 / 100) * this.input.totalHospitalBeds) - severeImpact);
    this.output.impact.hospitalBedsByRequestedTime = impactCalc;
    this.output.severeImpact.hospitalBedsByRequestedTime = severeImpactCalc;
    return this;
  }

  /**
     * 5% of infectionsByRequestedTime
     */
  casesForICUByRequestedTime() {
    const impactCalc = Math.floor(this.output.impact.infectionsByRequestedTime * (5 / 100));
    const sImpactCalc = Math.floor(this.output.severeImpact.infectionsByRequestedTime * (0.05));
    this.output.impact.casesForICUByRequestedTime = impactCalc;
    this.output.severeImpact.casesForICUByRequestedTime = sImpactCalc;
    return this;
  }

  /**
     * 2% of infectionsByRequestedTime
     */
  casesForVentilatorsByRequestedTime() {
    const impactCalc = Math.floor(this.output.impact.infectionsByRequestedTime * (2 / 100));
    const sImpactCalc = Math.floor(this.output.severeImpact.infectionsByRequestedTime * (2 / 100));
    this.output.impact.casesForVentilatorsByRequestedTime = impactCalc;
    this.output.severeImpact.casesForVentilatorsByRequestedTime = sImpactCalc;
    return this;
  }

  dollarsInFlight(days = this.input.timeToElapse) {
    const avgIncome = this.input.region.avgDailyIncomeInUSD;
    const avgIncomePopulation = this.input.region.avgDailyIncomePopulation;
    const impact = this.output.impact.infectionsByRequestedTime;
    const severeImpact = this.output.severeImpact.infectionsByRequestedTime;
    const impactCalc = Math.floor((impact * avgIncomePopulation * avgIncome) / days);
    const sImpactCalc = Math.floor((severeImpact * avgIncomePopulation * avgIncome) / days);

    this.output.impact.dollarsInFlight = impactCalc;
    this.output.severeImpact.dollarsInFlight = sImpactCalc;
    return this;
  }

  output() {
    return this.output;
  }
}

const covid19ImpactEstimator = (data) => (new Solution(data)).output;

export default covid19ImpactEstimator;
