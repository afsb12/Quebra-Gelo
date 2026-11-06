# Feature Specification: Seleção de Categorias no Modo "Tudo Misturado"

**Feature Branch**: `006-mixed-mode-category-filter`

**Created**: 2026-11-01

**Status**: Draft

**Input**: User description: "User Story: Seleção de Categorias no Modo 'Tudo Misturado'. Como
usuário, quero poder escolher quais baralhos específicos farão parte do modo 'Tudo Misturado', para
que eu possa evitar perguntas fora de contexto (ex.: remover perguntas de 'Trabalho' em um encontro
romântico) mantendo a surpresa da mistura. Gatilho: ícone de configurações (⚙️) ou filtro (funil) no
canto superior direito do destaque 'Tudo Misturado' na tela inicial, sutil, em tons escuros e
azul-gelo. Seleção: ao tocar no ícone abre um painel inferior (ou modal minimalista centralizado) que
lista as 8 categorias com chaves liga/desliga; por padrão todas ativadas. Regras: a seleção fica
salva no aparelho para não precisar refazer o filtro a cada abertura; não permitir iniciar o modo
misto nem salvar o filtro com menos de 2 categorias ativas (botão 'Salvar' desativado); ao tocar no
corpo do destaque para jogar, o baralho é montado e embaralhado só com as perguntas das categorias
ativas no filtro atual."

**Depends on**: [004-mixed-mode-hidden-backs](../004-mixed-mode-hidden-backs/spec.md), que cria o
modo "Tudo Misturado" (mini carta horizontal na largura total, acima da grade das 8 categorias,
verso escuro da marca), o baralho misturado sem repetição e a etiqueta de categoria na frente.
Esta feature **substitui** a suposição da 004 de que o modo sempre inclui as 8 categorias: passa a
incluir as categorias escolhidas pelo usuário (todas, por padrão).

**Contexto**: o exemplo "Trabalho" do pedido é ilustrativo; o app tem hoje 8 categorias
(Descontraído, Profundo, Casais, Happy Hour, Dilemas, Viagens e Aventuras, Nostalgia e Infância,
Futuro).

## Clarifications

### Session 2026-11-01

Modo automático: o usuário autorizou aceitar a opção recomendada em cada pergunta.

- Q: O destaque mostra "X de 8 categorias" quando há filtro ativo? → A: Sim (FR-015), para quem volta
  ao app saber que a mistura está reduzida.
- Q: Mudar o filtro descarta o baralho misturado em andamento? → A: Sim, só quando o conjunto de
  categorias muda; salvar o mesmo conjunto mantém o progresso (FR-010).
- Q: Qual tom de azul-gelo usa o ícone de filtro? → A: `#9ED8F0`, sobre o fundo escuro da marca.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Escolher quais categorias entram na mistura (Priority: P1)

Antes de um encontro a dois, alguém toca no pequeno ícone de filtro no canto do destaque "Tudo
Misturado" na tela inicial. Abre um painel com as 8 categorias, cada uma com seu ícone, nome e uma
chave liga/desliga, todas ligadas. A pessoa desliga "Happy Hour" e "Dilemas", toca em "Salvar" e
volta para a tela inicial. Ao tocar no destaque, joga só com perguntas das 6 categorias que ficaram
ligadas, ainda sem saber de qual delas virá a próxima carta.

**Why this priority**: é o pedido em si: ajustar a mistura ao contexto do grupo sem perder a surpresa.

**Independent Test**: desligar algumas categorias, salvar, abrir o modo misturado e passar por todas
as cartas do baralho, conferindo pela etiqueta de cada carta revelada que nenhuma pergunta vem de uma
categoria desligada e que todas as perguntas das categorias ligadas aparecem.

**Acceptance Scenarios**:

1. **Given** a tela inicial, **When** a pessoa olha o destaque "Tudo Misturado", **Then** vê um ícone
   de filtro discreto no canto superior direito, separado da área de toque que inicia o jogo.
2. **Given** a tela inicial, **When** a pessoa toca no ícone de filtro, **Then** abre um painel com as
   8 categorias, cada uma com ícone, nome e chave liga/desliga, sem iniciar o jogo.
3. **Given** um aparelho onde o filtro nunca foi alterado, **When** o painel abre, **Then** todas as 8
   categorias estão ligadas.
4. **Given** o painel aberto, **When** a pessoa desliga "Happy Hour" e "Dilemas" e toca em "Salvar",
   **Then** o painel fecha e o filtro passa a valer.
5. **Given** um filtro salvo com 6 categorias, **When** a pessoa toca no corpo do destaque, **Then** o
   modo misturado começa com um baralho embaralhado só com as perguntas dessas 6 categorias.
6. **Given** um baralho filtrado em andamento, **When** todas as suas cartas já apareceram, **Then** o
   fim do baralho é exibido; nenhuma pergunta repetiu e nenhuma veio de categoria desligada.
7. **Given** o painel aberto com alterações não salvas, **When** a pessoa o fecha sem tocar em
   "Salvar" (deslizando para baixo, tocando fora ou usando "voltar"), **Then** as alterações são
   descartadas e o filtro anterior continua valendo.

---

### User Story 2 - Garantir que a mistura sempre faça sentido (Priority: P1)

Ao desligar categorias, a pessoa chega a ter só uma ligada. O botão "Salvar" fica desativado e uma
mensagem curta explica que é preciso escolher pelo menos 2 categorias para misturar. Ao religar outra
categoria, o botão volta a funcionar.

**Why this priority**: sem essa regra seria possível salvar um filtro vazio (baralho sem cartas) ou de
uma categoria só (que não é "misturado"); a regra é parte obrigatória do pedido.

**Independent Test**: no painel, desligar categorias até restar 1 e depois 0, verificar que "Salvar"
fica desativado com a mensagem, e religar uma categoria para ver o botão voltar.

**Acceptance Scenarios**:

1. **Given** o painel com 2 categorias ligadas, **When** a pessoa desliga mais uma, **Then** o botão
   "Salvar" fica desativado e aparece a mensagem "Escolha pelo menos 2 categorias".
2. **Given** o painel com 0 ou 1 categoria ligada, **When** a pessoa toca em "Salvar", **Then** nada é
   salvo e o painel continua aberto.
3. **Given** o painel com 1 categoria ligada, **When** a pessoa liga outra, **Then** a mensagem some e
   o botão "Salvar" volta a funcionar.
4. **Given** qualquer situação, **When** a pessoa toca no destaque para jogar, **Then** o modo
   misturado nunca começa com menos de 2 categorias.

---

### User Story 3 - Lembrar o filtro entre aberturas (Priority: P2)

O grupo salva um filtro sem "Casais" para uma noite com amigos. Na semana seguinte, ao abrir o app,
o filtro continua igual e o destaque "Tudo Misturado" indica que a mistura está personalizada.

**Why this priority**: evita refazer o filtro a cada abertura; depende das histórias 1 e 2.

**Independent Test**: salvar um filtro, fechar o app por completo, reabri-lo e conferir que o painel
mostra as mesmas chaves e que o destaque indica o filtro ativo.

**Acceptance Scenarios**:

1. **Given** um filtro salvo, **When** o app é fechado por completo e reaberto, **Then** o painel
   mostra exatamente as mesmas categorias ligadas e desligadas.
2. **Given** um filtro com menos de 8 categorias, **When** a tela inicial aparece, **Then** o destaque
   "Tudo Misturado" mostra discretamente quantas categorias estão na mistura (ex.: "6 de 8
   categorias").
3. **Given** um filtro com as 8 categorias ligadas, **When** a tela inicial aparece, **Then** o
   destaque não mostra nenhuma indicação de filtro.

---

### Edge Cases

- **Filtro alterado com um baralho misturado em andamento**: se o filtro salvo mudar, o próximo
  acesso ao modo misturado começa um baralho novo com as categorias atuais; se o filtro for salvo sem
  mudanças, o progresso em andamento continua.
- **Dado salvo inválido ou ilegível**: se o filtro salvo não puder ser lido, ou tiver menos de 2
  categorias válidas, o app volta ao padrão (todas ligadas) sem travar nem atrasar a tela inicial.
- **Categoria nova numa atualização do app**: uma categoria que passe a existir depois que o filtro
  foi salvo entra ligada por padrão; uma categoria que deixe de existir é ignorada.
- **Toque perto do ícone**: tocar no ícone de filtro MUST NOT iniciar o jogo, e tocar no corpo do
  destaque MUST NOT abrir o painel; a área de toque do ícone é confortável sem invadir a do jogo.
- **Verso oculto preservado**: o painel e a indicação de filtro não mudam o verso das cartas do modo
  misturado; a carta continua sem revelar a categoria antes de virar (regras da 004).
- **Leitor de tela**: o ícone é anunciado como "Escolher categorias da mistura"; cada chave anuncia o
  nome da categoria e se está ligada ou desligada; o motivo do "Salvar" desativado é lido.
- **Fonte grande e telas pequenas**: as 8 categorias e o botão "Salvar" ficam acessíveis (com rolagem
  se necessário) e nenhum nome de categoria é cortado.
- **Movimento reduzido**: a abertura e o fechamento do painel usam uma transição simplificada.
- **Baralhos de categoria única**: não são afetados pelo filtro; continuam disponíveis na grade
  mesmo que a categoria esteja desligada na mistura.

## Requirements *(mandatory)*

### Functional Requirements

**Gatilho**

- **FR-001**: O destaque "Tudo Misturado" da tela inicial MUST exibir um ícone de filtro no canto
  superior direito, discreto, em azul-gelo `#9ED8F0` sobre tons escuros, coerente com o verso da marca.
- **FR-002**: Tocar no ícone MUST abrir o painel de seleção sem iniciar o jogo; tocar no restante do
  destaque MUST iniciar o modo misturado como na feature 004.

**Painel de seleção**

- **FR-003**: O painel MUST abrir a partir da parte de baixo da tela, ocupando só parte dela, e listar
  as 8 categorias na mesma ordem da tela inicial, cada uma com ícone, nome e chave liga/desliga.
- **FR-004**: Num aparelho em que o filtro nunca foi salvo, todas as categorias MUST vir ligadas.
- **FR-005**: O painel MUST ter um botão "Salvar" que aplica o filtro e fecha o painel.
- **FR-006**: Fechar o painel sem salvar (deslizar para baixo, tocar fora ou "voltar") MUST descartar
  as alterações e manter o filtro salvo anterior.
- **FR-007**: Com menos de 2 categorias ligadas, o botão "Salvar" MUST ficar desativado e o painel
  MUST mostrar a mensagem "Escolha pelo menos 2 categorias".

**Regras do baralho**

- **FR-008**: O modo misturado MUST montar o baralho só com as perguntas das categorias ligadas no
  filtro salvo, em ordem aleatória, sem repetir perguntas até todas terem aparecido.
- **FR-009**: O modo misturado MUST NOT iniciar com menos de 2 categorias.
- **FR-010**: Quando o filtro salvo mudar, o progresso do baralho misturado em andamento MUST ser
  descartado e o próximo acesso MUST começar um baralho novo com as categorias atuais; salvar sem
  mudanças MUST preservar o progresso.
- **FR-011**: O filtro MUST NOT afetar os baralhos de categoria única nem os favoritos.

**Persistência**

- **FR-012**: O filtro salvo MUST ficar guardado só no aparelho e sobreviver a fechar e reabrir o app.
- **FR-013**: Se o filtro salvo estiver ilegível ou inválido (menos de 2 categorias existentes), o app
  MUST usar o padrão de todas as categorias ligadas.
- **FR-014**: Categorias novas que não existiam quando o filtro foi salvo MUST entrar ligadas.

**Indicação e textos**

- **FR-015**: Com menos de 8 categorias ligadas, o destaque MUST mostrar discretamente a quantidade
  na mistura (ex.: "6 de 8 categorias"); com todas ligadas, MUST NOT mostrar indicação.
- **FR-016**: Os textos novos (título do painel, "Salvar", mensagem de mínimo, indicação de
  quantidade e rótulos de acessibilidade) MUST ficar centralizados com os demais textos da interface,
  em pt-BR.
- **FR-017**: O ícone, as chaves e o botão MUST ter rótulos e estados acessíveis para leitor de tela.

### Key Entities

- **Filtro da mistura**: conjunto das categorias ligadas para o modo misturado; mínimo de 2; padrão
  com todas; guardado só no aparelho; válido para todas as aberturas até ser alterado.
- **Categoria** (existente): id, nome, ícone, cor; aparece no painel com sua chave.
- **Baralho misturado** (da 004): agora montado a partir do filtro salvo; refeito quando o filtro muda.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos baralhos misturados filtrados, nenhuma carta revelada pertence a uma
  categoria desligada, e todas as perguntas das categorias ligadas aparecem antes de qualquer repetição.
- **SC-002**: Em 100% das tentativas, não é possível salvar um filtro nem começar o modo misturado com
  menos de 2 categorias.
- **SC-003**: Uma pessoa ajusta o filtro (abrir o painel, mudar chaves e salvar) em até 15 segundos.
- **SC-004**: Em 100% das reaberturas do app, o filtro salvo aparece exatamente como foi deixado.
- **SC-005**: Com o filtro já salvo, chegar à primeira carta do modo misturado continua levando 1 toque
  a partir da tela inicial.
- **SC-006**: Em testes com usuários, ao menos 9 em cada 10 encontram o ícone de filtro sem ajuda
  quando pedidos para "tirar uma categoria da mistura".

## Assumptions

- O pedido cita soluções técnicas (painel inferior/"BottomSheet", gerenciador de estado com
  armazenamento local, algoritmo de embaralhamento Fisher-Yates, filtragem do arquivo de conteúdo).
  São indicações para o plano; a spec exige só o comportamento. O embaralhamento já usado pelo app
  continua valendo.
- O mínimo é 2 categorias (o pedido cita "0 categorias", mas pede explicitamente forçar no mínimo 2);
  a regra é aplicada desativando "Salvar", não bloqueando as chaves.
- O painel inferior é a forma escolhida; o modal centralizado citado como alternativa não será feito.
- O ícone é um funil (filtro), que comunica melhor "escolher o que entra" do que uma engrenagem.
- O azul-gelo `#9ED8F0` passa a fazer parte da paleta do app (tokens de design) como cor de destaque.
- Não há "selecionar todas"/"limpar" nem filtros salvos por nome nesta versão.
- O progresso do baralho misturado continua só em memória (zera ao fechar o app); só o filtro é salvo.
