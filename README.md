# Digital Solutions - Loja

Site de venda de certificados digitais: **https://digitalsl.com.br**

React + Vite + TypeScript + Tailwind (componentes no estilo shadcn/ui), dados no Supabase
(projeto `ecosystem-digitalsl`, o mesmo banco do backend/painéis) e deploy na Vercel.

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha com as chaves públicas do Supabase
npm run dev            # http://localhost:8080
```

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | gera o catálogo estático (prebuild) e o build de produção em `dist/` |
| `npm run lint` | ESLint |
| `npm test` | testes (Vitest) |

## Estrutura

```
src/
  pages/        Index (home), Downloads, Admin, NotFound
  components/   seções da home, Header, Footer; ui/ = base shadcn (só o que é usado)
  hooks/        useProducts, useSettings, useDownloads (TanStack Query + Supabase)
  lib/          utilitários (whatsapp, icons, catálogo estático)
  integrations/supabase/   client e tipos do banco
scripts/        gerar-catalogo-estatico.mjs
```

## Catálogo estático (resiliência)

Antes de cada build, `scripts/gerar-catalogo-estatico.mjs` grava um retrato dos produtos e
configurações em `src/data/catalogo-estatico.json`. O site usa esse retrato como dado inicial
do React Query: a tela abre na hora e, se o banco responder, atualiza em segundo plano. Se o
banco estiver fora do ar (ou pausado), o site continua mostrando o último catálogo.
Se a busca falhar no build, o arquivo já existente é mantido.

## Downloads

A página `/downloads` lê a tabela `downloads` do Supabase (tutorial + botão do Emissor em
destaque e drivers). Para publicar um driver, preencha a `url` (link do Google Drive com
compartilhamento "qualquer pessoa com o link") e marque `active = true`.

## Convenções

- TypeScript em modo `strict`; `npm run lint` e `npx tsc --noEmit -p tsconfig.app.json` devem passar.
- `src/integrations/supabase/types.ts` é gerado a partir do banco; ao mudar o schema, regenere
  em vez de editar à mão.
