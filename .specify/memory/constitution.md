# Quebra-Gelo Constitution

## Core Principles

### I. Zero Fricção

- O app MUST NOT exigir cadastro, login, conta ou backend.
- O app MUST NOT ter onboarding com mais de uma tela; da abertura do app até a primeira carta
  MUST haver no máximo dois toques.
- Todo o conteúdo (cartas e categorias) MUST vir empacotado no app. Nenhuma funcionalidade do
  jogo MAY depender de conexão com a internet, nem na primeira execução.
- O app MUST NOT coletar ou transmitir respostas, conversas ou dados pessoais, e MUST NOT usar
  rastreamento de terceiros. Favoritos e progresso ficam apenas no dispositivo.

Racional: o jogo acontece em rodas de amigos, viagens e bares, muitas vezes sem sinal; qualquer
barreira entre abrir o app e começar a conversar mata o quebra-gelo.

### II. Imersão Tátil

- Interações com cartas (arrastar, virar, descartar) MUST ser dirigidas por gestos com física
  (mola/inércia), implementadas com React Native Gesture Handler e Reanimated.
- Animações MUST rodar na UI thread (worklets/shared values) e manter 60 fps em dispositivos
  intermediários; animações MUST NOT depender de `setState` a cada quadro.
- Virar e descartar uma carta MUST disparar Haptic Feedback sutil via `expo-haptics`
  (ex.: impacto leve ao virar, seleção/impacto ao descartar). O app MAY oferecer uma opção
  para desligar a vibração, ligada por padrão.
- Quando o sistema indicar movimento reduzido, as animações MUST ser simplificadas
  (ex.: fade em vez de rotação), mantendo o feedback háptico.

Racional: a sensação de manusear cartas físicas é parte da experiência; física e vibração
transformam toques em gestos naturais.

### III. Tipagem Estrita

- TypeScript MUST rodar com `"strict": true`; `tsc --noEmit` MUST passar sem erros.
- O uso de `any` (explícito ou implícito) MUST NOT ocorrer; a regra
  `@typescript-eslint/no-explicit-any` MUST estar configurada como erro. Dados de origem
  desconhecida MUST usar `unknown` com narrowing.
- Todas as entidades de domínio (Deck/Categoria, Card, progresso, favoritos), props de
  componentes, stores e parâmetros de navegação MUST ter tipos explícitos e exportados.
- Supressões (`@ts-ignore`, `@ts-expect-error`, `as unknown as`) MUST NOT ser usadas sem
  comentário justificando e aprovação na revisão.

Racional: tipos rigorosos tornam o conteúdo e as telas seguros para evoluir sem regressões
silenciosas.

### IV. Arquitetura Limpa

O código MUST respeitar três camadas, com dependências apenas de cima para baixo:

- **Camada de Dados** (`src/data`, `src/store`, `src/hooks`): JSON das cartas, tipos de domínio,
  stores Zustand e hooks que expõem os dados. É a única camada que acessa AsyncStorage ou o JSON.
- **Camada de UI** (`src/components`): componentes "burros", que recebem tudo por props, não
  acessam stores, hooks de dados ou navegação, e não contêm regra de negócio.
- **Telas** (`src/screens` ou rotas): containers que conectam hooks/stores aos componentes de UI
  e tratam navegação.

- Regras de negócio (sorteio, filtragem por categoria, controle de cartas vistas) MUST ficar em
  funções puras ou hooks da Camada de Dados, testáveis sem renderizar componentes.
- Componentes de UI MUST ser reutilizáveis e MUST NOT importar de `src/screens` ou `src/store`.

Racional: separar dados, apresentação e orquestração mantém o código limpo, modular, escalável
e fácil de manter.

## Stack Técnica e Restrições

- Framework: React Native com Expo (Managed Workflow). Módulos nativos MUST ser compatíveis com
  o Managed Workflow (sem eject); exceções exigem emenda a esta constituição.
- Linguagem: TypeScript em modo strict (ver Princípio III).
- Estilização: NativeWind é o padrão. `StyleSheet` nativo MAY ser usado em componentes críticos
  de performance (ex.: cartas animadas); um mesmo componente MUST NOT misturar as duas abordagens.
- Estado: Zustand para favoritos e progresso. Dados que precisam sobreviver ao fechamento do
  app (ex.: favoritos) MUST ser persistidos com o middleware `persist` sobre AsyncStorage;
  estado de sessão (ex.: progresso do baralho, quando a especificação assim definir) MAY ficar
  apenas em memória. Estado efêmero de tela fica em estado local do componente.
- Animações e gestos: React Native Reanimated e React Native Gesture Handler; háptica via
  `expo-haptics`.
- Plataformas-alvo: Android e iOS, com telas a partir de 320pt de largura.
- Novas dependências MUST ser justificadas no plano da feature; a solução mais simples que
  atende à especificação é a padrão (YAGNI).

## Conteúdo e Experiência de Jogo

- A tela de jogo MUST exibir uma carta por vez, com a pergunta como elemento dominante, e MUST
  NOT incluir placar, cronômetro obrigatório, anúncios ou notificações.
- O baralho é organizado em categorias temáticas, sem ordem obrigatória. Cada carta MUST ter um
  ID único e estável e pertencer a exatamente uma categoria; cada categoria MUST ter nome,
  descrição curta e identidade visual própria.
- Dentro de uma sessão, uma carta MUST NOT se repetir até que todas as cartas das categorias
  selecionadas tenham sido exibidas. Todo jogador MUST poder pular qualquer carta.
- Perguntas, nomes de categorias e identidade visual MUST ser originais; textos, nomes, layouts
  ou marcas de jogos comerciais (incluindo referências em `Assets/`) MUST NOT ser copiados.
- Perguntas MUST ser em português do Brasil, acolhedoras e inclusivas, sem pressupor gênero,
  orientação, religião, estado civil, condição financeira ou estrutura familiar. Textos de
  interface MUST ficar centralizados para permitir tradução futura.
- A interface MUST oferecer rótulos de acessibilidade em elementos interativos e contraste
  adequado (WCAG 2.1 AA como referência).

## Fluxo de Desenvolvimento e Qualidade

- Toda feature segue o fluxo Spec Kit: especificar → (esclarecer) → planejar → tarefas →
  implementar. O plano MUST conter uma verificação explícita contra esta constituição.
- Lógica da Camada de Dados (sorteio, filtragem, progresso, favoritos) MUST ter testes
  automatizados (Jest) escritos antes ou junto da implementação; componentes de UI SHOULD ter
  testes com React Native Testing Library.
- O JSON de conteúdo MUST ser validado por teste automatizado (campos obrigatórios, IDs únicos,
  categoria existente, tamanho máximo do texto).
- Gates obrigatórios antes de integrar na `main`: `tsc --noEmit`, ESLint sem erros, testes
  passando e validação de conteúdo passando.
- Mudanças em perguntas ou categorias MUST passar por revisão de conteúdo (originalidade,
  inclusão, segurança) antes do merge.
- Commits SHOULD seguir Conventional Commits (`feat:`, `fix:`, `content:`, `docs:` etc.).

## Governance

- Esta constituição prevalece sobre outras práticas e documentos do projeto. Em caso de
  conflito, a constituição vence até ser formalmente emendada.
- Emendas MUST ser feitas via `/speckit-constitution`, registradas em commit próprio e
  acompanhadas de justificativa; mudanças que afetem features em andamento MUST indicar o
  impacto nos specs e planos existentes.
- Versionamento semântico da constituição:
  - MAJOR: remoção ou redefinição incompatível de princípios, stack ou regras de governança.
  - MINOR: novo princípio ou seção, ou expansão material de orientação existente.
  - PATCH: esclarecimentos, redação e correções sem mudança de significado.
- Conformidade: cada `plan.md` MUST incluir o Constitution Check; revisões de código e de
  conteúdo MUST verificar aderência aos princípios. Qualquer violação MUST ser justificada na
  seção de complexidade do plano ou corrigida antes do merge.

**Version**: 2.1.0 | **Ratified**: 2026-10-31 | **Last Amended**: 2026-11-01
