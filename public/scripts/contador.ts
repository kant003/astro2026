 let contador = 0
    document.getElementById("btn")?.addEventListener("click", incrementar)
    function incrementar(){
        contador++
        const elemento = document.getElementById("cont")
        if(elemento){
            elemento.textContent = String(contador)
        }
    }