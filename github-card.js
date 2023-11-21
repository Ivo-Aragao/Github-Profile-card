document.addEventListener("DOMContentLoaded", function () {
    const usuarioInput = document.getElementById("usuario-github");
    const suggestionsList = document.getElementById("suggestions-list");
    const buscarButton = document.getElementById("buscar-github");
    const githubCard = document.querySelector(".github-card");
    

    usuarioInput.addEventListener("input", function () {
        let searchTerm = usuarioInput.value;

        if (searchTerm.length > 0) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "https://api.github.com/search/users?q=" + searchTerm, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    showSuggestions(data.items);
                } else if (xhr.status !== 200) {
                    console.error("Erro ao obter sugestões de usuários.");
                }
            };

            xhr.send();
        } else {
            hideSuggestions();
        }
    });

    function showSuggestions(users) {
        suggestionsList.innerHTML = "";

        users.forEach(function (user) {
            let listItem = document.createElement("li");
            let userLink = document.createElement("a");
            userLink.href = "#";
            userLink.textContent = user.login;

            listItem.appendChild(userLink);

            listItem.addEventListener("click", function () {
                usuarioInput.value = user.login;
                hideSuggestions();
            });

            suggestionsList.appendChild(listItem);
        });

        document.querySelector(".suggestions-container").style.display = "block";
    }

    function hideSuggestions() {
        document.querySelector(".suggestions-container").style.display = "none";
    }

    buscarButton.addEventListener("click", function () {
        let username = usuarioInput.value;

        if (username !== "") {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "https://api.github.com/users/" + username, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    showGitHubCard(data);
                } else if (xhr.status !== 200) {
                    alert("Usuário não encontrado no GitHub.");
                }
            };

            xhr.send();
        } else {
            alert("Por favor, insira um nome de usuário do GitHub.");
        }
    });

    function showGitHubCard(data) {
        let header = document.querySelector(".github-card .header");
        let avatarImg = document.querySelector(".github-card .avatar img");
        let h1 = document.querySelector(".github-card h1");
        let statusLinks = document.querySelectorAll(".github-card .status li a");
        let avatarLink = document.querySelector(".github-card .avatar");

        header.style.backgroundImage = "url(" + data.avatar_url + ")";
        avatarImg.src = data.avatar_url;
        h1.textContent = data.login;

        statusLinks[0].href = data.html_url + "?tab=repositories";
        statusLinks[1].href = "https://gist.github.com/" + data.login;
        statusLinks[2].href = data.html_url + "?tab=followers";

        avatarLink.href = data.html_url;

        githubCard.style.display = "block";
    }
});
