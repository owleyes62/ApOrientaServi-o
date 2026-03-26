const buildHomePage = (routesInfo) => {
  const { endpoints } = routesInfo;

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

${Object.entries(endpoints)
  .map(([groupName, groupData]) => `
    <div class="section">
      <h2>${groupName.toUpperCase()}</h2>
      <p>${groupData.description || ""}</p>

      ${groupData.routes
        .map(route => `
          <div class="route">
            <span class="${route.method}">${route.method}</span> ${route.path}
            <br/>
            <small>${route.description}</small>

            ${
              route.bodyExample
                ? `
                  <div style="margin-top:8px;">
                    <small><strong>Exemplo de envio (JSON):</strong></small>
                    <pre style="
                      background:#f0f0f0;
                      padding:8px;
                      border-radius:6px;
                      font-family:monospace;
                    ">
${JSON.stringify(route.bodyExample, null, 2)}
                    </pre>
                  </div>
                `
                : ""
            }
          </div>
        `)
        .join("")}
    </div>
  `)
  .join("")}
      </body>
    </html>
  `;
};

export default buildHomePage;