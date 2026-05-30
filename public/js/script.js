// Toggle single password field
function togglePassword(){
    const password = document.getElementById("password");
    if(password.type === "password"){
        password.type = "text";
    } else {
        password.type = "password";
    }
}

// Toggle any password field by id
function togglePasswordField(fieldId) {
    const input = document.getElementById(fieldId);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}

// Bootstrap form validation
(() => {
    'use strict'
    const forms = document.querySelectorAll('.needs-validation')
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            form.classList.add('was-validated')
        }, false)
    })
})()

// Profile modal
const profileBtn = document.getElementById("profileBtn");
const modal = document.getElementById("profileModal");
const closeBtn = document.getElementById("closeProfile");

if(profileBtn){
    profileBtn.onclick = () => modal.style.display = "flex";
}
if(closeBtn){
    closeBtn.onclick = () => modal.style.display = "none";
}
window.onclick = (e) => {
    if(e.target === modal) modal.style.display = "none";
};

// Flash close button
document.querySelectorAll(".flash-close").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.closest(".flash-container").remove();
    });
});

// Flash auto hide after 10 seconds
setTimeout(() => {
    document.querySelectorAll(".flash-container").forEach(msg => {
        msg.style.transition = "opacity 0.4s ease";
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 400);
    });
}, 10000);

// Gatepass date validation ✅
const exitInput = document.querySelector("#exitDate");
const returnInput = document.querySelector("#returnDate");

function validateDates() {
    const exitDate = new Date(exitInput.value);
    const returnDate = new Date(returnInput.value);
    if (returnDate <= exitDate) {
        returnInput.setCustomValidity("Return date must be after exit date.");
    } else {
        returnInput.setCustomValidity("");
    }
}

if (exitInput && returnInput) {
    exitInput.addEventListener("change", () => { if (returnInput.value) validateDates(); });
    returnInput.addEventListener("change", validateDates);
}

// Password match validation ✅
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

if (newPassword && confirmPassword) {
    confirmPassword.addEventListener("input", () => {
        if (confirmPassword.value !== newPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match.");
        } else {
            confirmPassword.setCustomValidity("");
        }
    });

    newPassword.addEventListener("input", () => {
        if (confirmPassword.value && confirmPassword.value !== newPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match.");
        } else {
            confirmPassword.setCustomValidity("");
        }
    });
}