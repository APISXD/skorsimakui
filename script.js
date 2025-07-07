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
const jurusanWrapper = document.createElement("div");
jurusanWrapper.className = "subtest"; // biar sama gaya dengan subtest lain
jurusanWrapper.innerHTML = `
  <h3>Jurusan yang kamu tuju (Opsional)</h3>
  <label for="jurusan">Tuliskan jurusan pilihanmu</label>
  <input type="text" id="jurusan" name="jurusan" placeholder="Contoh: Ilmu Komputer"/>
`;
subtestsContainer.appendChild(jurusanWrapper);

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
  const jurusan = document.getElementById("jurusan").value.trim() || "-";

  resultText += `<hr><p><strong>Total Skor: ${totalSkor}</strong></p>`;
  document.getElementById("result").innerHTML = resultText;

  // Tambahkan total skor ke akhir
  dataToSend.push(totalSkor);
  dataToSend.push(jurusan);
  
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
function updateCountdown() {
  const targetDate = new Date("July 11, 2025 00:00:00").getTime();
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    document.getElementById("countdown").innerText = "Hari H SIMAK UI telah tiba! 🎯";
    clearInterval(interval);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerText =
    `Menuju Pengumuman SIMAK UI: ${days} hari ${hours} jam ${minutes} menit ${seconds} detik`;
}

const interval = setInterval(updateCountdown, 1000);
updateCountdown(); // tampilkan langsung saat halaman dibuka
