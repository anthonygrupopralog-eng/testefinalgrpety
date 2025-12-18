import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB61mrR6417ECkuUCsbBqLU3KQ_hepXiQs",
  authDomain: "check-list-d32b1.firebaseapp.com",
  projectId: "check-list-d32b1",
  storageBucket: "check-list-d32b1.firebasestorage.app",
  messagingSenderId: "261801594944",
  appId: "1:261801594944:web:273ca3fbd1ff9457728fa5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const urlParams = new URLSearchParams(window.location.search);
const placa = urlParams.get('placa');

document.getElementById('placaTitulo').innerText = `Placa: ${placa}`;

document.getElementById('salvarChecklist').addEventListener('click', async () => {
  const mesAtual = new Date().toISOString().slice(0, 7);

  await addDoc(collection(db, 'checklists'), {
    placa,
    mes: mesAtual,
    pneus: document.getElementById('pneus').checked,
    freios: document.getElementById('freios').checked,
    iluminacao: document.getElementById('iluminacao').checked,
    observacoes: document.getElementById('obs').value,
    criadoEm: new Date()
  });

  alert('Checklist salvo com sucesso!');
  window.history.back();
});
