# Ejemplos de Astro

Proyecto Astro con una página `/productos` que consulta una base de datos MySQL
en Docker. Astro se ejecuta en el equipo y MySQL en el contenedor.

Consulta la [explicación de cada fichero](docs/explicacion-mysql.md) para entender
el código y el recorrido de los datos desde MySQL hasta la página.

## Requisitos

- Node.js compatible con el proyecto (`>=22.12.0`) y npm.
- Docker con Docker Compose v2. Abre Docker Desktop antes de ejecutar los comandos.

## Arrancar el ejemplo

Ejecuta los comandos desde la raíz del proyecto:

```sh
# Instalar las dependencias (incluido el cliente mysql2).
npm ci

# Crear la configuración local. Hazlo solo si todavía no tienes un archivo .env.
cp .env.example .env

# Crear y arrancar MySQL; esperar a que acepte conexiones.
docker compose up -d --wait --wait-timeout 180 mysql

# Iniciar Astro en segundo plano.
npm run dev -- --background
```

Abre [http://localhost:4321/productos](http://localhost:4321/productos).
También puedes acceder desde el enlace **Productos MySQL** del menú.
Si Astro utiliza otro puerto, consulta la URL con `npm run astro -- dev status`.

La primera vez, Docker descarga la imagen `mysql:8.4`, crea la base de datos
`astro_ejemplo` y ejecuta `docker/mysql/init.sql`. Este archivo crea la tabla
`productos` e inserta cuatro registros con ID, nombre, descripción, precio y stock.

## Conexión

Las variables de `.env.example` contienen credenciales de ejemplo para desarrollo
local. `.env` está excluido de Git. Astro utiliza el usuario `astro`, separado de root.

| Variable | Valor de ejemplo | Uso |
| --- | --- | --- |
| `DB_HOST` | `127.0.0.1` | Dirección de MySQL desde Astro |
| `DB_PORT` | `3307` | Puerto publicado en el equipo |
| `DB_NAME` | `astro_ejemplo` | Base de datos que crea Docker |
| `DB_USER` | `astro` | Usuario de la aplicación |
| `DB_PASSWORD` | `astro_ejemplo_local` | Contraseña de la aplicación |
| `MYSQL_ROOT_PASSWORD` | `root_ejemplo_local` | Contraseña de administración |

MySQL escucha dentro del contenedor en el puerto 3306 y se publica únicamente en
`127.0.0.1:3307`. Si el puerto 3307 está ocupado, cambia `DB_PORT` en `.env` antes
de arrancar. Reinicia Astro cuando cambies su configuración de conexión.

`src/lib/db.ts` usa un pool de conexiones de `mysql2/promise` y lee las variables
en el servidor mediante `astro:env/server`. `src/pages/productos.astro` tiene
`prerender = false`: ejecuta el `SELECT` en cada petición y renderiza una tabla HTML.
Las credenciales y la conexión se mantienen en el servidor. La página contempla
una tabla vacía y devuelve un estado 503 si falla la consulta, sin mostrar detalles
de conexión al visitante; el error completo queda en los logs del servidor.

## Consultar o modificar los datos

Abre el cliente MySQL del contenedor (introduce `DB_PASSWORD` cuando lo solicite):

```sh
docker compose exec mysql mysql --default-character-set=utf8mb4 -uastro -p astro_ejemplo
```

Dentro del cliente ejecuta, por ejemplo:

```sql
SELECT id, nombre, descripcion, precio, stock FROM productos ORDER BY id;

INSERT INTO productos (nombre, descripcion, precio, stock)
VALUES ('Cable USB-C', 'Cable de carga de dos metros.', 9.95, 20);

UPDATE productos SET stock = 15 WHERE id = 1;

exit;
```

Recarga `/productos` para ver los cambios. Si has cambiado el nombre de la BD o
el usuario en `.env`, adapta el comando del cliente.

## Estado, logs y parada

```sh
docker compose ps
docker compose logs --tail=50 mysql
npm run astro -- dev status
npm run astro -- dev logs

# Parar Astro y retirar el contenedor conservando los datos.
npm run astro -- dev stop
docker compose down
```

Si Docker no puede conectar con el daemon, abre Docker Desktop y espera a que
arranque. Si MySQL no pasa la comprobación de salud, consulta sus logs. Si la
página devuelve 503, comprueba que MySQL esté activo y que exista `.env` con los
valores correctos.

Los datos persisten en el volumen `mysql_data`. El script SQL y las variables de
inicialización de MySQL solo se aplican cuando el volumen está vacío. Cambiar las
contraseñas de `.env` no cambia las de una BD ya creada.

Para **borrar todos los datos de este ejemplo** y recrear la BD con el SQL inicial,
ejecuta lo siguiente únicamente si quieres perder las modificaciones guardadas:

```sh
docker compose down -v
docker compose up -d --wait --wait-timeout 180 mysql
```

## Compilar

```sh
npm run build
```

La compilación no necesita MySQL activo porque `/productos` se renderiza por
petición. Para ejecutar el resultado con el adaptador Node y cargar `.env`:

```sh
node --env-file=.env ./dist/server/entry.mjs
```

Documentación: [rutas y renderizado](https://docs.astro.build/en/guides/routing/),
[variables de entorno](https://docs.astro.build/en/guides/environment-variables/),
[cliente MySQL2](https://sidorares.github.io/node-mysql2/docs) e
[imagen oficial de MySQL](https://hub.docker.com/_/mysql).
