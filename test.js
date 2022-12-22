const assert = require('assert');
const price = require('./app/helper/indicator')
const sinon = require('sinon');


// // Mock the axios.get function to return pre-defined data for testing
// const axios = {
//     get: () => {
//         return {
//             data: [
//                 [1588592400000, '0.02483000', '0.02488000', '0.02483000', '0.02485000', '24.70000000', 1588592799999, '0.00611288', 24, '6.00000000', '0.14828480', '0.00000000'],
//                 [1588592800000, '0.02485000', '0.02487000', '0.02482000', '0.02484000', '20.50000000', 1588593199999, '0.00507980', 20, '5.00000000', '0.12441000', '0.00000000'],
//                 [1588593200000, '0.02484000', '0.02485000', '0.02470000', '0.02473000', '29.90000000', 1588593599999, '0.00740931', 29, '7.00000000', '0.17464470', '0.00000000'],
//                 [1588593600000, '0.02473000', '0.02475000', '0.02469000', '0.02473000', '34.40000000', 1588593999999, '0.00852113', 34, '8.00000000', '0.20797880', '0.00000000'],
//                 [1588594000000, '0.02473000', '0.02475000', '0.02472000', '0.02474000', '35.60000000', 1588594399999, '0.00898441', 35, '8.00000000', '0.21773240', '0.00000000']
//             ]
//         }
//     }
// }
//
// // Define the test inputs and expected output
// const tests = [
//     {
//         symbol: 'BNBBUSD',
//         interval: '5m',
//         limit: 50,
//         rsiPeriod: 14,
//         minLookbackRange: 60,
//         maxLookbackRange: 5,
//         expectedOutput: {
//             exists: false,
//             type: '',
//             price: '0.02474000',
//         }
//     },
//     {
//         symbol: 'BNBBUSD',
//         interval: '5m',
//         limit: 50,
//         rsiPeriod: 14,
//         minLookbackRange: 1,
//         maxLookbackRange: 5,
//         expectedOutput: {
//             exists: true,
//             type: 'bullish',
//             price: '0.02474000',
//         }
//     },
//     {
//         symbol: 'BNBBUSD',
//         interval: '5m',
//         limit: 50,
//         rsiPeriod: 14,
//         minLookbackRange: 1,
//         maxLookbackRange: 5,
//         expectedOutput: {
//             exists: true,
//             type: 'bearish',
//             price: '0.02474000',
//         }
//     },
// ]
//
//
// describe('calculateDivergenceIndicator', () => {
//     it('should return the expected output when given valid input', async () => {
//         // Mock the axios.get function to return pre-defined data for testing
//         const axios = {
//             get: sinon.fake.resolves({
//                 data: [
//                     [1588592400000, '0.02483000', '0.02488000', '0.02483000', '0.02485000', '24.70000000', 1588592799999, '0.00611288', 24, '6.00000000', '0.14828480', '0.00000000'],
//                     [1588592800000, '0.02485000', '0.02487000', '0.02482000', '0.02484000', '20.50000000', 1588593199999, '0.00507980', 20, '5.00000000', '0.12441000', '0.00000000'],
//                     [1588593200000, '0.02484000', '0.02485000', '0.02470000', '0.02473000', '29.90000000', 1588593599999, '0.00740931', 29, '7.00000000', '0.17464470', '0.00000000'],
//                     [1588593600000, '0.02473000', '0.02475000', '0.02469000', '0.02473000', '34.40000000', 1588593999999, '0.00852113', 34, '8.00000000', '0.20797880', '0.00000000'],
//                     [1588594000000, '0.02473000', '0.02475000', '0.02472000', '0.02474000', '35.60000000', 1588594399999, '0.00898441', 35, '8.00000000', '0.21773240', '0.00000000']
//                 ]
//             })
//         }
//         // Define the test input and expected output
//         const symbol = 'BNBBUSD';
//         const interval = '5m';
//         const limit = 50;
//         const rsiPeriod = 14;
//         const pivotLookbackRight = 3;
//         const pivotLookbackLeft = 3;
//         const minLookbackRange = 1;
//         const maxLookbackRange = 5;
//         const expectedOutput = {
//             exists: true,
//             type: 'bullish',
//             price: '0.02474000',
//         };
//
// // Invoke the function with the test input and assert that the output is as expected
//         const result = await price.calculateDivergenceIndicator(symbol, interval, limit, rsiPeriod, pivotLookbackRight, pivotLookbackLeft, minLookbackRange, maxLookbackRange, axios);
//         assert.deepEqual(result, expectedOutput);
//     });
// });
//
//

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