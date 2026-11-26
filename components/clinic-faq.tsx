'use client';

import { useState } from 'react';

const questions = [
  ['Como agendo uma avaliação?', <>Envie uma mensagem pelo <a href="https://ig.me/m/clinicarevela" target="_blank" rel="noreferrer">Instagram da Clínica Revela</a> para consultar a disponibilidade e combinar o atendimento.</>],
  ['O que acontece na primeira avaliação?', <>Você conversa com a profissional sobre o que deseja cuidar e tira dúvidas sobre a indicação, as possibilidades e os cuidados de cada procedimento.</>],
  ['Como posso saber o valor do atendimento?', <>Fale com a clínica para consultar o valor da avaliação. Para procedimentos, peça um orçamento conforme o atendimento indicado para o seu caso.</>],
  ['Posso agendar atendimento para cílios?', <>Sim. Ao <a href="https://ig.me/m/clinicarevela" target="_blank" rel="noreferrer">falar com a clínica</a>, informe que procura atendimento de cílios com a Maryanna e consulte as opções e os horários disponíveis.</>],
  ['Onde fica a Clínica Revela?', <>A clínica fica na Rua Papa João XXIII, 81, sala 02, em Vila Cachoeirinha, Cachoeirinha (RS). Veja o <a href="#contato">endereço e o link de rota</a> na seção de contato.</>],
] as const;

export function ClinicFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq band" id="faq" aria-labelledby="titulo-faq">
      <div className="shell faq-layout">
        <div>
          <p className="eyebrow"><span /> FAQ</p>
          <h2 id="titulo-faq">Perguntas frequentes.</h2>
        </div>
        <div className="faq-list">
          {questions.map(([question, answer], index) => (
            <article key={question} className="faq-item" data-open={open === index}>
              <h3>
                <button id={`faq-pergunta-${index}`} type="button" aria-controls={`faq-resposta-${index}`}
                  aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}>
                  {question}<span className="faq-plus" aria-hidden="true" />
                </button>
              </h3>
              <div className="faq-answer" id={`faq-resposta-${index}`} aria-labelledby={`faq-pergunta-${index}`} inert={open !== index}>
                <div><p>{answer}</p></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
