const buildHomePage = (routesInfo) => {
  const { routes } = routesInfo;

  return `
    <html>
      <head>
        <title>Express API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f8;
            padding: 40px;
          }
          h1 { color: #2c3e50; }
          .section { margin-bottom: 30px; }
          .route {
            background: white;
            padding: 10px 15px;
            margin: 5px 0;
            border-radius: 6px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            font-family: monospace;
          }
          .GET { color: green; font-weight: bold; }
          .POST { color: blue; font-weight: bold; }
          .PUT { color: orange; font-weight: bold; }
          .DELETE { color: red; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>🚀 API Express - Rotas Disponíveis</h1>

        ${Object.entries(routes)
          .map(([group, endpoints]) => `
            <div class="section">
              <h2>${group.toUpperCase()}</h2>
              ${endpoints
                .map(route => {
                  const [method, path] = route.split(" ");
                  return `
                    <div class="route">
                      <span class="${method}">${method}</span> ${path}
                    </div>
                  `;
                })
                .join("")}
            </div>
          `)
          .join("")}
      </body>
    </html>
  `;
};

export default buildHomePage;