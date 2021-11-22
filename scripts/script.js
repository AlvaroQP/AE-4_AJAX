const submit = document.querySelector('.submit');
const input_nombre = document.querySelector('.input_nombre');
const input_dir = document.querySelector('.input_dir');
const input_tel = document.querySelector('.input_tel');
const input_email = document.querySelector('.input_email');
const mensajeError = document.querySelectorAll('.mensajeError');
const mensajeError1 = document.querySelector('.mensajeError1');
const mensajeError2 = document.querySelector('.mensajeError2');
const mensajeError3 = document.querySelector('.mensajeError3');
const mensajeError4 = document.querySelector('.mensajeError4');
const mensajeError5 = document.querySelector('.mensajeError5');
const mensajeError6 = document.querySelector('.mensajeError6');
const modal = document.querySelector('.modal');
const botonCerrarModal = document.querySelector('.cerrar_modal');
const overlay = document.querySelector('.overlay');
const infoPedido = document.querySelector('.infoPedido');
const infoPedido2 = document.querySelector('.infoPedido2');
const mostrarPizza = document.querySelector('.pizza');
const mostrarIngredientes = document.querySelector('.ingredientes');
const mostrarPrecio = document.querySelector('.precioTotal');
const contenedorPizzas = document.querySelector('.contenedor_pizzas');
const contenedorIngredientes = document.querySelector('.contenedor_ingredientes');
const contenedorAvatares = document.querySelector('.nosotros');
const botonRefrescar = document.querySelector('.refresh');
let precioTotal = 0;
let precioPizza = 0;
let precioIngredientes = 0;
let pizzaElegida = '';
let frase1 = 'Pizza: ';
let frase2 = 'Ingredientes: ';
let ingreds = [];
//==============================================================================================================

function primeraRequest() {

    const request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:5500/json/tamaños.json', true);
    request.send();

    // Añadimos un eventListener de 'load' a la request, lo que equivaldría a una respuesta de 200 OK:
    request.addEventListener('load', function() {
        const json = JSON.parse(this.responseText);
        const tamaños = json.tamaños;

        for(let elem of tamaños) {
            const contenedor = document.createElement("div");
            contenedor.setAttribute('class', 'contenedor_tamano');  // <div class="contenedor_tamano"></div>
            
            const html = `
                <img src="${elem.src}" alt="icono pizza" class="icono_pizza_${elem.icono}">
                <div>
                    <input type="radio" id="${elem.tamaño}" name="tamaño" value="${elem.tamaño}" class="radio" data-id="${elem.precio}">
                    <label for="${elem.tamaño}">${elem.tamaño} (${elem.precio}€)</label>
                </div>
            `;

            contenedor.insertAdjacentHTML('beforeend', html);
            contenedorPizzas.append(contenedor);
        }
        segundaRequest();
    });

    // Si algo ha ido mal en la petición, alertamos (con mucha tristeza):
    request.addEventListener('error', function() {
        alert('Algo ha ido mal 😢😢😢');
    });
}

//==============================================================================================================

function segundaRequest() {
    const request2 = new XMLHttpRequest();
    request2.open('GET', 'http://localhost:5500/json/ingredientes.json', true);
    request2.send();

    // Añadimos un eventListener de 'load' a la request, lo que equivaldría a una respuesta de 200 OK:
    request2.addEventListener('load', function() {
        const json = JSON.parse(this.responseText);
        const ingredientes = json.ingredientes;
        
        for(let elem of ingredientes) {
            const contenedor = document.createElement("div");
            contenedor.setAttribute('class', 'cont_ingred');

            const html = `
                <img src="${elem.src}" alt="${elem.value}" class="ingrediente">
                <div>
                    <input type="checkbox" id="${elem.ingrediente}" name="ingredientes" value="${elem.value}" class="checkbox"> 
                    <label for="${elem.ingrediente}">${elem.value}</label>
                </div>
            `;

            contenedor.insertAdjacentHTML('beforeend', html);
            contenedorIngredientes.append(contenedor);
        }
    });

    request2.addEventListener('error', function() {
        alert('Algo ha ido mal 😢😢😢');
    });
}

//==============================================================================================================

// Función para el procesamiento del formulario y la validación de datos:
function procesarFormulario() {
    submit.addEventListener('click', function(event) {
        let formValido = true;
        event.preventDefault();
    
        // Reseteamos los mensajes de error:
        mensajeError.forEach(function(mensaje) {
            mensaje.textContent = '';
        });

        // Reseteamos campos necesarios:
        reseteoDatos();
    
        // Nombre relleno y comenzando por mayúsculas:
        const reNom = /^[A-Z]/;
        if(!reNom.test(input_nombre.value) || input_nombre.value.trim() == '') {
            mensajeError1.textContent = "El nombre debe comenzar por mayúsculas";
            formValido = false;
        }
    
        // Dirección rellena
        if(input_dir.value.trim() == '') {
            mensajeError2.textContent = "La dirección debe ser válida";
            formValido = false;
        }
    
        // Teléfono relleno y en formato correcto:
        const reTelf = /^[6-9][0-9]{8}$/;
        if(!reTelf.test(input_tel.value) || input_tel.value.trim() == '') {
            mensajeError3.textContent = "El teléfono debe tener un formato adecuado";
            formValido = false;
        }
    
        // Email relleno y en formato correcto:
        const reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!reEmail.test(input_email.value) || input_email.value.trim() == '') {
            mensajeError4.textContent = "El email debe tener un formato adecuado";
            formValido = false;
        }
    
        // Debe seleccionarse al menos un radio button
        let checked = false;
        const botonesRadio = document.querySelectorAll('.radio');
        botonesRadio.forEach(function(rad) {
            if(rad.checked) {
                checked = true;
            }
        });
    
        if(!checked) {
            mensajeError5.textContent = 'Debe seleccionar un tamaño para la pizza';
            formValido = false;
        }
    
        // Debe seleccionar al menos un checkbox
        checked = false;
        const botonesCheckbox = document.querySelectorAll('.checkbox');
        botonesCheckbox.forEach(function(cbox) {
            if(cbox.checked) {
                checked = true;
            }
        });
    
        if(!checked) {
            mensajeError6.textContent = 'Debe seleccionar al menos un ingrediente';
            formValido = false;
        }
    
        // Si el formulario es válido, abrimos modal mostrando información al cliente
        if(formValido) {
            calcularDatos();
            abrirModal();
        }   
    });
}

//==============================================================================================================

function abrirModal() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}

function cerrarModal() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

// Podemos cerrar el modal clicando el botón "X"
botonCerrarModal.addEventListener('click', function() {
    cerrarModal();
});

// Podemos cerrar el modal clicando fuera de éste
overlay.addEventListener('click', function() {
    cerrarModal();
});

// Podemos cerrar el modal pulsando "esc"
document.addEventListener('keydown', function(event) {
    if(event.key === 'Escape') {
        cerrarModal();
    }
});

//==============================================================================================================


// El precio será calculado desde el servidor mediante peticiones AJAX
function calcularDatos() {
    
    const botonesRadio = document.querySelectorAll('.radio');

    // Petición para obtener el precio según el tamaño de la pizza
    const requestPrecios1 = new XMLHttpRequest();
    requestPrecios1.open('GET', 'http://localhost:5500/json/tamaños.json', true);
    requestPrecios1.send();

    // Añadimos un eventListener de 'load' a la request, lo que equivaldría a una respuesta de 200 OK:
    requestPrecios1.addEventListener('load', function() {
        const json = JSON.parse(this.responseText);
        const tamaños = json.tamaños;

        botonesRadio.forEach(function(boton) {
            if(boton.checked) {
                pizzaElegida = boton.getAttribute('value');
            }
        });

        // Seleccionamos el precio de la pizza directamente desde el JSON
        for(let elem of tamaños) {
            if(elem.tamaño === pizzaElegida) {
                precioPizza = elem.precio;
            }
        }

        frase1 += `${pizzaElegida}`;
        // Sumamos el precio del tamaño de la pizza al precio total
        precioTotal += precioPizza;
        mostrarPizza.textContent = frase1;    
        // Pasamos a calcular los precios de los ingredientes dentro de una nueva función
        calcularDatos2();
    });

    requestPrecios1.addEventListener('error', function() {
        alert('Algo ha ido mal 😢😢😢');
    });
}
    

function calcularDatos2() {
    
    const botonesCheckbox = document.querySelectorAll('.checkbox');

    // Petición para obtener el precio de los ingredientes
    const requestPrecios2 = new XMLHttpRequest();
    requestPrecios2.open('GET', 'http://localhost:5500/json/ingredientes.json', true);
    requestPrecios2.send();

    // Añadimos un eventListener de 'load' a la request, lo que equivaldría a una respuesta de 200 OK:
    requestPrecios2.addEventListener('load', function() {
        const json = JSON.parse(this.responseText);
        const ingredientes = json.ingredientes;

        botonesCheckbox.forEach(function(boton) {
            if(boton.checked) {
                ingreds.push(boton.value);
            }
        });

        // Seleccionamos el precio de los ingredientes directamente desde el JSON
        for(let elem of ingredientes) {
            if(ingreds.includes(elem.value)) {
                precioIngredientes += elem.precio;
            }
        }

        // Añadimos el precio de los ingredientes seleccionados al precio total
        precioTotal += precioIngredientes;
        
        ingreds.forEach(function(ingred, index) {
            if(index !== ingreds.length -1) {
                frase2 += `${ingred} - `;
            } else {
                frase2 += ` ${ingred}.`
            }
        });

        mostrarIngredientes.textContent = frase2;
        mostrarPrecio.textContent = `Precio total: ${precioTotal}€`;

        // Información a mostrar por el modal
        const mostrarFecha = new Intl.DateTimeFormat('es-Es', {
            year: 'numeric', month: 'numeric', day: 'numeric',
        }).format(new Date());

        const mostrarHora = new Intl.DateTimeFormat('es-Es', {
            hour: 'numeric', minute: 'numeric',
        }).format(new Date());

        infoPedido.textContent = `Muchas gracias, ${input_nombre.value}, por su pedido realizado el ${mostrarFecha} a las ${mostrarHora}h.`;
        infoPedido2.textContent = `Por favor, compruebe el email de confirmación enviado a: ${input_email.value}`;
    });

    requestPrecios2.addEventListener('error', function() {
        alert('Algo ha ido mal 😢😢😢');
    });
}

    
//==============================================================================================================

// Adicionalmente, aunque no se pida en la actividad y para practicar más con JSON,
// insertamos nuestros avatares mediante otra petición con AJAX.
function avataresRequest() {
    const request3 = new XMLHttpRequest();
    request3.open('GET', 'http://localhost:5500/json/autores.json', true);
    request3.send();

    // Añadimos un eventListener de 'load' a la request, lo que equivaldría a una respuesta de 200 OK:
    request3.addEventListener('load', function() {
        const json = JSON.parse(this.responseText);
        const autores = json.autores;
        
        for(let elem of autores) {
            const html = `<img src="${elem.src}" alt="${elem.autor}" class="imagen_autor">`;
            contenedorAvatares.insertAdjacentHTML('beforeend', html);
        }
    });

    request3.addEventListener('error', function() {
        alert('Algo ha ido mal 😢😢😢');
    });
}

//==============================================================================================================


// Botón refrescar: al clicarlo hacemos una nueva petición para traer posibles cambios de datos de nuestra aplicación
botonRefrescar.addEventListener('click', function() {

    // Para evitar duplicados, reseteamos los elementos iniciales:
    contenedorPizzas.innerHTML = '';
    contenedorIngredientes.innerHTML = '';
    
    // Ejecutamos la primera request que, una vez procesada, llamará a la segunda.
    // De este modo, en caso de tener modificaciones en nuestros ficheros json, se actualizarían automáticamente.
    primeraRequest(); 
});

//==============================================================================================================

function reseteoDatos() {
    precioTotal = 0;
    precioPizza = 0;
    precioIngredientes = 0;
    pizzaElegida = '';
    frase1 = 'Pizza: ';
    frase2 = 'Ingredientes: ';
    ingreds = [];
    mostrarPizza.textContent = '';
    mostrarIngredientes.textContent = '';
    mostrarPrecio.textContent = '';
}

//==============================================================================================================

// Ejecutamos la primera request que, una vez procesada, llamará a la segunda.
primeraRequest();
// Ejecutamos la función para el procesamiento del formulario y la validación de datos.
procesarFormulario();
// Ejecutamos la request para obtener los avatares de los autores de la actividad
avataresRequest();