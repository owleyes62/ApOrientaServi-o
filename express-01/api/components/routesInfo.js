const routesInfo = {
  title: "🚀 API Express - Documentação",
  description: "API REST para gerenciamento de usuários e mensagens.",
  endpoints: {
    users: {
      description: "Operações relacionadas aos usuários.",
      routes: [
        {
          method: "GET",
          path: "/users",
          description: "Lista todos os usuários cadastrados."
        },
        {
          method: "GET",
          path: "/users/:userId",
          description: "Retorna um usuário específico pelo ID."
        },
        {
          method: "POST",
          path: "/users",
          description: "Cria um novo usuário.",
          bodyExample: {
            username: "string",
            email: "string"
          }
        },
        {
          method: "PUT",
          path: "/users/:userId",
          description: "Atualiza um usuário existente.",
          bodyExample: {
            username: "string",
            email: "string"
          }
        },
        {
          method: "DELETE",
          path: "/users/:userId",
          description: "Remove um usuário do sistema."
        }
      ]
    },

    messages: {
      description: "Operações relacionadas às mensagens.",
      routes: [
        {
          method: "GET",
          path: "/messages",
          description: "Lista todas as mensagens."
        },
        {
          method: "GET",
          path: "/messages/:messageId",
          description: "Retorna uma mensagem específica pelo ID."
        },
        {
          method: "POST",
          path: "/messages",
          description: "Cria uma nova mensagem vinculada a um usuário.",
          bodyExample: {
            text: "string",
            userId: "number"
          }
        },
        {
          method: "PUT",
          path: "/messages/:messageId",
          description: "Atualiza o texto ou o usuário da mensagem.",
          bodyExample: {
            text: "string (opcional)",
            userId: "number (opcional)"
          }
        },
        {
          method: "DELETE",
          path: "/messages/:messageId",
          description: "Remove uma mensagem."
        }
      ]
    },

    session: {
      description: "Retorna o usuário atualmente definido no contexto.",
      routes: [
        {
          method: "GET",
          path: "/session",
          description: "Retorna informações da sessão atual."
        }
      ]
    }
  }
};

export default routesInfo;