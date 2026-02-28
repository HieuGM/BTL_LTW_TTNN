// ===== LOAD LAYOUT =====
function loadLayout(callback) {

    fetch("layout.html")
        .then(res => res.text())
        .then(data => {

            document.getElementById("layout-container").innerHTML = data;

            initLayout();

            if (callback) callback();
        });
}


// ===== INIT LAYOUT =====
function initLayout() {

    highlightActiveNav();
    initUserInfo();
    initLogoutModal();
    updateNotificationBadge()
}


// ===== ACTIVE NAV =====
function highlightActiveNav() {

    const currentPage =
        window.location.pathname.split("/").pop();

    document.querySelectorAll(".sidebar-nav a")
        .forEach(link => {

            const linkPage =
                link.getAttribute("href");

            if (linkPage === currentPage) {
                link.classList.add("active");
            }
        });
}


// ===== USER INFO =====
function initUserInfo() {

    if (typeof student !== "undefined") {

        const topUsername =
            document.getElementById("topUsername");

        if (topUsername) {
            topUsername.innerText = student.name;
        }
    }
}


// ===== LOGOUT MODAL =====
function initLogoutModal() {

    const logoutBtn = document.getElementById("logoutBtn");
    const modal = document.getElementById("logoutModal");
    const cancelBtn = document.getElementById("cancelLogout");
    const confirmBtn = document.getElementById("confirmLogout");

    if (!logoutBtn || !modal) {
        console.error("Logout modal chưa tồn tại trong trang!");
        return;
    }

    // Mở modal
    logoutBtn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        modal.classList.add("active");
    });

    // Huỷ
    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            modal.classList.remove("active");
        });
    }

    // Click nền mờ
    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // Xác nhận logout
    if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
            localStorage.removeItem("currentUser");
            window.location.href = "../Auth/Home.html";
        });
    }
}

function updateNotificationBadge() {

    const badge = document.getElementById("notificationBadge");
    if (!badge) return;

    if (typeof notifications === "undefined") {
        badge.innerText = "";
        return;
    }

    const unread = notifications.filter(n => !n.read).length;

    if (unread > 0) {
        badge.innerText = unread;
        badge.style.display = "inline-block";
    } else {
        badge.innerText = "";
        badge.style.display = "none";
    }
}

