
const scriptURL = 'https://script.google.com/macros/s/AKfycbzR_jebvkZ3sS8kXlGBA1ZQPoH6KG382KjUMwYrSR_Ev0RYFfodh8Zs6vjypbMxBe9K/exec'; 
const form = document.querySelector('#signupForm');
const btn = form.querySelector('button');

function showNotification(message, type) {
    const notif = document.createElement('div');
    notif.id = 'notification';
    notif.className = type;
    notif.innerText = message;
    document.body.appendChild(notif);
    
    // Trigger animasi muncul
    setTimeout(() => notif.classList.add('show'), 100);
    
    // Hilangkan setelah 3 detik
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 500);
    }, 3000);
}

// untuk Register
form.addEventListener('submit', e => {
    e.preventDefault();
    btn.disabled = true;
    btn.innerText = "Memproses...";

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(response => response.json()) // Ubah respon jadi JSON
    .then(data => {
        if (data.status === "success") {
            showNotification(data.message, "success");
            form.reset();
        } else {
            showNotification(data.message, "error"); // Munculkan "Email sudah terdaftar!"
        }
    })
    .catch(error => {
        showNotification("Terjadi kesalahan sistem.", "error");
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerText = "Daftar";
    });
});



// untuk Login
const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = loginForm.querySelector('button');
    btn.disabled = true;
    btn.innerText = "Memproses...";

    fetch(scriptURL, { method: 'POST', body: new FormData(loginForm) })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // --- TAMBAHKAN BAGIAN INI ---
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("userNama", data.nama); // Menyimpan nama dari respons Apps Script
            sessionStorage.setItem("userJabatan", data.jabatan); // Simpan jabatan
            sessionStorage.setItem("userEmail", data.email);     // Simpan email (tetap disimpan tapi tidak ditampilkan)
            // ----------------------------
            
            showNotification(data.message, "success");
            // Arahkan ke dashboard.html setelah 1 detik
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            showNotification(data.message, "error");
            btn.disabled = false;
            btn.innerText = "Login";
        }
    })
    .catch(() => {
        showNotification("Gagal terhubung ke server.", "error");
        btn.disabled = false;
        btn.innerText = "Login";
    });
});


// --- FUNGSI: Menampilkan section reset password ---
function showResetModal() {
    document.getElementById('resetSection').style.display = 'block';
    // Sembunyikan tombol login atau form utama jika perlu agar tidak membingungkan
}

// --- FUNGSI: Simulasi kirim OTP ---
function sendOTP() {
    const email = document.getElementById('resetEmail').value;
    if (!email) return alert("Masukkan email terlebih dahulu!");
    
    // Di sini nanti Anda memanggil API ke Apps Script untuk kirim email
    alert("Kode OTP telah dikirim ke: " + email);
    
    document.getElementById('stepEmail').style.display = 'none';
    document.getElementById('stepOTP').style.display = 'block';
}

// --- FUNGSI: Verifikasi OTP ---
function verifyOTP() {
    const otp = document.getElementById('otpCode').value;
    if (otp === "123456") { // Contoh validasi manual
        alert("OTP Benar! Silahkan buat password baru.");
        // Arahkan ke halaman reset password atau tampilkan input password baru
    } else {
        alert("Kode OTP salah!");
    }
}