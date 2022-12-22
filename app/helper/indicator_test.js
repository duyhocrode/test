const assert = require('assert');
const price = require('../../helper/indicator')

describe('calculateRsi', () => {
    it('should return the expected RSI values for a given set of input data', () => {
        const closingPrices = [17.55, 21.45, 19.05, 16.15, 14.85, 15.3, 13.25, 11.65, 12.2, 16.1, 13.05, 15.35, 12.75, 18.45, 14.5, 12.35, 11.25];
        const rsiPeriod = 14;
        const expectedRsiValues = [45.84,43.12,41.75];

        // Calculate the RSI values using the calculateRsi function
        const rsiValues = price.calculateRsiLib(closingPrices, rsiPeriod);

        // Assert that the calculated RSI values are as expected
        assert.deepEqual(rsiValues, expectedRsiValues);
    });
});


describe('checkForDivergence', () => {
    it('should correctly identify divergence in the input data', () => {
        const rsiValues = [70, 60, 50, 40, 30];
        const pivotValues = [50, 60, 70, 80, 90];
        const minLookbackRange = 2;
        const maxLookbackRange = 4;
        const expectedResult = {
            exists: true,
            type: 'bullish',
        };

        // Call the checkForDivergence function with the input data
        const result = price.checkForDivergence(rsiValues, pivotValues, minLookbackRange, maxLookbackRange);

        // Assert that the result is as expected
        assert.deepEqual(result, expectedResult);
    });
});




describe('calculatePivotValues', () => {
    it('should return the expected pivot values for a given set of input data', () => {
        const highPrices = [10, 20, 30, 40, 50];
        const lowPrices = [1, 2, 3, 4, 5];
        const closingPrices = [5, 15, 25, 35, 45];
        const pivotLookbackRight = 2;
        const pivotLookbackLeft = 2;
        const expectedPivotValues = [7.5, 17.5, 27.5, 37.5];

        // Calculate the pivot values using the calculatePivotValues function
        const pivotValues = price.calculatePivotValues(highPrices, lowPrices, closingPrices, pivotLookbackRight, pivotLookbackLeft);

        // Assert that the calculated pivot values are as expected
        assert.deepEqual(pivotValues, expectedPivotValues);
    });
});