// API Base URLs - Todo pasa por Nginx en puerto 3000
const API_BASE = 'http://localhost:3000'; 
const API_ENDPOINTS = {
    auth: `${API_BASE}/api/auth`,
    eventos: `${API_BASE}/api/eventos`,
    pagos: `${API_BASE}/api/pagos`,
    notificaciones: `${API_BASE}/api/notificaciones`
};

// Estado global
let currentUser = null;
let authToken = null;
let selectedEvent = null;

// Elementos del DOM
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const closeModal = document.querySelector('.close');
const eventsContainer = document.getElementById('events-container');
const purchaseSection = document.getElementById('purchase-section');
const purchaseForm = document.getElementById('purchase-form');
const cancelPurchaseBtn = document.getElementById('cancel-purchase');
const notificationsContainer = document.getElementById('notifications-container');
const userInfo = document.getElementById('user-info');
const authSection = document.getElementById('auth-section');
const nameGroup = document.getElementById('name-group');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    setupEventListeners();
});

function setupEventListeners() {
    loginBtn.addEventListener('click', () => showAuthModal('login'));
    registerBtn.addEventListener('click', () => showAuthModal('register'));
    logoutBtn.addEventListener('click', logout);
    closeModal.addEventListener('click', hideAuthModal);
    authForm.addEventListener('submit', handleAuth);
    purchaseForm.addEventListener('submit', handlePurchase);
    cancelPurchaseBtn.addEventListener('click', hidePurchaseSection);
    
    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            hideAuthModal();
        }
    });
}

async function initApp() {
    // Verificar si hay token guardado
    authToken = localStorage.getItem('authToken');
    if (authToken) {
        await loadUserInfo();
    }
    
    await loadEvents();
    await loadNotifications();
}

// Funciones de Autenticación
function showAuthModal(type) {
    if (type === 'login') {
        authTitle.textContent = 'Iniciar Sesión';
        nameGroup.style.display = 'none';
    } else {
        authTitle.textContent = 'Registrarse';
        nameGroup.style.display = 'block';
    }
    authModal.style.display = 'flex';
}

function hideAuthModal() {
    authModal.style.display = 'none';
    authForm.reset();
}

async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;
    const nombre = document.getElementById('name').value;
    
    const isLogin = authTitle.textContent === 'Iniciar Sesión';
    const endpoint = isLogin ? '/login' : '/register';
    
    const data = { email, contrasena };
    if (!isLogin) data.nombre = nombre;
    
    try {
        const response = await fetch(`${API_ENDPOINTS.auth}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            const result = await response.json();
            authToken = result.access_token;
            currentUser = result.user;
            localStorage.setItem('authToken', authToken);
            
            updateAuthUI();
            hideAuthModal();
            showNotification('Autenticación exitosa', 'success');
            await loadNotifications();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Error en la autenticación', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión', 'error');
        console.error('Error:', error);
    }
}

async function loadUserInfo() {
    try {
        const response = await fetch(`${API_ENDPOINTS.auth}/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            updateAuthUI();
        } else {
            localStorage.removeItem('authToken');
            authToken = null;
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    updateAuthUI();
    hidePurchaseSection();
    showNotification('Sesión cerrada', 'success');
}

function updateAuthUI() {
    if (currentUser && authToken) {
        authSection.style.display = 'none';
        userInfo.style.display = 'block';
        document.getElementById('username').textContent = currentUser.nombre || currentUser.email;
        logoutBtn.style.display = 'block';
    } else {
        authSection.style.display = 'block';
        userInfo.style.display = 'none';
        logoutBtn.style.display = 'none';
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
            eventsContainer.innerHTML = '<p>Error al cargar eventos</p>';
        }
    } catch (error) {
        eventsContainer.innerHTML = '<p>Error de conexión</p>';
        console.error('Error:', error);
    }
}

function displayEvents(events) {
    if (events.length === 0) {
        eventsContainer.innerHTML = '<p>No hay eventos disponibles</p>';
        return;
    }
    
    eventsContainer.innerHTML = events.map(event => `
        <div class="event-card">
            <h3>${event.nombre || event.title}</h3>
            <p><strong>Fecha:</strong> ${formatDate(event.fecha || event.date)}</p>
            <p><strong>Lugar:</strong> ${event.lugar || event.location}</p>
            <p><strong>Capacidad:</strong> ${event.capacidad || event.capacidad}</p>
            <p class="price">${event.precio || event.price}BOB</p>
            <button class="btn primary" onclick="selectEvent(${event.id}, '${event.nombre || event.title}', ${event.precio || event.price})">
                Comprar Entrada
            </button>
        </div>
    `).join('');
}

function selectEvent(eventId, eventName, eventPrice) {
    if (!authToken) {
        showNotification('Debes iniciar sesión para comprar entradas', 'error');
        showAuthModal('login');
        return;
    }
    
    selectedEvent = { id: eventId, name: eventName, price: eventPrice };
    showPurchaseSection();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Funciones de Compra
function showPurchaseSection() {
    const purchaseDetails = document.getElementById('purchase-details');
    purchaseDetails.innerHTML = `
        <h3>Detalles de la compra</h3>
        <p><strong>Evento:</strong> ${selectedEvent.name}</p>
        <p><strong>Precio unitario:</strong> $${selectedEvent.price}</p>
    `;
    
    purchaseSection.style.display = 'block';
    purchaseSection.scrollIntoView({ behavior: 'smooth' });
}

function hidePurchaseSection() {
    purchaseSection.style.display = 'none';
    selectedEvent = null;
    purchaseForm.reset();
}

async function handlePurchase(e) {
    e.preventDefault();
    
    const quantity = parseInt(document.getElementById('quantity').value);
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    
    const purchaseData = {
        eventId: selectedEvent.id,
        quantity: quantity,
        totalAmount: selectedEvent.price * quantity,
        cardNumber: cardNumber,
        expiry: expiry,
        cvv: cvv
    };
    
    try {
        const response = await fetch(`${API_ENDPOINTS.pagos}/comprar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(purchaseData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification('Compra realizada exitosamente', 'success');
            hidePurchaseSection();
            
            // Enviar notificación
            await sendNotification({
                userId: currentUser.id,
                type: 'purchase',
                message: `Compra exitosa: ${quantity} entrada(s) para ${selectedEvent.name}`,
                eventId: selectedEvent.id
            });
            
            await loadNotifications();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Error en la compra', 'error');
        }
    } catch (error) {
        showNotification('Error de conexión en la compra', 'error');
        console.error('Error:', error);
    }
}

// Funciones de Notificaciones
async function loadNotifications() {
    if (!authToken) {
        notificationsContainer.innerHTML = '<p>Inicia sesión para ver tus notificaciones</p>';
        return;
    }
    
    notificationsContainer.innerHTML = '<div class="loading">Cargando notificaciones...</div>';
    
    try {
        const response = await fetch(`${API_ENDPOINTS.notificaciones}/notificaciones`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const notifications = await response.json();
            displayNotifications(notifications);
        } else {
            notificationsContainer.innerHTML = '<p>Error al cargar notificaciones</p>';
        }
    } catch (error) {
        notificationsContainer.innerHTML = '<p>Error de conexión</p>';
        console.error('Error:', error);
    }
}

function displayNotifications(notifications) {
    if (notifications.length === 0) {
        notificationsContainer.innerHTML = '<p>No tienes notificaciones</p>';
        return;
    }
    
    notificationsContainer.innerHTML = notifications.map(notification => `
        <div class="notification ${notification.type || 'info'}">
            <p><strong>${notification.title || 'Notificación'}</strong></p>
            <p>${notification.message}</p>
            <small>${formatDate(notification.createdAt || notification.fecha)}</small>
        </div>
    `).join('');
}

async function sendNotification(notificationData) {
    try {
        await fetch(`${API_ENDPOINTS.notificaciones}/enviar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(notificationData)
        });
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

// Funciones de Utilidad
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `<p>${message}</p>`;
    
    // Agregar al contenedor de notificaciones temporalmente
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.top = '20px';
    tempContainer.style.right = '20px';
    tempContainer.style.zIndex = '9999';
    tempContainer.appendChild(notification);
    
    document.body.appendChild(tempContainer);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        document.body.removeChild(tempContainer);
    }, 3000);
}