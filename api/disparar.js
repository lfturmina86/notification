export default async function handler(req, res) {
  // Garante que só aceita pedidos do tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // Recebe o título e a descrição que vieram do seu painel Admin
  const { titulo, descricao } = req.body;

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic os_v2_app_2oylq7jiebfbtpjhbdvuqp47isngifqrd3ruw4m3zdmplw43ue5ff7ldhzalujpewjfbf64ami3ijrq2y7abir5gb3mpfsz3cesyjkq"
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
