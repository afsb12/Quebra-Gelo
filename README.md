# Quebra-Gelo
Jogo de cartas focado em quebrar-gelo, criar conexões, batendo um papo e refletindo um pouco sobre a vida.

## Desenvolvimento

```bash
npm install        # instala dependências e ativa o hook de pre-commit (Husky)
npm start          # servidor Expo
npm test           # testes (unidade, componentes, telas e validação do conteúdo)
```

Todo commit passa por um hook que roda, nesta ordem: lint nos arquivos preparados (lint-staged),
`npm run typecheck` e `npm test -- --ci`. Se algo falhar, o commit é recusado. Todo PR (e todo push
para a `main`) roda os mesmos gates no GitHub Actions (`.github/workflows/ci.yml`).
