import admin from 'firebase-admin';

// Inicializa o Firebase Admin
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin', error);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  const API_SECRET = process.env.API_SECRET || 'admin_secret_key'; 

  if (token !== API_SECRET) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const { titulo, descricao } = req.body;

  if (!admin.apps.length) {
     return res.status(500).json({ error: "FIREBASE_SERVICE_ACCOUNT não configurada corretamente no servidor." });
  }

  try {
    const db = admin.firestore();
    const usuariosSnapshot = await db.collection('usuarios').get();
    
    const tokens = [];
    usuariosSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.fcmToken) {
        tokens.push(data.fcmToken);
      }
    });

    if (tokens.length === 0) {
      return res.status(400).json({ error: 'Nenhum dispositivo ativou as notificações ainda. Peça para a equipe clicar no botão "Ativar Alertas" na tela inicial.' });
    }

    const message = {
      notification: {
        title: titulo,
        body: descricao
      },
      data: {
        title: titulo,
        descricao: descricao
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    
    return res.status(200).json({ 
        success: true, 
        enviados: response.successCount, 
        falhas: response.failureCount 
    });

  } catch (error) {
    console.error("Erro no FCM:", error);
    return res.status(500).json({ error: "Erro interno no servidor ao disparar notificação." });
  }
}
