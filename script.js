function analyzePassword() {
    let password = document.getElementById("password").value;
    let criteriaList = document.getElementById("criteria-list");
    let scoreElement = document.getElementById("score");
    let entropyElement = document.getElementById("entropy");
    let resultSection = document.getElementById("result");

    let criteria = {
        length: { pattern: /.{8,}/, description: "At least 8 characters" },
        uppercase: { pattern: /[A-Z]/, description: "Contains uppercase letter" },
        lowercase: { pattern: /[a-z]/, description: "Contains lowercase letter" },
        number: { pattern: /\d/, description: "Contains number" },
        special: { pattern: /[!@#$%^&*(),.?":{}|<>]/, description: "Contains special character" }
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

    let score = passedCriteria * 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    scoreElement.innerText = `${score}%`;
    entropyElement.innerText = password.length * passedCriteria;
    resultSection.style.display = "block";
}

function generatePassword() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = Array(12).fill(chars).map(x => x[Math.floor(Math.random() * x.length)]).join('');
    document.getElementById("password").value = password;
}

function togglePassword() {
    let passwordInput = document.getElementById("password");
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}




