const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando o cadastro de três respostas conjuntamente get_respostas', () => {
  modelo.cadastrar_pergunta('Who is the main character in Legend of Heroes Trails in The Sky First Chapter?');
  modelo.cadastrar_pergunta('Who is the main character in Legend of Heroes Trails From Zero?');
  modelo.cadastrar_pergunta('Who is the main character in Legend of Heroes Trails Cold Steel?');
  modelo.cadastrar_resposta(4,'Estelle Bright');
  modelo.cadastrar_resposta(5,'Lloyd Bannings');
  modelo.cadastrar_resposta(6,'Ren Schwarz');
  expect(modelo.get_respostas(4)[0]["texto"]).toBe('Estelle Bright');
  expect(modelo.get_respostas(5)[0]["texto"]).toBe('Lloyd Bannings');
  expect(modelo.get_respostas(6)[0]["texto"]).toBe('Ren Schwarz');
});

test('Testando coerência do identificador de pergunta (get_pergunta)', () => {
  modelo.cadastrar_pergunta('Which is the best track in Trails Series in your opinion?');
  const perguntas_axl = modelo.listar_perguntas();
  const perguntas_get = modelo.get_pergunta(perguntas_axl[0].id_pergunta)
  expect(perguntas_get.texto).toBe('Which is the best track in Trails Series in your opinion?');
});
