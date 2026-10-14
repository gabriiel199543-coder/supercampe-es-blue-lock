# Supercampeões — Manager v0.4 em desenvolvimento

Branch de trabalho: `development/manager-online-v2`.

Esta entrega implementa a preparação e uma parte funcional da integração de
dados e clubes. **Ainda não é a versão multiplayer 1×1.** O protótipo anterior
continua disponível, com escalação, funções, treino, partidas e substituições.

## Começar a jogar

1. No GitHub, selecione a branch acima e use **Code → Download ZIP**, ou abra essa branch no Codex.
2. Extraia o projeto e instale o Node.js 24 LTS se ainda não estiver instalado.
3. Abra um terminal na pasta do projeto e execute:

```bash
npm install
npm test
npm start
```

Abra **http://localhost:3000/**. Para criar seu clube, clique em
**Criar ou escolher clube** na visão geral ou abra
**http://localhost:3000/clubes.html**.

Escolha uma das quatro equipes de origem, selecione um adversário, ajuste a
escalação e o treino, e simule a partida em blocos de 15 minutos ou até o fim.
Com 25–35 jogadores por equipe, há reservas disponíveis para substituições.

## O que está implementado

- Os mesmos 110 IDs, nomes, dez atributos e assinaturas do pacote, carregados pelo adaptador compatível. Não há soma de bancos.
- Quatro equipes: História do Brasil (25), Mundo (35), Internet (25), TV & Pop (25).
- Seleção explícita de adversário: uma equipe, em vez da união de todas as outras.
- As seis telas de gestão, treino, ficha, tática, banco e partida existentes.
- 20 identidades de clube predefinidas com cores, origem, estádio e orçamento.
- Editor manual, geração por seed, travas e rerrolagem apenas do visual.
- Escudo, bandeira e estandarte em SVG com a mesma paleta.
- Torcida local independente da audiência digital; orçamento derivado das receitas.
- Uso do clube salvo como identidade do time no protótipo.
- Servidor HTTP simples e healthcheck; **não há WebSocket de partida nesta fase**.
- Módulos separados de dados/compatibilidade, RNG, clubes e desenvolvimento.
- Desenvolvimento probabilístico, prontidão, conversas e memórias preparados em módulos; ainda não integrados ao motor da interface antiga.

## Metadados completos do pacote

O adaptador de 110 está incluído e já funciona. Para importar também o JSON
completo de personalidade, afinidades e poderes exatamente como veio no ZIP,
coloque `Manager_Online_1x1_Pacote_Completo_v2.zip` na pasta do projeto e rode:

```bash
npm run import
```

Nomes com `(1)` ou `(2)` também são reconhecidos. É possível indicar outro caminho
com `npm run import -- caminho/do/pacote.zip`. O importador verifica hashes e
contagens antes de escrever os bancos. A integração desses metadados ao novo
motor continua pendente.

## Testes

`npm test` executa os testes antigos, as regras de dados/clubes/desenvolvimento
e o servidor HTTP. Há um teste de navegador para a nova interface:

```bash
npm install --no-save playwright
npx playwright install chromium
npm run test:browser
```

Consulte `IMPLEMENTATION_STATUS.md` para distinguir testes executados dos
testes adicionados ainda sem execução. O workflow no GitHub executa ambos.

## Organização

- `index.html`: protótipo de gerenciamento ampliado para o banco de 110.
- `legacy/index.html`: cópia integral da v0.3 antes das alterações.
- `clubes.html` e `public/`: interface funcional do criador de clubes.
- `shared/`: módulos sem DOM de compatibilidade, clubes, RNG e desenvolvimento.
- `dados/` e `config/`: dados e parâmetros do pacote.
- `src/engine.js`, `src/roster.js`: motor e banco legados, preservados.
- `server/static.mjs`: servidor HTTP desta fase.
- `scripts/import-package.mjs`: importação fiel do ZIP com validação de integridade.
- `test/`: testes de regressão, regras e navegador.

## Limites e próximos passos

Faltam o motor compartilhado de futebol com posse e movimentação em 15 zonas,
a representação 2D das jogadas, poderes integrados aos duelos, o servidor
autoritativo WebSocket, salas privadas, dois treinadores, reconexão e resultados
sincronizados. Não há carreira multitemporadas, mercado ou ranking.

O estado da partida continua em memória. A identidade do clube é salva no
navegador. Os módulos de desenvolvimento não significam que esses sistemas já
estão ativos na partida do protótipo.

## Publicação

O criador e o protótipo atual podem ser servidos como arquivos estáticos.
Para a futura versão 1×1, GitHub Pages sozinho não serve: será necessário um
processo Node persistente, HTTPS, WebSocket Upgrade e conexões WSS.

Quando o servidor multiplayer estiver implementado e testado:
1. hospedar o projeto em um serviço que aceite Node e WebSocket persistente;
2. usar `npm install` e `npm start`, com a variável `PORT` da hospedagem;
3. configurar o proxy para `/ws` e o domínio HTTPS;
4. validar `/health`, os dois clientes e a reconexão antes de compartilhar o link.

Nesta fase `npm start` inicia somente o servidor HTTP. Nenhum endereço público
de partida online foi publicado.
