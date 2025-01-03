// NodeJS

const dadosDaConversao = {
    cotacoes: [],
    entrada: {
        valor: undefined,
        moeda: undefined,
    },
    saida: {
        moeda: undefined
    }
}

async function perguntar(pergunta) {
    return new Promise(function(retornar) {
        const readline = require('node:readline')
        const process = require('node:process')

        const parametrosDaInterfaceComOUsuario = {
            input: process.stdin,
            output: process.stdout,
        }

        const interfaceComOUsuario = readline.createInterface(parametrosDaInterfaceComOUsuario)

        interfaceComOUsuario.question(
            pergunta,
            function(resposta) {
                retornar(resposta)
                interfaceComOUsuario.close()
            }
        )
    })
}

async function receberParametrosDoUsuario() {
    dadosDaConversao.entrada.valor = await perguntar("Qual o valor? ")
    dadosDaConversao.entrada.moeda = await perguntar("Qual a moeda de entrada? ")
    dadosDaConversao.saida.moeda = await perguntar("Qual a moeda de saida? ")
}

async function carregarDadosDeConversaoDeMoeda() {
    const fs = require('node:fs')
    const arquivoDoUltimoResultado = __dirname + '/ultimoResultado.json'
    try {
        const url = "https://api2.binance.com/api/v3/ticker/24hr"
        const resposta = await fetch(url)
        const json = await resposta.json()
        fs.writeFileSync(arquivoDoUltimoResultado, JSON.stringify(json, null, 2))
        return json
    } catch (erro) {
        const ultimoResultado = fs.readFileSync(arquivoDoUltimoResultado).toString()
        const json = JSON.parse(ultimoResultado)
        return json
    }
}

async function receberDadosDasMoedas() {
    const moedas = await carregarDadosDeConversaoDeMoeda()

    const paraBtc = moedas 
        .filter(cotacao => cotacao.symbol.endsWith("BTC"))
        .map(cotacao => ({
            moeda: cotacao.symbol.substring(0, cotacao.symbol.indexOf("BTC")),
            valor: parseFloat(cotacao.lastPrice)
        }))

    const deBtc = moedas 
        .filter(cotacao => cotacao.symbol.startsWith("BTC"))
        .map(cotacao => ({
            moeda: cotacao.symbol.substring(3),
            valor: 1 / parseFloat(cotacao.lastPrice)
        }))

    dadosDaConversao.cotacoes = [
        ...paraBtc,
        ...deBtc,
    ]
}

async function calcularResultado(params) {
    const valorDeEntrada =  parseFloat(dadosDaConversao.entrada.valor)
    const moedaDeEntrada = (dadosDaConversao.entrada.moeda || "BTC").toUpperCase()
    const moedaDeSaida = (dadosDaConversao.saida.moeda || "USDT").toUpperCase()

    if (isNaN(valorDeEntrada)) {
        console.error(`ERRO: Valor de entrada dever ser numérico.`)
        return
    }
    await receberDadosDasMoedas() 

    const cotacaoDaMoedaDeEntradaParaBtc = moedaDeEntrada === "BTC"
        ? 1
        : dadosDaConversao.cotacoes.find(cotacao => cotacao.moeda === moedaDeEntrada)?.valor    
    if (cotacaoDaMoedaDeEntradaParaBtc === undefined) {
        console.error(`ERRO: Moeda não existe "${moedaDeEntrada}".`)
    }

    const cotacaoDaMoedaDeSaidaParaBtc = moedaDeSaida === "BTC"
        ? 1
        : dadosDaConversao.cotacoes.find(cotacao => cotacao.moeda === moedaDeSaida)?.valor    
    if (cotacaoDaMoedaDeSaidaParaBtc === undefined) {
        console.error(`ERRO: Moeda não existe "${moedaDeSaida}".`)
    }

    if (cotacaoDaMoedaDeEntradaParaBtc === undefined || cotacaoDaMoedaDeSaidaParaBtc === undefined ) {
        return
    }

    const razao = cotacaoDaMoedaDeEntradaParaBtc / cotacaoDaMoedaDeSaidaParaBtc
    const valorDeSaida = valorDeEntrada * razao

    const valorDeEntradaDecimais = moedaDeEntrada.includes("USD") || moedaDeEntrada.includes("BRL") ? 2 : 8
    const valorDeSaidaDecimais = moedaDeSaida.includes("USD") || moedaDeSaida.includes("BRL") ? 2 : 8

    console.log(`RESULTADO: ${valorDeEntrada.toFixed(valorDeEntradaDecimais)} ${moedaDeEntrada} -> ${valorDeSaida.toFixed(valorDeSaidaDecimais)} ${moedaDeSaida}`)

}

async function executarPrograma() {
    console.info("CONVERSOR DE MOEDAS")
    console.info("^^^^^^^^^^^^^^^^^^^")
    await receberParametrosDoUsuario()
    await calcularResultado()
    console.info("____________________")
    console.info("Aplicação finalizada")
}

executarPrograma()