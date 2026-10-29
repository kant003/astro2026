import { getSecret } from 'astro:env/server';
import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';

export interface Producto extends RowDataPacket {
    id: number;
    nombre: string;
    descripcion: string;
    precio: string; // MySQL devuelve DECIMAL como texto para conservar su precisión.
    stock: number;
}

let pool: Pool | undefined;

function getPool(): Pool {
    if (!pool) {
        const required = (name: string): string => {
            const value = getSecret(name);
            if (!value) throw new Error(`Falta la variable de entorno ${name}`);
            return value;
        };
        const port = Number(required('DB_PORT'));
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
            throw new Error('DB_PORT debe ser un puerto válido');
        }

        pool = mysql.createPool({
            host: required('DB_HOST'),
            port,
            database: required('DB_NAME'),
            user: required('DB_USER'),
            password: required('DB_PASSWORD'),
            charset: 'utf8mb4',
            connectionLimit: 5,
            connectTimeout: 5000,
        });
    }
    return pool;
}

export async function listarProductos(): Promise<Producto[]> {
    const [productos] = await getPool().query<Producto[]>(
        'SELECT id, nombre, descripcion, precio, stock FROM productos ORDER BY id',
    );
    return productos;
}

// Libera las conexiones cuando Vite recarga este módulo durante el desarrollo.
if (import.meta.hot) {
    import.meta.hot.dispose(async () => {
        await pool?.end();
    });
}
