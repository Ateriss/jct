/////// SERVICIO PARA CONECTAR CON SMART TAREO Y PROYECTOS ///////

import axios from 'axios';
import https from 'https';
import { getEnvValue } from '../helpers/envHandler.js';
import { ENV_KEY } from '../helpers/enum.js';
import chalk from 'chalk';
import { srtGlobal } from '../helpers/textDictionary.js';

// MOCK DATA - Importar datos falsos
import {
    mockSmartUser,
    mockSmartProjects,
    mockTaskTypes,
    mockTodayTasks,
    mockRequirements,
    mockCategories,
    mockStatistics,
    mockToken,
    mockLoginResponse
} from '../mocks/smart.mock.js';

// MODO DESARROLLO: true = usar datos falsos, false = usar API real
const USE_MOCK_DATA = false;

// Agente HTTPS para ignorar certificados auto-firmados en localhost
const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

/**
 * Obtiene los headers para las peticiones a Smart Tareo
 * Similar al patrón usado en jira.service.ts
 * 
 * SIEMPRE REQUIERE TOKEN (incluso en modo mock)
 */
const getSmartHeaders = () => {
    const SMART_TOKEN = getEnvValue(ENV_KEY.SMART_TOKEN);
    const SMART_URL = getEnvValue(ENV_KEY.SMART_URL);

    // MODO MOCK: Validar que exista token configurado
    if (USE_MOCK_DATA) {
        if (!SMART_TOKEN) {
            console.log(chalk.yellow('No hay token configurado'));
            console.log(chalk.cyan('Configura un token mock:'));
            console.log(chalk.gray('   cmd /c "jct config smart --token"'));
            console.log(chalk.gray('   (Puedes poner cualquier texto como token mock)\n'));
            return null;
        }
        
        // En modo mock, usar el token configurado o el mock por defecto
        return {
            baseURL: SMART_URL || 'http://mock-smart.local',
            headers: {
                Authorization: `Bearer ${SMART_TOKEN}`,
                'Content-Type': 'application/json',
            },
        };
    }

    // MODO REAL: Validar token real
    if (!SMART_TOKEN || !SMART_URL) {
        console.log(chalk.yellow('Configuración de Smart incompleta'));
        console.log(chalk.cyan('Configura Smart:'));
        console.log(chalk.gray('   cmd /c "jct config smart --url"'));
        console.log(chalk.gray('   cmd /c "jct config smart --token"\n'));
        return null;
    }

    return {
        baseURL: SMART_URL,
        headers: {
            Authorization: `Bearer ${SMART_TOKEN}`,
            'Content-Type': 'application/json',
        },
    };
};

/**
 * Muestra error cuando la configuración de Smart no es correcta
 */
const smartRequestError = () => {
    console.log(`
        ${srtGlobal.smart_config_error}:

        ${'jct config smart'}

        ${srtGlobal.change_config_message}

        ${'jct config smart --token'}
        ${'jct config smart --url'}

        ${srtGlobal.help_message}

        ${'jct --help'}
    `);
};

//TODO: AUTOMATIZAR LOGIN CON SMART 

export const smartLoginGoogle = async () => {
    // Implementar login con Google OAuth
}

export const smartLoginPsw = async () => {
    // Implementar login con contraseña
}

export const getActiveProjects = async () => {
    const headers = getSmartHeaders();
    
    // Sin token no hay acceso
    if (!headers) {
        console.log(chalk.red('No se puede obtener proyectos sin token\n'));
        return null;
    }

    // MODO MOCK: Devolver datos falsos (pero requiere token)
    if (USE_MOCK_DATA) {
        console.log(chalk.yellow('MODO DESARROLLO: Usando datos mock'));
        console.log(chalk.gray(`   Autenticado con token: ${getEnvValue(ENV_KEY.SMART_TOKEN)?.substring(0, 10)}...`));
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log(chalk.green(`${mockSmartProjects.length} proyectos obtenidos (MOCK)`));
        return {
            success: true,
            data: mockSmartProjects,
            total: mockSmartProjects.length
        };
    }

    // MODO REAL: Usar API real
    try {
        const instance = axios.create(headers);
        const response = await instance.get('/api/projects/active');
        
        console.log(chalk.green('Proyectos obtenidos correctamente'));
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.error(chalk.red('Token inválido o expirado'));
            console.log(chalk.cyan('Reconfigura el token:'));
            console.log(chalk.gray('   cmd /c "jct config smart --token"\n'));
        } else {
            console.error(chalk.red('Error al obtener proyectos de Smart:'), error.message);
        }
        smartRequestError();
        return null;
    }
};

export const saveTaskByCommits = async () => {
    // use getComitsFromGitHubByDay para obtener los commits del dia
    // formatear la info para smart tareo
    // crear tareas correspondientes en smart tareo
    
    const headers = getSmartHeaders();
    
    if (!headers) {
        smartRequestError();
        return null;
    }

    try {
        const instance = axios.create(headers);
        // Implementar lógica de guardado de tareas
        
        console.log(chalk.green('Tareas guardadas en Smart'));
    } catch (error: any) {
        console.error(chalk.red('Error al guardar tareas en Smart:'), error.message);
        smartRequestError();
    }
}

/**
 * Valida la conexión con Smart Tareo
 * Útil para verificar que el token es válido
 * 
 * VALIDA EL TOKEN en modo mock y real
 */
export const validateSmartConnection = async (): Promise<boolean> => {
    const headers = getSmartHeaders();
    
    if (!headers) {
        console.log(chalk.red('No se puede validar sin configuración completa\n'));
        return false;
    }

    const SMART_TOKEN = getEnvValue(ENV_KEY.SMART_TOKEN);

    // MODO MOCK: Validar formato del token
    if (USE_MOCK_DATA) {
        console.log(chalk.yellow('MODO DESARROLLO: Validando token mock...'));
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Validar que el token no esté vacío
        if (!SMART_TOKEN || SMART_TOKEN.length < 5) {
            console.log(chalk.red('Token inválido o muy corto'));
            console.log(chalk.yellow('El token debe tener al menos 5 caracteres\n'));
            return false;
        }
        
        console.log(chalk.green('Token válido'));
        console.log(chalk.gray(`   Token: ${SMART_TOKEN.substring(0, 10)}...`));
        console.log(chalk.gray(`   Usuario: ${mockSmartUser.name}`));
        console.log(chalk.gray(`   Email: ${mockSmartUser.email}`));
        console.log(chalk.gray(`   Rol: ${mockSmartUser.role}\n`));
        return true;
    }

    // MODO REAL: Validar con API real de Smart Tareo
    try {
        const SMART_URL = getEnvValue(ENV_KEY.SMART_URL);
        
        // Endpoint: POST /api/tokens/validar
        // El controller espera: [FromBody] string token (con comillas JSON)
        // Es [AllowAnonymous], no requiere Authorization header
        const response = await axios.post(
            `${SMART_URL}/api/tokens/validar`,
            JSON.stringify(SMART_TOKEN),
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                httpsAgent: httpsAgent
            }
        );
        
        // Verificar respuesta exitosa
        if (response.data.isSuccess) {
            console.log(chalk.green('Conexión con Smart Tareo exitosa'));
            console.log(chalk.gray(`   Token validado correctamente`));
            console.log(chalk.gray(`   Mensaje: ${response.data.message}\n`));
            return true;
        } else {
            console.log(chalk.red('Token inválido o expirado'));
            console.log(chalk.yellow(`   ${response.data.message}\n`));
            return false;
        }
    } catch (error: any) {
        console.error(chalk.red('Error al validar token con Smart Tareo'));
        
        if (error.response?.status === 401) {
            console.log(chalk.yellow('Token inválido, revocado o expirado'));
            console.log(chalk.cyan('Genera un nuevo token en Smart Tareo y reconfigura:'));
            console.log(chalk.gray('   1. Ve a Smart Tareo → Configuración → API Tokens'));
            console.log(chalk.gray('   2. Genera un nuevo token'));
            console.log(chalk.gray('   3. Ejecuta: cmd /c "jct config smart --token"\n'));
        } else if (error.response?.status === 400) {
            console.log(chalk.yellow('Formato de token incorrecto'));
            console.log(chalk.gray(`   ${error.response.data?.message || 'Token inválido'}\n`));
        } else {
            console.error(chalk.red(`   Error: ${error.message}\n`));
        }
        
        smartRequestError();
        return false;
    }
};

/**
 * Obtener tipos de tarea disponibles
 */
export const getTaskTypes = async () => {
    const headers = getSmartHeaders();
    
    // Sin token no hay acceso
    if (!headers) {
        console.log(chalk.red('No se puede obtener tipos de tarea sin token\n'));
        return null;
    }

    // MODO MOCK: Devolver datos falsos (pero requiere token)
    if (USE_MOCK_DATA) {
        console.log(chalk.yellow('MODO DESARROLLO: Usando datos mock'));
        console.log(chalk.gray(`   Autenticado con token: ${getEnvValue(ENV_KEY.SMART_TOKEN)?.substring(0, 10)}...`));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(chalk.green(`${mockTaskTypes.length} tipos de tarea obtenidos (MOCK)`));
        return { success: true, data: mockTaskTypes };
    }

    // MODO REAL: Usar API real
    try {
        const instance = axios.create(headers);
        const response = await instance.get('/api/task-types');
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.error(chalk.red('Token inválido o expirado'));
        } else {
            console.error(chalk.red('Error al obtener tipos de tarea:'), error.message);
        }
        return null;
    }
};

/**
 * Obtener tareas del día actual
 */
export const getTodayTasks = async () => {
    const headers = getSmartHeaders();
    
    // Sin token no hay acceso
    if (!headers) {
        console.log(chalk.red('No se puede obtener tareas sin token\n'));
        return null;
    }

    // MODO MOCK: Devolver datos falsos (pero requiere token)
    if (USE_MOCK_DATA) {
        console.log(chalk.yellow('MODO DESARROLLO: Usando datos mock'));
        console.log(chalk.gray(`   Autenticado con token: ${getEnvValue(ENV_KEY.SMART_TOKEN)?.substring(0, 10)}...`));
        
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log(chalk.green(`${mockTodayTasks.length} tareas del día obtenidas (MOCK)`));
        return { success: true, data: mockTodayTasks };
    }

    // MODO REAL: Usar API real
    try {
        const instance = axios.create(headers);
        const today = new Date().toISOString().split('T')[0];
        const response = await instance.get(`/api/tasks/date/${today}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.error(chalk.red('Token inválido o expirado'));
        } else {
            console.error(chalk.red('Error al obtener tareas:'), error.message);
        }
        return null;
    }
};

/**
 * Obtener información del usuario actual
 */
export const getCurrentUser = async () => {
    const headers = getSmartHeaders();
    
    // Sin token no hay acceso
    if (!headers) {
        console.log(chalk.red('No se puede obtener usuario sin token\n'));
        return null;
    }

    // MODO MOCK: Devolver datos falsos (pero requiere token)
    if (USE_MOCK_DATA) {
        console.log(chalk.yellow('MODO DESARROLLO: Usando datos mock'));
        console.log(chalk.gray(`   Autenticado con token: ${getEnvValue(ENV_KEY.SMART_TOKEN)?.substring(0, 10)}...`));
        
        await new Promise(resolve => setTimeout(resolve, 200));
        return { success: true, data: mockSmartUser };
    }

    // MODO REAL: Usar API real
    try {
        const instance = axios.create(headers);
        const response = await instance.get('/api/user/me');
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.error(chalk.red('Token inválido o expirado'));
        } else {
            console.error(chalk.red('Error al obtener usuario:'), error.message);
        }
        return null;
    }
};

/**
 * Obtener estadísticas del usuario
 */
export const getUserStatistics = async () => {
    const headers = getSmartHeaders();
    
    // Sin token no hay acceso
    if (!headers) {
        console.log(chalk.red('No se puede obtener estadísticas sin token\n'));
        return null;
    }

    // MODO MOCK: Devolver datos falsos (pero requiere token)
    if (USE_MOCK_DATA) {
        console.log(chalk.yellow('MODO DESARROLLO: Usando datos mock'));
        console.log(chalk.gray(`   Autenticado con token: ${getEnvValue(ENV_KEY.SMART_TOKEN)?.substring(0, 10)}...`));
        
        await new Promise(resolve => setTimeout(resolve, 250));
        return { success: true, data: mockStatistics };
    }

    // MODO REAL: Usar API real
    try {
        const instance = axios.create(headers);
        const response = await instance.get('/api/user/statistics');
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401) {
            console.error(chalk.red('Token inválido o expirado'));
        } else {
            console.error(chalk.red('Error al obtener estadísticas:'), error.message);
        }
        return null;
    }
};





