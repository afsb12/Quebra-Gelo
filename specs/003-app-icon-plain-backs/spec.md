# Feature Specification: Novo Ícone do App e Verso das Cartas Sem Padrões

**Feature Branch**: `003-app-icon-plain-backs`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "quero alterar o ícone do aplicativo e fazer um ajuste nas cartas. No
verso das cartas tem alguns desenhos (círculos, bolinhas, etc) tira elas e deixa somente as cores. E
sobre o ícone @Assets/ícone.png tenta usar essa imagem como base, mas pode polir e gerar algo com a
ideia de moderno e minimalista premium. Cria uma nova branch para essa feature"

**Depends on**: [002-card-visual-design](../002-card-visual-design/spec.md), which defines the card
back (category color, big icon, bold name, tone-on-tone geometric pattern) and the mini cards on the
home screen. This feature **removes the geometric pattern** requirement from 002 and replaces the
app icon, which today is still the framework's default placeholder.

## Clarifications

### Session 2026-11-01

- Q: Qual esquema de cores o novo ícone do app usa? → A: Fundo escuro do app (`#16131C`),
  contornos em creme (`#F7F0E3`) e a interseção preenchida com uma única cor de destaque quente
  (ex.: coral/âmbar).
- Q: O verso também perde o leve escurecimento nas bordas (vinheta)? → A: Não; a vinheta sutil do
  verso permanece, só os desenhos (padrões geométricos) saem.
- Q: A tela de abertura mostra só o símbolo ou o símbolo com o nome "Quebra-Gelo"? → A: Só o
  símbolo, centralizado sobre o fundo escuro, sem texto.

## Referência do ícone

`Assets/ícone.png` é um esboço do próprio usuário: dois quadrados de cantos arredondados, só com
contorno, sobrepostos na diagonal (um em cima à esquerda, outro embaixo à direita), com a área de
interseção preenchida, e o texto "Quebra-Gelo" embaixo. A ideia é **duas pessoas (ou dois mundos) se
encontrando, e o ponto em comum ganhando forma**: é exatamente o que o jogo propõe. Esse conceito e
essa composição são a base; o refinamento vem em proporção, espessura de traço, cores e acabamento.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verso da carta só com a cor da categoria (Priority: P1)

Ao entrar numa categoria, o grupo vê a carta virada para baixo com a cor sólida e limpa da categoria,
o ícone grande e o nome em letras bold, sem círculos, bolinhas, listras, ondas ou qualquer outro
desenho de fundo. O visual fica mais limpo e a cor da categoria ganha protagonismo.

**Why this priority**: é o ajuste pedido de forma mais direta, aparece em toda rodada do jogo e na
tela inicial, e é independente do ícone.

**Independent Test**: abrir cada uma das 8 categorias e a tela inicial e verificar que nenhum verso
de carta (grande ou miniatura) mostra desenho de fundo, mantendo cor, ícone e nome.

**Acceptance Scenarios**:

1. **Given** qualquer uma das 8 categorias, **When** a carta aparece virada para baixo, **Then** o
   fundo do verso é preenchido apenas com a cor da categoria, sem nenhum padrão geométrico.
2. **Given** a tela inicial, **When** as mini cartas das categorias são exibidas, **Then** elas
   seguem o mesmo verso liso da carta grande.
3. **Given** um verso liso, **When** o grupo olha a carta, **Then** o ícone e o nome da categoria
   continuam no mesmo lugar, tamanho e cor de antes, e as 8 categorias continuam distinguíveis
   entre si pela cor e pelo ícone.
4. **Given** uma carta virada, **When** o grupo vê a frente, **Then** a frente da carta continua
   exatamente como antes (este ajuste afeta só o verso).

---

### User Story 2 - Ícone do app moderno e minimalista (Priority: P2)

Na tela inicial do celular, na lista de apps e na tela de abertura, o Quebra-Gelo aparece com um
ícone próprio, derivado do esboço de dois quadrados arredondados que se sobrepõem, com acabamento
premium e minimalista, no lugar do ícone genérico atual.

**Why this priority**: é a primeira impressão do app fora dele e dá identidade ao produto, mas não
afeta a experiência de jogo.

**Independent Test**: instalar o app num Android e num iPhone, olhar o ícone na tela inicial, na
gaveta de apps, com tema de ícones monocromático (Android) e a tela de abertura ao iniciar.

**Acceptance Scenarios**:

1. **Given** o app instalado, **When** o usuário vê a tela inicial do celular, **Then** o ícone
   mostra dois quadrados arredondados sobrepostos na diagonal com a interseção destacada, sem
   nenhum resquício do ícone padrão anterior.
2. **Given** um Android com máscara de ícone circular, arredondada ou "squircle", **When** o ícone é
   exibido, **Then** o símbolo aparece inteiro e centralizado, sem ser cortado.
3. **Given** um Android com ícones temáticos (monocromáticos) ativados, **When** o ícone é exibido,
   **Then** aparece uma versão em uma única cor do mesmo símbolo, legível.
4. **Given** o app sendo aberto, **When** a tela de abertura aparece, **Then** ela mostra o mesmo
   símbolo sobre o fundo escuro do app, sem quebra visual na transição para a tela inicial do jogo.
5. **Given** o ícone em tamanho pequeno (lista de configurações, notificação de sistema,
   multitarefa), **When** exibido, **Then** o símbolo continua reconhecível.

---

### Edge Cases

- **Categoria de cor clara**: sem o padrão, o verso liso de uma cor clara não pode parecer "vazio" ou
  confundir-se com a moldura creme; o contraste entre a cor do verso e a moldura deve continuar
  visível.
- **Ícone em fundo claro e escuro**: o ícone deve se destacar tanto num papel de parede claro quanto
  num escuro.
- **Tamanhos mínimos**: em tamanhos muito pequenos, traços finos somem; a espessura dos contornos deve
  ser suficiente para o símbolo não "desmanchar".
- **Texto no ícone**: o nome "Quebra-Gelo" do esboço fica ilegível em tamanho de ícone; o nome já
  aparece abaixo do ícone pelo próprio sistema.
- **Movimento reduzido / animações**: virar e descartar a carta continua igual; o verso liso não
  altera gestos, física nem resposta tátil.

## Requirements *(mandatory)*

### Functional Requirements

**Verso das cartas**

- **FR-001**: O verso de toda carta MUST exibir como fundo apenas a cor sólida da sua categoria, sem
  padrões, formas ou desenhos (substitui o padrão geométrico tom sobre tom definido na feature 002).
  O leve escurecimento nas bordas (vinheta) do verso MUST ser mantido como está.
- **FR-002**: O verso MUST manter a moldura clara, os cantos arredondados, o ícone grande da
  categoria e o nome da categoria em tipografia bold, nas mesmas posições, tamanhos e cores atuais.
- **FR-003**: As mini cartas da tela inicial MUST usar o mesmo verso liso da carta grande.
- **FR-004**: A frente da carta, as cores das categorias, os ícones das categorias, as animações de
  virar/descartar e a resposta tátil MUST permanecer inalterados.
- **FR-005**: Cada uma das 8 categorias MUST continuar visualmente distinguível das demais apenas pela
  cor e pelo ícone do verso.

**Ícone do app**

- **FR-006**: O app MUST ter um ícone próprio baseado no esboço `Assets/ícone.png`: dois quadrados de
  cantos arredondados sobrepostos na diagonal, com a área de interseção preenchida/destacada.
- **FR-007**: O ícone MUST seguir uma estética moderna, minimalista e premium: geometria precisa e
  simétrica, traço uniforme, poucas cores (no máximo 3, contando o fundo), sem texto, sombras
  pesadas, brilhos ou detalhes decorativos.
- **FR-008**: O ícone MUST usar exatamente 3 cores: o fundo escuro do app (`#16131C`), creme claro
  (`#F7F0E3`) nos contornos dos dois quadrados e uma única cor de destaque quente (coral/âmbar)
  preenchendo a interseção, para que ícone, tela de abertura e app pareçam um só produto. A versão
  monocromática usa só a forma, sem cor.
- **FR-009**: O ícone MUST ser entregue em todas as variantes que o app usa: ícone principal (iOS e
  geral), ícone adaptativo do Android (frente com o símbolo dentro da área segura + fundo),
  versão monocromática para ícones temáticos do Android, favicon e imagem da tela de abertura.
- **FR-010**: Na variante adaptativa do Android, o símbolo MUST caber inteiro dentro da área segura
  central, sem ser cortado por nenhuma máscara de formato.
- **FR-011**: A tela de abertura MUST exibir apenas o mesmo símbolo do ícone, centralizado, sobre a
  cor de fundo do app, sem o nome do app nem qualquer outro texto.
- **FR-012**: O ícone MUST ser original, sem reproduzir logotipos, marcas ou elementos de outros
  jogos ou apps (constituição, "Conteúdo e Experiência de Jogo").
- **FR-013**: O arquivo-fonte do ícone MUST ficar guardado no projeto em formato editável e
  escalável, para que as variantes possam ser regeradas no futuro sem perda de qualidade.

### Key Entities

- **Verso da carta**: lado virado para baixo; atributos que permanecem: cor da categoria, vinheta
  sutil nas bordas, moldura, ícone, nome. Atributo removido: padrão geométrico de fundo.
- **Símbolo do app**: o desenho dos dois quadrados sobrepostos; origem de todas as variantes do ícone
  (principal, adaptativo, monocromático, favicon, tela de abertura).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 das 8 categorias exibe qualquer desenho no fundo do verso, tanto na carta grande
  quanto na mini carta da tela inicial.
- **SC-002**: Em um teste com 5 pessoas, todas identificam corretamente a categoria de cada um dos 8
  versos lisos apenas pela cor e pelo ícone (com o nome coberto).
- **SC-003**: O símbolo aparece inteiro, sem cortes, nas máscaras de ícone circular, quadrada
  arredondada e "squircle" do Android, e no ícone do iOS.
- **SC-004**: O símbolo continua reconhecível (dois quadrados sobrepostos distinguíveis) quando
  exibido a 48×48 px.
- **SC-005**: 100% dos lugares onde o app aparece fora do jogo (tela inicial do celular, gaveta de
  apps, ícone temático, tela de abertura, favicon) mostram o novo símbolo; nenhum mostra o ícone
  padrão anterior.
- **SC-006**: Virar e descartar cartas continuam tão fluidos quanto antes (sem quedas perceptíveis de
  quadros), já que o verso passa a ter menos elementos a desenhar.

## Assumptions

- "Tira os desenhos e deixa somente as cores" refere-se ao padrão geométrico de fundo do verso
  (bolinhas, círculos concêntricos, losangos, bolhas, xadrez, ondas, listras, divisas). O ícone e o
  nome da categoria **permanecem**, pois identificam a categoria e não são "desenhos de fundo".
- O texto "Quebra-Gelo" do esboço não entra no ícone (fica ilegível em tamanho de ícone e o sistema
  já mostra o nome do app); a composição dos dois quadrados é o símbolo.
- O tom exato do destaque quente (dentro da faixa coral/âmbar) é definido no planejamento,
  garantindo contraste com o fundo escuro e com o creme.
- O ícone gerado substitui os arquivos de ícone existentes do app; o esboço `Assets/ícone.png`
  continua no repositório como referência.
- Nome, versão, identificador do pacote e demais configurações do app não mudam.
- Os 8 tons de categoria definidos na feature 002 já são distinguíveis sem o padrão; se algum par
  ficar parecido demais sem ele, ajustar a cor é tratado como bug desta feature.
