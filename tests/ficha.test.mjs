// node tests/ficha.test.mjs  (Node 23.6+ lê .ts direto)
import assert from 'node:assert/strict';
import { cpfValido, maskCpf, maskCep, maskPhone, validarFicha, fichaVazia, mensagemFicha, dataBR } from '../lib/ficha.ts';
import { faseOferta, partesTempo } from '../lib/oferta.ts';

// CPF
assert.equal(cpfValido('529.982.247-25'), true);
assert.equal(cpfValido('52998224724'), false);
assert.equal(cpfValido('111.111.111-11'), false);
assert.equal(cpfValido('123'), false);

// Máscaras
assert.equal(maskCpf('52998224725'), '529.982.247-25');
assert.equal(maskCep('96810471'), '96810-471');
assert.equal(maskPhone('51995622999'), '(51) 99562-2999');
assert.equal(dataBR('1990-03-07'), '07/03/1990');

// Validação: só nome e celular obrigatórios
const f = fichaVazia('Curso X');
assert.deepEqual(Object.keys(validarFicha(f)).sort(), ['celular', 'nome']);
const ok = { ...f, nome: 'Fulano de Tal', celular: '(51) 99999-9999' };
assert.deepEqual(validarFicha(ok), {});
assert.ok(validarFicha({ ...ok, cpf: '123.456.789-00' }).cpf);
assert.ok(validarFicha({ ...ok, email: 'x@' }).email);

// Mensagem no molde da secretaria
const msg = mensagemFicha({ ...ok, nascimento: '1990-03-07' });
assert.match(msg, /\*Nome Completo:\* Fulano de Tal/);
assert.match(msg, /\*Data de Nascimento:\* 07\/03\/1990/);
assert.match(msg, /\*CPF:\*\n/);
assert.match(msg, /=+\n\*Nome do Curso:\* Curso X$/);

// Fase da oferta (horário de Brasília)
const bf = { inicio: '2026-11-27T00:00:00-03:00', fim: '2026-11-27T23:59:59-03:00' };
assert.equal(faseOferta(bf, Date.parse('2026-11-26T23:00:00-03:00')).fase, 'antes');
assert.equal(faseOferta(bf, Date.parse('2026-11-27T12:00:00-03:00')).fase, 'durante');
assert.equal(faseOferta(bf, Date.parse('2026-11-28T00:00:00-03:00')).fase, 'encerrada');
assert.equal(faseOferta({ fim: bf.fim }, 0).fase, 'durante');
assert.deepEqual(partesTempo(90061000), { dias: 1, horas: 1, min: 1, seg: 1 });

console.log('ficha + oferta: ok');
