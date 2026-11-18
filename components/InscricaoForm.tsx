'use client';

import { cloneElement, useRef, useState } from 'react';
import { NOMES_DOS_CURSOS } from '@/lib/courses';
import { WEBHOOK_URL, waLink } from '@/lib/config';
import {
  type ErrosFicha,
  type Ficha,
  UFS,
  fichaVazia,
  maskCep,
  maskCpf,
  maskPhone,
  mensagemFicha,
  validarFicha,
} from '@/lib/ficha';
import { WhatsAppIcon } from './icons';

const errStyle: React.CSSProperties = { color: '#D3382E', fontSize: 13, fontWeight: 600, minHeight: 18 };
const legendStyle: React.CSSProperties = {
  font: "700 13px 'Barlow',sans-serif",
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  color: '#1B4B9B',
  padding: 0,
  marginBottom: 10,
};
const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
  gap: '4px 14px',
};

export default function InscricaoForm({ courseName }: { courseName: string }) {
  const [f, setF] = useState<Ficha>(() => fichaVazia(courseName));
  const [erros, setErros] = useState<ErrosFicha>({});
  const [cepStatus, setCepStatus] = useState('');
  const [sent, setSent] = useState(false);
  const ultimoCep = useRef('');

  const set = (campo: keyof Ficha, valor: string) => {
    setF((atual) => ({ ...atual, [campo]: valor }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  async function buscarCep(cep: string) {
    const d = cep.replace(/\D/g, '');
    if (d.length !== 8 || d === ultimoCep.current) return;
    ultimoCep.current = d;
    setCepStatus('Buscando endereço…');
    try {
      const r = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const j = await r.json();
      if (ultimoCep.current !== d) return;
      if (j.erro) {
        setCepStatus('CEP não encontrado. Preencha o endereço abaixo.');
        return;
      }
      setF((atual) => ({
        ...atual,
        endereco: j.logradouro || atual.endereco,
        bairro: j.bairro || atual.bairro,
        cidade: j.localidade || atual.cidade,
        estado: j.uf || atual.estado,
      }));
      setCepStatus('Endereço preenchido. Confira e complete o número.');
    } catch {
      setCepStatus('');
    }
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validarFicha(f);
    setErros(e);
    const primeiro = Object.keys(e)[0];
    if (primeiro) {
      document.getElementById('f-' + primeiro)?.focus();
      return;
    }

    if (WEBHOOK_URL) {
      // Sem await: o WhatsApp precisa abrir no mesmo clique (Safari bloqueia popup depois de await).
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...f,
          whatsapp: f.celular,
          origem: location.href,
          data: new Date().toISOString(),
        }),
        keepalive: true,
      }).catch(() => {
        /* falha do webhook não bloqueia o lead */
      });
    }

    window.open(waLink(mensagemFicha(f)), '_blank');
    setSent(true);
  }

  function campo(
    id: keyof Ficha,
    label: string,
    input: React.ReactElement<Record<string, unknown>>,
    opts: { obrigatorio?: boolean; cheio?: boolean; ajuda?: string } = {},
  ) {
    const erro = erros[id];
    const descId = erro || opts.ajuda ? `f-${id}-desc` : undefined;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: opts.cheio ? '1 / -1' : undefined }}>
        <label htmlFor={`f-${id}`} style={{ fontWeight: 600, fontSize: 14 }}>
          {label}
          {opts.obrigatorio && <span style={{ color: '#D3382E' }}> *</span>}
        </label>
        {cloneElement(input, {
          id: `f-${id}`,
          name: id,
          className: 'input-field',
          'aria-invalid': erro ? true : undefined,
          'aria-describedby': descId,
        })}
        <span id={descId} style={erro ? errStyle : { ...errStyle, color: '#5B6472', fontWeight: 500 }}>
          {erro || opts.ajuda || ''}
        </span>
      </div>
    );
  }

  const txt = (id: keyof Ficha, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input type="text" value={f[id]} onChange={(e) => set(id, e.target.value)} {...extra} />
  );

  return (
    <div
      className="ficha-card"
      style={{
        maxWidth: 680,
        margin: '0 auto',
        background: '#ffffff',
        color: '#16181D',
        borderRadius: 20,
        padding: '36px 24px',
        boxShadow: '0 20px 60px rgba(0,0,0,.3)',
      }}
    >
      <h2
        style={{
          font: "800 clamp(28px,3.4vw,36px)/1.1 'Barlow Condensed',sans-serif",
          textTransform: 'uppercase',
          textAlign: 'center',
          margin: '0 0 6px',
        }}
      >
        Ficha de inscrição
      </h2>
      <p style={{ margin: '0 0 6px', color: '#5B6472', lineHeight: 1.5, textAlign: 'center' }}>
        Só nome e celular são obrigatórios. O resto já adianta sua matrícula.
      </p>
      <p style={{ margin: '0 0 24px', color: '#5B6472', lineHeight: 1.5, textAlign: 'center' }}>
        Prefere fazer pelo WhatsApp?{' '}
        <a
          href={waLink('Olá! Quero me inscrever no ' + courseName + '. Pode me mandar a ficha?')}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#1E8A4C', fontWeight: 700 }}
        >
          Chame a gente
        </a>{' '}
        que mandamos a ficha por lá.
      </p>

      <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend style={legendStyle}>Seus dados</legend>
          <div style={gridStyle}>
            {campo('nome', 'Nome completo', txt('nome', { autoComplete: 'name', placeholder: 'Seu nome' }), { obrigatorio: true, cheio: true })}
            {campo(
              'celular',
              'Telefone celular (WhatsApp)',
              <input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(51) 99999-9999" value={f.celular} onChange={(e) => set('celular', maskPhone(e.target.value))} />,
              { obrigatorio: true },
            )}
            {campo('nascimento', 'Data de nascimento', <input type="date" autoComplete="bday" value={f.nascimento} onChange={(e) => set('nascimento', e.target.value)} />)}
            {campo('cpf', 'CPF', <input type="text" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" value={f.cpf} onChange={(e) => set('cpf', maskCpf(e.target.value))} />)}
            {campo(
              'sexo',
              'Sexo',
              <select value={f.sexo} onChange={(e) => set('sexo', e.target.value)}>
                <option value="">Selecione</option>
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Prefiro não informar</option>
              </select>,
            )}
            {campo('email', 'E-mail', <input type="email" autoComplete="email" placeholder="voce@email.com" value={f.email} onChange={(e) => set('email', e.target.value)} />, { cheio: true })}
          </div>
        </fieldset>

        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend style={legendStyle}>Endereço</legend>
          <div style={gridStyle}>
            {campo(
              'cep',
              'CEP',
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="00000-000"
                value={f.cep}
                onChange={(e) => {
                  const v = maskCep(e.target.value);
                  set('cep', v);
                  buscarCep(v);
                }}
              />,
              { ajuda: cepStatus },
            )}
            {campo(
              'estado',
              'Estado',
              <select autoComplete="address-level1" value={f.estado} onChange={(e) => set('estado', e.target.value)}>
                <option value="">Selecione</option>
                {UFS.map((uf) => (
                  <option key={uf}>{uf}</option>
                ))}
              </select>,
            )}
            {campo('endereco', 'Endereço', txt('endereco', { autoComplete: 'address-line1', placeholder: 'Rua, avenida…' }), { cheio: true })}
            {campo('numero', 'Número', txt('numero', { inputMode: 'numeric' }))}
            {campo('complemento', 'Complemento', txt('complemento', { autoComplete: 'address-line2', placeholder: 'Apto, bloco… (opcional)' }))}
            {campo('bairro', 'Bairro', txt('bairro', { autoComplete: 'address-level3' }))}
            {campo('cidade', 'Cidade', txt('cidade', { autoComplete: 'address-level2' }))}
          </div>
        </fieldset>

        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend style={legendStyle}>Curso</legend>
          {campo(
            'curso',
            'Nome do curso',
            <select value={f.curso} onChange={(e) => set('curso', e.target.value)}>
              {NOMES_DOS_CURSOS.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>,
          )}
        </fieldset>

        <button
          type="submit"
          className="btn-yellow"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            background: '#FFB800',
            color: '#16181D',
            border: 'none',
            borderRadius: 10,
            padding: 17,
            font: "700 18px 'Barlow',sans-serif",
            cursor: 'pointer',
            minHeight: 52,
          }}
        >
          <WhatsAppIcon size={20} />
          Enviar ficha pelo WhatsApp
        </button>
        {sent && (
          <p role="status" style={{ margin: 0, textAlign: 'center', color: '#1E8A4C', background: '#E8F6EE', borderRadius: 10, padding: 12, fontWeight: 600 }}>
            Ficha pronta! Agora é só enviar a mensagem que abriu no WhatsApp.
          </p>
        )}
        <p style={{ margin: 0, textAlign: 'center', color: '#5B6472', fontSize: 13 }}>
          Seus dados estão seguros e serão usados apenas para a sua inscrição.
        </p>
      </form>
    </div>
  );
}
