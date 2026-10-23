import { useState } from "react";

export default function ContadorReact() {
    const [contador, setContador] = useState(1);

    let incrementar = () => {
        setContador(contador + 1)
    }

    return <div>
        <button onClick={incrementar}>Pulsame</button>
        <p>{contador}</p>
    </div>

}
