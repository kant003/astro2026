//GET   http://localhost:1234/api/hora
export const prerender = false
export async function GET(){
    const fecha = new Date().toLocaleString("es-ES")
    return new Response(
        JSON.stringify({
            laFecha: fecha, 
            msg: "Hola"
        }),
        { headers: {"Content-Type":"application/json"} }
    )
}