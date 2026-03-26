const routesInfo = {
  message: "API Express - Rotas disponíveis",
  routes: {
    users: [
      "GET /users",
      "GET /users/:userId",
      "POST /users",
      "PUT /users/:userId",
      "DELETE /users/:userId"
    ],
    messages: [
      "GET /messages",
      "GET /messages/:messageId",
      "POST /messages",
      "DELETE /messages/:messageId"
    ],
    session: [
      "GET /session"
    ]
  }
};

export default routesInfo;