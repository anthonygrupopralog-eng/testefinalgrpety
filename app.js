import { cadastrarPlaca, carregarPlacas } from './firebase.js';

const placaInput = document.getElementById('placaInput');
const tipoInput = document.getElementById('tipoInput');
const btnCadastrar = document.getElementById('btnCadastrar');
const tabelaBody = document.querySelector('tbody');

btnCadastrar.addEventListener('click', async () => {
  if (!placaInput.value || !tipoInput.value) {
    alert('Preencha todos os campos');
    return;
  }
  await cadastrarPlaca(placaInput.value, tipoInput.value);
  placaInput.value = '';
  tipoInput.value = '';
});

carregarPlacas((placas) => {
  tabelaBody.innerHTML = '';

  document.getElementById('totalVeiculos').textContent = placas.length;
  document.getElementById('emDia').textContent = 0;
  document.getElementById('pendentes').textContent = placas.length;
  document.getElementById('vencidos').textContent = 0;

  placas.forEach((p) => {
    tabelaBody.innerHTML += `
      <tr>
        <td>${p.placa}</td>
        <td>${p.tipo}</td>
        <td>-</td>
        <td class="status warning">Aguardando checklist</td>
        <td><button>Checklist</button></td>
      </tr>
    `;
  });
});
