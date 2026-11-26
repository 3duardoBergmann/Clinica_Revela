import StrokeText from '@/components/StrokeText';
import BlurText from '@/components/BlurText';
import TeamGallery from '@/components/team-gallery';
import { ClinicFaq } from '@/components/clinic-faq';
import TreatmentDeck from '@/components/treatment-deck';
import { SmoothScrolling } from '@/components/smooth-scrolling';
import { HeroHandoff, Motion, SectionNavigation } from '@/components/experience';
import { Icon } from '@/components/icons';

const clinic = {
  instagram: 'https://www.instagram.com/clinicarevela/',
  messages: 'https://ig.me/m/clinicarevela',
  phone: '(51) 98179-1882',
  tel: 'tel:+5551981791882',
  street: 'Rua Papa João XXIII, 81 · Sala 02',
  city: 'Vila Cachoeirinha, Cachoeirinha · RS',
  directions: 'https://www.google.com/maps/dir/?api=1&destination=Rua+Papa+Jo%C3%A3o+XXIII%2C+81%2C+Cachoeirinha%2C+RS',
};

const services = [
  {
    title: 'Harmonização facial',
    text: 'Na avaliação, a conversa parte dos seus traços, das suas expectativas e das possibilidades para o seu rosto.',
    icon: 'face',
    tone: 'rose',
  },
  {
    title: 'Botox',
    text: 'Converse sobre o uso de toxina botulínica para linhas de expressão e sobre a indicação para o seu caso.',
    icon: 'spark',
    tone: 'apricot',
  },
  {
    title: 'Harmonização do olhar',
    text: 'Uma avaliação direcionada à região dos olhos, considerando suas proporções e a expressão do rosto.',
    icon: 'eye',
    tone: 'sage',
  },
  {
    title: 'Rinomodelação',
    text: 'Uma avaliação estética do nariz em relação aos demais traços do rosto, com orientação sobre o que faz sentido para o seu caso.',
    icon: 'face',
    tone: 'sand',
  },
  {
    title: 'Fio Filler',
    text: 'Converse com a equipe sobre a proposta do procedimento, quando ele pode ser indicado e quais cuidados requer.',
    icon: 'spark',
    tone: 'blush',
  },
  {
    title: 'Design de cílios',
    text: 'Converse com a Lash Designer Maryanna Martins sobre o estilo de que você gosta, a extensão de cílios e os cuidados do atendimento.',
    icon: 'eye',
    tone: 'cream',
  },
] as const;

function RevelaPortrait({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <picture className={className}>
      <source media="(max-width: 650px)" srcSet="/media/abertura-mobile.webp" />
      <img src="/media/abertura.webp" alt="" width="1536" height="1024" fetchPriority={priority ? 'high' : undefined} />
    </picture>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <main id="conteudo" tabIndex={-1}>
        <div className="hero-bridge" id="inicio">
        <div className="bridge-stage">
        <section className="hero-film" aria-labelledby="titulo">
          <div className="hero">
            <RevelaPortrait className="hero-photo" priority />
            <div className="hero-vignette" aria-hidden="true" />
            <div className="hero-foreground">
              <div className="shell hero-inner">
                <a className="hero-brand hero-stage-detail" href="#inicio" aria-label="Clínica Revela, início">
                  <img src="/media/revela.svg" width="185" height="69" alt="Clínica Revela by Dra. Renata Martins" />
                </a>
                <div className="hero-copy hero-stage-detail">
                  <p className="eyebrow"><span /> <BlurText text="Estética facial em Cachoeirinha" /></p>
                  <h1 id="titulo">
                    <BlurText titleLine text="A beleza de" order={2} />
                    {' '}
                    <BlurText titleLine text="ser você." order={5} />
                  </h1>
                  <p className="hero-description"><BlurText text="Harmonização facial com atenção aos seus traços e à naturalidade da sua expressão." order={7} /></p>
                  <div className="hero-booking">
                    <a className="button button-light" href="#contato">Agendar avaliação <Icon name="diagonal" /></a>
                  </div>
                </div>
              </div>
              <a className="hero-scroll hero-stage-detail" href="#clinica"><Icon name="down" /> Conheça a Revela</a>
              <StrokeText />
            </div>
          </div>
        </section>

        <section className="about band" aria-labelledby="titulo-clinica">
          <div className="shell about-layout">
            <div className="about-copy about-glass">
              <p className="eyebrow"><span /> A clínica</p>
              <h2 id="titulo-clinica">Naturalidade<br />em cada traço.</h2>
              <p className="body-copy">A Clínica Revela é um espaço de estética facial em Cachoeirinha, no Rio Grande do Sul. A proposta da Dra. Renata Martins é valorizar o que já faz parte da sua expressão.</p>
              <p className="body-copy">Na avaliação, você pode falar sobre o que deseja cuidar e conversar sobre as possibilidades para o seu rosto.</p>
              <a className="text-link" href="#tratamentos">Conheça os tratamentos <Icon name="diagonal" /></a>
            </div>
            <figure className="about-photo">
              <RevelaPortrait />
            </figure>
          </div>
        </section>
        <div className="portrait-flight" aria-hidden="true"><RevelaPortrait /></div>
        </div>
        <div className="clinic-anchor" id="clinica" tabIndex={-1} />
        </div>

        <section className="treatments" id="tratamentos" aria-labelledby="titulo-tratamentos">
          <div className="treatments-stage">
          <div className="shell treatments-layout">
            <div className="section-intro" data-reveal>
              <div>
                <p className="eyebrow"><span /> Tratamentos</p>
                <h2 id="titulo-tratamentos">Cuidado facial<br />na Revela.</h2>
              </div>
              <p className="body-copy">A indicação de um procedimento começa na avaliação, onde você pode tirar dúvidas e alinhar suas expectativas.</p>
            </div>
            <TreatmentDeck services={services} />
          </div>
          </div>
        </section>

        <section className="team band" id="equipe" aria-labelledby="titulo-equipe">
          <div className="shell">
            <h2 id="titulo-equipe" data-reveal>Equipe</h2>
            <TeamGallery />
          </div>
        </section>

        <ClinicFaq />

        <section className="contact band" id="contato" aria-labelledby="titulo-contato">
          <div className="shell contact-layout">
            <div data-reveal>
              <p className="eyebrow"><span /> Contato</p>
              <h2 id="titulo-contato">Vamos<br />conversar?</h2>
              <p className="body-copy">Envie uma mensagem à Clínica Revela para agendar sua avaliação ou tirar dúvidas sobre o atendimento.</p>
              <a className="button button-dark" href={clinic.messages} target="_blank" rel="noreferrer">Mensagem no Instagram <Icon name="diagonal" /></a>
            </div>
            <div className="contact-panel" data-reveal>
              <a className="contact-link" href={clinic.directions} target="_blank" rel="noreferrer">
                <Icon name="pin" />
                <span><strong>Como chegar</strong><span>{clinic.street}<br />{clinic.city}</span></span>
                <Icon name="diagonal" />
              </a>
              <a className="contact-link" href={clinic.tel}>
                <Icon name="phone" />
                <span><strong>Telefone</strong><span>{clinic.phone}</span></span>
                <Icon name="diagonal" />
              </a>
              <a className="contact-link" href={clinic.instagram} target="_blank" rel="noreferrer">
                <Icon name="instagram" />
                <span><strong>Instagram</strong><span>@clinicarevela</span></span>
                <Icon name="diagonal" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-layout">
          <img src="/media/revela.svg" width="160" height="60" alt="Clínica Revela by Dra. Renata Martins" loading="lazy" />
          <p>© {new Date().getFullYear()} Clínica Revela</p>
          <a href="#inicio">Voltar ao início <Icon name="up" /></a>
        </div>
      </footer>
      <SectionNavigation />
      <HeroHandoff />
      <SmoothScrolling />
      <Motion />
    </>
  );
}
