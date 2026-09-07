fetch("data.txt")
    .then(response => response.text())
    .then(data => {
        const letters = data.trim().split("\n");

        const randomIndex = Math.floor(Math.random() * letters.length);

        console.log(letters[randomIndex]);
    });