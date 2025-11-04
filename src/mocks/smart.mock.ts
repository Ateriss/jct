/**
 * MOCK DATA: Datos falsos de Smart Tareo para desarrollo
 * 
 * Este archivo simula las respuestas de la API de Smart
 * mientras no existe un generador de tokens real.
 */

// Usuario mock
export const mockSmartUser = {
    id: 1,
    name: "Roberto Tapara",
    email: "rtapara@ateriss.com",
    role: "Developer",
    department: "TI",
    avatar: "https://i.pravatar.cc/150?img=1"
};

// Proyectos mock
export const mockSmartProjects = [
    {
        id: 101,
        name: "Sistema de Gestión SMART",
        code: "SMART-SYS",
        status: "activo",
        description: "Desarrollo del sistema principal de tareo",
        startDate: "2025-01-15",
        endDate: "2025-12-31",
        hoursAllocated: 2000,
        hoursUsed: 1250,
        team: ["Roberto Tapara", "Ana García", "Carlos López"]
    },
    {
        id: 102,
        name: "App Mobile Smart",
        code: "SMART-MOB",
        status: "activo",
        description: "Aplicación móvil para registro de tiempo",
        startDate: "2025-03-01",
        endDate: "2025-11-30",
        hoursAllocated: 1500,
        hoursUsed: 890,
        team: ["Roberto Tapara", "María Sánchez"]
    },
    {
        id: 103,
        name: "Integración JIRA",
        code: "SMART-INT",
        status: "planificado",
        description: "Integración automática con JIRA",
        startDate: "2025-11-01",
        endDate: "2026-02-28",
        hoursAllocated: 500,
        hoursUsed: 0,
        team: ["Roberto Tapara"]
    }
];

// Tipos de tarea mock
export const mockTaskTypes = [
    { id: 1, name: "Desarrollo", code: "DEV", color: "#3498db" },
    { id: 2, name: "Reunión", code: "MEET", color: "#9b59b6" },
    { id: 3, name: "Corrección de Bugs", code: "BUG", color: "#e74c3c" },
    { id: 4, name: "Documentación", code: "DOC", color: "#f39c12" },
    { id: 5, name: "Testing", code: "TEST", color: "#2ecc71" },
    { id: 6, name: "Revisión de Código", code: "REVIEW", color: "#1abc9c" }
];

// Tareas mock del día
export const mockTodayTasks = [
    {
        id: 1001,
        projectId: 101,
        projectName: "Sistema de Gestión SMART",
        taskType: "Desarrollo",
        description: "SCRUM-241: Reporte de errores al crear solicitudes masivas",
        hours: 4.5,
        date: "2025-11-03",
        status: "completada",
        startTime: "09:00",
        endTime: "13:30"
    },
    {
        id: 1002,
        projectId: 102,
        projectName: "App Mobile Smart",
        taskType: "Reunión",
        description: "Sprint Planning - Sprint 48",
        hours: 2,
        date: "2025-11-03",
        status: "completada",
        startTime: "14:00",
        endTime: "16:00"
    },
    {
        id: 1003,
        projectId: 101,
        projectName: "Sistema de Gestión SMART",
        taskType: "Corrección de Bugs",
        description: "SCRUM-259: Filtro de clientes no funciona correctamente",
        hours: 1.5,
        date: "2025-11-03",
        status: "en_progreso",
        startTime: "16:00",
        endTime: null
    }
];

// Requerimientos mock
export const mockRequirements = [
    {
        id: 201,
        projectId: 101,
        name: "Sprint 48",
        code: "SPRINT-48",
        startDate: "2025-10-28",
        endDate: "2025-11-10",
        status: "activo"
    },
    {
        id: 202,
        projectId: 102,
        name: "Release 2.0",
        code: "REL-2.0",
        startDate: "2025-11-01",
        endDate: "2025-11-30",
        status: "activo"
    }
];

// Categorías mock
export const mockCategories = [
    { id: 301, name: "Backend", code: "BE" },
    { id: 302, name: "Frontend", code: "FE" },
    { id: 303, name: "Base de Datos", code: "DB" },
    { id: 304, name: "Infraestructura", code: "INFRA" },
    { id: 305, name: "QA", code: "QA" }
];

// Estadísticas mock
export const mockStatistics = {
    hoursToday: 8,
    hoursWeek: 40,
    hoursMonth: 160,
    tasksCompleted: 45,
    projectsActive: 2,
    efficiency: 95.5
};

// Token mock (simula un JWT)
export const mockToken = "mock_smart_token_" + Buffer.from(mockSmartUser.email).toString('base64');

// Respuesta de login mock
export const mockLoginResponse = {
    success: true,
    token: mockToken,
    user: mockSmartUser,
    expiresIn: "24h"
};

// Configuración mock del sistema
export const mockSystemConfig = {
    apiVersion: "1.0.0",
    features: {
        timeTracking: true,
        projectManagement: true,
        reporting: true,
        mobileApp: true,
        integrations: {
            jira: true,
            github: true,
            slack: false
        }
    },
    workingHours: {
        start: "09:00",
        end: "18:00",
        lunchBreak: "13:00-14:00"
    }
};
