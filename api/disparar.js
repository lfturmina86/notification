export default async function handler(req, res) {
  // Garante que só aceita pedidos do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // 🔒 Verifica o Header de Autorização
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const API_SECRET = process.env.API_SECRET || 'admin_secret_key'; 

  if (token !== API_SECRET) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  // Recebe o título e a descrição que vieram do seu painel Admin
  const { titulo, descricao } = req.body;
  const onesignalKey = process.env.ONESIGNAL_API_KEY;

  if (!onesignalKey) {
    return res.status(500).json({ error: "ONESIGNAL_API_KEY não configurada no servidor." });
  }

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${onesignalKey}`
      },
      body: JSON.stringify({
        app_id: "d3b0b87d-2820-4a19-bd27-08eb483f9f44",
        included_segments: ["All"],
        headings: { "en": titulo, "pt": titulo },
        contents: { "en": descricao, "pt": descricao }
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Erro de comunicação com o servidor" });
  }
}
