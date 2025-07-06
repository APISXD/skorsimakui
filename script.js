const subtestsData = [
  { name: "Matematika Dasar", soal: 15, waktu: 20 },
  { name: "Bahasa Indonesia", soal: 15, waktu: 20 },
  { name: "Bahasa Inggris", soal: 15, waktu: 20 },
  { name: "Penalaran Verbal", soal: 25, waktu: 15 },
  { name: "Penalaran Kuantitatif", soal: 35, waktu: 50 },
  { name: "Penalaran Logika", soal: 25, waktu: 40 },
];

const subtestsContainer = document.getElementById("subtests");

subtestsData.forEach((subtest, index) => {
  const div = document.createElement("div");
  div.className = "subtest";
  div.innerHTML = `
      <h3>${subtest.name} (${subtest.soal} soal, ${subtest.waktu} menit)</h3>
      <label for="benar${index}">Jumlah Benar</label>
      <input type="number" id="benar${index}" min="0" max="${subtest.soal}" required />
      <label for="salah${index}">Jumlah Salah</label>
      <input type="number" id="salah${index}" min="0" max="${subtest.soal}" required />
    `;
  subtestsContainer.appendChild(div);
});

document.getElementById("scoreForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let totalSkor = 0;
  let resultText = "";

  subtestsData.forEach((subtest, index) => {
    const benar = parseInt(document.getElementById(`benar${index}`).value) || 0;
    const salah = parseInt(document.getElementById(`salah${index}`).value) || 0;
    const kosong = subtest.soal - benar - salah;
    const skor = benar * 4 + salah * -1;
    totalSkor += skor;

    resultText += `
        <p><strong>${subtest.name}</strong>: Benar ${benar}, Salah ${salah}, Kosong ${kosong}, Skor = ${skor}</p>
      `;
  });

  resultText += `<hr><p><strong>Total Skor: ${totalSkor}</strong></p>`;
  document.getElementById("result").innerHTML = resultText;
});
