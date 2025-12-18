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

const placa = new URLSearchParams(window.location.search).get('placa');
document.getElementById('placaTitulo').innerText = `Placa: ${placa}`;

document.getElementById('salvarChecklist').addEventListener('click', async () => {
  const hoje = new Date();
  hoje.setHours(0,0,0,0);

  await addDoc(collection(db, 'checklists'), {
    placa,
    dataChecklist: hoje.toISOString().slice(0,10),
    criadoEm: hoje
  });

  alert('Checklist salvo com sucesso!');
  window.location.href = 'index.html';
});
