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

test('Testando cadastro de três respostas', () => {
  modelo.cadastrar_pergunta('Who is the main character in Legend of Heroes Trails in The Sky First Chapter?');
  modelo.cadastrar_pergunta('Who is the main character in Legend of Heroes Trails From Zero?');
  modelo.cadastrar_pergunta('Who is the main character in Legend of Heroes Trails Cold Steel?');
  modelo.cadastrar_resposta(4,'Estelle Bright');
  modelo.cadastrar_resposta(4,'Joshua');
  modelo.cadastrar_resposta(4,'Kloe Rinz');
  modelo.cadastrar_resposta(5,'Lloyd Bannings');
  modelo.cadastrar_resposta(6,'Ren Schwarz');
  const perguntas = modelo.listar_perguntas();
  expect(modelo.get_respostas(4)[0]["texto"]).toBe('Estelle Bright');
  expect(modelo.get_respostas(5)[0]["texto"]).toBe('Lloyd Bannings');
  expect(modelo.get_respostas(6)[0]["texto"]).toBe('Ren Schwarz');
  expect(perguntas[0].num_respostas).toBe(3);
});

test('Testando coerência do identificador de pergunta', () => {
  modelo.cadastrar_pergunta('Which is the best track in Trails Series in your opinion?');
  modelo.cadastrar_pergunta('Which is the best character in Trails Series in your opinion?');
  modelo.cadastrar_pergunta('Which is the best villain in Trails Series in your opinion?');
  expect(modelo.get_pergunta(7)["id_pergunta"]).toBe(7);
  expect(modelo.get_pergunta(7)["id_usuario"]).toBe(1);
  expect(modelo.get_pergunta(7)["texto"]).toBe('Which is the best track in Trails Series in your opinion?');
  expect(modelo.get_pergunta(8)["texto"]).toBe('Which is the best character in Trails Series in your opinion?');
  expect(modelo.get_pergunta(9)["texto"]).toBe('Which is the best villain in Trails Series in your opinion?');
});
