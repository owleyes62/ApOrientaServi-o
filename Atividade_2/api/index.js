const express = require('express');
const app = express();


app.get('/', (req, res) => {
  res.send('Servidor Express funcionando!');
});


app.get('/random', (req, res) => {
  const numero = Math.floor(Math.random() * 100) + 1;
  res.send(`Número aleatório: ${numero}`);
});


app.get('/dado', (req, res) => {
  const face = Math.floor(Math.random() * 6) + 1;
  res.send(`Você tirou: ${face}`);
});


const citacoes = [
  { autor: "Albert Einstein", citacao: "A imaginação é mais importante que o conhecimento." },
  { autor: "Albert Einstein", citacao: "A vida é como andar de bicicleta. Para manter o equilíbrio, você deve continuar se movendo." },
  { autor: "Isaac Newton", citacao: "Se eu vi mais longe, foi por estar sobre ombros de gigantes." },
  { autor: "Isaac Newton", citacao: "O que sabemos é uma gota, o que ignoramos é um oceano." },
  { autor: "Marie Curie", citacao: "Nada na vida deve ser temido, somente compreendido." },
  { autor: "Marie Curie", citacao: "Seja menos curioso sobre as pessoas e mais curioso sobre as ideias." },
  { autor: "Charles Darwin", citacao: "Não é o mais forte que sobrevive, nem o mais inteligente, mas o que melhor se adapta às mudanças." },
  { autor: "Charles Darwin", citacao: "A ignorância gera confiança com mais frequência do que o conhecimento." },
  { autor: "Nikola Tesla", citacao: "O presente é deles; o futuro, pelo qual eu realmente trabalhei, é meu." },
  { autor: "Nikola Tesla", citacao: "Se você quer descobrir os segredos do universo, pense em termos de energia, frequência e vibração." },
  { autor: "Stephen Hawking", citacao: "Inteligência é a capacidade de se adaptar à mudança." },
  { autor: "Stephen Hawking", citacao: "Por mais difícil que seja a vida, sempre há algo que você pode fazer e ter sucesso." },
  { autor: "Richard Feynman", citacao: "Se você acha que entende a mecânica quântica, então você não entende a mecânica quântica." },
  { autor: "Richard Feynman", citacao: "O primeiro princípio é que você não deve se enganar — e você é a pessoa mais fácil de enganar." },
  { autor: "Galileu Galilei", citacao: "A ciência é escrita no grande livro da natureza, que está sempre aberto diante de nossos olhos." },
  { autor: "Galileu Galilei", citacao: "Todos os corpos caem com a mesma velocidade no vácuo, independentemente de sua massa." },
  { autor: "Carl Sagan", citacao: "Somos feitos de poeira de estrelas." },
  { autor: "Carl Sagan", citacao: "Em algum lugar, algo incrível está esperando para ser descoberto." },
  { autor: "Louis Pasteur", citacao: "O acaso favorece apenas a mente preparada." },
  { autor: "Louis Pasteur", citacao: "A ciência não tem pátria, porque o conhecimento pertence à humanidade." },
  { autor: "Max Planck", citacao: "A ciência não pode resolver o mistério final da natureza porque, em última análise, somos parte do mistério que tentamos resolver." },
  { autor: "Niels Bohr", citacao: "O oposto de uma afirmação correta é uma afirmação falsa. Mas o oposto de uma verdade profunda pode ser outra verdade profunda." },
  { autor: "Linus Pauling", citacao: "A melhor maneira de ter uma boa ideia é ter muitas ideias." },
  { autor: "Ada Lovelace", citacao: "A imaginação é a faculdade de descobrir e de criar." },
  { autor: "Alan Turing", citacao: "Às vezes são as pessoas que ninguém imagina que farão algo que fazem as coisas que ninguém imagina." },
  { autor: "Rosalind Franklin", citacao: "A ciência e a vida cotidiana não podem e não devem ser separadas." },
  { autor: "Ernest Rutherford", citacao: "Em ciência, há apenas física; todo o resto é coleção de selos." },
  { autor: "Werner Heisenberg", citacao: "Não existe ciência sem fantasia, nem arte sem fatos." },
  { autor: "James Watson", citacao: "Evite projetos chatos; é muito perigoso para a mente humana não ter problemas desafiadores." },
  { autor: "Dmitri Mendeleev", citacao: "Não existe nada mais prático do que uma boa teoria." }
];

app.get('/citacoes', (req, res) => {
  const indice = Math.floor(Math.random() * citacoes.length);
  res.send(citacoes[indice]);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});


module.exports = app;