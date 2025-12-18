import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot
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

const placasRef = collection(db, "placas");

export async function cadastrarPlaca(placa, tipo) {
  await addDoc(placasRef, {
    placa: placa.toUpperCase(),
    tipo,
    criadoEm: new Date()
  });
}

export function carregarPlacas(callback) {
  onSnapshot(placasRef, (snapshot) => {
    const placas = [];
    snapshot.forEach(doc => placas.push(doc.data()));
    callback(placas);
  });
}
