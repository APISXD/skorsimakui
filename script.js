const subtestsData = [
  { code: "MD", name: "Matematika Dasar", soal: 15, waktu: 20 },
  { code: "BI", name: "Bahasa Indonesia", soal: 15, waktu: 20 },
  { code: "ING", name: "Bahasa Inggris", soal: 15, waktu: 20 },
  { code: "VER", name: "Penalaran Verbal", soal: 25, waktu: 15 },
  { code: "KUA", name: "Penalaran Kuantitatif", soal: 35, waktu: 50 },
  { code: "LOG", name: "Penalaran Logika", soal: 25, waktu: 40 },
];

window.addEventListener("DOMContentLoaded", () => {
  const hasSubmitted = localStorage.getItem("simakScoreSubmitted") === "true";
  if (hasSubmitted) {
    document.getElementById("others-result").classList.remove("locked");
    const infoText = document.querySelector(".locked-info");
    if (infoText) infoText.remove();
    loadOthersResults();
    console.log("Data dikirim ke SheetBest:", dataToSend);

  }
});
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
  let dataToSend = {
    Timestamp: new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
  

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
    dataToSend[`${subtest.code} Benar`] = benarFormatted;
    dataToSend[`${subtest.code} Salah`] = salahFormatted;    

    resultText += `
      <p><strong>${subtest.name}</strong>: Benar ${benar} (${skorBenar}), Salah ${salah} (${skorSalah}), Skor = ${skor}</p>
    `;
  });
  const jurusan = document.getElementById("jurusan").value.trim() || "-";

  resultText += `<hr><p><strong>Total Skor: ${totalSkor}</strong></p>`;
  document.getElementById("result").innerHTML = resultText;
  localStorage.setItem("simakScoreSubmitted", "true");
  document.getElementById("others-result").classList.remove("locked");
  const infoText = document.querySelector(".locked-info");
  if (infoText) infoText.remove();

  // Tambahkan total skor ke akhir
  dataToSend["Total Skor"] = totalSkor;
  dataToSend["Jurusan"] = jurusan;

  console.log("Data yang akan dikirim ke Sheet:", dataToSend);

  fetch(
    "https://api.sheetbest.com/sheets/5b1d8798-ceff-4827-9957-a7e26dd7a6a2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend), // ✅ bukan array
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
    document.getElementById("countdown").innerText =
      "Pengumuman SIMAK UI telah tiba! 🎯";
    clearInterval(interval);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById(
    "countdown"
  ).innerText = `Menuju Pengumuman SIMAK UI (+- 11 Juli): ${days} hari ${hours} jam ${minutes} menit ${seconds} detik`;
}

const interval = setInterval(updateCountdown, 1000);
updateCountdown(); // tampilkan langsung saat halaman dibuka
function loadOthersResults(filterText = "") {
  fetch("https://api.sheetbest.com/sheets/5b1d8798-ceff-4827-9957-a7e26dd7a6a2")
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("resultList");
      list.innerHTML = "";

      const results = data
        .filter((row) => row["Jurusan"] && row["Jurusan"] !== "-")
        .map((row) => ({
          jurusan: row["Jurusan"],
          skor: parseInt(row["Total Skor"]),
        }));

      const filteredResults = results.filter((item) =>
        item.jurusan.toLowerCase().includes(filterText.toLowerCase())
      );

      filteredResults
        .sort((a, b) => b.skor - a.skor)
        .forEach((item) => {
          const li = document.createElement("li");
          li.textContent = `🎓 ${item.jurusan} — Skor: ${item.skor}`;
          list.appendChild(li);
        });
    })
    .catch((err) => {
      console.error("❌ Gagal mengambil data peserta lain:", err);
    });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.trim();
  loadOthersResults(value);
});

document.getElementById("topScoresBtn").addEventListener("click", function () {
  fetch("https://api.sheetbest.com/sheets/5b1d8798-ceff-4827-9957-a7e26dd7a6a2")
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("resultList");
      list.innerHTML = "";

      const results = data
        .filter((row) => row["Jurusan"] && row["Jurusan"] !== "-")
        .map((row) => ({
          jurusan: row["Jurusan"],
          skor: parseInt(row["Total Skor"]),
        }))
        .sort((a, b) => b.skor - a.skor)
        .slice(0, 5); // 5 besar

      results.forEach((item, i) => {
        const li = document.createElement("li");
        li.textContent = `🏅 #${i + 1} — ${item.jurusan} — Skor: ${item.skor}`;
        list.appendChild(li);
      });
    });
});

loadOthersResults();

let allResults = [];
let currentPage = 1;
const resultsPerPage = 10;

function renderResultsPage(page, filterText = "") {
  const list = document.getElementById("resultList");
  list.innerHTML = "";

  const filtered = allResults.filter((item) =>
    item.jurusan.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / resultsPerPage);
  currentPage = Math.max(1, Math.min(page, totalPages));

  const start = (currentPage - 1) * resultsPerPage;
  const end = start + resultsPerPage;

  const pageResults = filtered.slice(start, end);
  pageResults.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `🎓 ${item.jurusan} — Skor: ${item.skor}`;
    list.appendChild(li);
  });

  document.getElementById(
    "pageInfo"
  ).innerText = `Halaman ${currentPage} dari ${totalPages}`;
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

function loadOthersResults(filterText = "") {
  fetch("https://api.sheetbest.com/sheets/5b1d8798-ceff-4827-9957-a7e26dd7a6a2")
    .then((res) => res.json())
    .then((data) => {
      allResults = data
        .filter((row) => row["Jurusan"] && row["Jurusan"] !== "-")
        .map((row) => ({
          jurusan: row["Jurusan"],
          skor: parseInt(row["Total Skor"]) || 0,
        }))
        .sort((a, b) => b.skor - a.skor);

      renderResultsPage(1, filterText);
    })
    .catch((err) => {
      console.error("❌ Gagal mengambil data peserta lain:", err);
    });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const value = this.value.trim();
  renderResultsPage(1, value);
});

document.getElementById("prevPage").addEventListener("click", () => {
  const value = document.getElementById("searchInput").value.trim();
  renderResultsPage(currentPage - 1, value);
});

document.getElementById("nextPage").addEventListener("click", () => {
  const value = document.getElementById("searchInput").value.trim();
  renderResultsPage(currentPage + 1, value);
});
