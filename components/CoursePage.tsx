'use client';

import { useRef, useState } from 'react';
import type { Course } from '@/lib/courses';
import Image from 'next/image';
import { waLink } from '@/lib/config';
import { BarraBlackFriday, CardOferta, PrecoHero, SeloBlackFriday, useOfertaAtiva } from './BlackFriday';
import InscricaoForm from './InscricaoForm';
import Cabecalho from './Cabecalho';
import BarraMobile from './BarraMobile';
import {
  CredIcon,
  FacebookIcon,
  InstagramIcon,
  LearnIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from './icons';

const STRIPES = 'repeating-linear-gradient(-45deg,#FFB800 0 16px,#16181D 16px 32px)';

export default function CoursePage({ course }: { course: Course }) {
  const formRef = useRef<HTMLElement>(null);

  const [openFaq, setOpenFaq] = useState(-1);

  const waInfo = waLink(
    'Olá! Tenho interesse no ' + course.courseName + ' e gostaria de mais informações.',
  );

  function scrollToForm() {
    const el = formRef.current;
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 12,
        behavior: 'smooth',
      });
    }
  }

  // Black Friday: tema escuro + contagem enquanto a oferta estiver no prazo.
  const bf = course.blackFriday;
  const bfOn = useOfertaAtiva(bf) && bf ? bf : null;

  return (
    <div
      className="tema"
      data-bf={bfOn ? '' : undefined}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--fg)' }}
    >
      {/* FAIXA DE SEGURANÇA (ou barra da Black Friday) */}
      {bfOn ? <BarraBlackFriday bf={bfOn} onCta={scrollToForm} /> : <div style={{ height: 8, background: STRIPES }} />}

      {/* HEADER */}
      <Cabecalho
        links={[
          { id: 'o-curso', label: 'O curso' },
          { id: 'como-funciona', label: 'Como funciona' },
          { id: 'investimento', label: bfOn ? 'Oferta' : 'Investimento' },
          ...(course.galeria ? [{ id: 'fotos', label: 'Fotos' }] : []),
          { id: 'duvidas', label: 'Dúvidas' },
        ]}
        escuro={Boolean(bfOn)}
        ctaTexto={bfOn ? `Garantir por ${bfOn.precoPor}` : 'Quero me inscrever'}
        onCta={scrollToForm}
        waHref={waInfo}
      />

      {/* HERO */}
      <section
        className="hero"
        style={{
          background: bfOn
            ? 'radial-gradient(60% 70% at 85% 15%,rgba(255,184,0,.16),transparent 60%),radial-gradient(50% 60% at 0% 100%,rgba(27,75,155,.35),transparent 60%),#050505'
            : 'linear-gradient(135deg,#12141A 0%,#1C2230 60%,#1B4B9B 140%)',
          color: '#ffffff',
          padding: '56px 20px 64px',
        }}
      >
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 40,
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {bfOn ? (
              <div className="hero-selo">
                <SeloBlackFriday bf={bfOn} grande />
              </div>
            ) : (
            <span
              style={{
                alignSelf: 'flex-start',
                background: 'rgba(255,184,0,.15)',
                border: '1px solid #FFB800',
                color: '#FFB800',
                font: "700 13px 'Barlow',sans-serif",
                letterSpacing: 1,
                textTransform: 'uppercase',
                padding: '6px 12px',
                borderRadius: 6,
              }}
            >
              {course.hero.badge}
            </span>
            )}
            <h1
              style={{
                margin: 0,
                font: "800 clamp(34px,5.2vw,58px)/1.05 'Barlow Condensed',sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '.5px',
              }}
            >
              {course.hero.titlePre}
              <span style={{ color: '#FFB800', whiteSpace: 'nowrap' }}>{course.hero.titleHighlight}</span>
              {course.hero.titlePost}
            </h1>
            <p
              className="hero-texto"
              style={{
                margin: 0,
                fontSize: 18,
                lineHeight: 1.55,
                color: '#C9D2E0',
                maxWidth: 520,
              }}
            >
              {course.hero.paragraph}
            </p>

            {course.hero.chips && (
              <div className="hero-chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {course.hero.chips.map((chip) => (
                  <span
                    key={chip}
                    style={{
                      background: 'rgba(255,255,255,.08)',
                      border: '1px solid rgba(255,255,255,.2)',
                      borderRadius: 999,
                      padding: '6px 14px',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            )}

            {bfOn && <PrecoHero bf={bfOn} />}

            <div className="hero-ctas" style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 6 }}>
              <button
                onClick={scrollToForm}
                className="btn-yellow"
                style={{
                  background: '#FFB800',
                  color: '#16181D',
                  border: 'none',
                  borderRadius: 10,
                  padding: '16px 28px',
                  font: "700 17px 'Barlow',sans-serif",
                  cursor: 'pointer',
                  minHeight: 48,
                }}
              >
                {bfOn ? 'Garantir meu desconto' : 'Quero me inscrever'}
              </button>
              <a
                href={waInfo}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-green"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  background: '#25D366',
                  color: '#ffffff',
                  borderRadius: 10,
                  padding: '16px 24px',
                  font: "700 17px 'Barlow',sans-serif",
                  textDecoration: 'none',
                  minHeight: 48,
                  boxSizing: 'border-box',
                }}
              >
                <WhatsAppIcon size={20} />
                Falar no WhatsApp
              </a>
            </div>
          </div>

          <div className="hero-midia" style={{ justifySelf: 'center', width: '100%', maxWidth: 520 }}>
            {course.hero.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.hero.image.src}
                alt={course.hero.image.alt}
                className="hero-img"
                style={{
                  display: 'block',
                  width: '100%',
                  height: 380,
                  objectFit: 'cover',
                  borderRadius: 16,
                  boxShadow: bfOn
                    ? '0 0 0 2px rgba(255,184,0,.6), 0 20px 60px rgba(255,184,0,.12)'
                    : '0 20px 50px rgba(0,0,0,.4)',
                }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  width: '100%',
                  height: 380,
                  border: '2px dashed rgba(255,255,255,.25)',
                  borderRadius: 16,
                  color: 'rgba(255,255,255,.55)',
                  font: "600 15px 'Barlow',sans-serif",
                  padding: 20,
                }}
              >
                {course.hero.imagePlaceholder}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BARRA DE CREDIBILIDADE */}
      <section className="cred" style={{ background: '#FFB800', padding: '22px 20px' }}>
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: 18,
          }}
        >
          {course.credibility.map((item) => (
            <div
              key={item.text}
              className="cred-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                font: "700 16px 'Barlow',sans-serif",
                color: '#16181D',
              }}
            >
              <CredIcon name={item.icon} />
              {item.text}
            </div>
          ))}
        </div>
      </section>

      {/* O QUE VOCÊ VAI APRENDER */}
      <section id="o-curso" style={{ padding: '72px 20px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          {/* Título à esquerda, chamada à direita (empilha no celular). */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '12px 40px',
              marginBottom: 40,
            }}
          >
            <h2
              style={{
                margin: 0,
                font: "800 clamp(30px,3.8vw,42px)/1.1 'Barlow Condensed',sans-serif",
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  display: 'block',
                  font: "700 13px 'Barlow',sans-serif",
                  letterSpacing: '2.5px',
                  color: 'var(--kicker)',
                  marginBottom: 10,
                }}
              >
                Conteúdo do curso
              </span>
              O que você vai aprender
            </h2>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 17, lineHeight: 1.5, maxWidth: 420 }}>
              {course.learn.intro}
            </p>
          </div>

          <ol
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))',
              gap: 20,
            }}
          >
            {course.learn.cards.map((card, i) => (
              <li key={card.title} className="card-aprender">
                <span aria-hidden="true" className="card-aprender-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="card-aprender-icone">
                  <LearnIcon name={card.icon} />
                </span>
                <h3 style={{ margin: '6px 0 0', font: "700 21px/1.2 'Barlow',sans-serif" }}>{card.title}</h3>
                <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>{card.text}</p>
              </li>
            ))}
          </ol>

          <p style={{ margin: '28px 0 0', textAlign: 'center', color: 'var(--muted)' }}>
            Quer ver a grade completa?{' '}
            <a href={waInfo} target="_blank" rel="noopener noreferrer" className="link-grade">
              Peça pelo WhatsApp →
            </a>
          </p>
        </div>
      </section>

      {/* MERCADO DE TRABALHO */}
      <section className="secao-mercado" style={{ padding: '80px 20px', color: '#ffffff' }}>
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 48,
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2
              style={{
                margin: 0,
                font: "800 clamp(30px,3.8vw,42px)/1.1 'Barlow Condensed',sans-serif",
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  display: 'block',
                  font: "700 13px 'Barlow',sans-serif",
                  letterSpacing: '2.5px',
                  color: '#FFB800',
                  marginBottom: 10,
                }}
              >
                {course.market.kicker}
              </span>
              {course.market.titlePre}
              <span style={{ color: '#FFB800' }}>{course.market.titleHighlight}</span>
              {course.market.titlePost}
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,.75)', fontSize: 17, lineHeight: 1.6, maxWidth: 520 }}>
              {course.market.paragraph}
            </p>
            <div style={{ marginTop: 10 }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  font: "700 12px 'Barlow',sans-serif",
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,.6)',
                  marginBottom: 12,
                }}
              >
                <span style={{ color: '#FFB800', display: 'flex' }}>
                  <LearnIcon name="map-pin" />
                </span>
                Onde você pode trabalhar
              </span>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {course.market.sectors.map((s) => (
                  <li key={s} className="chip-setor">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {(() => {
            const [destaque, ...outros] = course.market.stats;
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="stat-destaque">
                  <span className="stat-icone">
                    <LearnIcon name={destaque.icon} />
                  </span>
                  <span
                    style={{
                      font: "800 clamp(38px,4.6vw,54px)/1 'Barlow Condensed',sans-serif",
                      color: '#FFB800',
                    }}
                  >
                    {destaque.value}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,.8)', fontSize: 16, lineHeight: 1.5 }}>{destaque.label}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                  {outros.map((stat) => (
                    <div key={stat.value} className="stat-card">
                      <span className="stat-icone stat-icone-sm">
                        <LearnIcon name={stat.icon} />
                      </span>
                      <span style={{ font: "800 26px/1.1 'Barlow Condensed',sans-serif", textTransform: 'uppercase' }}>
                        {stat.value}
                      </span>
                      <span style={{ color: 'rgba(255,255,255,.7)', fontSize: 14, lineHeight: 1.5 }}>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '72px 20px', background: 'var(--bg-alt)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <h2
            style={{
              margin: '0 0 36px',
              font: "800 clamp(30px,3.8vw,42px)/1.1 'Barlow Condensed',sans-serif",
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                display: 'block',
                font: "700 13px 'Barlow',sans-serif",
                letterSpacing: '2.5px',
                color: 'var(--kicker)',
                marginBottom: 10,
              }}
            >
              Na prática
            </span>
            Como funciona o curso
          </h2>
          <div
            className="steps-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
              gap: 20,
            }}
          >
            {course.steps.map((step) => (
              <div
                key={step.label}
                className="step-card"
                style={{
                  background: 'var(--card-alt)',
                  borderRadius: 14,
                  padding: 26,
                  borderTop: '4px solid #FFB800',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    font: "700 13px 'Barlow',sans-serif",
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: 'var(--kicker)',
                  }}
                >
                  {step.label}
                </span>
                <span className="step-valor" style={{ font: "800 30px 'Barlow Condensed',sans-serif" }}>{step.value}</span>
                <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INVESTIMENTO */}
      <section id="investimento" style={{ padding: '72px 20px', background: 'var(--bg)' }}>
        {bfOn ? (
          <CardOferta bf={bfOn} onCta={scrollToForm} />
        ) : (
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto',
            textAlign: 'center',
            background: 'var(--dark)',
            color: '#ffffff',
            borderRadius: 20,
            padding: '44px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: STRIPES }} />
          <h2
            style={{
              margin: '0 0 6px',
              font: "800 clamp(28px,3.4vw,38px)/1.1 'Barlow Condensed',sans-serif",
              textTransform: 'uppercase',
            }}
          >
            Investimento
          </h2>
          <p style={{ margin: '0 0 18px', color: '#C9D2E0' }}>{course.investimento.intro}</p>
          <div
            style={{
              font: "800 clamp(40px,6vw,56px)/1 'Barlow Condensed',sans-serif",
              color: '#FFB800',
              marginBottom: 8,
            }}
          >
            {course.investimento.preco}
          </div>
          <p style={{ margin: '0 0 24px', color: '#C9D2E0', fontSize: 15 }}>
            {course.investimento.precoDetalhe}
          </p>
          <button
            onClick={scrollToForm}
            className="btn-yellow"
            style={{
              background: '#FFB800',
              color: '#16181D',
              border: 'none',
              borderRadius: 10,
              padding: '16px 32px',
              font: "700 17px 'Barlow',sans-serif",
              cursor: 'pointer',
              minHeight: 48,
            }}
          >
            Garantir minha vaga
          </button>
        </div>
        )}
      </section>

      {/* GALERIA: fotos reais das turmas */}
      {course.galeria && (
        <section id="fotos" style={{ padding: '72px 20px', background: 'var(--dark)', color: '#ffffff' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto' }}>
            <h2
              style={{
                margin: '0 0 36px',
                font: "800 clamp(30px,3.8vw,42px)/1.1 'Barlow Condensed',sans-serif",
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  display: 'block',
                  font: "700 13px 'Barlow',sans-serif",
                  letterSpacing: '2.5px',
                  color: '#FFB800',
                  marginBottom: 10,
                }}
              >
                {course.galeria.kicker}
              </span>
              {course.galeria.titulo}
            </h2>
            {/* Linhas justificadas: cada foto cresce na proporção dela, sem cortar. */}
            <div className="galeria" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {course.galeria.fotos.map((foto) => (
                <div key={foto.src} className="galeria-item" style={{ flex: `${foto.w / foto.h} 1 ${(foto.w / foto.h) * 200}px` }}>
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    width={foto.w}
                    height={foto.h}
                    sizes="(max-width: 640px) 80vw, 50vw"
                    style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 12 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DEPOIMENTOS */}
      <section style={{ padding: '72px 20px', background: 'var(--bg-alt)' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <h2
            style={{
              margin: '0 0 36px',
              font: "800 clamp(30px,3.8vw,42px)/1.1 'Barlow Condensed',sans-serif",
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                display: 'block',
                font: "700 13px 'Barlow',sans-serif",
                letterSpacing: '2.5px',
                color: 'var(--kicker)',
                marginBottom: 10,
              }}
            >
              Alunos formados
            </span>
            Quem fez, recomenda
          </h2>
          <div
            className="carrossel-movel"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
              gap: 20,
            }}
          >
            {course.testimonials.map((t) => (
              <div
                key={t.name}
                className="depo-card"
                style={{
                  background: 'var(--card-alt)',
                  borderRadius: 14,
                  padding: 26,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{ font: "800 54px/0.4 'Barlow Condensed',sans-serif", color: '#FFB800' }}
                >
                  &ldquo;
                </div>
                <p style={{ margin: 0, color: 'var(--text-body)', fontSize: 16, lineHeight: 1.6 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: 52,
                      height: 52,
                      flex: 'none',
                      borderRadius: '50%',
                      background: 'var(--avatar-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--avatar-fg)',
                      font: "700 18px 'Barlow',sans-serif",
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: 15 }}>{t.name}</strong>
                    <span style={{ color: 'var(--muted)', fontSize: 13 }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="duvidas" style={{ padding: '72px 20px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2
            style={{
              margin: '0 0 36px',
              font: "800 clamp(30px,3.8vw,42px)/1.1 'Barlow Condensed',sans-serif",
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            Perguntas frequentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {course.faqs.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={faq.q} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    aria-expanded={open}
                    className="faq-q"
                    style={{
                      width: '100%',
                      background: 'var(--bg)',
                      border: 'none',
                      padding: '18px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                      font: "700 16px 'Barlow',sans-serif",
                      color: 'var(--fg)',
                      minHeight: 44,
                    }}
                  >
                    {faq.q}
                    <span style={{ color: 'var(--kicker)', font: "800 20px 'Barlow',sans-serif", flex: 'none' }}>
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  {open && (
                    <p style={{ margin: 0, padding: '0 20px 18px', color: 'var(--muted)', lineHeight: 1.6 }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section ref={formRef} id="inscricao" style={{ padding: '72px 20px', background: 'var(--form-bg)' }}>
        <InscricaoForm courseName={course.courseName} />
      </section>

      {/* RODAPÉ */}
      <footer className="rodape" style={{ background: 'var(--dark)', color: '#C9D2E0', padding: '56px 20px 90px' }}>
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
            gap: 36,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo-instituto-top.png"
              alt="Instituto Top"
              style={{
                height: 80,
                width: 80,
                objectFit: 'contain',
                background: '#ffffff',
                borderRadius: '50%',
                padding: 6,
                alignSelf: 'flex-start',
              }}
            />
            <p style={{ margin: 0, lineHeight: 1.6, fontSize: 15 }}>
              Instituto Top, Treinamentos e Qualificação.
              <br />
              Formando operadores certificados em Santa Cruz do Sul e região.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <h3
              style={{
                margin: '0 0 4px',
                font: "700 16px 'Barlow',sans-serif",
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Contato
            </h3>
            <a
              href="tel:+5551995622999"
              className="phone-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                color: '#C9D2E0',
                textDecoration: 'none',
                fontSize: 15,
              }}
            >
              <PhoneIcon />
              (51) 99562-2999
            </a>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
              <PinIcon />
              Rua Érico Veríssimo, 61 - Centro, Santa Cruz do Sul - RS, 96810-471
            </span>
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              <a
                href="https://www.instagram.com/topcursoscs/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.facebook.com/topcursosrs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-link"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                <FacebookIcon />
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3
              style={{
                margin: '0 0 4px',
                font: "700 16px 'Barlow',sans-serif",
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Fale agora
            </h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
              Tire suas dúvidas direto com nossa equipe.
            </p>
            <a
              href={waInfo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-green"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: '#25D366',
                color: '#ffffff',
                borderRadius: 10,
                padding: '14px 22px',
                font: "700 16px 'Barlow',sans-serif",
                textDecoration: 'none',
                alignSelf: 'flex-start',
              }}
            >
              <WhatsAppIcon size={18} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
        <p
          style={{
            maxWidth: 1140,
            margin: '40px auto 0',
            borderTop: '1px solid rgba(255,255,255,.1)',
            paddingTop: 20,
            fontSize: 13,
            color: '#7A8494',
          }}
        >
          © 2026 Instituto Top. Todos os direitos reservados.
        </p>
      </footer>

      {/* BARRA FIXA DO CELULAR (substitui o botão flutuante) */}
      <BarraMobile
        ctaTexto={bfOn ? `Garantir por ${bfOn.precoPor}` : 'Quero me inscrever'}
        onCta={scrollToForm}
        waHref={waInfo}
        alvoId="inscricao"
      />

      {/* BOTÃO FLUTUANTE WHATSAPP */}
      <a
        href={waInfo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="wa-float"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 100,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(0,0,0,.35)',
          textDecoration: 'none',
        }}
      >
        <WhatsAppIcon size={32} color="#ffffff" />
      </a>
    </div>
  );
}
