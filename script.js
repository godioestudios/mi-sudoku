const tablero = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],

    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],

    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];



function encontrarVacio(tablero) {
    // recorre la fila 
    for (let fila = 0; fila < 9; fila++) {
        // recorre las columnas
        for (let columna = 0; columna < 9; columna++) {
            // encontrar el 0 
            if (tablero[fila][columna] === 0) {
                return [fila, columna];
            }

        }
    }

    return null;

}

function esValido(tablero, fila, columna, numero) {

    // Comprobar fila
    for (let c = 0; c < 9; c++) {
        if (tablero[fila][c] === numero) {
            return false;
        }
    }

    // Comprobar columna
    for (let f = 0; f < 9; f++) {
        if (tablero[f][columna] === numero) {
            return false;
        }
    }

    // Comprobar bloque 3x3
    const inicioFila = Math.floor(fila / 3) * 3;
    const inicioColumna = Math.floor(columna / 3) * 3;

    for (let f = inicioFila; f < inicioFila + 3; f++) {

        for (let c = inicioColumna; c < inicioColumna + 3; c++) {

            if (tablero[f][c] === numero) {
                return false;
            }
        }
    }

    return true;
}


function resolverSudoku(tablero) {

    const vacio = encontrarVacio(tablero);

    if (vacio === null) {
        return true;
    }

    const [fila, columna] = vacio;

    const numeros = mezclar([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const numero of numeros) {

        if (esValido(tablero, fila, columna, numero)) {

            tablero[fila][columna] = numero;

            if (resolverSudoku(tablero)) {
                return true;
            }

            tablero[fila][columna] = 0;
        }
    }

    return false;
}

function mezclar(array) {
    return [...array].sort(() => Math.random() - 0.5);
    // sort() necesita comparar dos elementos y decidir cuál va antes
    // () => Math.random() - Math.random() devuelve un número entre 0 y 1:
    //  0.5 : el 0.5 devuelve un número aleatorio entre -0.5 y 0.5.
    //cada comparación hace esto:
        // genera un número aleatorio
        // lo resta 0.5
        // si da positivo, el elemento va “más adelante”
        // si da negativo, va “más atrás”
        // Como todo es aleatorio, el orden queda mezclado.
    //ej : Math.random() 0.3 ,0.8 ,0.01 restamos 0.5 positivo o negativo depende que sale
    // Y sort() usa esos valores para poner elementos antes o después de otros, mezclándolos al azar.
}


function crearTableroVacio() {
    
    /*
    crea el 9x9 del sudoku
    from : Lo que hace es crear un array nuevo a partir de otra estructura.
        toma un objeto con length: 9
        crea un array con 9 elementos
        cada elemento es otra array de 9 ceros 
    fill() sirve para completar todos los elementos de un array con un mismo valor
    */
    return Array.from(
        { length: 9 },
        () => Array(9).fill(0)
    );
}

function generarSudokuCompleto() {
    //crea el tablero vacio
    const tablero = crearTableroVacio();
    // genera numeros aleatorios en eltablero
    resolverSudoku(tablero);

    return tablero;
}


// cuanta las soluciones posibles, deja de contar a la 2 porque sabe que mas de una solucion
function contarSoluciones(tablero) {
    // busca la casilla vacia
    const vacio = encontrarVacio(tablero);
    // si llego a un tablero completo y valido encontro una solucion
    if (vacio === null) {
        return 1;
    }
    // contiene la fila y columna de esa casilla 
    const [fila, columna] = vacio;
    // contador
    let soluciones = 0;
    // prueba del 1 al 9
    for (let numero = 1; numero <= 9; numero++) {
        // prueba si cumplen las reglas
        if (esValido(tablero, fila, columna, numero)) {
            // prueba el numero actual en una casilla vacia
            tablero[fila][columna] = numero;
            /* vuelva a llamar a la funcion para contar cuantas soluciones salen
            de esa posibilidad y suma el resultado */
            soluciones += contarSoluciones(tablero);
            /* cuando vuelve la llamada borra el numero probado para dejar
            la casilla vacia y probar otro  */
            tablero[fila][columna] = 0;
            /* si ya encontro dos soluciones termina  y devuelve 2 que significa
            "que hay 2 o mas soluciones"  */
            if (soluciones >= 2) {
                return 2;
            }
            /* Por ejemplo: una opción encuentra una solución y el contador queda en 1. 
            Otra opción encuentra una más y queda en 2; entonces la función devuelve 2.
            */ 
        }
    }

    return soluciones;
    /* El resultado significa:
        0: no encontró soluciones.
        1: encontró una solución única.
        2: encontró al menos dos soluciones.*/
}

/*CONTAR SOLUCIONES
1. Buscar una casilla vacía.
2. Si no hay casillas vacías:
    encontramos una solución
    devolver 1.
3. Obtener la fila y columna.
4. Crear contador = 0.
5. Probar números del 1 al 9.
6. Si el número es válido:
    colocarlo.
7. Llamar nuevamente a contarSoluciones().
8. Sumar las soluciones encontradas.
9. Quitar el número.
10. Si encontramos 2 soluciones:
    etenernos.
11. Devolver cantidad de soluciones.
*/

function quitarNumeros(tablero, cantidad) {
    // eliminados cuenta cuántos números logró quitar sin crear soluciones alternativas.
    let eliminados = 0;
    // Repite el proceso hasta alcanzar la cantidad pedida.
    while (eliminados < cantidad) {
        //Elige una casilla al azar: tanto la fila como la columna van de 0 a 8.
        const fila = Math.floor(Math.random() * 9);
        const columna = Math.floor(Math.random() * 9);
        // Si la casilla ya estaba vacía, continue salta al siguiente ciclo y elige otra.
        if (tablero[fila][columna] === 0) {
            continue;
        }
        // Guarda el número y prueba dejar vacía esa casilla.
        const numeroOriginal = tablero[fila][columna];

        tablero[fila][columna] = 0;
        // Cuenta las soluciones del tablero después de quitar el número.
        const soluciones = contarSoluciones(tablero);
        // Si queda exactamente una solución, conserva el 0 y aumenta el contador.
        // Si hay cero soluciones o más de una, restaura el número original.
        if (soluciones === 1) {

            eliminados++;

        } else {

            tablero[fila][columna] = numeroOriginal;
        }
    }
    /*GENERAR PUZZLE
    generar Sudoku completo
    mientras no lleguemos a la cantidad deseada:
        elegir casilla
        guardar número original
        poner 0
        contar soluciones
        si soluciones === 1:
            mantener el 0
        si soluciones > 1:
            restaurar número
    */
}


function generarSudoku(cantidad) {

    const tablero = crearTableroVacio();

    resolverSudoku(tablero);

    quitarNumeros(tablero, cantidad);

    return tablero;
}

//encuentra los numeros para definir los que van en la casilla vacia
function obtenerCandidatos(tablero, fila, columna) {
    // Crea una lista vacía para guardar los números permitidos.
    const candidatos = [];
    // Prueba cada número del 1 al 9.
    for (let numero = 1; numero <= 9; numero++) {
        /* esValido comprueba que el número no se repita en la fila, 
        la columna ni el bloque 3×3. Si pasa las comprobaciones, 
        push lo agrega a la lista.*/
        if (esValido(tablero, fila, columna, numero)) {
            candidatos.push(numero);
        }
    }
    return candidatos;
}

//  busca una casilla vacía que tenga un solo número posible
function encontrarSingle(tablero) {
    // ecorre fila por fila y columna por columna
    for (let fila = 0; fila < 9; fila++) {

        for (let columna = 0; columna < 9; columna++) {
            // Si la casilla no está vacía, la salta
            if (tablero[fila][columna] !== 0) {
                continue; // continue hace que el ciclo pase directamente 
                // a la siguiente casilla.
            }
            // Para una casilla vacía, obtiene sus números posibles
            const candidatos = obtenerCandidatos(
                tablero,
                fila,
                columna
            );
            // Si la lista tiene exactamente un candidato
            if (candidatos.length === 1) {
                // devuelve un objeto con la posición de la casilla y 
                // el único número que puede ir allí
                return {
                    fila,
                    columna,
                    numero: candidatos[0]
                };
            }
        }
    }

    return null;
}

// Pone numeros unicos en la casilla vacia como unico cancidato
function resolverLogicamente(tablero) {

    let movimientos = 0;

    while (true) {

        const single = encontrarSingle(tablero);

        if (single === null) {
            break;
        }

        tablero[single.fila][single.columna] = single.numero;

        movimientos++;
    }

    const terminado = encontrarVacio(tablero) === null;

    return {
        terminado,
        movimientos
    };
}
























// const facil = generarSudoku(35);
// const medio = generarSudoku(45);
// const dificil = generarSudoku(50);

// function imprimirSudoku(tablero) {
    
//     for (let fila = 0; fila < 9; fila++) {
        
//         let linea = "";
        
//         for (let columna = 0; columna < 9; columna++) {

//             const numero = tablero[fila][columna];
            
//             linea += numero === 0 ? ". " : numero + " ";
            
//             if (columna === 2 || columna === 5) {
//                 linea += "| ";
//             }
//         }
        
//         console.log(linea);
        
//         if (fila === 2 || fila === 5) {
//             console.log("---------------------");
//         }
//     }
// }

// const sudoku = generarSudoku(40);

// imprimirSudoku(sudoku);

// console.log("Soluciones:", contarSoluciones(sudoku));

/*
crear tablero vacío
        ↓
generar solución completa
        ↓
quitar números aleatoriamente
        ↓
comprobar solución única
        ↓
restaurar si rompe la unicidad
        ↓
repetir
        ↓
🎯 Sudoku válido para jugar
*/





