Conceptos de Seguridad - API de Tareas

    Este documento explica los conceptos de seguridad que implementaremos en nuestra API, con definiciones propias y ejemplos de situaciones reales.

1. Rate Limit
    ¿Qué es?
    Rate limit es un límite de velocidad para las peticiones a nuestra API. Es como poner un "freno" que controla cuántas veces puede alguien hacer solicitudes en un tiempo determinado.

    ¿Para qué sirve?
    Sirve para proteger nuestro servidor de ser saturado por demasiadas peticiones, ya sean accidentales o maliciosas.

    Ejemplo de situación real
    Imagina que tienes una tienda online y alguien programa un bot para consultar el precio de todos tus productos cada segundo. Sin rate limit, ese bot podría hacer miles de peticiones por minuto y ralentizar tu servidor para los clientes reales. Con rate limit, después de 100 peticiones en 15 minutos, el bot recibiría un mensaje de "espera un poco" y tu servidor seguiría funcionando normal para los demás usuarios.


2. CORS (Cross-Origin Resource Sharing)
    ¿Qué es?
    CORS es un sistema de permisos que controla desde qué páginas web se puede acceder a tu API. Es como una lista de invitados en una fiesta: solo entran los que están en la lista.

    ¿Para qué sirve?
    Sirve para evitar que sitios web desconocidos o maliciosos accedan a tu API sin tu permiso. Los navegadores bloquean automáticamente peticiones entre diferentes dominios, y CORS es la forma de decirle al navegador "este sitio sí puede acceder".

    Ejemplo de situación real
    Tu API está en api.mitarea.com y tu aplicación web en app.mitarea.com. Sin configurar CORS, cuando tu aplicación web intente cargar las tareas, el navegador bloqueará la petición porque son dominios diferentes. Al configurar CORS permitiendo app.mitarea.com, le dices al navegador "tranquilo, ese sitio tiene mi permiso para acceder a mi API". Pero si alguien desde sitio-malicioso.com intenta acceder, el navegador lo bloqueará porque no está en tu lista de permitidos.


3. JWT (JSON Web Token)
    ¿Qué es?
    JWT es como una credencial digital firmada que se le da al usuario después de hacer login. Es un texto codificado que contiene información del usuario y que el servidor puede verificar como auténtico.

    ¿Para qué sirve?
    Sirve para mantener al usuario "logueado" sin tener que guardar su sesión en el servidor. El usuario envía su JWT en cada petición y el servidor verifica que sea válido antes de darle acceso.

    Ejemplo de situación real
    Imagina que entras a una aplicación de tareas con tu email y contraseña. El servidor verifica que eres tú y te da un JWT (como una pulsera VIP en un concierto). A partir de ese momento, cada vez que quieras ver tus tareas, crear una nueva o eliminar una, envías esa pulsera (JWT) y el servidor la verifica. Si la pulsera es válida, te da acceso. Si alguien intenta falsificar la pulsera, el servidor lo detecta porque tiene una firma digital que no se puede copiar. Además, la pulsera tiene fecha de vencimiento (por ejemplo, 24 horas), después de ese tiempo tienes que volver a hacer login.


4. Passport (Bonus)
    ¿Qué es?
    Passport es una herramienta de Node.js que simplifica todo el proceso de autenticación. Es como un sistema de seguridad completo que puedes conectar fácilmente a tu aplicación.

    ¿Para qué sirve?
    Sirve para no tener que programar desde cero toda la lógica de login, verificación de tokens, etc. Ya tiene todo hecho y probado.

    Ejemplo de situación real
    En lugar de escribir manualmente todo el código para verificar el JWT en cada ruta protegida, instalas Passport y con unas pocas líneas de configuración ya tienes todo funcionando. Es como comprar un sistema de alarma completo en lugar de intentar construir uno desde cero con sensores y cables sueltos.