# Checklist obrigatório — não declare concluído sem passar

## Integridade e regressão
- [ ] `python scripts/validar_pacote.py` sem erros.
- [ ] `npm install && npm test` sai com código 0.
- [ ] Jogo offline antigo abre, permite escalação, treino, partida e substituição sem exceção de JS.
- [ ] 110 IDs de jogador únicos e 110 assinaturas; quatro equipes de origem (25/35/25/25). Dez marxistas sem perder os 100 anteriores.
- [ ] 20 clubes de exemplo, campos de origem/cor/estádio, gerador seeded reproduzível e travas preservadas.
- [ ] `awakening` XP e `development.readiness` 0–100 não se confundem.

## Multiplayer com dois browsers reais
- [ ] Navegador A cria sala; navegador B entra via código/link em computador distinto ou aba em sessão independente.
- [ ] Navegador C não consegue entrar numa sala cheia.
- [ ] Ambos selecionam clube (ou geram aleatoriamente); identidade aparece corretamente para o rival.
- [ ] Cada time recebe 16 jogadores únicos; nenhuma pessoa aparece simultaneamente nas duas equipes, cada elenco tem ao menos dois goleiros.
- [ ] 11 titulares/5 reservas por lado, escalações e posição do goleiro são válidas; duplicação e escalações inválidas rejeitadas.
- [ ] A partida não inicia antes de ambos terem clicado **Pronto** com formação válida.
- [ ] Relógio simula 0 a 90; intervalo no 45; placar e eventos iguais nos dois clientes.
- [ ] Alterar pressing/tempo/risco pelo A altera apenas as decisões do A na partida, não os comandos privados do B.
- [ ] A tenta substituir jogador B e servidor responde NOT_AUTHORIZED / INVALID_PLAYER.
- [ ] Mais de 5 substituições rejeitadas; repetir mesma mensagem de substituição não gera segunda aplicação.
- [ ] Vantagem de categoria Impacto×Criação, Criação×Leitura e Leitura×Impacto aplicada conforme configuração, com perdas possíveis.
- [ ] Pelo menos uma ativação de poder válida em teste determinístico com gatilho satisfeito; sem ativações quando gatilho é falso.
- [ ] A dá refresh no minuto 35 e retorna com `resumeToken` antes de 60s, sem reiniciar cronômetro nem mudar placar.
- [ ] B cai por mais de 60s; partida termina com `resultType=forfeit`, placar esportivo preservado, ambos informados.
- [ ] Payload forjado com score, phase, minute, seed não manipula o servidor.
- [ ] Um login/carrinho não é necessário; servidor Node serve frontend e WebSocket no mesmo domínio.
- [ ] `match_end` é emitido uma vez, vencedor/empate e xG iguais aos dois lados.

## Problemas de rede e publicação
- [ ] Dois clientes acessam o servidor em IP de rede local, sem utilizar `localhost` do telefone apontando para o próprio telefone.
- [ ] Com domínio HTTPS público, WebSocket usa WSS, sem erros de mixed content.
- [ ] O processo servidor suporta WebSocket Upgrade e mantém a conexão ativa por ao menos uma partida; checagem `/health` responde 200.
- [ ] Erro para sala inexistente, sala cheia, conexão perdida e servidor indisponível está em português claro.
- [ ] Servidor encerra/cancela salas antigas e não vaza token em logs/telemetria.

## Qualidade
- [ ] Layout minimamente utilizável em desktop e celular, contrastes legíveis, páginas distintas para online/tática/jogo.
- [ ] Código compartilhado do motor pode ser testado sem DOM/browser e seed fixa reproduz mesma simulação.
- [ ] Log do Codex contém: commits, comandos para iniciar, testes automáticos e seus resultados, captura/screenshot ou descrição do teste manual, bugs pendentes.
- [ ] Se não houver hospedagem de rede, informar que localhost foi testado e NÃO afirmar que duelo remoto pela internet foi publicado.
