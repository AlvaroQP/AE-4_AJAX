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
        //Accedemos al array de tamaños.
        let elemento = tamañosJQuery.losTamaños.tamaños
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
        //Accedemos al array de tamaños.
        let autor = autoresJQuery.losAutores.autores
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

    let error2 = ['mensajeError1','mensajeError2','mensajeError3','mensajeError4','mensajeError5'];
   
    for(let i= 0; i<error2.length; i++){
        $('mensajeError'[i]).html('');
    }
    //Se resetean los campos necesarios
    reseteoDatos();
    const reNom= /^[A-Z]/;
    //validación de los inputs nombre, direccion, email y teléfono
    if(!reNom.test($('#nombre').val()) || $.trim($('#nombre').val()) == ''){
        $('.mensajeError1').text('El nombre debe comenzar por mayúsculas');
        formValido = false;
    }
    // Dirección rellena
    if($.trim($('input[name="direccion"]').val()) =='') {
        $('.mensajeError2').text("La dirección debe ser válida");
        formValido = false;
    }
    // Teléfono relleno y en formato correcto:
    const reTelf = /^[6-9][0-9]{8}$/;
    if(!reTelf.test($('#tlf').val()) || $.trim($('#tlf').val()) =='') {
        $('.mensajeError3').text("El teléfono debe tener un formato adecuado");
        formValido = false;
    }
    // Email relleno y en formato correcto:
    const reEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!reEmail.test($('#email').val()) || $.trim($('#email').val()) =='') {
        $('.mensajeError4').text("El email debe tener un formato adecuado");
        formValido = false;
    }
    // Debe seleccionarse al menos un radio button
    let checked = false;
    const botonesRadio = $('.radio');
    $.each(botonesRadio, function(i, rad) {
        if(rad.checked) {
            checked = true;
        }
    });

    if(!checked){
        $('.mensajeError5').text("Debe seleccionar un tamaño para la pizza");
        formValido = false;
    }
    
    // Debe seleccionar al menos un checkbox
    checked = false;
    const botonesCheckbox = $('.checkbox');
    $.each(botonesCheckbox, function(i, cbox) {
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
    $('.pizza').text('');
    $('ingredientes').text('');
    $('.precioTotal').text('');
}

function reseteoInputs(){
    $('#nombre').val('');
    $('input[name="direccion"]').val('');
    $('#tlf').val('');
    $('#email').val('');
    $('input[type=radio]').prop('checked',false);
    $('input[type=checkbox]').prop('checked',false);
    $('.mensajeError1').text('');
    $('.mensajeError2').text('');
    $('.mensajeError3').text('');
    $('.mensajeError4').text('');
    $('.mensajeError5').text('');
}

//==============================================================================================================

function abrirModal() {
    console.log('No se si llego')
    $('#modal').removeClass('hidden')
    $('#overlay').removeClass('hidden')
}

function cerrarModal() {
    $('#modal').addClass('hidden')
    $('#overlay').addClass('hidden')
    reseteoDatos();
    reseteoInputs();
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
        let tamaños = tamañosJQuery.losTamaños.tamaños;
        $.each(botonesRadio, function(i,boton) {
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
        $('.pizza').text(frase1);    
        // Pasamos a calcular los precios de los ingredientes dentro de una nueva función
        calcularDatos2();
    }
}

function calcularDatos2() {
   
    const bCheckbox = $('.checkbox');

    $.ajax({
        type: 'GET',
        url: 'http://localhost:5500/json/ingredientesJQuery.json',
        async: true,
        dataType: 'json'
    }).done(calcula2)

    function calcula2(ingredientesJQuery){
        
        let ingredientes = ingredientesJQuery.losIngredientes.ingredientes;
        console.log(ingredientes)
        $.each(bCheckbox, function(i,boton) {
            console.log(boton)
            if(boton.checked) {
                ingreds.push(boton.value);
            }
        });

        for(let i=0; i<ingreds.length; i++){
            console.log(`los ingredientes elegidos son: ${ingreds[i]}`)
        }
        

        $.each(ingredientes, function(i, ing){
            if(ingreds.includes(ing.value)) {
                precioIngredientes += ing.precio;
            }
        })


        // Añadimos el precio de los ingredientes seleccionados al precio total
        precioTotal += precioIngredientes;
        
        $.each(ingreds, function(index, ingred){
            if(index != ingreds.length-1){
                frase2 += `${ingred} - `;
            }else{
                frase2 += `${ingred}. `;
            }
        })
    
        abrirModal()

        $('.ingredientes').text(frase2);
        $('.precioTotal').text(`Precio total: ${precioTotal}`);

        // Información a mostrar por el modal
        const mostrarFecha = new Intl.DateTimeFormat('es-Es', {
            year: 'numeric', month: 'numeric', day: 'numeric',
        }).format(new Date());

        const mostrarHora = new Intl.DateTimeFormat('es-Es', {
            hour: 'numeric', minute: 'numeric',
        }).format(new Date());

        $('.infoPedido').text(`Muchas gracias, ${$('#nombre').val()}, por su pedido realizado el ${mostrarFecha} a las ${mostrarHora}h.`);

        $('.infoPedido2').text(`Por favor, compruebe el email de confirmación enviado a: ${$('#email').val()}`);
    }

   
}
