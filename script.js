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
  let dataToSend = [new Date().toLocaleString()]; // Timestamp

  subtestsData.forEach((subtest, index) => {
    const benar = parseInt(document.getElementById(`benar${index}`).value) || 0;
    const salah = parseInt(document.getElementById(`salah${index}`).value) || 0;

    const skorBenar = benar * 4;
    const skorSalah = salah * -1;
    const skor = skorBenar + skorSalah;

    totalSkor += skor;

    // Format: 12 (48)
    const benarFormatted = `${benar} (${skorBenar})`;
    const salahFormatted = `${salah} (${skorSalah})`;

    // Tambahkan ke baris yang dikirim
    dataToSend.push(benarFormatted, salahFormatted);

    resultText += `
      <p><strong>${subtest.name}</strong>: Benar ${benar} (${skorBenar}), Salah ${salah} (${skorSalah}), Skor = ${skor}</p>
    `;
  });

  resultText += `<hr><p><strong>Total Skor: ${totalSkor}</strong></p>`;
  document.getElementById("result").innerHTML = resultText;

  // Tambahkan total skor ke akhir
  dataToSend.push(totalSkor);

  console.log("Data yang akan dikirim ke Sheet:", dataToSend);

  fetch(
    "https://v1.nocodeapi.com/kocijas/google_sheets/WwQrDQSTrfBlfVMJ?tabId=Sheet1",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([dataToSend]),
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(
        "✅ Data berhasil dikirim ke Google Sheet via NoCodeAPI:",
        data
      );
    })
    .catch((err) => {
      console.error("❌ Gagal kirim ke NoCodeAPI:", err);
    });
});
