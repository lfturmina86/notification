if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('PWA Ativo com Sucesso!'))
    .catch((err) => console.log('Erro ao registrar PWA:', err));
}
