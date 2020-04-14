class Solution{
    constructor(data){
        this.input = data;
        this.output = {
            data: this.input,
            impact: {},
            severeImpact: {}
        };

        let days =  this.input.timeToElapse * (this.input.periodType == 'weeks' ? 7 
                    : this.input.periodType == 'weeks' ? 30 
                    : 1);
        this.currentlyInfected()
            .days(days)
            .severeCasesByRequestedTime()
            .hospitalBedsByRequestedTime()
            .casesForICUByRequestedTime()
            .casesForVentilatorsByRequestedTime()
            .dollarsInFlight(days)
    }

    /**
     * 
     * @param {*} reportedCases 
     */
    currentlyInfected(reportedCases = this.input.reportedCases){
        this.output.impact.currentlyInfected = reportedCases * 10;
        this.output.severeImpact.currentlyInfected = reportedCases * 50;
        return this;
    }

    /**
     * Calculate reported cases after x days
     * @param {*} days 
     */
    days(days = this.input.timeToElapse){
        let factor = Math.floor(days/3);
        this.output.impact.infectionsByRequestedTime = this.output.impact.currentlyInfected * (2**factor);
        this.output.severeImpact.infectionsByRequestedTime = this.output.severeImpact.currentlyInfected * (2**factor);
        return this;
    }

    severeCasesByRequestedTime(){
        this.output.impact.severeCasesByRequestedTime = Math.floor(this.output.impact.infectionsByRequestedTime * (15/100));
        this.output.severeImpact.severeCasesByRequestedTime = Math.floor(this.output.severeImpact.infectionsByRequestedTime * (15/100));
        return this;
    }
    
    /**
     * 
     */
    hospitalBedsByRequestedTime(){
        this.output.impact.hospitalBedsByRequestedTime = Math.floor(((35/100) * this.input.totalHospitalBeds) - this.output.impact.severeCasesByRequestedTime);
        this.output.severeImpact.hospitalBedsByRequestedTime = Math.floor(((35/100) * this.input.totalHospitalBeds) - this.output.severeImpact.severeCasesByRequestedTime);
        return this;
    }

    /**
     * 5% of infectionsByRequestedTime
     */
    casesForICUByRequestedTime(){
        this.output.impact.casesForICUByRequestedTime = Math.floor(this.output.impact.infectionsByRequestedTime * (5/100));
        this.output.severeImpact.casesForICUByRequestedTime = Math.floor(this.output.severeImpact.infectionsByRequestedTime * (5/100));
        return this;
    }

    /**
     * 2% of infectionsByRequestedTime
     */
    casesForVentilatorsByRequestedTime(){
        this.output.impact.casesForVentilatorsByRequestedTime = Math.floor(this.output.impact.infectionsByRequestedTime * (2/100));
        this.output.severeImpact.casesForVentilatorsByRequestedTime = Math.floor(this.output.severeImpact.infectionsByRequestedTime * (2/100));
        return this;
    }

    dollarsInFlight(days = this.input.timeToElapse){
        let avgIncome = this.input.region.avgDailyIncomeInUSD;
        let avgIncomePopulation = this.input.region.avgDailyIncomePopulation;
        
        this.output.impact.dollarsInFlight = Math.floor((this.output.impact.infectionsByRequestedTime * avgIncomePopulation * avgIncome) * days);
        this.output.severeImpact.dollarsInFlight = Math.floor((this.output.severeImpact.infectionsByRequestedTime * avgIncomePopulation * avgIncome) * days);
        return this;
    }

    output(){
        return this.output;
    }
}

const covid19ImpactEstimator = (data) => {
    return (new Solution(data)).output;
};

export default covid19ImpactEstimator;
