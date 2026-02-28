function loadLayout() {
    fetch("layout.html")
        .then(res => res.text())
        .then(data => {
            const temp = document.createElement("div");
            temp.innerHTML = data;

            const header = temp.querySelector("header");
            const footer = temp.querySelector("footer");

            // Thêm header lên đầu body
            document.body.prepend(header);

            // Thêm footer xuống cuối body
            document.body.append(footer);

            initAuthUI();
        });
}

function initAuthUI() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) return;

    document.getElementById("loginBtn")?.classList.add("hidden");
    document.getElementById("registerBtn")?.classList.add("hidden");
    document.getElementById("logoutBtn")?.classList.remove("hidden");

    document.getElementById("logoutBtn")?.addEventListener("click", function(e) {
        e.preventDefault();
        localStorage.removeItem("currentUser");
        location.reload();
    });
}