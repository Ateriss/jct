export const jiraRequestError = ()=>{
    console.log(`
        Es posible que la configuración de acceso a tu Jira no sea correcta o el token a expirado
        por favor ejecuta el siguiente comando para revisarla:

        ${'jct --me'}

        O ejecuta el siguiente para cambiarla:

        ${'jct --config'}

        Si necesitas ayuda adicional, ejecuta:

        ${'jct --help'}`
    )
}