$(document).ready(function(){

    //Cuando carga la página mediante AJAX se carga la sección de 
    //los tamañas, de los ingredientes y de las imagenes de los 
    //componentes del equipo
    primeraRequest();  //Los ingredientes se carga, una vez cargados los tamñaos

    avataresRequest();
   
    //Botón refrescar página
    $('.refresh').on('click', function(){

        $('contenedor_pizzas').html('');
        $('contenedor_ingredientes').html('');

        primeraRequest();
        segundaRequest();

    })

    //Botón enviar
    $('form').on('submit', function(event){
        let formValido = true;
        event.preventDefault();
        procesarFormulario(formValido);
    })


});

//Variables que se necesitan para mostrar el resultado de la compra
let precioTotal = 0;
let precioPizza = 0;
let precioIngredientes = 0;
let pizzaElegida = '';
let frase1 = 'Pizza: ';
let frase2 = 'Ingredientes: ';
let ingreds = [];

function primeraRequest(){
    $.ajax({
        type : 'GET',
        url : 'http://localhost:5500/json/tamañosJQuery.json',
        async : true,
        dataType : 'json'

    }).done(primera);

    function primera(tamañosJQuery) {
        console.log(arguments);
        console.log(tamañosJQuery);
        //Accedemos al array de tamaños.
        let elemento = tamañosJQuery.losTamaños.tamaños
        console.log(elemento);
        //Nos aseguramos que no se dupliquen filas
        $('.contenedor_pizzas').html('');
        //Con el bucle for-each cargamos la respuesta AJAX
        $.each(elemento, function(i, tam){
            $(`<div class="contenedor_tamano">
                <img src="${tam.src}" alt="icono pizza" class="icono_pizza_${tam.icono}">
                <div>
                <input type="radio" id="${tam.tamaño}" name="tamaño" value="${tam.tamaño}" class="radio" data-id="${tam.precio}">
                <label for="${tam.tamaño}">${tam.tamaño} (${tam.precio}€)</label>
                </div>
            </div>`).appendTo('.contenedor_pizzas');
        });
    }
    segundaRequest();
}

function segundaRequest(){
    $.ajax({
        type : 'GET',
        url : 'http://localhost:5500/json/ingredientesJQuery.json',
        async : true,
        dataType : 'json'

    }).done(segunda);
    function segunda(ingredientesJQuery) {
        console.log(arguments);
        console.log(ingredientesJQuery);
        //Accedemos al array de tamaños.
        let ingrediente = ingredientesJQuery.losIngredientes.ingredientes
        console.log(ingrediente);
        //Nos aseguramos que no se dupliquen filas
        $('.contenedor_ingredientes').html('');
        //Con el bucle for-each cargamos la respuesta AJAX
        $.each(ingrediente, function(i, ing){
            $(`<div class="contenedor_ingred">
            <img src="${ing.src}" alt="${ing.value}" class="ingrediente">
            <div>
                <input type="checkbox" id="${ing.ingrediente}" name="ingredientes" value="${ing.value}" class="checkbox"> 
                <label for="${ing.ingrediente}">${ing.value}</label>
            </div>
            </div>`).appendTo('.contenedor_ingredientes');
        })
    }

}

function avataresRequest(){
    $.ajax({
        type : 'GET',
        url : 'http://localhost:5500/json/autoresJQuery.json',
        async : true,
        dataType : 'json'

    }).done(avatares);
    function avatares(autoresJQuery) {
        console.log(arguments);
        console.log(autoresJQuery);
        //Accedemos al array de tamaños.
        let autor = autoresJQuery.losAutores.autores
        console.log(autor);
        //Nos aseguramos que no se dupliquen filas
        $('.nosotros').html('');
        //Con el bucle for-each cargamos la respuesta AJAX
        $.each(autor, function(i, aut){
            $(`<img src="${aut.src}" alt="${aut.autor}" class="imagen_autor">`).appendTo('.nosotros');
        })
    }
}

function procesarFormulario(formValido){

    let error = $('.mensajeError');
    $.each(error, function(){
        error.html('');
    })
    //Se resetean los campos necesarios
    reseteoDatos();
    const reNom= /^[A-Z]/;
    //validación de los inputs nombre, direccion, email y teléfono
    if(!reNom.test($('#nombre').value) || $.trim($('#nombre').value) == ''){
        $('.mensajeError1').text('El nombre debe comenzar por mayúsculas');
        formValido = false;
    }

    // Dirección rellena
    if($.trim($('input[name="direccion"]').value) =='') {
        $('.mensajeError2').text("La dirección debe ser válida");
        formValido = false;
    }

    // Teléfono relleno y en formato correcto:
    const reTelf = /^[6-9][0-9]{8}$/;
    if(!reTelf.test($('#tel').value) || $.trim($('tlf').value) =='') {
        $('.mensajeError3').text("El teléfono debe tener un formato adecuado");
        formValido = false;
    }

    // Email relleno y en formato correcto:
    const reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!reEmail.test($('#email').value) || $.trim($('#email').value) =='') {
        $('.mensajeError4').text("El email debe tener un formato adecuado");
        formValido = false;
    }

    // Debe seleccionarse al menos un radio button
    let checked = false;
    const botonesRadio = $('.radio');
    botonesRadio.each(function(rad) {
        if(rad.checked) {
            checked = true;
        }
    });

    if(!checked) {
        $('.mensajeError5').text("Debe seleccionar un tamaño para la pizza");
        formValido = false;
    }

    // Debe seleccionar al menos un checkbox
    checked = false;
    const botonesCheckbox = $('.checkbox');
    botonesCheckbox.each(function(cbox) {
        if(cbox.checked) {
            checked = true;
        }
    });

    if(!checked) {
        $('.mensajeError6').text("Debe seleccionar al menos un ingrediente");
        formValido = false;
    }

    // Si el formulario es válido, abrimos modal mostrando información al cliente
    if(formValido) {
        calcularDatos();
        abrirModal();
    }  



}

//==============================================================================================================

function reseteoDatos() {
    precioTotal = 0;
    precioPizza = 0;
    precioIngredientes = 0;
    pizzaElegida = '';
    frase1 = 'Pizza: ';
    frase2 = 'Ingredientes: ';
    ingreds = [];
    //mostrarPizza.textContent = '';
    //mostrarIngredientes.textContent = '';
    //mostrarPrecio.textContent = '';
}

//==============================================================================================================

function abrirModal() {
    $('#modal').removeClass('hidden')
    $('#overlay').removeClass('hidden')
}

function cerrarModal() {
    $('#modal').addClass('hidden')
    $('#overlay').addClass('hidden')
}

// Podemos cerrar el modal clicando el botón "X"
$('.cerrar_modal').on('click', function(){
    cerrarModal();
})

// Podemos cerrar el modal clicando fuera de éste
$('#overlay').on('click', function(){
    cerrarModal();
})

// Podemos cerrar el modal pulsando "esc"
$(document).on('keydown', function(event){
    if(event.key === 'Escape') {
        cerrarModal();
    }
})

// El precio será calculado desde el servidor mediante peticiones AJAX
function calcularDatos() {
    
    const botonesRadio = $('.radio');

    $.ajax({
        type: 'GET',
        url: 'http://localhost:5500/json/tamañosJQuery.json',
        async: true,
        dataType: 'json'
    }).done(calcula1)

    function calcula1(tamañosJQuery){
        let botonesRadio = $('.botonesRadio');
        let tamaños = tamañosJQuery.losTamaños.tamaños;
        botonesRadio.each(function(boton) {
            if(boton.checked) {
                pizzaElegida = boton.value
            }
        })

        $.each(tamaños, function(i, tam){
            if(tam.tamaño === pizzaElegida) {
                precioPizza = tam.precio;
            }
        })

        frase1 += `${pizzaElegida}`;
        // Sumamos el precio del tamaño de la pizza al precio total
        precioTotal += precioPizza;
        $('mostrarPizza').textContent = frase1;    
        // Pasamos a calcular los precios de los ingredientes dentro de una nueva función
        calcularDatos2();
    }
}

function calcularDatos2() {
    
    const botonesCheckbox = $('.checkBox');

    $.ajax({
        type: 'GET',
        url: 'http://localhost:5500/json/ingredientesJQuery.json',
        async: true,
        dataType: 'json'
    }).done(calcula2)

    function calcula2(ingredientesJQuery){
        let ingredientes = ingredientesJQuery.losIngredientes.ingredientes;
        botonesCheckbox.each(function(boton) {
            if(boton.checked) {
                ingreds.push(boton.value);
            }
        });

        $.each(ingredientes, function(i, ing){
            if(ing.includes(ing.value)) {
                precioIngredientes += ing.precio;
            }
        })

        // Añadimos el precio de los ingredientes seleccionados al precio total
        precioTotal += precioIngredientes;

        $.Each(ingreds, function(ingred, index){
            if(index != ingreds.length-1){
                frase2 += `${ingred} - `;
            }else{
                frase2 += `${ingred}. `;
            }
        })

        $('mostrarIndredientes').textContent(frase2);
        $('mostrarPrecio').textContent(`Precio total: ${precioTotal}`);

        // Información a mostrar por el modal
        const mostrarFecha = new Intl.DateTimeFormat('es-Es', {
            year: 'numeric', month: 'numeric', day: 'numeric',
        }).format(new Date());

        const mostrarHora = new Intl.DateTimeFormat('es-Es', {
            hour: 'numeric', minute: 'numeric',
        }).format(new Date());

        $('.infoPedido').textContent(`Muchas gracias, ${$('nombre').value}, por su pedido realizado el ${mostrarFecha} a las ${mostrarHora}h.`);

        $('infoPedido2').textContent(`Por favor, compruebe el email de confirmación enviado a: ${$('email').value}`);
    }
}
