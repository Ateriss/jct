import { ENV_KEY } from "./enum.js"
import { getEnvValue, setEnvKey } from "./envHandler.js"

const srtBase:Dictionary<Dictionary<string>> = {
    user_input: {
        EN: 'Set up the Jira user',
        ES: 'Configura el usuario de Jira'
    },
    token_input: {
        EN: 'Set up the Jira token',
        ES: 'Configura el token de Jira'
    },
    url_input: {
        EN: 'Set up the Jira URL',
        ES: 'Configura la URL de Jira'
    },
    project_input: {
        EN: 'Set up the default Jira project',
        ES: 'Configura el proyecto Jira por defecto'
    },
    sprint_input: {
        EN: 'Set up the current sprint ID',
        ES: 'Configura el ID del sprint actual'
    },
    config_commant: {
        EN: "Configure JCT",
        ES: "Configura JCT"
    },
    me_command: {
        EN: "Displays JCT configuration",
        ES: "Muestra la información de configuración de JCT"
    },
    user_no_configure: {
        EN: "User not configured",
        ES: "Usuario no configurado"
    },
    url_not_configured: {
        EN: "Url not configured",
        ES: "Url no configurada"
    },
    token_not_configured: {
        EN: "Token not configured",
        ES: "Token no configurado"
    },
    config_message: {
        EN: "Please execute the following command to configure JCT:",
        ES: "Por favor ejecuta el siguiente comando para configurar JCT:"
    },
    config_validate: {
        EN: "...validating configuration...",
        ES: "...validando configuración..."
    },
    must_configurate:{
        EN: 'You must configure JCT',
        ES: 'Debes configurar JCT'
    },
    no_changes_for_commits: {
        EN: "No changes available for commits",
        ES: "No hay cambios disponibles para commits"
    },
    last_commit: {
        EN: "\nLast commit:\n",
        ES: "\nÚltimo commit:\n"
    },
    commit_error: {
        EN: "Error performing commit:",
        ES: "Error al realizar el commit:"
    },
    project_not_defined: {
        EN: "[Project not defined]",
        ES: "[Proyecto no definido]"
    },
    sprint_not_defined: {
        EN: "[Sprint not defined]",
        ES: "[Sprint no definido]"
    },
    goal_not_defined: {
        EN: "[Goal not defined]",
        ES: "[Objetivo no definido]"
    },
    date_not_defined: {
        EN: "[Not defined]",
        ES: "[No definido]"
    },
    finalizes_on: {
        EN: "Finalizes on:",
        ES: "Finaliza el:"
    },
    goal: {
        EN: "Sprint goal:",
        ES: "Objetivo del sprint:"
    },
    jira_config_error: {
        EN: `
        Jira access configuration may be incorrect or token has expired
        please run the following command to review it:
        `,
        ES: `
        Es posible que la configuración de acceso a tu Jira no sea correcta o el token ha expirado
        por favor ejecuta el siguiente comando para revisarla:
        `
    },
    jira_not_configured: {
        EN: `
        You don’t have Jira access configured.
        Please run the following command to set it up:
        `,
        ES: `
        No tienes configurado el acceso a Jira,
        por favor ejecuta el siguiente comando para configurarlo:
        `
    },
    change_config_message: {
        EN: "Or run the following to change it:",
        ES: "O ejecuta el siguiente para cambiarla:"
    },
    help_message: {
        EN: "If you need additional help, run:",
        ES: "Si necesitas ayuda adicional, ejecuta:"
    },
    jct_config_start: {
        EN: `
        ...Starting JCT configuration
        `,
        ES: `
        ...Iniciando configuración de JCT
        `
    },
    add_jira_token: {
        EN: "Add the token so you can access your Jira",
        ES: "Agrega el token para que puedas acceder a tu Jira"
    },
    jira_token_configured: {
        EN: "You already have a Jira token configured. Do you want to configure another?",
        ES: "Ya tienes un token de Jira configurado ¿Deseas configurar otro?"
    },
    get_jira_token_link: {
        EN: "Click on this link to get your Jira token",
        ES: "Haz click en este link para obtener tu token de Jira"
    },
    paste_jira_token: {
        EN: "Please enter your Jira token here:",
        ES: "Por favor ingresa el token de Jira aquí:"
    },
    token_configured_success: {
        EN: "✅ Token configured successfully!",
        ES: "✅ ¡Token configurado con éxito!"
    },
    remember_message: {
        EN: "Remember:",
        ES: "Recuerda:"
    },
    dont_share_token: {
        EN: "Don't share your token with anyone.",
        ES: "No compartas tu token con nadie."
    },
    security_important: {
        EN: "Your security is important.",
        ES: "Tu seguridad es importante."
    },
    add_jira_email: {
        EN: "Add your user email so you can access your Jira",
        ES: "Agrega el email de tu usuario para que puedas acceder a tu Jira"
    },
    jira_email_configured: {
        EN: "You already have a Jira user email configured. Do you want to change it?",
        ES: "Ya tienes un email de usuario de Jira configurado ¿Deseas cambiarlo?"
    },
    enter_user_email: {
        EN: "Enter your user email",
        ES: "Ingresa tu email de usuario"
    },
    user_configured_success: {
        EN: "✅ User configured successfully!",
        ES: "✅ ¡Usuario configurado con éxito!"
    },
    jira_space_url_configured: {
        EN: "✅ You already have your Jira space URL configured. Do you want to change it?",
        ES: "✅ Ya tienes la URL de tu organización de Jira configurada ¿Deseas cambiarla?"
    },
    jira_space_current: {
        EN: "Currently your Jira space is: JIRA_SPACE_URL. Do you want to change it?",
        ES: "Actualmente tu organización de Jira es: JIRA_SPACE_URL ¿Deseas cambiarla?"
    },
    enter_jira_space_url: {
        EN: "Enter your Jira space URL. example: https://yourspace.atlassian.net",
        ES: "Ingresa la URL de tu organización de Jira. ejemplo: https://tuespacio.atlassian.net"
    },
    url_configured_success: {
        EN: "✅ URL configured successfully!",
        ES: "✅ ¡URL configurado con éxito!"
    },
    select_project: {
        EN: "Select a project",
        ES: "Selecciona un proyecto"
    },
    project_configured_success: {
        EN: "✅ Project configured successfully!",
        ES: "✅ ¡Proyecto configurado con éxito!"
    },
    error_getting_projects: {
        EN: "An error occurred while getting projects",
        ES: "Ocurrió un error al obtener proyectos"
    },
    sprint_ended_update: {
        EN: 'According to the planning, sprint ended on END_DATE. Do you want to update it?',
        ES: 'Según la planificación el sprint finalizó el día END_DATE. ¿Desea actualizarlo?'
    },
    sprint_end_date_update: {
        EN: 'Sprint has a planned end date of END_DATE. Do you want to update it?',
        ES: 'El sprint tiene fecha de finalización planeada para el día END_DATE. ¿Desea actualizarlo?'
    },
    sprint_configured_success: {
        EN: "✅ Sprint configured successfully!",
        ES: "✅ ¡Sprint configurado con éxito!"
    },
    working_on_issue: {
        EN: "Which issue are you working on?",
        ES: "¿Que incidencia te encuentras trabajando?"
    },
    select_commit_type: {
        EN: "Select the commit type",
        ES: "Selecciona el tipo de commit"
    },
    commit_title_question: {
        EN: "What is the commit title?",
        ES: "¿Cuál es el título del commit?"
    },
    commit_description_question: {
        EN: "Write the commit description",
        ES: "Escribe la descripción del commit"
    },
    feat: {
        EN: "feat - A new feature.",
        ES: "feat - Una nueva funcionalidad."
    },
    fix: {
        EN: "fix - Bug fix.",
        ES: "fix - Corrección de errores."
    },
    docs: {
        EN: "docs - Changes to README or documentation.",
        ES: "docs - Cambios en el README o Documentación."
    },
    style: {
        EN: "style - Indentation and/or visual changes for development.",
        ES: "style - Indentación y/o cambios visuales para el desarrollo."
    },
    refactor: {
        EN: "refactor - Improvements and best practices.",
        ES: "refactor - Mejoras y buenas prácticas."
    },
    perf: {
        EN: "perf - Changes that improve performance.",
        ES: "perf - Cambios que mejoran el rendimiento."
    },
    test: {
        EN: "test - Changes or new automated tests.",
        ES: "test - Cambios o nuevas pruebas automatizadas."
    },
    previous_projects: {
        EN: "<-- Previous projects --",
        ES: "<-- Proyectos anteriores --"
    },
    next_projects: {
        EN: "-- Next projects -->",
        ES: "-- Siguientes proyectos  -->"
    },
    choose_main_project: {
        EN: "Choose your main project",
        ES: "Elige tu proyecto principal"
    },
    no_active_sprints: {
        EN: "There are no active sprints at this time",
        ES: "No hay sprints activos en este momento"
    },
    no_issues_available: {
        EN: "No issues available",
        ES: "No hay incidencias disponibles"
    },
    unknow_command: {
        EN: "Unknown command.",
        ES: "Comando desconocido."
    },
    unknow_command_help: {
        EN: "Use `jct help` to see the list of available commands.",
        ES: "Usa `jct help` para ver la lista de comandos disponibles."
    },
    save: {
        EN: "Saved",
        ES: "Guardado"
    },
    no_configure: {
        EN: "Not configured",
        ES: "No configurado"
    },
    jira_input: {
        EN: "Configure Jira integration",
        ES: "Configurar integración con Jira"
    },
    aviable_comands: {
        EN: "Available commands:",
        ES: "Comandos disponibles:"
    },
    intro_comands_help: {
        EN: "Or run the following commands directly",
        ES: "O ejecuta los siguientes comandos directamente"
    },
    user_label: {
        EN: "User",
        ES: "Usuario"
    },
    project_label: {
        EN: "Project",
        ES: "Proyecto"
    },
    access_label: {
        EN: "Access",
        ES: "Acceso"
    },
    smart_input: {
        EN: "Configure Smart integration",
        ES: "Configurar integración con Smart"
    },
    issues_input: {
        EN: "Set up the issues to work on",
        ES: "Configura las incidencias en las que trabajar"
    },
    smart_email_input: {
        EN: "Set up the Smart registered email",
        ES: "Configura el email registrado en Smart"
    },
    smart_access_input: {
        EN: "Set up the Smart access type (Google or Password)",
        ES: "Configura el tipo de acceso a Smart (Google o Password)"
    },
    config_success: {
        EN: "✅ Configuration successful!",
        ES: "✅ ¡Configuración exitosa!"
    },
    current_value_changed: {
        EN: "Current value will be changed to NEW_VALUE_ENV.",
        ES: "El valor actual será cambiado a NEW_VALUE_ENV."
    },
    get_new_project: {
        EN: "...Search projects in Jira...",
        ES: "...Buscar proyectos en Jira..."
    },
    jira_default_project_configured: {
        EN: "You already have the default Jira project configured. Do you want to change it?",
        ES: "Ya tienes el proyecto Jira por defecto configurado ¿Deseas cambiarlo?"
    },
    check_scrum_managed:{
        ES: "Verificando si PROJECT_NAME usa el marco Scrum...",
        EN: "Checking if PROJECT_NAME uses the Scrum framework..."
    },
    project_type_check:{
        ES: "El proyecto usa la metodología METHOD_NAME.",
        EN: "The project uses the METHOD_NAME methodology."
    },
    clasic:{
        ES: "Tradicional",
        EN: "Traditional"
    },
    change_project:{
        ES: "Buscar otros proyectos en Jira",
        EN: "Search for other projects in Jira"
    },
    config_command:{
        EN: "Configure JCT",
        ES: "Configura JCT"
    },
    config_title:{
        EN: "⚙️  Current Configuration\n",
        ES: "⚙️  Configuración Actual\n"
    },
    configuring_value:{
        EN: "🧩 Configuring value",
        ES: "🧩 Configurando valor"
    },
    canceled:{
        EN: "Configuration canceled by user at:",
        ES: "Configuración interrumpida por el usuario en:"
    },
    config_error:{
        EN: "An error occurred during configuration:",
        ES: "Ocurrió un error durante la configuración:"
    },
    no_control_error:{
        EN: "An unexpected error occurred. Please try again.",
        ES: "Ocurrió un error inesperado. Por favor intenta de nuevo."
    }
};

interface Dictionary<T> {
    [key: string]: T;
}
export const srtGlobal:Dictionary<string> = {};

export const setGlobalStr = () => {
        let languaje = getEnvValue(ENV_KEY.LAN)
        if(!languaje)  languaje = setEnvKey(ENV_KEY.LAN, 'EN')

    if (languaje === "EN" || languaje === "ES") {
        for (const key in srtBase) {
                srtGlobal[key] = srtBase[key][languaje];
        }
    }
};
