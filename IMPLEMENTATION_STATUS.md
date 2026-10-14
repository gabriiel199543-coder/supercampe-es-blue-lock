# Estado de implementação — Manager Online v2

Branch: `development/manager-online-v2`  
Base preservada: `846b1d397ba362bf7c33b92a85f403c1dab197ab`

## Entrega atual: fases 0 e parte da 1

| Área | Situação |
| --- | --- |
| Auditoria e proteção | Concluídas; protótipo v0.3 copiado integralmente para legacy/index.html |
| Banco de 110 | Adaptador completo incluído: IDs, nomes, 10 atributos e assinaturas exatos; quatro origens 25/35/25/25 |
| Metadados de personalidade/poderes | Importador fiel do ZIP criado; integração ao novo motor pendente |
| 20 clubes coerentes | Incluídos com todos os campos do pacote |
| Criador de clubes | Editor, seed, travas, SVG, orçamento, torcida e uso no protótipo implementados |
| Gestão existente | Preservada; escolha explícita de adversário e banco com reservas reais |
| Módulos compartilhados | RNG, compatibilidade, funções, clubes e desenvolvimento preparados |
| Treino/prontidão/conversas/memórias novos | Funções testadas isoladamente; ainda não integradas à partida da interface |
| Servidor HTTP | Implementado; validação de execução pendente no ambiente local |
| Motor de futebol 2D | Pendente |
| Poderes por categoria nos duelos | Configuração importada; integração pendente |
| Multiplayer autoritativo 1×1 | Pendente — nenhum WebSocket/sala de partida declarado funcional |
| Carreira avançada | Pendente |

## Fontes e compatibilidade

- Os 30 arquivos do pacote foram extraídos, conferidos por SHA-256 e usados como referência.
- Documentos prioritários e parâmetros JSON foram lidos; todas as planilhas foram percorridas.
- A representação compatível é o MESMO catálogo de 110 do pacote, não um novo elenco.
- Os 22 antigos conservam seus IDs, atributos e assinaturas no conjunto ampliado.
- O catálogo canônico completo `jogadores_110.json` foi lido/validado no workspace; devido à perda do executor, seu conteúdo completo ainda não foi transferido para a branch.
- `npm run import` importa esse JSON e os outros bancos diretamente do ZIP original, após validar hashes e contagens, sem inventar metadados.
- `awakening` continua XP; `development.readiness` é uma medida separada 0–100.
- Clubes e jogadores são entidades separadas. Dinheiro e torcida não são bônus de habilidade.
- O código da partida atual continua sendo o motor do protótipo. Nenhum movimento físico, multiplayer ou carreira completa foi simulado apenas por animação.

## Testes efetivamente executados

Antes da perda do executor:
- `scripts/validar_pacote.py`: passou com Python 3.14.
- SHA-256 e tamanho dos 30 arquivos: passaram.
- Planilhas: todas as abas XML foram percorridas.
- 6 testes antigos do motor: passaram no runtime Node.
- 1.000 clubes gerados: nenhum erro de regra obrigatória; seed determinística.

No ambiente JavaScript ainda disponível:
- 1.015 verificações de regras e dados: passaram.
- 22 verificações funcionais do protótipo com ambiente DOM de teste: banco de 110, quatro origens, adversário único, treino, navegação, substituição e partida até 90min.
- SVG: 28 símbolos distintos, 5 formatos e 6 padrões de estandarte com efeito visual real.
- Script do protótipo: sintaxe válida e IDs de elementos sem duplicação.
- Repetida amostra de 1.000 clubes após ajustes visuais/travas: passou.

Ainda sem execução local:
- `npm install`, `npm test`, `npm start` e os testes de HTTP/navegador adicionados.
- Testes de dois clientes, sincronização, finalização única, reconexão e W.O.; dependem do servidor multiplayer ainda não implementado.

## Bloqueio real do ambiente

O terminal inicialmente falhou com `helper_sandbox_lock_failed`. Foi possível
trabalhar usando o runtime JavaScript e Python, mas esse executor perdeu a
conexão e passou a responder `Transport closed`, inclusive ao tentar reiniciá-lo.
O navegador também estava indisponível. A implementação possível foi preservada
pela conexão do GitHub; não há alegação de backend multiplayer testado.

O workflow da branch tenta executar npm, HTTP e navegador em um runner do
GitHub. Seu resultado deve ser registrado após a execução, sem substituir por
“código escrito = teste passou”.

## Limites conhecidos do criador

As regras duras e os alertas de ocupação, capacidade típica e contraste estão
implementados. As regras suaves de afinidade de símbolo, atmosfera e justificativas
econômicas mais detalhadas ainda precisam ser ampliadas. Mercado, dívida,
contratos e direitos de TV permanecem fora desta fase.

## Próxima continuação

1. Executar/corrigir os testes de HTTP e navegador.
2. Importar o JSON completo do ZIP com `npm run import` no ambiente restaurado.
3. Implementar motor de posse/15 zonas compartilhado e renderer 2D.
4. Integrar categorias/gatilhos/custos e desenvolvimento ao motor.
5. Implementar Node + ws, duas cadeiras humanas, relógio autoritativo, reconexão e testes ponta a ponta.
