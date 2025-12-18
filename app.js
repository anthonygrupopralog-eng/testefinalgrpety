import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ================= FIREBASE ================= */
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

/* ================= REGRA DE STATUS ================= */
function calcularStatus(dataChecklist) {
  const hoje = new Date();
  hoje.setHours(0,0,0,0);

  const data = new Date(dataChecklist);
  data.setHours(0,0,0,0);

  const diffDias = Math.floor(
    (hoje - data) / (1000 * 60 * 60 * 24)
  );

  if (diffDias > 30) return { texto: 'Vencido', classe: 'danger' };
  if (diffDias === 30) return { texto: 'Pendente', classe: 'warning' };
  return { texto: 'Em dia', classe: 'ok' };
}

/* ================= SALVAR CHECKLIST (1 CLIQUE) ================= */
async function salvarChecklist(placa) {
  const hoje = new Date();
  hoje.setHours(0,0,0,0);

  try {
    await addDoc(collection(db, 'checklists'), {
      placa: placa,
      dataChecklist: hoje.toISOString().slice(0,10),
      criadoEm: hoje
    });

    alert(`Checklist da placa ${placa} salvo com sucesso!`);
  } catch (error) {
    alert('Erro ao salvar checklist');
    console.error(error);
  }
}

/* DEIXA A FUNÇÃO VISÍVEL PARA O BOTÃO */
window.salvarChecklist = salvarChecklist;

/* ================= CARREGAR PLACAS E STATUS ================= */
const placasRef = collection(db, 'placas');
const checklistsRef = collection(db, 'checklists');

onSnapshot(placasRef, (placasSnap) => {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  let emDia = 0;
  let pendentes = 0;
  let vencidos = 0;

  placasSnap.forEach((placaDoc) => {
    const { placa, tipo } = placaDoc.data();

    const q = query(checklistsRef, where('placa', '==', placa));

    onSnapshot(q, (checkSnap) => {
      let ultimaData = null;

      checkSnap.forEach(doc => {
        const d = new Date(doc.data().dataChecklist);
        if (!ultimaData || d > ultimaData) ultimaData = d;
      });

      let statusTexto = 'Pendente';
      let statusClasse = 'warning';

      if (ultimaData) {
        const status = calcularStatus(ultimaData);
        statusTexto = status.texto;
        statusClasse = status.classe;

        if (statusTexto === 'Em dia') emDia++;
        if (statusTexto === 'Pendente') pendentes++;
        if (statusTexto === 'Vencido') vencidos++;
      }

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${placa}</td>
        <td>${tipo}</td>
        <td>${ultimaData ? ultimaData.toLocaleDateString() : '-'}</td>
        <td class="status ${statusClasse}">${statusTexto}</td>
        <td>
          <button onclick="salvarChecklist('${placa}')">
            Checklist
          </button>
        </td>
      `;

      tbody.appendChild(row);

      document.getElementById('totalVeiculos').innerText = placasSnap.size;
      document.getElementById('emDia').innerText = emDia;
      document.getElementById('pendentes').innerText = pendentes;
      document.getElementById('vencidos').innerText = vencidos;
    });
  });
});
