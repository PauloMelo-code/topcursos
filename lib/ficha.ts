// Ficha de inscrição: máscaras, validação e a mensagem de WhatsApp no mesmo
// formato da ficha que a secretaria já usa. Funções puras (testadas em
// tests/ficha.test.mjs).

export interface Ficha {
  nome: string;
  nascimento: string; // yyyy-mm-dd (input type="date")
  cpf: string;
  celular: string;
  email: string;
  sexo: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  curso: string;
}

export type ErrosFicha = Partial<Record<keyof Ficha, string>>;

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

export function fichaVazia(curso: string): Ficha {
  return {
    nome: '', nascimento: '', cpf: '', celular: '', email: '', sexo: '', cep: '',
    endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', curso,
  };
}

const digitos = (v: string) => v.replace(/\D/g, '');

export function maskPhone(v: string): string {
  const d = digitos(v).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

export function maskCpf(v: string): string {
  const d = digitos(v).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

export function maskCep(v: string): string {
  const d = digitos(v).slice(0, 8);
  return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
}

/** Confere os dois dígitos verificadores do CPF. */
export function cpfValido(v: string): boolean {
  const d = digitos(v);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  for (const n of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(d[i]) * (n + 1 - i);
    const dv = ((soma * 10) % 11) % 10;
    if (dv !== Number(d[n])) return false;
  }
  return true;
}

/** Só nome e celular são obrigatórios; o resto é validado se vier preenchido. */
export function validarFicha(f: Ficha): ErrosFicha {
  const e: ErrosFicha = {};
  if (f.nome.trim().length < 3) e.nome = 'Informe seu nome completo.';
  if (digitos(f.celular).length < 10) e.celular = 'Informe um celular válido com DDD.';
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    e.email = 'Informe um e-mail válido.';
  if (f.cpf.trim() && !cpfValido(f.cpf)) e.cpf = 'CPF inválido. Confira os números.';
  if (f.cep.trim() && digitos(f.cep).length !== 8) e.cep = 'O CEP tem 8 números.';
  return e;
}

export function dataBR(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/** Mensagem para o WhatsApp, no mesmo molde da ficha da secretaria. */
export function mensagemFicha(f: Ficha): string {
  const linha = (rotulo: string, valor: string) => `*${rotulo}:* ${valor.trim()}`.trimEnd();
  return [
    'Olá! Quero me inscrever. Segue minha ficha:',
    '',
    linha('Nome Completo', f.nome),
    linha('Data de Nascimento', dataBR(f.nascimento)),
    linha('CPF', f.cpf),
    linha('Telefone Celular', f.celular),
    linha('E-mail', f.email),
    linha('Sexo', f.sexo),
    linha('CEP', f.cep),
    linha('Endereço', f.endereco),
    linha('Número', f.numero),
    linha('Complemento', f.complemento),
    linha('Bairro', f.bairro),
    linha('Cidade', f.cidade),
    linha('Estado', f.estado),
    '==========================',
    linha('Nome do Curso', f.curso),
  ].join('\n');
}
