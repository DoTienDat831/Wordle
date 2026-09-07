console.log("Hello");

let n = 0;
let hidden_word = "";
let words = [];
let attempts = 5;

fetch("data.txt")
    .then(response => response.text())
    .then(data => {
        words = data
            .trim()
            .split(/\r?\n/)
            .map(word => word.trim().toUpperCase())
            .filter(word => word.length > 0);

        startGame();
    });


function startGame() {
    attempts = 5;

    const randomIndex =
        Math.floor(Math.random() * words.length);

    hidden_word = words[randomIndex];
    n = hidden_word.length;

    console.log("Hidden word:", hidden_word);

    document.getElementById("letters_container").innerHTML = "";

    document.getElementById("guessed_word").textContent =
        "Guessed word:";

    document.getElementById("result").textContent = "";

    document.getElementById("final_result").textContent = "";

    document.getElementById("attempts").textContent = "Attempts left: " + attempts;

    createGuessBoxes();
}

document.querySelector("#restart")
    .addEventListener("click", startGame);


function createGuessBoxes() {
    const letters_container =
        document.getElementById("letters_container");

    const row = document.createElement("div");
    row.className = "guess_row";

    for (let i = 0; i < n; i++) {
        const input = document.createElement("input");

        input.type = "text";
        input.placeholder = `Letter: ${i + 1}`;
        input.maxLength = 1;
        input.className = "guess_box";

        // Auto CAPSLOCK
        input.addEventListener("input", function() {
            input.value = input.value.toUpperCase();

            if (input.value.length === 1) {
                row.querySelectorAll("input")[i + 1]?.focus();
            }
        });

        // Backspace returns to previous box
        input.addEventListener("keydown", function(e) {
            if (
                e.key === "Backspace" &&
                input.value === "" &&
                i > 0
            ) {
                row.querySelectorAll("input")[i - 1].focus();
            }
        });
        row.appendChild(input);
    }

    letters_container.appendChild(row);
    // Focus first box
    row.querySelector("input")?.focus();
}

const check = document.querySelector("#check");

// Check button
check.addEventListener("click", submit);
document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        submit();
    }
});

function submit() {
    // Get the last row
    const rows = document.querySelectorAll(".guess_row");
    if (rows.length === 0) {
        return;
    }

    const currentRow = rows[rows.length - 1];

    const guessed_letters =
        [...currentRow.querySelectorAll("input")]
            .map(input => input.value)
            .join("");

    // Check if all letters are entered
    if (guessed_letters.length !== hidden_word.length) {
        document.getElementById("result").textContent =
            "Please enter all letters";
        return;
    }

    checkResult(guessed_letters);

    document.getElementById("guessed_word").textContent =
        "Guessed word: " + guessed_letters;
}


function checkResult(the_guessed_word) {
    console.log("Guessed:", the_guessed_word);
    let checkresult = "";

    for (let i = 0; i < hidden_word.length; i++) {

        if (hidden_word[i] === the_guessed_word[i]) {
            checkresult += "T";
        } else if (hidden_word.includes(the_guessed_word[i])) {
            checkresult += "P";
        } else {
            checkresult += "F";
        }
    }

    document.getElementById("result").textContent =
        checkresult;

    if (checkresult === "T".repeat(hidden_word.length)) {
        console.log("WIN");
        document.getElementById("final_result").textContent =
            "WIN";
    } else {
        document.getElementById("final_result").textContent = "";
        attempts -= 1;
        document.getElementById("attempts").textContent = "Attempts left: " + attempts;
        createGuessBoxes();
    }

    if (attempts === 0) {
        document.getElementById("finalresult").textContent = "YOU LOST";
    }
}
