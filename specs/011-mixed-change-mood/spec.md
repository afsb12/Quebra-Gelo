# Feature Specification: "Mudar o Clima" no Modo Misturado

**Feature Branch**: `011-mixed-change-mood`

**Created**: 2026-11-08

**Status**: Draft

**Input**: User description: "Trocar o botão de embaralhar as próximas cartas por algo com efeito
real: no 'Tudo Misturado', um botão 'mudar o clima' faz a próxima carta sair de uma categoria
diferente da carta atual. Embaralhar de novo uma ordem que já é aleatória não muda nada que o
jogador perceba; o desejo real por trás do botão ('essa conversa cansou') é mudar de assunto."

**Depends on**: [004-mixed-mode-hidden-backs](../004-mixed-mode-hidden-backs/spec.md) (baralho
"Tudo Misturado", versos que não revelam a categoria),
[006-mixed-mode-category-filter](../006-mixed-mode-category-filter/spec.md) (filtro de categorias
da mistura), [008-reshuffle-remaining-cards](../008-reshuffle-remaining-cards/spec.md) (botão de
re-embaralhar, que esta feature substitui) e
[009-directional-swipe-navigation](../009-directional-swipe-navigation/spec.md) (próxima pela
esquerda, voltar pela direita, histórico de cartas vistas).

**Contexto**: a ordem de cada baralho já é sorteada ao abrir, com todas as ordens igualmente
prováveis. O botão de 008 ("Embaralhar as próximas cartas") troca essa ordem aleatória por outra
igualmente aleatória: a próxima carta continua sendo qualquer uma das que faltam, com a mesma
chance, então o toque não tem efeito perceptível. A própria spec 008 descreve o desejo por trás do
botão: "a roda quer mudar o clima da conversa". No modo misturado isso tem uma resposta concreta:
trocar a carta da mesa por uma de **outra categoria**.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Mudar o clima da conversa no modo misturado (Priority: P1)

Uma roda joga "Tudo Misturado". Sai uma carta de "Profundo" e o grupo quer algo mais leve. Depois
de virar a carta e ver a categoria, alguém toca em "Mudar o clima": o aparelho vibra, a carta sai
da mesa e entra uma nova carta, virada para baixo, de uma categoria diferente (por exemplo,
"Dilemas"). O jogo segue normalmente.

**Why this priority**: é o valor inteiro da feature: um botão que faz o que o jogador espera dele.

**Independent Test**: no modo misturado com o filtro padrão, virar uma carta, tocar em "Mudar o
clima" várias vezes e conferir, ao virar cada nova carta, que a categoria é sempre diferente da
carta anterior.

**Acceptance Scenarios**:

1. **Given** uma carta virada para cima no modo misturado, **When** o jogador toca em "Mudar o
   clima", **Then** entra uma carta nunca vista, virada para baixo, de uma categoria diferente da
   carta que estava na mesa, e o contador avança uma posição ("Carta 5 de 270" → "Carta 6 de
   270").
2. **Given** várias categorias diferentes com cartas ainda não vistas, **When** o jogador muda o
   clima, **Then** a categoria da nova carta é sorteada entre elas, com chance igual para cada
   categoria (não para cada carta), para que categorias com mais cartas restantes não dominem.
3. **Given** que o jogador mudou o clima, **When** desliza para a direita, **Then** volta à carta
   que foi trocada, virada para cima, como qualquer carta já vista (009).
4. **Given** que o jogador mudou o clima, **When** segue jogando até o fim, **Then** nenhuma carta
   se repete e todas as cartas do baralho aparecem uma vez antes do "Fim do Baralho".
5. **Given** o toque em "Mudar o clima", **When** a nova carta entra, **Then** o aparelho vibra e
   um aviso curto ("Clima trocado") aparece no lugar da dica de gestos, sem revelar a categoria da
   nova carta.

---

### User Story 2 - Botão só aparece quando faz sentido (Priority: P2)

O botão nunca promete algo que não pode cumprir: ele fica indisponível enquanto a carta está
virada para baixo, quando o jogador está revendo cartas antigas, e quando não sobra nenhuma carta
de outra categoria.

**Why this priority**: evita toques sem efeito, o mesmo problema que motivou a feature.

**Independent Test**: percorrer os estados (carta virada para baixo, carta revista após voltar,
filtro com só cartas de uma categoria restante) e verificar o estado do botão.

**Acceptance Scenarios**:

1. **Given** uma carta virada para baixo, **When** a tela é exibida, **Then** "Mudar o clima"
   aparece desativado (o jogador ainda não sabe o clima da carta).
2. **Given** que o jogador voltou a uma carta já vista (deslizou para a direita), **When** a carta
   revista está na mesa, **Then** o botão fica desativado; ele volta a funcionar ao chegar de novo
   na carta mais recente.
3. **Given** que todas as cartas ainda não vistas são da mesma categoria da carta atual (ou não
   sobra nenhuma), **When** a carta é virada, **Then** o botão fica desativado.

---

### User Story 3 - Categorias sem o botão sem efeito (Priority: P2)

Quem joga um baralho de uma só categoria não vê mais o botão de embaralhar as próximas cartas,
já que ele não muda nada que dê para perceber e não existe "outra categoria" para onde mudar.

**Why this priority**: tira um controle sem efeito da tela, alinhado ao princípio de zero atrito.

**Independent Test**: abrir qualquer categoria e verificar que a linha de controles mostra só o
botão de favoritar e a dica de gestos.

**Acceptance Scenarios**:

1. **Given** um baralho de categoria, **When** a tela do jogo é exibida, **Then** não há botão de
   embaralhar nem de mudar o clima; o botão de favoritar continua centralizado.
2. **Given** o fim de qualquer baralho, **When** aparece o "Fim do Baralho", **Then** "Embaralhar
   de novo" continua recomeçando o baralho do zero, como hoje.

---

### Edge Cases

- **Filtro com uma categoria só**: o filtro exige pelo menos 2 categorias (006), mas, perto do
  fim, as cartas restantes podem ser todas de uma categoria; o botão fica desativado (US2-3).
- **Última carta do baralho**: sem cartas não vistas, o botão fica desativado; deslizar para a
  esquerda leva ao "Fim do Baralho".
- **Revendo cartas (009)**: mudar o clima a partir de uma carta antiga mexeria no histórico; por
  isso o botão só funciona na carta mais recente (US2-2).
- **Toques repetidos rápidos**: cada toque troca a carta uma vez; a nova carta entra virada para
  baixo, então o botão fica desativado até ela ser virada, o que impede trocas em cadeia sem ler a
  carta.
- **Versos que não revelam a categoria (004)**: o aviso, o rótulo de acessibilidade e o verso da
  nova carta nunca dizem de qual categoria ela é antes de ser virada.
- **Movimento reduzido**: a animação do ícone do botão é omitida; a vibração e o aviso continuam.
- **Favoritos**: a carta trocada pode ser favoritada antes da troca, ou depois, ao voltar a ela.
- **Mudança do filtro**: como hoje (006), mudar o filtro recomeça o baralho misturado; nada a
  migrar.

## Requirements *(mandatory)*

### Functional Requirements

**Mudar o clima (modo misturado)**

- **FR-001**: No baralho "Tudo Misturado", a tela do jogo MUST oferecer o botão "Mudar o clima" no
  lugar do botão de embaralhar as próximas cartas (mesma posição, à direita do botão de favoritar).
- **FR-002**: Ao tocar, a carta da mesa MUST ser substituída por uma carta **nunca vista** de uma
  categoria **diferente** da categoria da carta da mesa, entre as categorias ativas no filtro.
- **FR-003**: A categoria da nova carta MUST ser sorteada com chance igual entre as categorias
  diferentes que ainda têm cartas não vistas; dentro da categoria sorteada, a carta MUST ser a
  próxima dela na ordem já embaralhada do baralho.
- **FR-004**: A carta substituída MUST contar como vista: entra no histórico (voltar pela direita
  a mostra), não reaparece até o fim do baralho, e o contador avança uma posição.
- **FR-005**: A nova carta MUST entrar virada para baixo, como qualquer próxima carta.
- **FR-006**: O botão MUST estar disponível só quando, ao mesmo tempo: a carta da mesa está virada
  para cima, é a carta mais recente (o jogador não está revendo cartas antigas) e existe pelo
  menos uma carta não vista de outra categoria. Nos demais casos MUST aparecer desativado.
- **FR-007**: O toque MUST dar retorno tátil (o mesmo padrão de "sucesso" usado hoje pelo botão de
  embaralhar) e mostrar o aviso curto "Clima trocado" no lugar da dica de gestos por 2 segundos,
  também anunciado pelo leitor de tela.
- **FR-008**: Nada (aviso, rótulo de acessibilidade, verso ou cabeçalho) MUST revelar a categoria
  da nova carta antes de ela ser virada (004).
- **FR-009**: Sob movimento reduzido, qualquer animação do botão MUST ser omitida; a troca, a
  vibração e o aviso continuam.

**Baralhos de categoria e fim do baralho**

- **FR-010**: Nos baralhos de uma só categoria, a tela do jogo MUST NOT mostrar botão de
  embaralhar nem de mudar o clima.
- **FR-011**: O re-embaralhamento das próximas cartas (008) MUST deixar de existir; "Embaralhar de
  novo", no "Fim do Baralho", MUST continuar como hoje.

**Regras que continuam valendo**

- **FR-012**: Sem repetição até mostrar todas as cartas, qualquer carta pode ser pulada, próxima
  pela esquerda e voltar pela direita (009), favoritos e filtro (006) MUST continuar funcionando.
- **FR-013**: Os textos novos MUST ficar centralizados com os demais textos da interface, em pt-BR.

### Key Entities

- **Baralho em andamento**: ordem embaralhada das cartas, posição atual e carta mais recente já
  mostrada (histórico). Mudar o clima traz uma carta não vista para logo depois da carta mais
  recente e avança para ela; a ordem das demais cartas não vistas não muda.
- **Categoria da carta**: cada carta pertence a exatamente uma categoria; é ela que define o
  "clima" a ser trocado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos toques em "Mudar o clima", a nova carta é de uma categoria diferente da
  carta substituída.
- **SC-002**: Em 1.000 trocas simuladas com 3 categorias restantes, cada categoria aparece entre
  25% e 42% das vezes (chance igual por categoria, FR-003).
- **SC-003**: Com qualquer sequência de trocas, próximas e voltas, cada carta do baralho aparece
  exatamente uma vez antes do "Fim do Baralho".
- **SC-004**: O botão nunca fica ativo num estado em que o toque não teria efeito (carta virada
  para baixo, revendo cartas, sem carta de outra categoria).
- **SC-005**: Nos baralhos de categoria, a linha de controles tem só o botão de favoritar e a dica.

## Assumptions

- **Só no modo misturado**: num baralho de uma só categoria não existe "outra categoria"; por isso
  o botão some ali, em vez de virar outra coisa.
- **Carta precisa estar virada**: o jogador só sabe o clima depois de ler a carta; com ela virada
  para baixo, trocar seria só pular (o que deslizar já faz).
- **Chance por categoria**: sortear por categoria (e não por carta) faz o botão realmente mudar de
  assunto mesmo quando uma categoria tem muito mais cartas restantes.
- **Rótulo**: "Mudar o clima" no botão (rótulo de acessibilidade "Mudar o clima: próxima carta de
  outra categoria"), aviso "Clima trocado". O ícone muda de "embaralhar" para um que sugira
  mudança de clima.
- **Tutorial**: o tutorial de primeiro uso (005/009) não cita o botão de embaralhar e não muda.
- **Sem persistência nova**: o progresso continua só na memória.
