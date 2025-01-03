# Conversor de Moedas - Node.js

Este é um simples conversor de moedas em Node.js que consulta cotações de criptomoedas através da API da Binance. Ele permite converter valores entre diferentes moedas (incluindo criptomoedas) com base nas cotações mais recentes.

## Funcionalidades

- Solicita ao usuário o valor a ser convertido, a moeda de entrada e a moeda de saída.
- Utiliza a API da Binance para obter as cotações de criptomoedas.
- Realiza a conversão entre as moedas informadas, considerando taxas de câmbio de Bitcoin.
- Exibe o resultado da conversão no terminal com a precisão adequada para cada moeda.

## Como Usar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/conversor-de-moedas.git

2. O programa pedirá as seguintes informações:
  Valor a ser convertido
  Moeda de entrada (ex: USD, BTC, BRL)
  Moeda de saída (ex: USD, BTC, BRL)

Dependências
  node:fs: Para realizar requisições HTTP à API da Binance.
  node:readline: Para interagir com o usuário via terminal.
