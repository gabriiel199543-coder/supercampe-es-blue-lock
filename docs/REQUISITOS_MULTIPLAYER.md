# Especificação funcional — sala privada 1×1 via navegador

## Experiência do usuário
1. Na tela principal, selecionar **Online 1×1 → Criar sala**. Um treinador escolhe apelido (2–24 caracteres), gera ou escolhe clube e recebe código de seis caracteres + link copiável.
2. O outro jogador abre o link em OUTRO dispositivo/navegador, seleciona **Entrar** e escolhe seu clube. Cada jogador é responsável apenas pelo seu lado; o servidor anuncia presença e prontidão.
3. O servidor cria duas equipes de 16 personagens distintos a partir do banco global de 110, procurando força média parecida, duas opções de goleiro em cada elenco e equilíbrio de posições. A separação de bancos temáticos não bloqueia a partida.
4. Cada técnico escala 11 titulares e dispõe de cinco reservas, seleciona formação e funções, escolhe a identidade e dá **Pronto**. Após ambos prontos, bloquear a preparação e iniciar contagem regressiva de 3 s.
5. O relógio simulado vai 0–90: um minuto do jogo a cada dois segundos reais. Intervalo no 45, 30 segundos ou menos caso ambos cliquem **Voltar do intervalo**.
6. Durante a partida os treinadores veem campo tático, placar, minuto, feed, poderes ativados, fadiga, xG e lista de substituições. Mudança tática tem cooldown de 5 minutos simulados. Até cinco substituições válidas por equipe; trocas atualizam o estado em próximo tick.
7. No apito final, ambos veem o MESMO placar, relatório, gráficos resumidos e opção de criar nova sala/rematch (rematch pode reaproveitar conexão com novo ID/seed). Um clube com pouco orçamento não fica mais fraco nesta exibição por causa de finanças.

## Estados e transições do servidor
- `LOBBY`: sala recém-criada; espera exatamente 2 jogadores.
- `SQUAD_SETUP`: elencos atribuídos, personalização/escalação; ambos devem sinalizar ready.
- `KICKOFF`: curta contagem regressiva automática.
- `FIRST_HALF`: ticks 1..45. Comandos enfileirados e processados apenas no servidor.
- `HALFTIME`: alterações permitidas; contagem 30s; ambos prontos podem antecipar.
- `SECOND_HALF`: ticks 46..90.
- `FINISHED`: placar final, resumo e 30min para consulta.
- `ABANDONED`: sala expirada/desistência; comunicar motivo.

Transições são controladas pelo servidor, nenhuma mensagem de cliente estabelece phase/minuto/gol. Conexão quebrada após kickoff: congelar o relógio de ambos, notificar e iniciar graça de 60 s. Retorno com token restaura mesma cadeira e snapshot; se não retornar, registrar vitória por W.O. (distinguir `resultType=forfeit` de placar esportivo, que permanece o disputado em campo). Sem usuários autenticados, um token furtado poderia controlar a cadeira: tratá-lo como credencial e nunca colocá-lo em URL ou log.

## Justiça esportiva: 110 atletas, 20 clubes, poderes
- Cada personagem do banco tem identificador global único. Nunca distribuir uma mesma pessoa para ambos os técnicos numa mesma partida.
- Os 20 clubes são **identidades e opções estéticas**; o gerador manual/aleatório não é um atalho para receber equipe poderosa: dinheiro, capacidade do estádio, origem e seguidores não entram no cálculo de gols.
- Elenco mínimo por lado: 2 goleiros + 14 de linha; 11 titulares válidos: 1 goleiro e jogadores compatíveis com a formação; 5 no banco. O posicionamento usa `positionFit`/`roleScore` existentes, preservando a lógica original.
- Usar composição determinística por seed gerada no servidor. Objetivo: diferença relativa do valor técnico estimado dos titulares abaixo de 5% sempre que viável. Não falsificar o elenco para atingir meta: tentar trocas por posição, mostrar score de equilíbrio e se necessário criar nova seed. Nunca prometer equilíbrio matematicamente perfeito.
- Modo exibição: habilidades de assinatura disponíveis temporariamente com domínio inicial de 40 (configuração comum às duas equipes), sem tocar em `initialMastery`, `stage`, `skills` e `awakening` persistentes. Gatilhos e custo continuam obrigatórios. Experiência/treino na carreira offline permanece regida pela progressão já especificada.
- Categorias `impact`, `creation`, `reading`: `reading>impact>creation>reading`, bônus padrão 5pp, 9pp se ambos poderes estiverem efetivamente ativos naquele duelo. Não acumular 5+9. Bônus total novo limitado ±15pp, vitória nunca garantida.

## Futebol, campo e audiovisual
- Primeiro MVP não requer física contínua da bola nem visual 3D. A partida deve ser real no motor de eventos, com posse de bola, passes, disputas, finalizações, goleiros, pressão, contexto e lesão/cartão apenas se já estiverem implementados corretamente.
- Reusar progressivamente zonas de campo e fases: construção, progressão, criação, finalização, transição. Garantir contexto de posse entre eventos (evitar sorteio isolado não relacionado ao campo quando refatoração permitir).
- Campo 2D pode representar posições, deslocamentos interpolados e destaques de confrontos como visualização do motor. Não apresentar animação como se fosse física exata quando for meramente ilustrativa.
- As decisões dos técnicos são de estratégia, **não** controle instantâneo de personagens. Sem botões de chute/passe por jogador humano.

## Um lado só, visibilidade parcial
- Ambos recebem informações comuns (cronômetro, placar, feed, ações públicas). Cada treinador recebe seus comandos de escalação/instrução, habilidade escondida apenas quando conhecida, relatórios próprios. Não vazar futuras rolagens, afinidades ocultas do rival, tokens ou segredos de servidor no snapshot público.
- Time adversário reage pelas regras do motor e pelos próprios comandos humanos; NÃO executar `opponentTactic()` fixo para o lado remoto após conectar segundo humano.
- Treino não é executado durante a partida online (somente local/carreira futura). Estados psicológicos podem modificar as decisões em campo, mas alterações temporárias de amistoso não mudam o banco mestre.

## Redes, execução e segurança
- Mesmo domínio HTTP+WS na versão simples: `http://localhost:3000` e `ws://localhost:3000/ws` no desenvolvimento. Ambiente público precisa `https://dominio` e `wss://dominio/ws`, com proxy e WebSocket Upgrade habilitados.
- Preferir servidor Node atual LTS, `ws`, HTTP nativo (ou Express se já existir) e client WebSocket nativo. Não exigir contas, Docker, Redis, banco de dados ou serviços pagos para rodar localmente.
- Salas em memória bastam para MVP e serão perdidas se o processo reiniciar. Proteger contra abuso: tamanho máx. 16 KiB por mensagem, limites por IP e por conexão, portas de origin permitidas, sanitização de apelidos, validação por JSON, cleanup da sala.
- Lobby expira em 15 min, resultados ficam em memória 30 min. Códigos e tokens não previsíveis gerados com função criptográfica. Testar sincronização com latência e reconexão.
- Interface responsiva para desktop e celular, botões acessíveis e idioma pt-BR.
