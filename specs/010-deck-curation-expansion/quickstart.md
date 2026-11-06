# Quickstart: validating 010

## Automated

```bash
npm run typecheck
npm run lint
npm test                                   # whole suite
npx jest src/data/__tests__/content.test.ts  # content rules C2
```

Expected: all green; content suite reports rules 9, 12, 13 and 14 passing.

Quick counts (Node):

```bash
node -e "const d=require('./src/data/data.json');const m={};for(const q of d.questions)m[q.categoryId]=(m[q.categoryId]||0)+1;console.log(m,d.questions.length)"
```

Expected: every category `30`, total `270`.

Favorites compatibility: every ID from before 010 still exists:

```bash
git show 12fc478:src/data/data.json > /tmp/old.json
node -e "const o=require('/tmp/old.json'),n=require('./src/data/data.json');const ids=new Set(n.questions.map(q=>q.id));console.log(o.questions.filter(q=>!ids.has(q.id)))"
```

Expected: `[]`.

## Manual content review (SC-002, SC-003, SC-004)

Using [content-review.md](./content-review.md):

1. No question can be answered honestly with only "sim" or "não".
2. Each category follows its tone in spec FR-008.
3. Each category has ≥ 6 topics, none with more than 5 cards.
4. Rewrites keep the theme of the original (compare "antes" column).
5. Inclusion (FR-010): no assumed gender, orientation, religion, marital status, money, family,
   health, ability or experiences (e.g. having travelled abroad).
6. Happy Hour answerable in front of colleagues; Primeiros Encontros keeps the 007 rules.

## In the app

1. `npm start`, open any category and play to the end: 30 distinct cards, then the completion
   message.
2. Mixed mode with all categories: counter/finish after 270 cards (or spot-check that cards
   from `-021…030` appear).
3. Favorite a card on the previous build, install the new build: the favorite is still listed.
