const Telebot = require('telebot');
const indicator = require('../../helper/indicator')
require('dotenv').config();

async function sendAlertToTelegram(botToken, chatId, message) {
    const bot = new Telebot({
        token: botToken,
        logPlugins: false
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
    const limit = 60;
    const rsiPeriod = 14;
    const pivotLookbackRight = 5;
    const pivotLookbackLeft = 5;
    const minLookbackRange = 60;
    const maxLookbackRange = 5;
    const botToken = process.env.TOKEN_BOT;
    const chatId = process.env.CHAT_ID;

    indicator.detectDivergence(symbol, interval, limit, rsiPeriod, pivotLookbackRight, pivotLookbackLeft, minLookbackRange, maxLookbackRange);
    
    if (result && result.hasOwnProperty('exists')) {
        // Check the value of the exists property
        if (result.exists) {
            // Send the alert to Telegram
            await sendAlertToTelegram(botToken, chatId, `Divergence detected! Type: ${result.type}`);
        }
    }
}, 1000);
