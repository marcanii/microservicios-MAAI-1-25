// Global variables
let currentUser = null;
let currentTab = "dashboard";
const API_BASE = "";
let currentEditingReservaId = null;

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  checkAuthStatus();
});

// Authentication functions
function checkAuthStatus() {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");

  if (token && userData) {
    currentUser = JSON.parse(userData);
    showMainApp();
  } else {
    showLoginScreen();
  }
}

async function login() {
  const correo = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!correo || !password) {
    showAlert("Por favor, completa todos los campos", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/usuarios/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo, password }),
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(data.datos));
      currentUser = data.datos;
      showMainApp();
      showAlert("¡Bienvenido!", "success");
    } else {
      showAlert(data.message || "Error en el login", "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Login error:", error);
  }
}

async function register() {
  const nombres = document.getElementById("registerNombre").value;
  const apellidos = document.getElementById("registerApellido").value;
  const correo = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const celular = document.getElementById("registerTelefono").value;
  const rol = document.getElementById("registerRol").value;

  if (!nombres || !apellidos || !correo || !password || !celular || !rol) {
    showAlert("Por favor, completa todos los campos", "error");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/usuarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombres,
        apellidos,
        correo,
        password,
        celular,
        rol,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlert("Registro exitoso. Ya puedes iniciar sesión.", "success");
      showLoginForm();
    } else {
      showAlert(data.message || "Error en el registro", "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Register error:", error);
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  currentUser = null;
  showLoginScreen();
  showAlert("Sesión cerrada", "info");
}

// UI Navigation functions
function showLoginScreen() {
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("mainApp").classList.add("hidden");
}

function showMainApp() {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("mainApp").classList.remove("hidden");
  setupNavigation();
  loadDashboard();
}

function showLoginForm() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".nav-tab")[0].classList.add("active");
}

function showRegisterForm() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".nav-tab")[1].classList.add("active");
}

function setupNavigation() {
  const userWelcome = document.getElementById("userWelcome");
  userWelcome.textContent = `${currentUser.correo} (${currentUser.rol})`;

  const navTabs = document.getElementById("mainNavTabs");
  let tabsHTML = `
                <button class="nav-tab active" onclick="switchTab('dashboard')">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </button>
            `;

  if (currentUser.rol === "paciente" || currentUser.rol === "medico") {
    tabsHTML += `
                    <button class="nav-tab" onclick="switchTab('reservas')">
                        <i class="fas fa-calendar-alt"></i> ${currentUser.rol === "paciente"
        ? "Mis Citas"
        : "Citas de Pacientes"
      }
                    </button>
                `;
  }

  if (currentUser.rol === "admin") {
    tabsHTML += `
                    <button class="nav-tab" onclick="switchTab('especialidades')">
                        <i class="fas fa-stethoscope"></i> Especialidades
                    </button>
                `;
  }

  if (currentUser.rol === "medico") {
    tabsHTML += `
                    <button class="nav-tab" onclick="switchTab('agenda')">
                        <i class="fas fa-calendar-week"></i> Mi Agenda
                    </button>
                `;
  }

  tabsHTML += `
                <button class="nav-tab" onclick="switchTab('notificaciones')">
                    <i class="fas fa-bell"></i> Notificaciones
                </button>
            `;

  navTabs.innerHTML = tabsHTML;
}

function switchTab(tabName) {
  // Hide all tabs
  document
    .querySelectorAll(".tab-content")
    .forEach((tab) => tab.classList.add("hidden"));
  document
    .querySelectorAll(".nav-tab")
    .forEach((tab) => tab.classList.remove("active"));

  // Show selected tab
  document.getElementById(tabName + "Tab").classList.remove("hidden");
  event.target.classList.add("active");

  currentTab = tabName;

  // Load tab content
  switch (tabName) {
    case "dashboard":
      loadDashboard();
      break;
    case "reservas":
      loadReservas();
      break;
    case "especialidades":
      loadEspecialidades();
      break;
    case "agenda":
      loadAgenda();
      break;
    case "notificaciones":
      loadNotificaciones();
      break;
  }
}

// Dashboard functions
async function loadDashboard() {
  const dashboardContent = document.getElementById("dashboardContent");

  let content = `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
            `;

  try {
    if (currentUser.rol === "paciente") {
      const reservas = await fetchWithAuth(
        "/api/reservas?usuario_id=" + currentUser.id
      );
      content += `
                        <div class="card" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
                            <h3><i class="fas fa-calendar-check"></i> Mis Citas</h3>
                            <p style="font-size: 2rem; margin: 10px 0;">${reservas.length}</p>
                            <small>Citas programadas</small>
                        </div>
                    `;
    } else if (currentUser.rol === "medico") {
      const citasHoy = await fetchWithAuth(
        "/api/reservas?medico_id=" + currentUser.id
      );
      content += `
                        <div class="card" style="background: linear-gradient(135deg, #28a745, #20c997); color: white;">
                            <h3><i class="fas fa-user-md"></i> Citas Hoy</h3>
                            <p style="font-size: 2rem; margin: 10px 0;">${citasHoy.length}</p>
                            <small>Pacientes programados</small>
                        </div>
                    `;
    } else if (currentUser.rol === "admin") {
      const response = await fetch(`${API_BASE}/api/especialidades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          query: `
        query {
          especialidades {
            id
            nombre
          }
        }
      `,
        }),
      });

      const result = await response.json();
      const especialidades = result.data?.especialidades || [];
      content += `
    <div class="card" style="background: linear-gradient(135deg, #ffc107, #fd7e14); color: white;">
        <h3><i class="fas fa-stethoscope"></i> Especialidades</h3>
        <p style="font-size: 2rem; margin: 10px 0;">${especialidades.length}</p>
        <small>Especialidades registradas</small>
    </div>
  `;
      // Aquí deberías usar content en algún lugar del DOM, por ejemplo:
      // document.getElementById("dashboardCards").innerHTML += content;
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }

  content += `</div>`;
  dashboardContent.innerHTML = content;
}

// Reservas functions
async function loadReservas() {
  try {
    const endpoint =
      currentUser.rol === "paciente"
        ? "/api/reservas?usuario_id=" + currentUser.id
        : "/api/reservas?medico_id=" + currentUser.id;
    const reservas = await fetchWithAuth(endpoint);
    displayReservas(reservas);
    await loadEspecialidadesForReserva();
    await loadPacientes();
    await loadMedicos();
    hideNewReservaForm();
  } catch (error) {
    showAlert("Error cargando reservas", "error");
    console.error("Error loading reservas:", error);
  }
}

async function displayReservas(reservas) {
  const reservasList = document.getElementById("reservasList");
  if (reservas.length === 0) {
    reservasList.innerHTML = "<p>No hay citas programadas.</p>";
    return;
  }
  let html = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora Inicio</th>
                            <th>Hora Fin</th>
                            ${currentUser.rol === "paciente"
      ? "<th>Médico</th>"
      : "<th>Paciente</th>"
    }
                            <th>Especialidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
  for (const reserva of reservas) {
    const nombre =
      currentUser.rol === "paciente"
        ? await getNombreUsuarioById(reserva.medico_id)
        : await getNombreUsuarioById(reserva.paciente_id);
    const nombreEspecialidad = await getNombreEspecialidadById(reserva.especialidad_id);
    html += `
    <tr>
      <td>${new Date(reserva.fecha).toLocaleDateString()}</td>
      <td>${reserva.hora_inicio}</td>
      <td>${reserva.hora_fin}</td>
      <td>${nombre}</td>
      <td>${nombreEspecialidad}</td>
      <td>
        <button class="btn btn-primary" onclick='editarReserva(${JSON.stringify(reserva)})'>
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-danger" onclick="cancelarReserva(${reserva.id})">
          <i class="fas fa-trash"></i> Cancelar
        </button>
      </td>
    </tr>
  `;
  }
  html += `</tbody></table>`;
  reservasList.innerHTML = html;
}

async function getNombreUsuarioById(id) {
  try {
    const response = await fetchWithAuth(`/api/usuarios/${id}`);
    if (response.transaccion && response.datos) {
      return `${response.datos.nombres} ${response.datos.apellidos}`;
    } else {
      return "Usuario no encontrado";
    }
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return "Error al obtener usuario";
  }
}

async function getNombreEspecialidadById(especialidadId) {
  try {
    const query = `
      query {
        especialidadById(especialidadId: "${especialidadId}") {
          nombre
        }
      }
    `;
    const response = await fetch(`${API_BASE}/api/especialidades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Incluye autorización si es necesario
        // "Authorization": `Bearer ${tuToken}`
      },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    if (result.data && result.data.especialidadById) {
      return result.data.especialidadById.nombre;
    } else {
      return "Especialidad no encontrada";
    }
  } catch (error) {
    console.error("Error al obtener especialidad:", error);
    return "Error al obtener especialidad";
  }
}

async function loadEspecialidadesForReserva() {
  try {
    const response = await fetch(`${API_BASE}/api/especialidades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        query: `
        query {
          especialidades {
            id
            nombre
          }
        }
      `,
      }),
    });

    const result = await response.json();
    const especialidades = result.data?.especialidades || [];
    const select = document.getElementById("reservaEspecialidad");
    select.innerHTML = '<option value="">Seleccionar especialidad...</option>';

    especialidades.forEach((esp) => {
      select.innerHTML += `<option value="${esp.id}">${esp.nombre}</option>`;
    });
  } catch (error) {
    console.error("Error loading especialidades:", error);
  }
}

// Función para cargar pacientes (solo para médicos)
async function loadPacientes() {
  if (currentUser.rol === "paciente") {
    document.getElementById("pacienteSelectGroup").style.display = "none";
    return;
  }
  try {
    const response = await fetchWithAuth(`/api/usuarios/by-role/paciente`);
    const pacienteSelect = document.getElementById("reservaPaciente");
    pacienteSelect.innerHTML =
      '<option value="">Seleccionar paciente...</option>';

    if (response.transaccion && response.datos) {
      response.datos.forEach((paciente) => {
        pacienteSelect.innerHTML += `<option value="${paciente.id}">${paciente.nombres} ${paciente.apellidos}</option>`;
      });
    }
  } catch (error) {
    console.error("Error loading pacientes:", error);
  }
}

async function loadMedicos() {
  if (currentUser.rol === "medico") {
    document.getElementById("medicoSelectGroup").style.display = "none";
    return;
  }
  const medicoSelect = document.getElementById("reservaMedico");

  try {
    const response = await fetchWithAuth(`/api/usuarios/by-role/medico`);
    console.log("Medicos response:", response);
    medicoSelect.innerHTML = '<option value="">Seleccionar médico...</option>';
    const medicos = response.datos || [];
    medicos.forEach((medico) => {
      medicoSelect.innerHTML += `<option value="${medico.id}">${medico.nombres} ${medico.apellidos}</option>`;
    });
  } catch (error) {
    console.error("Error loading medicos:", error);
    showAlert("Error cargando médicos", "error");
  }
}

function initializeReservaForm() {
  const currentUser = getCurrentUser();
  const medicoSelectGroup = document.getElementById("medicoSelectGroup");

  if (currentUser && currentUser.rol === "medico") {
    // Si es médico, ocultar el select de médicos
    medicoSelectGroup.style.display = "none";
  } else {
    // Si es paciente, mostrar el select de médicos
    medicoSelectGroup.style.display = "block";
  }
}

async function createReserva() {
  const especialidadId = document.getElementById("reservaEspecialidad").value;
  const fecha = document.getElementById("reservaFecha").value;
  const hora = document.getElementById("reservaHora").value;
  let medicoId;
  let pacienteId;
  // Determinar medico_id y paciente_id según el rol
  if (currentUser.rol === "medico") {
    medicoId = currentUser.id; // Sacar del usuario actual
    pacienteId = document.getElementById("reservaPaciente").value;
  } else {
    medicoId = document.getElementById("reservaMedico").value;
    pacienteId = currentUser.id; // Sacar del usuario actual
  }
  // Validaciones
  if (!especialidadId || !fecha || !hora) {
    showAlert("Por favor, completa todos los campos obligatorios", "error");
    return;
  }
  if (currentUser.rol === "medico" && !pacienteId) {
    showAlert("Por favor, selecciona un paciente", "error");
    return;
  }
  if (currentUser.rol === "paciente" && !medicoId) {
    showAlert("Por favor, selecciona un médico", "error");
    return;
  }

  try {
    const response = await fetchWithAuth("/api/reservas", {
      method: "POST",
      body: JSON.stringify({
        paciente_id: pacienteId,
        medico_id: medicoId,
        especialidad_id: especialidadId,
        rol: currentUser.rol,
        fecha,
        hora: hora,
      }),
    });
    console.log("Create reserva response:", response);
    if (response?.message) {
      showAlert("Cita creada exitosamente", "success");
      hideNewReservaForm();
      loadReservas();
    } else {
      showAlert(response.error || "Error creando la cita", "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Error creating reserva:", error);
  }
}

function editarReserva(reserva) {
  currentEditingReservaId = reserva.id;
  // Cargar los datos en el formulario
  document.getElementById("reservaEspecialidad").value = reserva.especialidad_id;
  document.getElementById("reservaFecha").value = reserva.fecha;
  document.getElementById("reservaHora").value = reserva.hora_inicio; // o reserva.hora si solo tienes un campo
  // Configurar visibilidad según el rol del usuario
  if (currentUser.rol === "medico") {
    document.getElementById("reservaPaciente").value = reserva.paciente_id;
    document.getElementById("pacienteSelectGroup").style.display = 'block';
    document.getElementById("medicoSelectGroup").style.display = 'none';
  } else {
    document.getElementById("reservaMedico").value = reserva.medico_id;
    document.getElementById("pacienteSelectGroup").style.display = 'none';
    document.getElementById("medicoSelectGroup").style.display = 'block';
  }

  // Cambiar el título y botón
  document.querySelector("#newReservaForm h2").innerHTML = '<i class="fas fa-calendar-edit"></i> Editar Cita';
  document.querySelector("#newReservaForm .btn-success").innerHTML = '<i class="fas fa-save"></i> Actualizar Cita';
  document.querySelector("#newReservaForm .btn-success").setAttribute('onclick', 'actualizarReserva()');

  // Mostrar el formulario
  document.getElementById("newReservaForm").classList.remove("hidden");
}

async function actualizarReserva() {
  if (!currentEditingReservaId) {
    showAlert("Error: No se ha seleccionado una reserva para editar", "error");
    return;
  }
  const especialidadId = document.getElementById("reservaEspecialidad").value;
  const fecha = document.getElementById("reservaFecha").value;
  const hora = document.getElementById("reservaHora").value;
  let medicoId;
  let pacienteId;
  // Determinar medico_id y paciente_id según el rol
  if (currentUser.rol === "medico") {
    medicoId = currentUser.id; // Sacar del usuario actual
    pacienteId = document.getElementById("reservaPaciente").value;
  } else {
    medicoId = document.getElementById("reservaMedico").value;
    pacienteId = currentUser.id; // Sacar del usuario actual
  }
  // Validaciones
  if (!especialidadId || !fecha || !hora) {
    showAlert("Por favor, completa todos los campos obligatorios", "error");
    return;
  }
  if (currentUser.rol === "medico" && !pacienteId) {
    showAlert("Por favor, selecciona un paciente", "error");
    return;
  }
  if (currentUser.rol === "paciente" && !medicoId) {
    showAlert("Por favor, selecciona un médico", "error");
    return;
  }
  try {
    const response = await fetchWithAuth(`/api/reservas/${currentEditingReservaId}`, {
      method: "PATCH",
      body: JSON.stringify({
        paciente_id: pacienteId,
        medico_id: medicoId,
        especialidad_id: especialidadId,
        rol: currentUser.rol,
        fecha,
        hora: hora,
      }),
    });
    if (response?.message) {
      showAlert("Cita actualizada exitosamente", "success");
      hideNewReservaForm();
      loadReservas();
      resetFormToCreate(); // Resetear el formulario al modo crear
    } else {
      showAlert(response.error || "Error actualizando la cita", "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Error updating reserva:", error);
  }
}

function resetFormToCreate() {
  currentEditingReservaId = null;

  // Cambiar el título y botón de vuelta
  document.querySelector("#newReservaForm h2").innerHTML = '<i class="fas fa-calendar-plus"></i> Nueva Cita';
  document.querySelector("#newReservaForm .btn-success").innerHTML = '<i class="fas fa-save"></i> Crear Cita';
  document.querySelector("#newReservaForm .btn-success").setAttribute('onclick', 'createReserva()');

  // Limpiar el formulario
  document.getElementById("reservaEspecialidad").value = "";
  document.getElementById("reservaFecha").value = "";
  document.getElementById("reservaHora").value = "";

  if (currentUser.rol === "medico") {
    document.getElementById("reservaPaciente").value = "";
  } else {
    document.getElementById("reservaMedico").value = "";
  }
}

async function cancelarReserva(reservaId) {
  if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
    return;
  }
  try {
    console.log("Cancelando reserva con ID:", reservaId);
    const response = await fetchWithAuth(`/api/reservas/${reservaId}`, {
      method: "DELETE",
    });
    console.log("Cancel reserva response:", response);
    if (response?.message) {
      showAlert("Cita cancelada", "success");
      loadReservas();
    } else {
      showAlert(response?.error, "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Error canceling reserva:", error);
  }
}

function showNewReservaForm() {
  document.getElementById("newReservaForm").classList.remove("hidden");
}

function hideNewReservaForm() {
  document.getElementById("newReservaForm").classList.add("hidden");
  // Clear form
  document.getElementById("reservaEspecialidad").value = "";
  document.getElementById("reservaMedico").value = "";
  document.getElementById("reservaPaciente").value = "";
  document.getElementById("reservaFecha").value = "";
  document.getElementById("reservaHora").value = "";
  resetFormToCreate();
}

// Especialidades functions (Admin only)
async function loadEspecialidades() {
  try {
    const response = await fetch(`${API_BASE}/api/especialidades`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        query: `
        query {
          especialidades {
            id
            nombre
          }
        }
      `,
      }),
    });

    const result = await response.json();
    const especialidades = result.data?.especialidades || [];
    displayEspecialidades(especialidades);
  } catch (error) {
    showAlert("Error cargando especialidades", "error");
    console.error("Error loading especialidades:", error);
  }
}

function displayEspecialidades(especialidades) {
  const especialidadesList = document.getElementById("especialidadesList");

  if (especialidades.length === 0) {
    especialidadesList.innerHTML = "<p>No hay especialidades registradas.</p>";
    return;
  }

  let html = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

  especialidades.forEach((esp) => {
    html += `
                    <tr>
                        <td><strong>${esp.nombre}</strong></td>
                        <td>
                            <button class="btn btn-warning" onclick="editEspecialidad(${esp.id})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger" onclick="deleteEspecialidad(${esp.id})">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </td>
                    </tr>
                `;
  });

  html += `</tbody></table>`;
  especialidadesList.innerHTML = html;
}

async function createEspecialidad() {
  const nombre = document.getElementById("especialidadNombre").value;

  if (!nombre) {
    showAlert("El nombre es obligatorio", "error");
    return;
  }

  try {
    const response = await fetchWithAuth("/api/especialidades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
      mutation CrearEspecialidad($nombre: String!) {
        crearEspecialidad(nombre: $nombre) {
          id
          nombre
        }
      }
    `,
        variables: {
          nombre,
        },
      }),
    });
    if (response?.data?.crearEspecialidad) {
      showAlert("Especialidad creada exitosamente", "success");
      hideNewEspecialidadForm();
      loadEspecialidades();
    } else {
      showAlert(response.message || "Error creando especialidad", "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Error creating especialidad:", error);
  }
}

async function deleteEspecialidad(especialidadId) {
  if (!confirm("¿Estás seguro de que deseas eliminar esta especialidad?")) {
    return;
  }

  try {
    const response = await fetchWithAuth(`/especialidades/${especialidadId}`, {
      method: "DELETE",
    });

    if (response.success) {
      showAlert("Especialidad eliminada", "success");
      loadEspecialidades();
    } else {
      showAlert("Error eliminando especialidad", "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Error deleting especialidad:", error);
  }
}

function showNewEspecialidadForm() {
  document.getElementById("newEspecialidadForm").classList.remove("hidden");
}

function hideNewEspecialidadForm() {
  document.getElementById("newEspecialidadForm").classList.add("hidden");
  document.getElementById("especialidadNombre").value = "";
}

// Agenda functions (Medico only)
async function loadAgenda() {
  try {
    const agenda = await fetchWithAuth("/reservas/mi-agenda");
    displayAgenda(agenda);
  } catch (error) {
    showAlert("Error cargando agenda", "error");
    console.error("Error loading agenda:", error);
  }
}

function displayAgenda(horarios) {
  const agendaList = document.getElementById("agendaList");

  if (horarios.length === 0) {
    agendaList.innerHTML =
      '<p>No tienes horarios configurados. Haz clic en "Configurar Horarios" para empezar.</p>';
    return;
  }

  let html = `
                <table class="table">
                    <thead>
                        <tr>
                            <th>Día</th>
                            <th>Hora Inicio</th>
                            <th>Hora Fin</th>
                            <th>Duración por Cita</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

  horarios.forEach((horario) => {
    html += `
                    <tr>
                        <td><strong>${horario.dia.charAt(0).toUpperCase() +
      horario.dia.slice(1)
      }</strong></td>
                        <td>${horario.hora_inicio}</td>
                        <td>${horario.hora_fin}</td>
                        <td>${horario.duracion_cita} min</td>
                        <td><span class="status ${horario.activo ? "confirmada" : "cancelada"
      }">${horario.activo ? "Activo" : "Inactivo"}</span></td>
                        <td>
                            <button class="btn ${horario.activo ? "btn-warning" : "btn-success"
      }" onclick="toggleHorario(${horario.id})">
                                <i class="fas fa-${horario.activo ? "pause" : "play"
      }"></i> ${horario.activo ? "Desactivar" : "Activar"
      }
                            </button>
                            <button class="btn btn-danger" onclick="deleteHorario(${horario.id
      })">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </td>
                    </tr>
                `;
  });

  html += `</tbody></table>`;
  agendaList.innerHTML = html;
}

async function createAgenda() {
  const dia = document.getElementById("agendaDia").value;
  const horaInicio = document.getElementById("agendaHoraInicio").value;
  const horaFin = document.getElementById("agendaHoraFin").value;
  const duracionCita = document.getElementById("agendaDuracionCita").value;

  if (!dia || !horaInicio || !horaFin || !duracionCita) {
    showAlert("Por favor, completa todos los campos", "error");
    return;
  }

  if (horaInicio >= horaFin) {
    showAlert("La hora de inicio debe ser menor a la hora de fin", "error");
    return;
  }

  try {
    const response = await fetchWithAuth("/reservas/agenda", {
      method: "POST",
      body: JSON.stringify({
        dia,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        duracion_cita: parseInt(duracionCita),
      }),
    });

    if (response.success) {
      showAlert("Horario configurado exitosamente", "success");
      hideNewAgendaForm();
      loadAgenda();
    } else {
      showAlert(response.message || "Error configurando horario", "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Error creating agenda:", error);
  }
}

async function toggleHorario(horarioId) {
  try {
    const response = await fetchWithAuth(
      `/reservas/agenda/${horarioId}/toggle`,
      {
        method: "PUT",
      }
    );

    if (response.success) {
      showAlert("Estado del horario actualizado", "success");
      loadAgenda();
    } else {
      showAlert("Error actualizando horario", "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Error toggling horario:", error);
  }
}

async function deleteHorario(horarioId) {
  if (!confirm("¿Estás seguro de que deseas eliminar este horario?")) {
    return;
  }

  try {
    const response = await fetchWithAuth(`/reservas/agenda/${horarioId}`, {
      method: "DELETE",
    });

    if (response.success) {
      showAlert("Horario eliminado", "success");
      loadAgenda();
    } else {
      showAlert("Error eliminando horario", "error");
    }
  } catch (error) {
    showAlert("Error de conexión", "error");
    console.error("Error deleting horario:", error);
  }
}

function showNewAgendaForm() {
  document.getElementById("newAgendaForm").classList.remove("hidden");
}

function hideNewAgendaForm() {
  document.getElementById("newAgendaForm").classList.add("hidden");
  document.getElementById("agendaDia").value = "";
  document.getElementById("agendaHoraInicio").value = "";
  document.getElementById("agendaHoraFin").value = "";
  document.getElementById("agendaDuracionCita").value = "30";
}

// Notificaciones functions
async function loadNotificaciones() {
  try {
    let notificaciones = [];
    if (currentUser.rol === "paciente") {
      notificaciones = await fetchWithAuth(
        "/api/notificaciones/by-paciente/" + currentUser.id
      );
    } else if (currentUser.rol === "medico") {
      notificaciones = await fetchWithAuth(
        "/api/notificaciones/by-medico/" + currentUser.id
      );
    } else if (currentUser.rol === "admin") {
      notificaciones = await fetchWithAuth("/api/notificaciones");
    }
    displayNotificaciones(notificaciones.datos ?? []);
  } catch (error) {
    showAlert("Error cargando notificaciones", "error");
    console.error("Error loading notificaciones:", error);
  }
}

function displayNotificaciones(notificaciones) {
  const notificacionesList = document.getElementById("notificacionesList");
  const nroNotificaciones = document.getElementById("nroNotificaciones");
  nroNotificaciones.textContent = notificaciones.length;
  if (notificaciones.length === 0) {
    notificacionesList.innerHTML = "<p>No tienes notificaciones.</p>";
    return;
  }
  let html = "";
  notificaciones.forEach((notif) => {
    html += `
                    <div class="card" style="margin-bottom: 15px; border-left: 4px solid #667eea;">
                        <div style="display: flex; justify-content: between; align-items: start;">
                            <div style="flex: 1;">
                                <h4 style="margin-bottom: 10px; color: # 666;">
                                    <i class="fas fa-check-circle"></i> ${notif.accion}
                                </h4>
                                <p style="margin-bottom: 10px;">${notif.mensaje
      }</p>
                                <small style="color: #888;">
                                    <i class="fas fa-clock"></i> ${new Date(
        notif.fecha
      ).toLocaleString()}
                                </small>
                            </div>
                        </div>
                    </div>
                `;
  });

  notificacionesList.innerHTML = html;
}

// Utility functions
async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  const response = await fetch(API_BASE + url, mergedOptions);
  if (response.status === 401) {
    logout();
    showAlert("Sesión expirada. Por favor, inicia sesión nuevamente.", "error");
    return;
  }
  return await response.json();
}

function showAlert(message, type = "info") {
  const alertContainer = document.getElementById("alertContainer");
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="flex: 1;">${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; opacity: 0.7;">×</button>
    </div>
  `;

  alertContainer.appendChild(alertDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

// Initialize tooltips and other UI enhancements
document.addEventListener("DOMContentLoaded", function () {
  // Set minimum date for date inputs
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split("T")[0];
  dateInputs.forEach((input) => {
    input.min = today;
  });
});
