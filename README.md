# Clínica Revela V2

Landing page institucional em português brasileiro. Projeto independente da primeira versão, com Next.js App Router, React, TypeScript, CSS, Lenis, GSAP ScrollTrigger e adaptações de Card Swap, Accordion Gallery, Stroke Text, BlurText e Stepper do React Bits.

## Abrir no Windows

Dê dois cliques em `abrir-site.bat`. O atalho instala as dependências quando necessário, inicia o servidor e abre [http://localhost:3012](http://localhost:3012). Também é possível executar manualmente com Node.js 20.9 ou superior.

```sh
npm ci
npm run dev -- --port 3012
```

## Arquivos principais

- `app/page.tsx` contém os textos, serviços e links de contato.
- `app/globals.css` contém as cores, a tipografia e as regras responsivas.
- `components/experience.tsx` contém o menu, a transição do retrato entre seções e o carregamento das animações de rolagem restantes.
- `components/treatment-deck.tsx` conecta os seis cartões do Card Swap à rolagem, ao arraste e às barras selecionáveis do Stepper.
- `components/smooth-scrolling.tsx` controla a suavização da rodinha do mouse e dos saltos entre cartões. A rolagem por toque mantém o comportamento nativo.
- `public/media/` reúne imagens otimizadas e quatro versões da marca em SVG.
- `docs/pesquisa-cliente.md` guarda fontes, decisões de identidade e dados a confirmar.

## Build estático

Execute `npm run build` para gerar a pasta `out/`. Para usar no Cloudflare Pages, configure `npm run build` como comando e `out` como diretório de saída. Defina `NEXT_PUBLIC_SITE_URL` com a URL final do site durante o build para gerar a URL da imagem Open Graph.

A tipografia Manrope é servida localmente. Na abertura, o letreiro vetorial é desenhado ao longo de 1,5 segundo, seguido da entrada do texto por palavras em foco. Início e A clínica compartilham um quadro fixo durante a transição. Após a faixa de leitura, o texto perde foco e o retrato acompanha a rolagem em ambos os sentidos. O quadro solta depois do encaixe. Os tratamentos ficam fixos durante a leitura dos seis cartões. A troca anima para cima ou para baixo conforme o sentido da rolagem, e as barras do Stepper selecionam qualquer cartão diretamente. Com movimento reduzido, a abertura aparece de imediato, o retrato já ocupa seu bloco na clínica e os cartões podem ser selecionados pelos controles. O menu acompanha a seção ativa e vai para a base em telas de até 1100 px. Os retratos da equipe começam em preto e branco, recuperam a cor no hover ou foco e abrem os perfis em tela cheia.

## Reprodução da validação

Com o servidor ligado e `playwright-cli` disponível, execute a partir da raiz.

```sh
playwright-cli -s=revela-v2 open http://localhost:3012
playwright-cli -s=revela-v2 run-code --filename scripts/validar-navegador.js
playwright-cli -s=revela-v2 close
```

As capturas ficam em `docs/validacao/`. Para regenerar as versões da logo, instale a dependência opcional com `python -m pip install --target .tools opencv-python-headless` e execute `python scripts/preparar-marca.py`. O letreiro `public/media/revela-letreiro.svg` tem contornos desenhados manualmente.
