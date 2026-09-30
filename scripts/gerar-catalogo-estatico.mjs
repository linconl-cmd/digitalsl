// Roda antes de cada build (hook "prebuild" do npm). Busca produtos ativos e
// configurações do site na Supabase e grava um retrato em src/data/, que é
// importado direto no JS (bundle) e usado como dado inicial do React Query —
// a tela pinta instantânea com esse retrato e, se o banco responder, é
// atualizada em segundo plano; se não responder, o retrato continua valendo.
//
// Se a busca falhar (banco pausado, indisponibilidade, etc.), o build NÃO
// falha: o arquivo já commitado em src/data/ é mantido como está.
import { createClient } from '@supabase/supabase-js'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const destino = join(__dirname, '..', 'src', 'data', 'catalogo-estatico.json')

function carregarEnvLocal() {
  const caminho = join(__dirname, '..', '.env')
  if (!existsSync(caminho)) return
  for (const linha of readFileSync(caminho, 'utf8').split(/\r?\n/)) {
    const m = linha.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}
carregarEnvLocal()

const url = process.env.VITE_SUPABASE_URL
const chave = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !chave) {
  console.warn('[catalogo-estatico] VITE_SUPABASE_URL/PUBLISHABLE_KEY ausentes — build segue com o snapshot já existente.')
  process.exit(0)
}

try {
  const supabase = createClient(url, chave)

  const [{ data: products, error: erroProdutos }, { data: settingsRows, error: erroSettings }] = await Promise.all([
    supabase.from('products').select('*').eq('active', true).order('sort_order').order('created_at'),
    supabase.from('site_settings').select('key, value'),
  ])

  if (erroProdutos) throw erroProdutos
  if (erroSettings) throw erroSettings

  const settings = Object.fromEntries((settingsRows ?? []).map((s) => [s.key, s.value]))

  writeFileSync(destino, JSON.stringify({
    geradoEm: new Date().toISOString(),
    products: products ?? [],
    settings,
  }, null, 2))

  console.log(`[catalogo-estatico] snapshot atualizado: ${products?.length ?? 0} produtos, ${Object.keys(settings).length} configurações.`)
} catch (erro) {
  console.warn('[catalogo-estatico] banco indisponível no momento do build — mantendo snapshot anterior. Detalhe:', erro instanceof Error ? erro.message : erro)
}
