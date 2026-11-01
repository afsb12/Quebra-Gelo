# Feature Specification: Modo "Tudo Misturado" com Verso Oculto e Etiqueta de Categoria

**Feature Branch**: `004-mixed-mode-hidden-backs`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "User Story: Design Oculto e Contexto no Modo 'Tudo Misturado'. Como
usuário, quero que as cartas do modo 'Tudo Misturado' escondam sua categoria no verso e revelem a
origem apenas na frente, para que eu tenha o elemento surpresa antes de ler, mas mantenha o contexto
do tom da pergunta (profundo, engraçado, etc.) durante a conversa. Critérios: verso — estado inicial
virado para baixo; identidade visual do Quebra-Gelo (dois quadrados de cantos arredondados
sobrepostos sobre fundo escuro); nenhuma informação da pergunta ou categoria vaza. Frente — ao tocar
e virar, mostra a pergunta centralizada com leitura limpa; uma pequena etiqueta (badge) indica de
onde a pergunta veio, usando o ícone e a cor da categoria original definidos no conteúdo do app
(ex.: '❤️ Casais', '🚀 Futuro')."

**Depends on**: [001-icebreaker-cards-mvp](../001-icebreaker-cards-mvp/spec.md) (baralho, sorteio
sem repetição, virar/pular, favoritos), [002-card-visual-design](../002-card-visual-design/spec.md)
(frente e verso das cartas, mini cartas da tela inicial) e
[003-app-icon-plain-backs](../003-app-icon-plain-backs/spec.md) (símbolo do app: dois quadrados
arredondados sobrepostos sobre o fundo escuro `#16131C`, contornos creme e interseção em cor de
destaque).

**Contexto**: hoje o app só oferece baralhos de uma categoria por vez; o modo "Tudo Misturado" ainda
não existe. Esta feature cria o modo (todas as categorias embaralhadas num único baralho) e define o
visual das suas cartas. Os exemplos do pedido ("❤️ Casais" em `#FF3366`, "🚀 Futuro" em `#33FFEC`)
são ilustrativos: a etiqueta usa o ícone e a cor que cada categoria já tem no conteúdo do app.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Jogar com todas as categorias misturadas, sem saber o tom antes de virar (Priority: P1)

Na tela inicial, além das 8 categorias, o grupo encontra a opção "Tudo Misturado". Ao escolhê-la,
aparece uma carta virada para baixo com o verso da marca Quebra-Gelo: fundo escuro e o símbolo dos
dois quadrados arredondados sobrepostos. Nada no verso indica se a próxima pergunta é profunda,
engraçada ou de casal; todas as cartas do modo têm exatamente o mesmo verso. O grupo toca, a carta
vira e a pergunta aparece.

**Why this priority**: é o núcleo do pedido: sem o modo misturado e sem o verso neutro não existe
elemento surpresa. Sozinha, esta história já entrega uma forma nova de jogar.

**Independent Test**: abrir "Tudo Misturado", pular e virar várias cartas e verificar que todos os
versos são idênticos, que nenhum mostra cor, ícone ou nome de categoria, e que as perguntas vêm de
categorias diferentes.

**Acceptance Scenarios**:

1. **Given** a tela inicial, **When** o grupo procura como começar, **Then** encontra a opção
   "Tudo Misturado", visualmente distinta das 8 categorias e exibida com o mesmo verso neutro da
   marca.
2. **Given** o modo "Tudo Misturado" aberto, **When** uma nova carta aparece, **Then** ela está
   virada para baixo, com fundo escuro e o símbolo do Quebra-Gelo centralizado, sem cor, ícone,
   nome de categoria, texto ou pista da pergunta.
3. **Given** duas cartas consecutivas de categorias diferentes, **When** são comparadas viradas para
   baixo, **Then** os versos são indistinguíveis.
4. **Given** uma carta virada para baixo, **When** o grupo toca nela, **Then** ela vira com a mesma
   animação e a mesma resposta tátil das outras categorias e mostra a pergunta.
5. **Given** o modo misturado em andamento, **When** o grupo vira e pula cartas, **Then** nenhuma
   pergunta se repete até que todas as perguntas de todas as categorias tenham aparecido.
6. **Given** que todas as perguntas já apareceram, **When** a última carta é descartada, **Then** o
   grupo vê o fim do baralho com a opção de embaralhar de novo ou escolher outra categoria.

---

### User Story 2 - Saber de onde veio a pergunta depois de virar (Priority: P2)

Com a carta virada, a pergunta ocupa o centro da carta para uma leitura limpa e uma pequena
etiqueta mostra a categoria de origem, com o ícone e a cor dessa categoria (ex.: ícone de coração e
"Casais" no vermelho de Casais). Assim o grupo entende o tom da pergunta (profunda, divertida,
nostálgica…) enquanto conversa.

**Why this priority**: dá o contexto que o verso esconde; depende da história 1 para existir, mas é
o que torna o modo misturado confortável de jogar.

**Independent Test**: virar cartas no modo misturado até ver ao menos uma pergunta de cada uma das
8 categorias e conferir que cada etiqueta mostra o ícone, o nome e a cor certos daquela categoria.

**Acceptance Scenarios**:

1. **Given** uma carta virada no modo misturado, **When** a frente aparece, **Then** a pergunta fica
   centralizada na carta e é o elemento de maior destaque.
2. **Given** uma pergunta da categoria "Casais", **When** a carta é virada, **Then** uma etiqueta
   pequena mostra o ícone de Casais e o nome "Casais" na cor de Casais.
3. **Given** qualquer uma das 8 categorias, **When** uma pergunta dela é revelada, **Then** a
   etiqueta usa exatamente o ícone, o nome e a cor cadastrados para essa categoria.
4. **Given** a etiqueta exibida, **When** o grupo lê a pergunta, **Then** a etiqueta não cobre nem
   se sobrepõe ao texto da pergunta, mesmo nas perguntas mais longas.
5. **Given** uma pergunta revelada no modo misturado, **When** o grupo a favorita, **Then** ela vai
   para os favoritos associada à sua categoria de origem, como em qualquer outro baralho.

---

### Edge Cases

- **Vazamento pela acessibilidade**: com leitor de tela, a carta virada para baixo no modo misturado
  não pode anunciar a categoria (hoje o anúncio é "Carta de {categoria}, virada para baixo"); deve
  dizer apenas que é uma carta do Quebra-Gelo virada para baixo. Ao virar, a categoria e a pergunta
  passam a ser anunciadas.
- **Vazamento pela transição**: durante o descarte de uma carta já virada, a carta seguinte que
  surge por baixo deve estar virada para baixo, sem mostrar por um instante a frente, a cor ou a
  etiqueta da próxima pergunta.
- **Vazamento por elementos ao redor**: o título, a cor de fundo ou qualquer elemento da tela do
  baralho não podem mudar conforme a categoria da próxima carta enquanto ela estiver virada para
  baixo (o título mostra "Tudo Misturado").
- **Contraste da etiqueta**: categorias de cor clara (ex.: Descontraído, Nostalgia) e escura
  (ex.: Profundo) precisam de etiqueta legível sobre a frente creme.
- **Fonte grande do sistema**: com fonte do sistema ampliada, a etiqueta continua numa linha e a
  pergunta continua inteira e legível.
- **Nomes longos de categoria**: "Viagens e Aventuras" e "Nostalgia e Infância" cabem na etiqueta
  sem cortar ou empurrar a pergunta.
- **Movimento reduzido**: com a preferência de movimento reduzido ativa, a revelação usa a versão
  simplificada da animação já existente, sem pistas da categoria antes da revelação.
- **Progresso independente**: avançar no modo misturado não altera o progresso salvo de cada
  categoria individual, e vice-versa; ambos zeram quando o app é fechado.

## Requirements *(mandatory)*

### Functional Requirements

**Modo "Tudo Misturado"**

- **FR-001**: A tela inicial MUST oferecer a opção "Tudo Misturado", além das 8 categorias, alcançável
  com no máximo 2 toques até a primeira carta.
- **FR-002**: O baralho do modo misturado MUST conter todas as perguntas de todas as categorias, em
  ordem aleatória.
- **FR-003**: No modo misturado, uma pergunta MUST NOT se repetir até que todas as perguntas do
  baralho tenham aparecido; qualquer carta pode ser pulada.
- **FR-004**: O progresso do modo misturado MUST ser mantido apenas em memória durante a sessão,
  independente do progresso de cada categoria, e MUST zerar quando o app é fechado.
- **FR-005**: Ao fim do baralho misturado, o app MUST oferecer embaralhar de novo e voltar à escolha
  de categoria, como nos demais baralhos.

**Verso oculto (face para baixo)**

- **FR-006**: Toda carta do modo misturado MUST surgir virada para baixo.
- **FR-007**: O verso das cartas do modo misturado MUST exibir a identidade visual do Quebra-Gelo:
  fundo escuro do app com o símbolo dos dois quadrados de cantos arredondados sobrepostos, centralizado.
- **FR-008**: O verso do modo misturado MUST ser idêntico para todas as cartas e MUST NOT exibir
  cor, ícone ou nome de categoria, texto da pergunta ou qualquer elemento que varie com a carta.
- **FR-009**: Enquanto a carta estiver virada para baixo, nenhum outro canal (rótulo de
  acessibilidade, título ou cores da tela, transições) MUST revelar a categoria ou a pergunta.
- **FR-010**: A opção "Tudo Misturado" na tela inicial MUST usar o mesmo verso neutro, em versão
  miniatura, mantendo a moldura e o formato das demais mini cartas.

**Frente revelada**

- **FR-011**: Ao tocar na carta, ela MUST virar com a mesma animação, física e resposta tátil dos
  demais baralhos, e o pulo/descarte MUST funcionar igual.
- **FR-012**: A frente MUST exibir a pergunta centralizada na carta, como elemento principal, com o
  mesmo papel creme e tipografia de leitura dos demais baralhos.
- **FR-013**: A frente MUST exibir uma etiqueta pequena com o ícone e o nome da categoria de origem,
  na cor dessa categoria, conforme cadastrados no conteúdo do app (nenhuma cor ou ícone fixo no
  componente).
- **FR-014**: A etiqueta MUST ser legível sobre a frente para todas as 8 cores de categoria e MUST NOT
  sobrepor o texto da pergunta.
- **FR-015**: A cor da categoria de origem MAY ser usada nos detalhes da frente revelada (ex.:
  moldura), mas apenas depois da revelação.
- **FR-016**: Favoritar uma pergunta no modo misturado MUST funcionar como nos demais baralhos e
  MUST registrar a pergunta com sua categoria de origem.

**Escopo preservado**

- **FR-017**: Os baralhos de categoria única MUST continuar com o verso colorido da categoria e a
  frente atuais, sem alteração.
- **FR-018**: Os textos novos ("Tudo Misturado", descrição curta do modo, rótulos de acessibilidade)
  MUST ficar centralizados com os demais textos da interface, em pt-BR.

### Key Entities

- **Modo "Tudo Misturado"**: um baralho especial que reúne todas as perguntas de todas as categorias;
  tem nome, descrição curta e identidade visual própria (a da marca Quebra-Gelo), sem cor de
  categoria.
- **Categoria** (existente): id, nome, ícone, cor e descrição; fonte do ícone, nome e cor da etiqueta.
- **Pergunta** (existente): id, texto e exatamente uma categoria de origem; a origem determina a
  etiqueta exibida na frente.
- **Progresso do baralho misturado**: ordem embaralhada de todas as perguntas e posição atual, em
  memória durante a sessão.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das cartas do modo misturado viradas para baixo, nenhum observador consegue
  identificar a categoria da pergunta (versos idênticos entre todas as 8 categorias, inclusive pelo
  leitor de tela).
- **SC-002**: Em 100% das cartas reveladas, a etiqueta mostra o ícone, o nome e a cor corretos da
  categoria de origem.
- **SC-003**: Um grupo chega da tela inicial à primeira carta do modo misturado em no máximo 2 toques.
- **SC-004**: Em uma sessão, nenhuma pergunta se repete antes de todas as perguntas do baralho
  misturado terem aparecido.
- **SC-005**: Em testes com usuários, ao menos 9 em cada 10 pessoas identificam o tom/categoria da
  pergunta revelada olhando para a carta, em até 3 segundos.
- **SC-006**: A virada da carta no modo misturado tem a mesma fluidez percebida e o mesmo retorno
  tátil dos demais baralhos (nenhuma diferença notada em teste lado a lado).

## Assumptions

- O modo "Tudo Misturado" não existe hoje e faz parte do escopo desta feature; ele inclui
  obrigatoriamente todas as 8 categorias (sem seleção parcial de categorias nesta versão).
- O verso neutro reutiliza o símbolo do app definido na feature 003 (fundo `#16131C`, contornos
  creme, interseção na cor de destaque), mantendo a moldura clara e os cantos arredondados das cartas.
- Os exemplos de emoji e de cores hexadecimais do pedido são ilustrativos; o ícone e a cor da
  etiqueta são os já cadastrados para cada categoria no conteúdo do app (ex.: Casais usa o ícone de
  coração e `#C41E3A`; Futuro usa o foguete e `#167A4C`).
- "Pergunta centralizada" significa a pergunta ocupar a área central da carta como foco de leitura;
  o alinhamento do texto segue o padrão de leitura já usado na frente das cartas.
- A opção "Tudo Misturado" aparece na tela inicial em posição de destaque (antes ou acima das 8
  categorias); a posição exata é decisão de design no plano.
- Favoritos, fim de baralho, haptics e movimento reduzido reaproveitam o comportamento existente.
- Nenhum conteúdo novo de perguntas é necessário; o modo usa o conteúdo já embarcado, offline.
