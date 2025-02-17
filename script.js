async function analyzePassword() {
    let password = document.getElementById("password").value;
    let scoreElement = document.getElementById("score");
    let entropyElement = document.getElementById("entropy");
    let feedbackElement = document.getElementById("password-feedback");
    let resultSection = document.getElementById("result");

    if (!password) {
        alert("⚠️ Please enter a password.");
        return;
    }

    // 📌 Step 1: Calculate password strength
    let strength = calculateStrength(password);
    scoreElement.innerText = `${strength}%`;

    // 📌 Step 2: Calculate entropy
    let entropy = calculateEntropy(password);
    entropyElement.innerText = entropy.toFixed(2);

    // 📌 Step 3: Provide user feedback based on Strength & Entropy
    let feedback = getPasswordFeedback(strength, entropy);
    feedbackElement.innerText = feedback;
    feedbackElement.style.color = getFeedbackColor(feedback);

    resultSection.style.display = "block";

    // 📌 Step 4: Check if password has been leaked
    let breached = await checkPwnedPassword(password);
    if (breached) {
        alert("⚠️ WARNING: This password has been found in a data breach! Consider changing it.");
    }
}

// ✅ Function to Calculate Password Strength Score
function calculateStrength(password) {
    let criteria = {
        length: /.{8,}/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /\d/,
        special: /[!@#$%^&*(),.?\":{}|<>]/
    };

    let passedCriteria = 0;
    for (let key in criteria) {
        if (criteria[key].test(password)) passedCriteria++;
    }

    let score = passedCriteria * 20; // Each criterion adds 20%
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    return Math.min(score, 110); // Max Score = 110%
}

// ✅ Function to Calculate Entropy (Basic Formula)
function calculateEntropy(password) {
    let charSets = [
        /[A-Z]/.test(password) ? 26 : 0,  // Uppercase letters
        /[a-z]/.test(password) ? 26 : 0,  // Lowercase letters
        /\d/.test(password) ? 10 : 0,     // Numbers
        /[!@#$%^&*(),.?\":{}|<>]/.test(password) ? 32 : 0 // Special characters
    ];

    let poolSize = charSets.reduce((a, b) => a + b, 0);
    return password.length * Math.log2(poolSize); // Shannon Entropy Formula
}

// ✅ Function to Provide Feedback Based on Strength & Entropy
function getPasswordFeedback(strength, entropy) {
    if (strength < 40 || entropy < 30) return "❌ Weak Password!";
    if (strength < 80 || entropy < 50) return "⚠️ Medium Strength - Consider making it stronger.";
    if (strength < 100 || entropy < 70) return "✅ Strong Password!";
    return "💪 Very Strong Password!";
}

// ✅ Function to Get Color Based on Feedback
function getFeedbackColor(feedback) {
    if (feedback.includes("Weak")) return "red";
    if (feedback.includes("Medium")) return "orange";
    if (feedback.includes("Strong")) return "green";
    return "blue";
}

// ✅ Function to Check If Password is in a Data Breach
async function checkPwnedPassword(password) {
    let hashedPassword = await sha1(password);
    let prefix = hashedPassword.substring(0, 5);
    let suffix = hashedPassword.substring(5);
    let response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    return response.text().then(data => data.includes(suffix));
}

// ✅ Function to Generate SHA-1 Hash
async function sha1(str) {
    const buffer = new TextEncoder("utf-8").encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ✅ Function to Toggle Password Visibility
function togglePassword() {
    let input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
}

// ✅ Function to Generate a Secure Password
function generatePassword() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    document.getElementById("password").value = Array(12).fill(chars).map(x => x[Math.floor(Math.random() * x.length)]).join('');
}
