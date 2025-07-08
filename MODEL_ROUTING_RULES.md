# MODEL_ROUTING_RULES.md

## 📘 Regras de Roteamento de Modelos - GitHub Mastery MCP

Este arquivo define quais modelos de linguagem devem ser utilizados para cada tipo de tarefa. Utilize as tags de modelo para maximizar eficiência e custo-benefício.

### 🔖 Sintaxe de Tag
Coloque `#model:modelo` ou `#model:auto` no início da mensagem ou comentário da tarefa para forçar/adaptar o modelo.

### 🚦 Mapeamento
| Tarefa                       | Tag/Trigger      | Modelo Recom.         | Explicação                               |
|------------------------------|------------------|-----------------------|------------------------------------------|
| Explicação/resumo curto      | #model:3.5-sonnet| claude 3.5 sonnet     | Baixo custo, texto objetivo              |
| Análise de código extenso    | #model:4o        | gpt-4o                | Raciocínio detalhado, grande contexto    |
| Refatoração multi-arquivo    | #model:o4-mini   | o4-mini               | Precisa de maior "janela"                |
| Brainstorm/roteiro criativo  | #model:haiku     | claude 3.5 haiku      | Ideias criativas, menos custo            |
| Interação rápida/CLI         | #model:auto      | roteamento automático | Otimização baseada na tarefa             |
| Geração de documentação      | #model:4o        | gpt-4o                | Contexto amplo, resposta estruturada     |
| Report/relatório técnico     | #model:4o        | gpt-4o                | Consistência e precisão                  |
| Testes unitários massivos    | #model:gemini    | gemini 2.5 pro        | Respostas simples e rápidas              |
| Análise rápida               | #model:flash     | gemini 2.0 flash      | Respostas muito rápidas                  |
| Estrutura de dados complexa  | #model:o3        | o3                    | Controle de estado                       |
| Versatilidade balanceada     | #model:opus      | claude 4 opus         | Equilibrio entre custo e funcionalidade  |
| Desenvolvedor solo           | #model:sonnet-4  | claude 4 sonnet       | Ideal para projetos front-end leves      |
| Análise iterativa            | #model:o3-mini   | o3-mini               | Linearidade em tarefas iterativas        |

### 📎 Notas
- O roteamento "auto" alterna para o modelo de menor custo que resolva a tarefa, escalando para o modelo maior se o contexto exceder o limite.
- O modelo poderá ser alterado em tempo real conforme necessidade. A tag pode ser incluída em comentários do GitHub, Requests do MCP, Issues, etc.
- O arquivo pode ser revisado conforme experiência e custo/benefício real.

---

## 🔍 Exemplo de Uso

```
#model:4o
Explique em detalhes como funciona a integração entre GIDEN e o workflow CI deste projeto.
```

## 📊 Utilizando o MCP

Veja no arquivo de documentação do MCP como integrar essas regras de modelo com as tarefas diárias usando a estrutura harmonizada de aprendizagem GIDEN e o EvolutionaryLearningSystem para otimização contínua.
