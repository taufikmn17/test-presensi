

const scriptURL = 'https://script.google.com/macros/s/AKfycbzR_jebvkZ3sS8kXlGBA1ZQPoH6KG382KjUMwYrSR_Ev0RYFfodh8Zs6vjypbMxBe9K/exec';
document.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
        return; // Hentikan eksekusi jika tidak login
    }

    // Jalankan jika elemen statistik (Hadir, Telat, Alpha) ada di halaman ini
    if (document.getElementById("countHadir") && document.getElementById("countTerlambat") && document.getElementById("countAlpha")) {
        fetchStats();
    }
});

function fetchStats() {
    const email = sessionStorage.getItem("userEmail");
    const formData = new FormData();
    formData.append("action", "getStats");
    formData.append("email", email);

    fetch(scriptURL, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            // 1. Ambil elemen
            const elHadir = document.getElementById("countHadir");
            const elTerlambat = document.getElementById("countTerlambat");
            const elAlpha = document.getElementById("countAlpha");

            // 2. Hapus kelas animasi agar tidak berkedip lagi
            elHadir.classList.remove("animate-pulse");
            elTerlambat.classList.remove("animate-pulse");
            elAlpha.classList.remove("animate-pulse");

            // 3. Update UI
            elHadir.innerText = data.countHadir || 0;
            elTerlambat.innerText = data.countTerlambat || 0;
            elAlpha.innerText = data.countAlpha || 0;

            // 4. Inisialisasi Grafik
            initChart(data.countHadir || 0, data.countTerlambat || 0, data.countAlpha || 0);
        }
    });
}

function initChart(hadir, terlambat, alpha) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Tepat Waktu', 'Terlambat', 'Alpha'],
            datasets: [{
                data: [hadir, terlambat, alpha],
                backgroundColor: ['#059669', '#fbbf24', '#dc2626'], // Hijau, Kuning, Merah
                borderWidth: 2
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
}