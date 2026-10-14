# Contrato WebSocket 1.0 — implementação fiel, sem divergência entre clientes

Cada mensagem é um objeto JSON com campos básicos: `v` (int = 1), `type` (string), `requestId` (string opcional nos comandos), `payload` (objeto). Mensagens de ação que alteram estado incluem `clientActionId` com ID aleatório por clique, para serem deduplicadas. Mensagens de estado emitidas pelo servidor incluem `seq` (número crescente **por sala**) e `serverTime` (timestamp ISO). `roomCode` pode aparecer dentro de payload, nunca usar `resumeToken` como identificador público.

## Cliente → servidor

| type | Payload mínimo | Permitido quando | Nota |
|---|---|---|---|
| `create_room` | `{nickname,club}` | fora de sala | devolve código e token privado da cadeira 1 |
| `join_room` | `{roomCode,nickname,club}` | `LOBBY` | devolve token privado da cadeira 2 |
| `resume_room` | `{roomCode,resumeToken,lastSeq}` | desconectado | nova conexão substitui a antiga da cadeira |
| `set_club` | `{club}` | lobby/setup antes de ready | servidor valida nome/cores/estrutura, preserva locks |
| `reroll_club` | `{theme,seed,lockedFields}` | lobby/setup antes de ready | seed e dados enviados não conferem autoridade de partida; servidor aplica regras do pool |
| `request_auto_squads` | `{}` | setup / responsável autorizado | alocação no servidor, para ambos |
| `set_lineup` | `{formation,slots:[{slotId,playerId,roleId}],benchIds}` | setup ou intervalo | valida todas as posições e 16 IDs disponíveis |
| `set_ready` | `{ready:true/false}` | setup | só confirma se formação legal e todos conectados |
| `set_halftime_ready` | `{ready:true}` | intervalo | acelera volta se dois prontos |
| `set_tactics` | `{pressing,tempo,freedom,risk,compactness,identity}` | em jogo/intervalo | cooldown 5 min, enfileirar para tick seguinte |
| `substitute` | `{outPlayerId,inPlayerId,slotId,roleId}` | jogo/intervalo | max 5, titular sai, reserva entra, sem duplicatas |
| `ping` | `{clientTime?}` | qualquer | resposta `pong` e heartbeat de transporte |

## Servidor → cliente

| type | Conteúdo / efeito |
|---|---|
| `room_created` | `{roomCode,seat:1,resumeToken,shareUrl}` só para criador |
| `room_joined` | `{roomCode,seat:2,resumeToken}` só para novo participante |
| `room_state` | `{phase,players:[{seat,nickname,clubName,connected,ready}],status}` público |
| `squad_assigned` | Elenco do próprio lado, IDs e atributos públicos permitidos; informações compartilhadas de adversário conforme scouting |
| `ready_changed` | Prontidão e countdown de início |
| `match_start` | Id da partida, seed NÃO divulgado antes do término, tempo oficial, snapshot |
| `match_snapshot` | `{seq,minute,score:{home,away},xg,phase,visibleEvents,publicTactics?,privateSelf,...}` com variações privadas por destino |
| `match_event` | `{eventId,minute,kind,summary,actorId?,targetId?,powerId?,publicMetadata}` |
| `halftime` | snapshot de minuto 45 + janela de ajustes |
| `match_end` | `{resultType,score,stats,summary,reason?}` exatamente igual nos dois lados, exceto campos pessoais |
| `player_disconnected` / `player_reconnected` | seat, tempo restante da graça, status de pausa |
| `command_accepted` | `{clientActionId,applyAtMinute,status}` apenas para dono do comando |
| `error` | `{code,message,requestId?}` sem secrets/stacktrace |
| `pong` | `{serverTime}` |

## Regras de confiabilidade

1. Toda mensagem de alteração passa por: JSON/schema → autenticar cadeira por token de conexão → fase → dono do lado → cooldown/limites → transformação no servidor → sequenciamento → broadcast/publicação seletiva.
2. NUNCA aceitar do cliente: `score`, `xg`, `minute`, `phase`, `winner`, `randomSeed`, `powerMastery` modificado, atributos, geração de gol ou alteração do rival. Ignore campos não previstos e rejeite payloads excessivos.
3. `clientActionId` duplicado na mesma cadeira retorna o mesmo aceite/erro, sem aplicar duas vezes. Reordenação de rede não pode provocar dois chutes/duas substituições. `seq` recebido inferior ao último exibido é descartado no cliente.
4. Comandos táticos são aplicados na virada do minuto simulado; `applyAtMinute=minute+1` é enviado na confirmação. Rumo ao minuto 90, comandos tardios recebem erro explícito.
5. Ao reconectar, `resume_room` recebe snapshot completo autorizado + último seq, sem recalcular os eventos passados. Tokens expiram quando a sala expira.
6. Implementar schema compartilhado em código (por exemplo Zod opcional), com teste automatizado dos exemplos `exemplos/mensagens.json`.
7. O servidor não deve declarar a própria partida como concluída duas vezes. `match_end` idempotente e imutável.
