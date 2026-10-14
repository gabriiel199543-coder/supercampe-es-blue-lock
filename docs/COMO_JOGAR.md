# Como rodar a versão que o Codex implementar

## No computador
1. Com o Codex no repositório, pedir para ele executar até que `npm install`, `npm start` e `npm test` funcionem sem erros.
2. No projeto atualizado, abrir terminal e usar `npm install` (uma vez) e `npm start` (para iniciar). O script esperado deve servir frontend e WebSocket.
3. Abrir `http://localhost:3000/` no navegador. Selecionar **Online 1×1 → Criar sala**.
4. Abrir outro navegador/aba independente em `http://localhost:3000/`, escolher **Entrar na sala** e informar o código.
5. Criar/selecionar clubes, preparar cada equipe, marcar **Pronto** nos dois lados. Assistir à partida de 90 min simulados e alterar táticas durante o jogo.
6. Para usar com dois aparelhos na mesma Wi-Fi, descobrir o IP local do PC (por exemplo `192.168.1.100`), permitir a porta no firewall e acessar `http://IP_LOCAL:3000/` em ambos. `localhost` no celular não aponta para o PC.

## Pela internet, com amigo em outro lugar
- O Codex precisa publicar um processo de servidor Node que mantenha WebSocket ativo, com TLS/HTTPS. O endereço público deve usar `https://...` e a conexão `wss://.../ws`.
- GitHub é ótimo para manter código; páginas estáticas do GitHub Pages não executam o backend Node do 1×1. Publicar backend em hospedagem que aceite processo persistente + WebSocket Upgrade. Não supor gratuidade/uptime de nenhum fornecedor.
- Pedir ao Codex confirmação do link público, healthcheck e teste com dois dispositivos. Se não tiver permissão/credenciais para publicar, deixe funcionando localmente e mostre os comandos exatos.

## Troubleshooting
- **Link abre mas amigo não entra:** confirmar que hospedagem executa backend e que HTTPS/WSS e proxy WebSocket estão corretos.
- **Tela fica 'Conectando':** confirmar que `npm start` está em execução, rota `/ws` acessível e firewall liberado.
- **Partidas diferentes em cada tela:** bug crítico: falta servidor autoritativo. Não aceitar como concluído.
- **Partida reiniciou ao atualizar página:** token de reconexão e snapshot não implementados corretamente.
- **Só uma aba funciona:** talvez o servidor não aceite dois sockets distintos ou use `localStorage` como estado de partida.
- **App no GitHub Pages só joga sozinho:** esperado para versão estática; modo online exige backend ativo.
