async function analyzePassword() {
    let password = document.getElementById("password").value;
    let scoreElement = document.getElementById("score");
    let entropyElement = document.getElementById("entropy");
    let feedbackElement = document.getElementById("password-feedback");
    let resultSection = document.getElementById("result");
    let criteriaList = document.getElementById("criteria-list");
    
    if (!password) {
        alert("⚠️ Please enter a password.");
        return;
    }

    let criteria = {
        length: { pattern: /.{8,}/, description: "At least 8 characters" },
        uppercase: { pattern: /[A-Z]/, description: "One uppercase letter" },
        lowercase: { pattern: /[a-z]/, description: "One lowercase letter" },
        number: { pattern: /\d/, description: "One number" },
        special: { pattern: /[!@#$%^&*(),.?":{}|<>]/, description: "One special character" }
    };

    let passedCriteria = 0;
    criteriaList.innerHTML = "";

    for (let key in criteria) {
        let passed = criteria[key].pattern.test(password);
        let listItem = document.createElement("li");
        listItem.innerHTML = `<span>${passed ? "✅" : "❌"}</span> ${criteria[key].description}`;
        criteriaList.appendChild(listItem);
        if (passed) passedCriteria++;
    }

    let strength = calculateStrength(password);
    scoreElement.innerText = `${strength}%`;

    let entropy = calculateEntropy(password);
    entropyElement.innerText = entropy.toFixed(2);

    let feedback = getPasswordFeedback(strength, entropy);
    feedbackElement.innerText = feedback;
    feedbackElement.style.color = getFeedbackColor(feedback);

    resultSection.style.display = "block";

    let breached = await checkPwnedPassword(password);
    if (breached) {
        alert("⚠️ WARNING: This password has been found in a data breach! Consider changing it.");
    }
}

function calculateStrength(password) {
    let score = 0;
    if (/.{8,}/.test(password)) score += 20;
    if (/[A-Z]/.test(password)) score += 20;
    if (/[a-z]/.test(password)) score += 20;
    if (/\d/.test(password)) score += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    return Math.min(score, 110);
}

function calculateEntropy(password) {
    let charSets = [
        /[A-Z]/.test(password) ? 26 : 0,
        /[a-z]/.test(password) ? 26 : 0,
        /\d/.test(password) ? 10 : 0,
        /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 32 : 0
    ];
    let poolSize = charSets.reduce((a, b) => a + b, 0);
    return password.length * Math.log2(poolSize);
}

function getPasswordFeedback(strength, entropy) {
    if (strength < 40 || entropy < 30) return "❌ Weak Password!";
    if (strength < 80 || entropy < 50) return "⚠️ Medium Strength - Consider making it stronger.";
    if (strength < 100 || entropy < 70) return "✅ Strong Password!";
    return "💪 Very Strong Password!";
}

function getFeedbackColor(feedback) {
    if (feedback.includes("Weak")) return "red";
    if (feedback.includes("Medium")) return "orange";
    if (feedback.includes("Strong")) return "green";
    return "blue";
}

function togglePassword() {
    let input = document.getElementById("password");
    let toggle = document.querySelector(".toggle-password");
    input.type = input.type === "password" ? "text" : "password";
    toggle.innerText = input.type === "password" ? "👁️" : "🙈";
}

function generatePassword() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < 12; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById("password").value = password;
}

function resetForm() {
    document.getElementById("password").value = "";
    document.getElementById("score").innerText = "0%";
    document.getElementById("entropy").innerText = "0";
    document.getElementById("password-feedback").innerText = "🔍 Checking...";
    document.getElementById("criteria-list").innerHTML = "";
    document.getElementById("result").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    let marquee = document.getElementById("marquee");
    if (marquee) {
        marquee.addEventListener("mouseover", function () { marquee.stop(); });
        marquee.addEventListener("mouseout", function () { marquee.start(); });
    }
});
