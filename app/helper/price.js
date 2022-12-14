
const getPrice = (symbol) => {
    const api = `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol}`;
    fetch(api)
        .then(response => response.json())
        .then(data => data.lastPrice);
}

module.exports = getPrice;