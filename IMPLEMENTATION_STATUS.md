# Estado de implementação — Manager Online v2

Branch: `development/manager-online-v2`  
Base preservada: `846b1d397ba362bf7c33b92a85f403c1dab197ab`

## Fase 0 — concluída
- Auditados os 9 arquivos do repositório e os 30 arquivos do pacote.
- Lidos os documentos de entrada, contrato WebSocket, parâmetros e testes de aceitação.
- Catálogo canônico: 110 atletas / 110 poderes / 4 equipes (25/35/25/25).
- 20 clubes coerentes; originais são somente referência, não um segundo catálogo.
- Protótipo de seis telas preservado integralmente em `legacy/index.html`.
- `src/engine.js`, `src/roster.js` e os testes antigos preservados.
- Verificador oficial do ZIP passou; 6 testes legados passaram.

## Compatibilidade
- A versão atual é v0.3, mais recente que a v0.2 descrita no pacote.
- O motor CJS usa atributos 1–100; o navegador já possui formação e funções. Ambos serão preservados.
- `awakening` é XP de estágio; `development.readiness` será uma medida separada 0–100.
- O catálogo de 110 inclui os 22 anteriores com seus IDs e assinaturas. Não somar catálogos.
- Cada amistoso online usará 16 atletas por lado, com 11 titulares e 5 reservas, distribuídos pelo servidor sem repetições.
- Assinaturas emprestadas no amistoso não alterarão o banco canônico nem a carreira.
- Fases avançadas de carreira, escolas, mercado e ranking não fazem parte do MVP obrigatório do pacote.

## Em implementação
Importação dos bancos, criação coerente de clubes, módulos compartilhados, visualização 2D e servidor autoritativo.

## Validação e limites do ambiente
A execução normal do terminal falhou na preparação do sandbox. Os testes legados
foram executados pelo runtime JavaScript, e o verificador do pacote por Python
3.14. Um runtime Node portátil está sendo preparado no workspace para executar
os comandos npm, o backend e testes de integração reais.
Nenhum servidor público foi publicado.
