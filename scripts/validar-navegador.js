async (page) => {
  page.setDefaultTimeout(10000);
  const viewports = [
    [360, 800], [390, 844], [428, 926], [768, 1024],
    [1366, 768], [1920, 1080], [2560, 1440], [3840, 2160],
  ];
  const errors = [];
  const checked = [];
  const shortViewports = [[900, 560], [651, 740], [390, 600], [360, 500], [812, 375]];
  const valid = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of viewports) {
    await page.setViewportSize({ width, height });
    await page.goto('http://localhost:3012', { waitUntil: 'networkidle' });
    await page.locator('footer').scrollIntoViewIfNeeded();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, image => image.decode().catch(() => undefined)));
      window.scrollTo(0, 0);
    });
    await page.locator('.section-nav a[aria-current="location"][href="#inicio"]').waitFor();

    const layout = await page.evaluate(() => {
      const bounds = selector => document.querySelector(selector).getBoundingClientRect();
      const nav = bounds('.section-nav');
      const word = bounds('.hero-word');
      const scroll = bounds('.hero-scroll');
      const booking = bounds('.hero-copy .button');
      const heading = document.querySelector('[data-hero-line]');
      const intersects = (a, b) => a.right > b.left + 2 && a.left < b.right - 2 && a.bottom > b.top + 2 && a.top < b.bottom - 2;
      return {
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        broken: Array.from(document.images).filter(image => !image.complete || !image.naturalWidth).map(image => image.currentSrc),
        navVisible: nav.left >= 0 && nav.right <= innerWidth && nav.bottom <= innerHeight,
        heroOverlap: intersects(scroll, word) || intersects(scroll, booking),
        dockOverlap: innerWidth <= 1100 && word.bottom > nav.top + 1,
        titleClipped: heading.scrollWidth > heading.clientWidth + 1,
      };
    });
    valid(layout.document === layout.viewport, `Overflow em ${width} x ${height}`);
    valid(layout.broken.length === 0, `Imagens quebradas: ${layout.broken.join(', ')}`);
    valid(layout.navVisible, `Menu cortado em ${width} x ${height}`);
    valid(!layout.heroOverlap, `Rolagem e letreiro sobrepostos em ${width} x ${height}`);
    valid(!layout.dockOverlap, `Menu sobre o letreiro em ${width} x ${height}`);
    valid(!layout.titleClipped, `Título cortado em ${width} x ${height}`);
    await page.screenshot({ path: `docs/validacao/${width}x${height}.jpg`, type: 'jpeg', quality: 83, fullPage: width === 390 || width === 1920 });
    checked.push(`${width} x ${height}`);
  }
  for (const [width, height] of shortViewports) {
    await page.setViewportSize({ width, height });
    await page.goto('http://localhost:3012');
    await page.evaluate(() => document.fonts.ready);
    const fits = await page.evaluate(() => {
      const bounds = selector => document.querySelector(selector).getBoundingClientRect();
      const button = bounds('.hero-booking > .button');
      const prompt = bounds('.hero-scroll');
      const wordmark = bounds('.hero-word');
      const dock = bounds('.section-nav');
      const overlaps = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
      return [button, prompt, wordmark].every(box => box.top >= 0 && box.bottom <= innerHeight + 1) &&
        !overlaps(button, prompt) && !overlaps(button, wordmark) && !overlaps(prompt, wordmark) && !overlaps(prompt, dock) &&
        [...document.querySelectorAll('[data-hero-line]')].every(line => line.scrollWidth <= line.clientWidth + 1);
    });
    valid(fits, `O início cortou ou sobrepôs controles em ${width} x ${height}`);
  }

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto('http://localhost:3012');
  await page.keyboard.press('Tab');
  valid(await page.evaluate(() => document.activeElement.classList.contains('skip')), 'Link de salto fora da ordem do teclado');
  await page.keyboard.press('Enter');
  valid(await page.evaluate(() => document.activeElement.id === 'conteudo'), 'Link de salto sem foco no conteúdo');
  await page.getByRole('link', { name: 'Agendar avaliação' }).click();
  await page.locator('.section-nav a[aria-current="location"][href="#contato"]').waitFor();
  valid(page.url().endsWith('#contato'), 'CTA principal sem âncora');
  const links = {
    direct: await page.getByRole('link', { name: 'Mensagem no Instagram' }).getAttribute('href'),
    telephone: await page.getByRole('link', { name: /Telefone/ }).getAttribute('href'),
    directions: await page.getByRole('link', { name: /Como chegar/ }).getAttribute('href'),
  };
  valid(links.direct === 'https://ig.me/m/clinicarevela', 'Destino de mensagem incorreto');
  valid(links.telephone === 'tel:+5551981791882', 'Telefone incorreto');
  valid(links.directions.includes('Papa+Jo%C3%A3o+XXIII%2C+81'), 'Endereço de rota incorreto');
  await page.getByRole('navigation').getByRole('link', { name: 'Tratamentos' }).click();
  await page.locator('.section-nav a[aria-current="location"][href="#tratamentos"]').waitFor();
  valid(await page.locator('.deck-stage .service').count() === 6, 'A pilha deve ter seis tratamentos');
  valid(await page.locator('.stepper-progress .stepper-progress__step').count() === 6, 'Os tratamentos devem ter seis barras');
  valid(await page.getByRole('button', { name: /^(Anterior|Próximo)$/ }).count() === 0, 'Os botões antigos de navegação foram renderizados');
  valid(await page.locator('.deck-stage h3').filter({ hasText: 'Rinomodelação' }).count() === 1, 'Rinomodelação ausente');
  const step = number => page.getByRole('button', { name: new RegExp(`^Etapa ${number}:`) });
  const front = () => page.locator('.card-swap-slot[data-front] h3').textContent();
  await step(1).press('End');
  valid(await front() === 'Design de cílios', 'O teclado não selecionou a última barra');
  await page.getByRole('region', { name: 'Cartões de tratamentos' }).press('ArrowRight');
  await step(1).press('ArrowRight');
  valid(await front() === 'Botox' && await step(2).getAttribute('aria-current') === 'step', 'A barra ativa não acompanhou o teclado');
  await step(5).click();
  valid(await front() === 'Fio Filler', 'A seleção por barra não foi direto ao cartão indicado');
  await step(2).click();
  await page.getByRole('link', { name: /^Botox/ }).focus();
  await page.keyboard.press('Enter');
  await page.locator('.section-nav a[aria-current="location"][href="#contato"]').waitFor();
  const renata = page.getByRole('button', { name: 'Dra. Renata Martins', exact: true });
  await renata.click();
  await page.getByRole('dialog', { name: 'Dra. Renata Martins' }).waitFor();
  await page.keyboard.press('Escape');
  await page.locator('.team-dialog').waitFor({ state: 'hidden' });
  valid(await renata.evaluate(button => document.activeElement === button), 'Foco não restaurado após fechar o perfil');
  const maryanna = page.getByRole('button', { name: 'Maryanna Martins', exact: true });
  await maryanna.click();
  await page.getByRole('dialog', { name: 'Maryanna Martins' }).getByText('Lash Designer').waitFor();
  await page.getByRole('button', { name: 'Voltar para a equipe' }).click();
  await page.locator('.team-dialog').waitFor({ state: 'hidden' });
  const faq = page.locator('.faq-list button');
  await faq.nth(0).click();
  await faq.nth(1).click();
  valid(await faq.nth(0).getAttribute('aria-expanded') === 'false', 'FAQ anterior ficou aberto');
  valid(await faq.nth(1).getAttribute('aria-expanded') === 'true', 'FAQ selecionado ficou fechado');
  valid(await page.locator('.faq-item[data-open="true"]').count() === 1, 'Mais de uma resposta aberta');
  await page.getByRole('navigation').getByRole('link', { name: 'Início' }).click();
  await page.waitForFunction(() => scrollY === 0);
  valid(await page.locator('.portrait-flight').isHidden(), 'Foto em transição com movimento reduzido');
  valid(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior) === 'auto', 'Scroll animado em movimento reduzido');

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('http://localhost:3012', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.stroke-fill')).animationDuration === '1.5s');
  valid(await page.locator('.hero-copy').evaluate(element => getComputedStyle(element).animationDelay) === '1.5s', 'Texto sem atraso após o Stroke');
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.stroke-fill')).opacity === '1' &&
    getComputedStyle(document.querySelector('.hero-copy .blur-text__word > span')).filter === 'blur(0px)');
  valid(await page.evaluate(() => scrollY) === 0, 'Abertura automática alterou a rolagem');
  await page.locator('html.lenis').waitFor({ state: 'attached' });
  await page.evaluate(() => {
    const controller = new AbortController();
    window.wheelSamples = { values: [], controller };
    window.addEventListener('scroll', () => window.wheelSamples.values.push(scrollY), { passive: true, signal: controller.signal });
  });
  await page.mouse.move(60, 60);
  await page.mouse.wheel(0, 240);
  await page.waitForFunction(() => scrollY > 180 && !document.documentElement.classList.contains('lenis-smooth'));
  const downSamples = await page.evaluate(() => window.wheelSamples.values.splice(0));
  valid(downSamples.length >= 6 && downSamples.some(y => y > 10 && y < 150), 'Rodinha pulou posições sem suavização');
  await page.mouse.wheel(0, -240);
  await page.waitForFunction(() => scrollY < 2 && !document.documentElement.classList.contains('lenis-smooth'));
  const upSamples = await page.evaluate(() => {
    const { values, controller } = window.wheelSamples;
    controller.abort();
    delete window.wheelSamples;
    return values;
  });
  valid(upSamples.length >= 6 && upSamples.some(y => y > 20 && y < 160), 'Rolagem para cima sem desaceleração');

  const move = top => page.evaluate(value => window.scrollTo({ top: value, behavior: 'instant' }), top);
  const geometry = await page.evaluate(() => {
    const bridge = document.querySelector('.hero-bridge');
    return { runway: bridge.clientHeight - bridge.querySelector('.bridge-stage').clientHeight };
  });
  valid(geometry.runway > 400, 'Transição sem espaço de rolagem fixada');
  await move(geometry.runway * .18);
  await page.waitForTimeout(240);
  valid(await page.locator('.hero-foreground').evaluate(node => getComputedStyle(node).opacity) === '1', 'A abertura sumiu antes da faixa de leitura');
  await move(geometry.runway * .34);
  await page.waitForFunction(() => {
    const opacity = Number(getComputedStyle(document.querySelector('.hero-foreground')).opacity);
    return opacity > 0 && opacity < 1;
  });
  await page.waitForFunction(() => {
    const button = document.querySelector('.hero-booking');
    const word = document.querySelector('.hero-copy [data-hero-line] .blur-text__word');
    const style = getComputedStyle(word);
    return Number(getComputedStyle(button).opacity) < Number(style.opacity) &&
      style.filter !== 'none' && Number.parseFloat(style.filter.slice(5)) > .1 && style.clipPath === 'none';
  });
  await move(geometry.runway * .58);
  await page.locator('.portrait-flight[data-active]').waitFor();
  await page.waitForTimeout(340);
  valid(await page.evaluate(() => {
    const hero = document.querySelector('.hero-film');
    const about = document.querySelector('.about');
    const stage = document.querySelector('.bridge-stage');
    return [stage, hero, about].every(element => Math.abs(element.getBoundingClientRect().top) < 2) &&
      Number(getComputedStyle(hero).zIndex) > Number(getComputedStyle(about).zIndex);
  }), 'As duas seções deveriam permanecer fixas no mesmo lugar');
  valid(await page.locator('.about-photo picture').isHidden(), 'Foto final apareceu antes do encaixe');
  valid(await page.locator('.about-glass').isHidden(), 'Texto da clínica apareceu antes do encaixe');
  await page.screenshot({ path: 'docs/validacao/transicao-clinica.jpg', type: 'jpeg' });
  const photoTop = () => page.locator('.portrait-flight').evaluate(element => element.getBoundingClientRect().top);
  const earlier = await photoTop();
  await move(geometry.runway * .74);
  await page.waitForFunction(prior => document.querySelector('.portrait-flight').getBoundingClientRect().top > prior + 8, earlier);
  await page.waitForTimeout(340);
  const later = await photoTop();
  await move(geometry.runway * .58);
  await page.waitForFunction(prior => document.querySelector('.portrait-flight').getBoundingClientRect().top < prior - 8, later);
  await move(geometry.runway * .87);
  await page.locator('.about[data-landed] .about-photo picture').waitFor();
  await page.waitForFunction(() => {
    const glass = document.querySelector('.about-glass');
    return Number(getComputedStyle(glass).opacity) > 0 &&
      Number(getComputedStyle(glass.querySelector('h2')).opacity) < Number(getComputedStyle(glass).opacity);
  });
  await move(geometry.runway * .99);
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.about-glass > .text-link')).opacity === '1');
  valid(await page.locator('.portrait-flight').isHidden(), 'Camada de transição permaneceu depois do encaixe');
  await move(geometry.runway + 70);
  valid(await page.locator('.bridge-stage').evaluate(node => node.getBoundingClientRect().top) < -55, 'Página ficou presa após o encaixe');

  await page.locator('.treatments[data-pinned]').waitFor({ state: 'attached' });
  const pin = await page.evaluate(() => {
    const group = document.querySelector('.treatments');
    const stage = group.querySelector('.treatments-stage');
    return { start: group.getBoundingClientRect().top + scrollY, step: (group.clientHeight - stage.clientHeight) / 5 };
  });
  await move(pin.start + pin.step);
  await page.locator('.card-swap-slot[data-front] h3').filter({ hasText: 'Botox' }).waitFor();
  const directionOf = (index, direction) => page.waitForFunction(({ index, direction }) => {
    const slot = document.querySelector(`[data-swap-index="${index}"]`);
    const front = document.querySelector('.card-swap-slot[data-front]');
    const style = getComputedStyle(slot);
    const entering = getComputedStyle(front);
    return Number(style.opacity) > .15 && Number(style.opacity) < .99 &&
      Number(entering.opacity) > .01 && new DOMMatrixReadOnly(style.transform).m42 * direction > 2 &&
      new DOMMatrixReadOnly(entering.transform).m42 * direction < -2 &&
      [slot, front].every(element => Math.abs(element.clientHeight - element.querySelector('.card-swap-card').clientHeight) < 2);
  }, { index, direction }, { timeout: 2500 });
  await page.waitForTimeout(550);
  await move(pin.start + pin.step * 2);
  await directionOf(1, 1);
  await page.locator('.card-swap-slot[data-front] h3').filter({ hasText: 'Harmonização do olhar' }).waitFor();
  valid(Math.abs(await page.locator('.treatments-stage').evaluate(element => element.getBoundingClientRect().top)) < 2, 'Tratamentos saíram da posição fixa antes do último cartão');
  await page.waitForTimeout(550);
  await move(pin.start + pin.step);
  await directionOf(2, -1);
  await page.locator('.card-swap-slot[data-front] h3').filter({ hasText: 'Botox' }).waitFor();
  valid(await page.locator('.deck-stage').evaluate(node => getComputedStyle(node).overflowY) === 'visible', 'A pilha está recortando a parte inferior da troca');
  await step(6).click();
  await page.locator('.card-swap-slot[data-front] h3').filter({ hasText: 'Design de cílios' }).waitFor();
  await page.waitForFunction(top => Math.abs(scrollY - top) < 3 && !document.documentElement.classList.contains('lenis-smooth'), pin.start + pin.step * 5);
  await move(pin.start + pin.step * 5 + 65);
  valid(await page.locator('.treatments-stage').evaluate(element => element.getBoundingClientRect().top) < -50, 'Tratamentos não liberaram a rolagem após o último cartão');
  await step(1).click();
  await page.waitForFunction(top => Math.abs(scrollY - top) < 3 && !document.documentElement.classList.contains('lenis-smooth'), pin.start);
  const slide = page.locator('.card-swap-slot[data-front] .service');
  await slide.scrollIntoViewIfNeeded();
  const box = await slide.boundingBox();
  const x = box.x + box.width * .5;
  const y = box.y + box.height * .5;
  for (const [delta, title] of [[115, 'Botox'], [-115, 'Harmonização facial']]) {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + delta, y, { steps: 7 });
    await page.mouse.up();
    await slide.getByRole('heading', { name: title }).waitFor();
    valid(!page.url().endsWith('#contato'), 'Arrastar disparou o link do cartão');
    await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-smooth'));
  }
  await page.mouse.move(0, 0);
  await move(await page.locator('.team').evaluate(element => element.getBoundingClientRect().top + scrollY));
  const gallery = page.locator('.team .ag-panel');
  await gallery.first().scrollIntoViewIfNeeded();
  valid(await gallery.first().locator('img').evaluate(node => getComputedStyle(node).filter) === 'grayscale(1)', 'O retrato deve começar em preto e branco');
  await gallery.first().hover();
  await page.waitForFunction(node => getComputedStyle(node).filter === 'grayscale(0)', await gallery.first().locator('img').elementHandle(), { timeout: 4500 })
    .catch(() => { throw new Error('O retrato sob o cursor não recuperou a cor'); });
  valid(await gallery.last().locator('img').evaluate(node => getComputedStyle(node).filter) === 'grayscale(1)', 'A foto fora do hover perdeu o preto e branco');
  await gallery.first().click();
  await page.locator('.team-dialog[data-entering][data-portrait-in-flight]').waitFor({ state: 'attached' });
  await page.waitForFunction(() => {
    const dialog = document.querySelector('.team-dialog');
    return !dialog.hasAttribute('data-portrait-in-flight') &&
      getComputedStyle(dialog.querySelector('.team-detail-copy > .text-link')).opacity === '1';
  });
  await page.keyboard.press('Escape');
  await page.locator('.team-dialog').waitFor({ state: 'hidden' });
  valid(await gallery.first().evaluate(node => node === document.activeElement), 'A saída animada não devolveu o foco à foto');
  for (const link of await page.locator('.contact-panel .contact-link').all()) {
    await link.hover();
    const icon = link.locator('svg').first();
    await page.waitForFunction(node => getComputedStyle(node).transform !== 'none', await icon.elementHandle());
  }
  const touch = await page.context().browser().newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce',
  });
  try {
    const mobile = await touch.newPage();
    await mobile.goto('http://localhost:3012');
    await mobile.getByRole('navigation').getByRole('link', { name: 'Tratamentos' }).tap();
    await mobile.locator('.section-nav a[aria-current="location"][href="#tratamentos"]').waitFor();
    const mobileSlide = mobile.locator('.card-swap-slot[data-front] .service');
    await mobileSlide.scrollIntoViewIfNeeded();
    const bounds = await mobileSlide.boundingBox();
    const device = await touch.newCDPSession(mobile);
    const touchX = bounds.x + bounds.width * .35;
    const touchY = bounds.y + bounds.height * .4;
    await device.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchX, y: touchY }] });
    for (const delta of [20, 55, 100]) {
      await device.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touchX + delta, y: touchY }] });
    }
    await device.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await mobileSlide.getByRole('heading', { name: 'Botox' }).waitFor();
    const fits = await mobileSlide.evaluate(element => {
      const box = element.getBoundingClientRect();
      const slot = element.closest('.card-swap-slot');
      return Math.abs(element.clientHeight - slot.clientHeight) < 2 &&
        element.querySelector('p').getBoundingClientRect().bottom <= box.bottom - 4;
    });
    valid(fits, 'O texto do cartão está cortado no celular');
    await mobile.waitForTimeout(430);
    await mobileSlide.tap();
    await mobile.locator('.section-nav a[aria-current="location"][href="#contato"]').waitFor();
    valid(mobile.url().endsWith('#contato'), 'Card sem navegação por toque');
  } finally {
    await touch.close();
  }
  valid(errors.length === 0, errors.join('\n'));
  return { resolucoes: checked, telasCompactas: shortViewports.length, rolagemSuave: true, blurNaEntradaESaida: true, stepper: true, teclado: true, toque: true, arrastar: true, ctas: true, quadroFixo: true, encaixeDaFoto: true, movimentoBidirecional: true, cartoesSemCorte: true, fixacaoDosTratamentos: true, selecaoDireta: true, equipe: true, faq: true, contato: true, movimentoReduzido: true, erros: errors };
}
