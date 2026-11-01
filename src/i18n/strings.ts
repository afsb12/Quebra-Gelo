/** Centralized pt-BR UI strings (constitution: UI text centralized for future translation). */
export const strings = {
  appName: 'Quebra-Gelo',
  home: {
    title: 'Quebra-Gelo',
    subtitle: 'Escolha um baralho para começar a conversa',
    favorites: 'Favoritos',
    openFavoritesHint: 'Abre a lista de perguntas favoritas',
  },
  mixed: {
    title: 'Tudo Misturado',
    description: 'Todas as categorias num só baralho.',
    heroLabel: 'Tudo Misturado. Todas as categorias num só baralho.',
  },
  deck: {
    backHint: 'Volta para a escolha de baralho',
    position: (index: number, total: number) => `Carta ${index} de ${total}`,
    tapHint: 'Toque para virar · deslize para pular',
  },
  card: {
    faceDownLabel: (category: string) => `Carta de ${category}, virada para baixo`,
    faceDownMixedLabel: 'Carta do Quebra-Gelo, virada para baixo',
    faceUpMixedLabel: (category: string, question: string) => `${category}: ${question}`,
    actions: {
      flip: 'virar',
      favorite: 'favoritar',
      skip: 'pular',
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
