const Telebot = require('telebot');
const price = require('../../helper/price')

async function sendAlertToTelegram(botToken, chatId, message) {
    const bot = new Telebot({
        token: botToken,
        usePlugins: ['askUser']
    });

    try {
        // Send the message to the specified chat ID
        await bot.sendMessage(chatId, message);

        console.log(`Successfully sent alert to Telegram: ${message}`);
    } catch (error) {
        // Handle the error
        console.error(error);
    }
}

setInterval(async () => {
    // Define the function arguments
    const symbol = "BNBBUSD";
    const interval = "5m";
    const limit = 100;
    const rsiPeriod = 14;
    const pivotLookbackRight = 5;
    const pivotLookbackLeft = 5;
    const minLookbackRange = 60;
    const maxLookbackRange = 5;
    const botToken = process.env.CHAT_ID;
    const chatId = process.env.TOKEN_BOT;
    
    const result = await price.calculateDivergenceIndicator(symbol, interval, limit, rsiPeriod, pivotLookbackRight, pivotLookbackLeft, minLookbackRange, maxLookbackRange);
    if (result.exists) {
        await sendAlertToTelegram(botToken, chatId, `Divergence detected! Type: ${result.type}`);
    }
}, 1000);
