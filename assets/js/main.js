// --- 1. INISIALISASI SAAT HALAMAN DIMUAT ---
document.addEventListener("DOMContentLoaded", function() {
    // Validasi Login
    if (sessionStorage.getItem("isLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }

    // Tampilkan Nama dan Jabatan
    const namaUser = sessionStorage.getItem("userNama");
    const jabatanUser = sessionStorage.getItem("userJabatan");
    document.getElementById("displayNama").innerText = namaUser;
    document.getElementById("displayJabatan").innerText = jabatanUser;

    // Tampilkan Tanggal
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dateDisplay').innerText = new Date().toLocaleDateString('id-ID', options);

    // Ambil Lokasi
    getGeolocation(); 
});

// --- 2. LOGIKA TOGGLE KAMERA (Baru) ---
let currentStream = null;
document.getElementById('toggleKamera').addEventListener('change', async function(e) {
    const video = document.getElementById('video');
    const statusText = document.getElementById('status');

    if (e.target.checked) {
        // Nyalakan kamera
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = stream;
            currentStream = stream;
            statusText.innerText = "Kamera aktif.";
        } catch (err) {
            console.error(err);
            statusText.innerText = "Gagal mengakses kamera.";
            e.target.checked = false; // Reset switch jika gagal
        }
    } else {
        // Matikan kamera
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
            currentStream = null;
            statusText.innerText = "Kamera dimatikan.";
        }
    }
});

// --- 3. LOGIKA PRESENSI ---
document.getElementById('snap').addEventListener('click', function() {
    const nama = sessionStorage.getItem("userNama");
    const jabatan = sessionStorage.getItem("userJabatan");
    const email = sessionStorage.getItem("userEmail");
    const video = document.getElementById('video');
    const toggleKamera = document.getElementById('toggleKamera');
    
    if (!email) { alert("Sesi berakhir!"); window.location.href = "login.html"; return; }

    // VALIDASI WAJIB KAMERA
    if (!toggleKamera.checked || !video.srcObject) {
        alert("Wajib mengaktifkan kamera sebelum presensi!");
        return;
    }

    // --- TAMBAHAN: PAUSE VIDEO SAAT TOMBOL DIKLIK ---
    video.pause(); 

    // Ambil foto
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.scale(-1, 1); // Membalik horizontal
    ctx.drawImage(video, -canvas.width, 0); // Menggambar dengan posisi yang disesuaikan
    const fotoBase64 = canvas.toDataURL('image/jpeg', 0.5);

    const formData = new FormData();
    formData.append('action', 'absen');
    formData.append('nama', nama);
    formData.append('jabatan', jabatan);
    formData.append('email', email);
    formData.append('foto', fotoBase64);
    formData.append('lokasi', window.userCoords);

    const btn = document.getElementById('snap');
    btn.disabled = true; btn.innerText = "Mengirim...";

    fetch(scriptURL, { method: 'POST', body: formData })
    .then(res => res.json())
    .then(data => {
        alert(data.message); 
    })
    .catch(() => alert("Terjadi kesalahan."))
    .finally(() => { 
        // --- TAMBAHAN: PLAY KEMBALI VIDEO SETELAH PROSES SELESAI ---
        video.play(); 
        btn.disabled = false; 
        btn.innerText = "Ambil Foto"; 
    });
});


// --- 4. UTILS ---
function confirmLogout() {
    if (confirm("Yakin ingin logout?")) { sessionStorage.clear(); window.location.href = "login.html"; }
}

window.userCoords = "Lokasi tidak diizinkan";
function getGeolocation() {
    if (navigator.geolocation) {
        // Menambahkan opsi enableHighAccuracy: true
        navigator.geolocation.getCurrentPosition((pos) => {
            window.userCoords = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        }, (err) => {
            console.error("Gagal mendapatkan lokasi: ", err);
        }, {
            enableHighAccuracy: true, // Ini memaksa browser mencoba mendapatkan lokasi paling akurat
            timeout: 10000,
            maximumAge: 0
        });
    }
}