# Graph Report - v2  (2026-11-25)

## Corpus Check
- 24 files · ~14,918 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: .css 9, (none) 1, .bat 1)

## Summary
- 181 nodes · 256 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- compilerOptions
- package.json
- components.json
- page.tsx
- GlareHover.tsx
- preparar-marca.py
- Pesquisa da Clínica Revela
- Clínica Revela V2
- TeamGallery
- CardSwap.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `react` - 15 edges
3. `Home()` - 12 edges
4. `TreatmentDeck()` - 10 edges
5. `Icon()` - 9 edges
6. `TeamGallery()` - 9 edges
7. `tailwind` - 6 edges
8. `Clínica Revela V2` - 5 edges
9. `CardSwap` - 5 edges
10. `StepperProgress()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `StrokeText()`  [EXTRACTED]
  app/page.tsx → components/StrokeText.tsx
- `Home()` --calls--> `TeamGallery()`  [EXTRACTED]
  app/page.tsx → components/team-gallery.tsx
- `Home()` --calls--> `BlurText()`  [EXTRACTED]
  app/page.tsx → components/BlurText.tsx
- `Home()` --calls--> `ClinicFaq()`  [EXTRACTED]
  app/page.tsx → components/clinic-faq.tsx
- `Home()` --calls--> `HeroHandoff()`  [EXTRACTED]
  app/page.tsx → components/experience.tsx

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (34): metadata, nextConfig, dependencies, @fontsource-variable/manrope@^5.3.0, gsap@^3.15.1, @hugeicons/core-free-icons@^4.4.0, @hugeicons/react@^1.1.10, lenis@^1.3.28 (+26 more)

### Community 2 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, ui, utils, registries, @react-bits, rsc, $schema (+8 more)

### Community 4 - "page.tsx"
Cohesion: 0.13
Nodes (22): clinic, Home(), RevelaPortrait(), services, BlurText(), Card, ClinicFaq(), questions (+14 more)

### Community 5 - "GlareHover.tsx"
Cohesion: 0.24
Nodes (10): bump(), ease(), GlareHover(), GlareHoverProps, gradient(), Mode, PROFILES, smootherstep() (+2 more)

### Community 7 - "Pesquisa da Clínica Revela"
Cohesion: 0.40
Nodes (4): Fontes, Identidade e imagens, Pendências, Pesquisa da Clínica Revela

### Community 8 - "Clínica Revela V2"
Cohesion: 0.33
Nodes (5): Abrir no Windows, Arquivos principais, Build estático, Clínica Revela V2, Reprodução da validação

### Community 9 - "TeamGallery"
Cohesion: 0.16
Nodes (10): AccordionGallery(), AccordionGalleryItem, AccordionGalleryProps, DEFAULT_ITEMS, SpecularButton(), portraitFrame(), prefersMotion(), team (+2 more)

### Community 11 - "CardSwap.tsx"
Cohesion: 0.10
Nodes (23): AXES, Axis, Bounds, BoundsInput, CardProps, CardSwap, CardSwapHandle, CardSwapItem (+15 more)

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `page.tsx` to `package.json`, `CardSwap.tsx`, `GlareHover.tsx`, `TeamGallery`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `TreatmentDeck()` connect `page.tsx` to `CardSwap.tsx`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1265597147950089 - nodes in this community are weakly interconnected._
- **Should `CardSwap.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09782608695652174 - nodes in this community are weakly interconnected._