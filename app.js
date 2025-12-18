import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

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

function calcularStatus(dataChecklist) {
  const hoje = new Date();
  hoje.setHours(0,0,0,0);

  const data = new Date(dataChecklist);
  data.setHours(0,0,0,0);

  const diffDias = Math.floor(
    (hoje - data) / (1000 * 60 * 60 * 24)
  );

  if (diffDias > 30) return 'vencido';
  if (diffDias === 30) return 'pendente';
  return 'em dia';
}

const placasRef = collection(db, 'placas');
const checklistsRef = collection(db, 'checklists');

onSnapshot(placasRef, (placasSnap) => {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  let emDia = 0, pendente = 0, vencido = 0;

  placasSnap.forEach(async (placaDoc) => {
    const placa = placaDoc.data().placa;
    const tipo = placaDoc.data().tipo;

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

        if (status === 'em dia') {
          statusTexto = 'Em dia';
          statusClasse = 'ok';
          emDia++;
        }
        if (status === 'pendente') {
          statusTexto = 'Pendente';
          statusClasse = 'warning';
          pendente++;
        }
        if (status === 'vencido') {
          statusTexto = 'Vencido';
          statusClasse = 'danger';
          vencido++;
        }
      }

      tbody.innerHTML += `
        <tr>
          <td>${placa}</td>
          <td>${tipo}</td>
          <td>${ultimaData ? ultimaData.toLocaleDateString() : '-'}</td>
          <td class="status ${statusClasse}">${statusTexto}</td>
          <td>
            <a href="checklist.html?placa=${placa}">
              <button>Checklist</button>
            </a>
          </td>
        </tr>
      `;

      document.getElementById('totalVeiculos').innerText = placasSnap.size;
      document.getElementById('emDia').innerText = emDia;
      document.getElementById('pendentes').innerText = pendente;
      document.getElementById('vencidos').innerText = vencido;
    });
  });
});
