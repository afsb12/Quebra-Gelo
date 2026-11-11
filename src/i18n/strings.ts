/** Centralized pt-BR UI strings (constitution: UI text centralized for future translation). */
export const strings = {
  appName: 'Quebra-Gelo',
  home: {
    title: 'Quebra-Gelo',
    question: 'Sobre o que vamos conversar?',
    decksLabel: 'Ou escolha um baralho',
    favorites: 'Favoritos',
    openFavoritesHint: 'Abre a lista de perguntas favoritas',
  },
  tutorial: {
    title: 'Como jogar',
    skip: 'Pular',
    skipLabel: 'Pular tutorial',
    hintNext: 'Deslize para a esquerda para passar a carta',
    hintBack: 'Deslize para a direita para voltar à carta anterior',
    hintFlip: 'Toque na carta para revelar a pergunta',
    hintDeck: 'Toque em um baralho para começar',
  },
  mixFilter: {
    title: 'Categorias da mistura',
    open: 'Escolher categorias da mistura',
    save: 'Salvar',
    minimum: 'Escolha pelo menos 2 categorias',
    /** Text of the filter chip on the mix card (015): always shows how many categories are in. */
    chip: (active: number, total: number) => (active < total ? `${active} de ${total} categorias` : `${total} categorias`),
  },
  mixed: {
    title: 'Tudo Misturado',
    play: 'Jogar',
    description: 'Todas as categorias num só baralho.',
    heroLabel: 'Tudo Misturado. Todas as categorias num só baralho.',
  },
  deck: {
    backHint: 'Volta para a escolha de baralho',
    position: (index: number, total: number) => `Carta ${index} de ${total}`,
    tapHint: 'Toque para virar · ← próxima · anterior →',
    /** Short visual counter in the header (016); `position` stays its accessibility label. */
    counter: (index: number, total: number) => `${index} / ${total}`,
    /** Reminder under the action bar on the first cards of a game (016). */
    swipeHint: 'Dica: você também pode deslizar a carta',
    previous: 'Anterior',
    next: 'Próxima',
    previousLabel: 'Carta anterior',
    nextLabel: 'Próxima carta',
    progressLabel: 'Progresso do baralho',
    changeMoodLabel: 'Mudar o clima: próxima carta de outra categoria',
    moodChanged: 'Clima trocado',
  },
  card: {
    faceDownLabel: (category: string) => `Carta de ${category}, virada para baixo`,
    faceDownMixedLabel: 'Carta do Quebra-Gelo, virada para baixo',
    faceUpMixedLabel: (category: string, question: string) => `${category}: ${question}`,
    actions: {
      flip: 'virar',
      favorite: 'favoritar',
      next: 'próxima',
      previous: 'voltar',
    },
    favoritedIndicator: 'Pergunta favoritada',
  },
  favoriteButton: {
    add: 'Favoritar',
    remove: 'Remover dos favoritos',
  },
  deckComplete: {
    title: 'Fim do Baralho',
    message: (category: string) => `Vocês viram todas as perguntas de ${category}.`,
    reshuffle: 'Embaralhar de novo',
    chooseAnother: 'Escolher outra categoria',
  },
  favorites: {
    title: 'Favoritos',
    emptyTitle: 'Nenhuma pergunta favorita ainda',
    emptyMessage: 'Durante o jogo, vire uma carta e toque na estrela abaixo dela para guardar a pergunta aqui.',
    remove: 'Remover',
    removeLabel: (question: string) => `Remover dos favoritos: ${question}`,
  },
} as const;
