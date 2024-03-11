const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const port = 3000;
const ticker = "AAPL"

app.get('/scrape', async (req, res) => {
    let result = { ticker: "AAPL" };

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`https://finance.yahoo.com/quote/${ticker}`);

        // Substitua o seletor pelo correto se o website foi atualizado e o seletor mudou
        const marketCapSelector = 'td[data-test="MARKET_CAP-value"]';
        const marketCap = await page.$eval(marketCapSelector, element => element.innerText);

        await browser.close();

        // Adiciona o market cap ao resultado
        result.market_cap = marketCap;
    } catch (error) {
        console.error("Erro ao extrair dados: ", error);
        // Adiciona uma mensagem de erro ao resultado caso a extração falhe
        result.error_message = "Não foi possível extrair os dados de market cap.";
    }

    // Salvando o resultado (com ou sem erro) em um arquivo JSON
    fs.writeFileSync('result.json', JSON.stringify(result, null, 2));

    res.json(result);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
