const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbzR_jebvkZ3sS8kXlGBA1ZQPoH6KG382KjUMwYrSR_Ev0RYFfodh8Zs6vjypbMxBe9K/exec";

// Fungsi 1: Kirim OTP
async function sendOTP() {
    const emailInput = document.getElementById("resetEmail");
    
    // INI BAGIAN PENTING:
    // .reportValidity() akan mengecek atribut 'required' 
    // dan menampilkan pesan error bawaan browser jika kosong.
    if (!emailInput.reportValidity()) {
        return; // Berhenti di sini jika input kosong
    }

    const email = emailInput.value;
    
    await fetch(URL_WEB_APP, {
        method: "POST",
        mode: 'no-cors', 
        body: new URLSearchParams({action: "sendOTP", email: email})
    });
    
    document.getElementById("stepEmail").style.display = "none";
    document.getElementById("stepOTP").style.display = "block";
}


function togglePassword() {
    const passwordInput = document.getElementById("newPassword");
    const checkbox = document.getElementById("show-pass-login");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

// Fungsi 2: Verifikasi OTP
async function verifyOTP() {
    const email = document.getElementById("resetEmail").value;
    const otp = document.getElementById("otpCode").value;

    const response = await fetch(URL_WEB_APP, {
        method: "POST",
        body: new URLSearchParams({action: "verifyOTP", email: email, otp: otp})
    });
    const result = await response.json();
    alert(result.message);

    if (result.status === "success") {
        // Jika sukses, ganti tampilan ke form input password baru
        document.getElementById("stepOTP").innerHTML = `
            <input type="password" id="newPassword" placeholder="Masukkan Password Baru" required>
            <div style="margin-top: 10px; font-size: 12px;">
                <input type="checkbox" id="show-pass-login" onclick="togglePassword()" style="height: auto; width: auto; margin-right: 5px;">
                <label for="show-pass-login">Tampilkan Password</label>
            </div>
            <button type="button" onclick="updatePassword()">Update Password</button>
        `;
    }
}

// Fungsi 3: Update Password Baru
async function updatePassword() {
    const email = document.getElementById("resetEmail").value;
    const newPassword = document.getElementById("newPassword").value;

    if (!newPassword) return alert("Password tidak boleh kosong!");

    const response = await fetch(URL_WEB_APP, {
        method: "POST",
        body: new URLSearchParams({
            action: "updatePassword", 
            email: email, 
            password: newPassword
        })
    });
    const result = await response.json();
    alert(result.message);

    if (result.status === "success") {
        window.location.href = "index.html"; // Arahkan kembali ke login
    }
}