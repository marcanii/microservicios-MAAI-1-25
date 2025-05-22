// API Base URLs - Todo pasa por Nginx en puerto 3000
const API_BASE = "http://localhost:3000";
const API_ENDPOINTS = {
    auth: `${API_BASE}/api/auth`,
    eventos: `${API_BASE}/api/eventos`,
    pagos: `${API_BASE}/api/pagos`,
    notificaciones: `${API_BASE}/api/notificaciones`,
};

// Estado global
let currentUser = null;
let authToken = null;
let selectedEvent = null;
let editingEvent = null;

// Elementos del DOM
const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");
const closeModal = document.querySelector(".close");
const eventsContainer = document.getElementById("events-container");
const purchaseSection = document.getElementById("purchase-section");
const purchaseForm = document.getElementById("purchase-form");
const cancelPurchaseBtn = document.getElementById("cancel-purchase");
const notificationsContainer = document.getElementById(
    "notifications-container"
);
const misComprasContainer = document.getElementById("mis-compras-container");
const userInfo = document.getElementById("user-info");
const authSection = document.getElementById("auth-section");
const nameGroup = document.getElementById("name-group");
const roleGroup = document.getElementById("role-group");

// Elementos para CRUD de eventos
const eventModal = document.getElementById("event-modal");
const eventForm = document.getElementById("event-form");
const eventModalTitle = document.getElementById("event-modal-title");
const addEventBtn = document.getElementById("add-event-btn");
const closeEventModal = document.getElementById("close-event-modal");
const cancelEventBtn = document.getElementById("cancel-event");

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM Content Loaded - Starting app initialization");
    initApp();
    setupEventListeners();
});

// También escuchar el evento de visibilidad para revalidar cuando la página vuelve a estar visible
document.addEventListener("visibilitychange", function () {
    if (!document.hidden && authToken) {
        console.log("Page became visible, revalidating token");
        validateToken().then((isValid) => {
            if (!isValid) {
                clearStoredAuth();
                showNotification(
                    "Sesión expirada, por favor inicia sesión nuevamente",
                    "error"
                );
            }
        });
    }
});

// Escuchar cambios en localStorage desde otras pestañas
window.addEventListener("storage", function (e) {
    if (e.key === "authToken" || e.key === "currentUser") {
        console.log("Auth data changed in another tab, refreshing...");
        initApp();
    }
});

function setupEventListeners() {
    loginBtn.addEventListener("click", () => showAuthModal("login"));
    registerBtn.addEventListener("click", () => showAuthModal("register"));
    logoutBtn.addEventListener("click", logout);
    closeModal.addEventListener("click", hideAuthModal);
    authForm.addEventListener("submit", handleAuth);
    purchaseForm.addEventListener("submit", handlePurchase);
    cancelPurchaseBtn.addEventListener("click", hidePurchaseSection);

    // Event listeners para CRUD de eventos
    addEventBtn.addEventListener("click", () => showEventModal());
    closeEventModal.addEventListener("click", hideEventModal);
    cancelEventBtn.addEventListener("click", hideEventModal);
    eventForm.addEventListener("submit", handleEventSubmit);

    // Cerrar modales al hacer click fuera
    window.addEventListener("click", function (event) {
        if (event.target === authModal) {
            hideAuthModal();
        }
        if (event.target === eventModal) {
            hideEventModal();
        }
    });
}

// Funciones para manejo seguro de localStorage
function saveAuthData(token, user) {
    try {
        localStorage.setItem("authToken", token);
        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("authTimestamp", Date.now().toString());
        console.log("Auth data saved successfully");
    } catch (error) {
        console.error("Error saving auth data:", error);
    }
}

function getStoredAuthData() {
    try {
        const token = localStorage.getItem("authToken");
        const userStr = localStorage.getItem("currentUser");
        const timestamp = localStorage.getItem("authTimestamp");

        if (!token || !userStr) {
            console.log("No stored auth data found");
            return null;
        }

        // Verificar si los datos no son muy antiguos (24 horas)
        if (timestamp) {
            const age = Date.now() - parseInt(timestamp);
            const maxAge = 24 * 60 * 60 * 1000; // 24 horas
            if (age > maxAge) {
                console.log("Stored auth data is too old, clearing...");
                clearStoredAuth();
                return null;
            }
        }

        const user = JSON.parse(userStr);
        console.log("Retrieved stored auth data:", {
            token: token.substring(0, 20) + "...",
            user: user.email,
        });
        return { token, user };
    } catch (error) {
        console.error("Error retrieving stored auth data:", error);
        clearStoredAuth();
        return null;
    }
}

async function initApp() {
    console.log("Initializing app...");

    // Recuperar datos de autenticación almacenados
    const storedAuth = getStoredAuthData();

    if (storedAuth) {
        authToken = storedAuth.token;
        currentUser = storedAuth.user;

        console.log("Found stored auth, validating token...");

        // Validar token con el servidor
        const isValid = await validateToken();
        if (isValid) {
            console.log("Token is valid, updating UI");
            updateAuthUI();
        } else {
            console.log("Token is invalid, clearing auth");
            clearStoredAuth();
        }
    } else {
        console.log("No valid stored auth found");
    }

    await loadEvents();
    await loadNotifications();
    await loadMisCompras();
}

async function validateToken() {
    if (!authToken) {
        console.log("No token to validate");
        return false;
    }

    try {
        console.log("Validating token with server...");
        const response = await fetch(`${API_ENDPOINTS.auth}/me`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Token validation response status:", response.status);

        if (response.ok) {
            const userData = await response.json();
            console.log(
                "Token is valid, user data received:",
                userData.email || userData.nombre
            );

            // Actualizar datos del usuario si han cambiado
            if (JSON.stringify(currentUser) !== JSON.stringify(userData)) {
                currentUser = userData;
                saveAuthData(authToken, currentUser);
            }
            return true;
        } else {
            console.log("Token validation failed:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Error validating token:", error);
        return false;
    }
}

function clearStoredAuth() {
    console.log("Clearing stored auth data");
    authToken = null;
    currentUser = null;
    try {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authTimestamp");
    } catch (error) {
        console.error("Error clearing localStorage:", error);
    }
    updateAuthUI();
}

// Funciones de Autenticación
function showAuthModal(type) {
    if (type === "login") {
        authTitle.textContent = "Iniciar Sesión";
        nameGroup.style.display = "none";
        roleGroup.style.display = "none";
    } else {
        authTitle.textContent = "Registrarse";
        nameGroup.style.display = "block";
        roleGroup.style.display = "block";
    }
    authModal.style.display = "flex";
}

function hideAuthModal() {
    authModal.style.display = "none";
    authForm.reset();
}

async function handleAuth(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const contrasena = document.getElementById("password").value;
    const nombre = document.getElementById("name").value;
    const rol = document.getElementById("role").value;

    const isLogin = authTitle.textContent === "Iniciar Sesión";
    const endpoint = isLogin ? "/login" : "/register";

    const data = { email, contrasena };
    if (!isLogin) {
        data.nombre = nombre;
        data.rol = rol;
    }

    console.log(`Attempting ${isLogin ? "login" : "register"} for:`, email);

    try {
        const response = await fetch(`${API_ENDPOINTS.auth}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        console.log("Auth response status:", response.status);

        if (response.ok) {
            const result = await response.json();
            console.log("Auth successful:", result);

            // Extraer token y datos de usuario según la respuesta del servidor
            authToken = result.access_token || result.token || result.authToken;
            currentUser = result.user || result.usuario || result;

            // Si el usuario viene dentro del resultado, extraerlo
            if (!currentUser.email && result.user) {
                currentUser = result.user;
            }

            console.log("Extracted auth data:", {
                hasToken: !!authToken,
                userEmail: currentUser.email || currentUser.nombre,
            });

            if (authToken && currentUser) {
                // Guardar en localStorage de forma segura
                saveAuthData(authToken, currentUser);

                updateAuthUI();
                hideAuthModal();
                showNotification("Autenticación exitosa", "success");
                await loadEvents();
                await loadNotifications();
                await loadMisCompras();
            } else {
                console.error("Missing token or user data in response");
                showNotification("Error: Datos de autenticación incompletos", "error");
            }
        } else {
            const error = await response.json();
            console.log("Auth error:", error);
            showNotification(
                error.mensaje ||
                error.message ||
                error.error ||
                "Error en la autenticación",
                "error"
            );
        }
    } catch (error) {
        console.error("Network error during auth:", error);
        showNotification("Error de conexión", "error");
    }
}

function logout() {
    clearStoredAuth();
    hidePurchaseSection();
    hideEventModal();
    showNotification("Sesión cerrada", "success");
    // Recargar eventos para mostrar vista pública
    loadEvents();
    loadNotifications();
    loadMisCompras();
}

function updateAuthUI() {
    console.log("Updating auth UI:", {
        hasUser: !!currentUser,
        hasToken: !!authToken,
        userEmail: currentUser?.email || currentUser?.nombre || "N/A",
    });

    if (currentUser && authToken) {
        authSection.style.display = "none";
        userInfo.style.display = "block";

        const usernameElement = document.getElementById("username");
        const userRoleElement = document.getElementById("user-role");

        if (usernameElement) {
            usernameElement.textContent =
                currentUser.nombre || currentUser.email || "Usuario";
        }

        if (userRoleElement) {
            userRoleElement.textContent =
                currentUser.rol || currentUser.role || "user";
        }

        // Mostrar botón de agregar evento solo para admins
        if (isAdmin()) {
            addEventBtn.style.display = "inline-block";
        } else {
            addEventBtn.style.display = "none";
        }

        console.log("Auth UI updated for authenticated user");
    } else {
        authSection.style.display = "block";
        userInfo.style.display = "none";
        addEventBtn.style.display = "none";
        console.log("Auth UI updated for anonymous user");
    }
}

function isAdmin() {
    return (
        currentUser && (currentUser.rol === "admin" || currentUser.role === "admin")
    );
}

// Funciones de CRUD de Eventos
function showEventModal(event = null) {
    editingEvent = event;

    if (event) {
        eventModalTitle.textContent = "Editar Evento";
        document.getElementById("event-name").value =
            event.nombre || event.title || "";
        document.getElementById("event-date").value = formatDateForInput(
            event.fecha || event.date
        );
        document.getElementById("event-location").value =
            event.lugar || event.location || "";
        document.getElementById("event-capacity").value =
            event.capacidad || event.capacity || "";
        document.getElementById("event-price").value =
            event.precio || event.price || "";
    } else {
        eventModalTitle.textContent = "Crear Evento";
        eventForm.reset();
    }

    eventModal.style.display = "flex";
}

function hideEventModal() {
    eventModal.style.display = "none";
    eventForm.reset();
    editingEvent = null;
}

async function handleEventSubmit(e) {
    e.preventDefault();

    const eventData = {
        nombre: document.getElementById("event-name").value,
        fecha: document.getElementById("event-date").value,
        lugar: document.getElementById("event-location").value,
        capacidad: parseInt(document.getElementById("event-capacity").value),
        precio: parseFloat(document.getElementById("event-price").value),
    };

    try {
        let response;
        if (editingEvent) {
            // Actualizar evento
            response = await fetch(`${API_ENDPOINTS.eventos}/${editingEvent.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(eventData),
            });
        } else {
            // Crear nuevo evento
            response = await fetch(`${API_ENDPOINTS.eventos}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify(eventData),
            });
        }

        if (response.ok) {
            showNotification(
                editingEvent
                    ? "Evento actualizado exitosamente"
                    : "Evento creado exitosamente",
                "success"
            );
            hideEventModal();
            await loadEvents();
        } else {
            const error = await response.json();
            showNotification(
                error.mensaje || error.message || "Error al guardar evento",
                "error"
            );
        }
    } catch (error) {
        showNotification("Error de conexión", "error");
        console.error("Error:", error);
    }
}

async function deleteEvent(eventId, eventName) {
    if (
        !confirm(`¿Estás seguro de que quieres eliminar el evento "${eventName}"?`)
    ) {
        return;
    }

    try {
        const response = await fetch(`${API_ENDPOINTS.eventos}/${eventId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.ok) {
            showNotification("Evento eliminado exitosamente", "success");
            await loadEvents();
        } else {
            const error = await response.json();
            showNotification(
                error.mensaje || error.message || "Error al eliminar evento",
                "error"
            );
        }
    } catch (error) {
        showNotification("Error de conexión", "error");
        console.error("Error:", error);
    }
}

// Funciones de Eventos
async function loadEvents() {
    eventsContainer.innerHTML = '<div class="loading">Cargando eventos...</div>';

    try {
        const response = await fetch(`${API_ENDPOINTS.eventos}`);

        if (response.ok) {
            const events = await response.json();
            displayEvents(events);
        } else {
            eventsContainer.innerHTML = "<p>Error al cargar eventos</p>";
        }
    } catch (error) {
        eventsContainer.innerHTML = "<p>Error de conexión</p>";
        console.error("Error:", error);
    }
}

function displayEvents(events) {
    if (events.length === 0) {
        eventsContainer.innerHTML = "<p>No hay eventos disponibles</p>";
        return;
    }

    eventsContainer.innerHTML = events
        .map((event) => {
            const adminButtons = isAdmin()
                ? `
            <button class="btn secondary" onclick="showEventModal(${JSON.stringify(
                    event
                ).replace(/"/g, "&quot;")})">
                Editar
            </button>
            <button class="btn danger" onclick="deleteEvent(${event.id}, '${event.nombre || event.title
                }')">
                Eliminar
            </button>
        `
                : "";

            return `
            <div class="event-card">
                <h3>${event.nombre || event.title}</h3>
                <p><strong>Fecha:</strong> ${formatDate(
                event.fecha || event.date
            )}</p>
                <p><strong>Lugar:</strong> ${event.lugar || event.location}</p>
                <p><strong>Capacidad:</strong> ${event.capacidad || event.capacity
                }</p>
                <p class="price">${event.precio || event.price} BOB</p>
                <div class="event-actions">
                    <button class="btn primary" onclick="selectEvent(${event.id
                }, '${event.nombre || event.title}', ${event.precio || event.price
                })">
                        Comprar Entrada
                    </button>
                    ${adminButtons}
                </div>
            </div>
        `;
        })
        .join("");
}

function selectEvent(eventId, eventName, eventPrice) {
    if (!authToken) {
        showNotification("Debes iniciar sesión para comprar entradas", "error");
        showAuthModal("login");
        return;
    }

    selectedEvent = { id: eventId, name: eventName, price: eventPrice };
    showPurchaseSection();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
}

// Funciones de Compra
function showPurchaseSection() {
    const purchaseDetails = document.getElementById("purchase-details");
    purchaseDetails.innerHTML = `
        <h3>Detalles de la compra</h3>
        <p><strong>Evento:</strong> ${selectedEvent.name}</p>
        <p><strong>Precio unitario:</strong> ${selectedEvent.price} BOB</p>
    `;

    purchaseSection.style.display = "block";
    purchaseSection.scrollIntoView({ behavior: "smooth" });
}

function hidePurchaseSection() {
    purchaseSection.style.display = "none";
    selectedEvent = null;
    purchaseForm.reset();
}

async function handlePurchase(e) {
    e.preventDefault();

    const cantidad = parseInt(document.getElementById("quantity").value);
    const cardNumber = document.getElementById("card-number").value;
    const expiry = document.getElementById("expiry").value;
    const cvv = document.getElementById("cvv").value;

    // Estructura de datos según lo que espera el backend Ruby
    const purchaseData = {
        id_evento: selectedEvent.id,
        nombre_evento: selectedEvent.name,
        precio_evento: selectedEvent.price,
        cantidad: cantidad,
        id_usuario: currentUser.id,
        nombre_usuario: currentUser.nombre || currentUser.email,
        // Datos de tarjeta (opcional para validación)
        num_tarjeta: cardNumber,
        expiracion: expiry,
        cvv: cvv,
    };

    try {
        const response = await fetch(`${API_ENDPOINTS.pagos}/comprar-entradas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(purchaseData),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Purchase successful:", result);
            showNotification("Compra realizada exitosamente", "success");
            hidePurchaseSection();

            // Enviar notificación
            // await sendNotification({
            //     userId: currentUser.id,
            //     type: 'purchase',
            //     message: `Compra exitosa: ${cantidad} entrada(s) para ${selectedEvent.name}`,
            //     eventId: selectedEvent.id
            // });

            await loadNotifications();
            await loadMisCompras();
        } else {
            const error = await response.json();
            showNotification(
                error.mensaje || error.message || "Error en la compra",
                "error"
            );
        }
    } catch (error) {
        showNotification("Error de conexión en la compra", "error");
        console.error("Error:", error);
    }
}

// Funciones de Notificaciones
async function loadNotifications() {
    if (!authToken) {
        notificationsContainer.innerHTML =
            "<p>Inicia sesión para ver tus notificaciones</p>";
        return;
    }

    notificationsContainer.innerHTML =
        '<div class="loading">Cargando notificaciones...</div>';

    try {
        const response = await fetch(
            `${API_ENDPOINTS.notificaciones}/notificaciones`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        if (response.ok) {
            const notifications = await response.json();
            displayNotifications(notifications);
        } else {
            notificationsContainer.innerHTML =
                "<p>Error al cargar notificaciones</p>";
        }
    } catch (error) {
        notificationsContainer.innerHTML = "<p>Error de conexión</p>";
        console.error("Error:", error);
    }
}

async function loadMisCompras() {
    if (!authToken) {
        misComprasContainer.innerHTML = "<p>Inicia sesión para ver tus compras</p>";
        return;
    }
    misComprasContainer.innerHTML =
        '<div class="loading">Cargando compras...</div>';
    try {
        const response = await fetch(
            `${API_ENDPOINTS.pagos}/compras-usuario/${currentUser.id}`
        );
        if (response.ok) {
            const purchases = await response.json();
            displayMisCompras(purchases);
        } else {
            misComprasContainer.innerHTML = "<p>Error al cargar compras</p>";
        }
    } catch (error) {
        misComprasContainer.innerHTML = "<p>Error de conexión</p>";
        console.error("Error:", error);
    }
}

function displayNotifications(notifications) {
    if (notifications.length === 0) {
        notificationsContainer.innerHTML = "<p>No tienes notificaciones</p>";
        return;
    }

    notificationsContainer.innerHTML = notifications
        .map(
            (notification) => `
        <div class="notification ${notification.type || "info"}">
            <p><strong>${notification.title || "Notificación"}</strong></p>
            <p>${notification.message}</p>
            <small>${formatDate(
                notification.createdAt || notification.fecha
            )}</small>
        </div>
    `
        )
        .join("");
}

function displayMisCompras(purchases) {
    if (purchases.length === 0) {
        misComprasContainer.innerHTML = "<p>No tienes compras registradas</p>";
        return;
    }

    misComprasContainer.innerHTML = purchases
        .map(
            (purchase) => `
    <div class="purchase">
        <h3>${purchase.nombre_evento}</h3>
        <p><strong>Fecha:</strong> ${formatDate(purchase.created_at)}</p>
        <p><strong>Precio unitario:</strong> ${purchase.precio_evento} BOB</p>
        <p><strong>Cantidad:</strong> ${purchase.cantidad}</p>
        <p><strong>Total:</strong> ${purchase.total} BOB</p>
        <p><strong>Estado:</strong> <span class="status ${purchase.pagado ? "paid" : "pending"
                }">${purchase.pagado ? "Pagado" : "Pendiente"}</span></p>
    </div>
`
        )
        .join("");
}

async function sendNotification(notificationData) {
    try {
        await fetch(`${API_ENDPOINTS.notificaciones}/enviar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(notificationData),
        });
    } catch (error) {
        console.error("Error sending notification:", error);
    }
}

// Funciones de Utilidad
function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `<p>${message}</p>`;

    // Agregar al contenedor de notificaciones temporalmente
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.top = "20px";
    tempContainer.style.right = "20px";
    tempContainer.style.zIndex = "9999";
    tempContainer.appendChild(notification);

    document.body.appendChild(tempContainer);

    // Remover después de 3 segundos
    setTimeout(() => {
        if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
        }
    }, 3000);
}
