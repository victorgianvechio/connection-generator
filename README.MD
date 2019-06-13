# Gerador de Conexão Oracle - Electron Project

Gerador de arquivo _.env_ com informações criptografadas de conexão com banco de dados.

![Gerador](https://i.imgur.com/XXOSHtu.png 'Gerador de Conexão')

## Variáveis

-   ENCRYPTION_KEY
-   ALGORITHM
-   DB_USER
-   DB_PASS
-   CONNECT_STRING

## Ciphers

-   AES-256-CBC
-   AES-256-CFB
-   AES-256-CTR
-   AES-256-GCM
-   AES-256-OFB

## Build

```sh
npm run build
```

## Corrigir erro de versão do NodeJS

excluir **package-lock.json** e a pasta **node_modules**

executar:

```sh
npm i
```

depois das dependências instaladas executar o rebuild:

```sh
npm run rebuild
```

e então gere o build:

```sh
npm run build
```

Copyright ® 2019 Victor Gianvechio
