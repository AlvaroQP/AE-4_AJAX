$(document).ready(function(){
    console.log('todo en orden');
    
    $.ajax({
        type : 'GET',
        url : 'http://localhost:5500/json/tamañosJQuery.json',
        async : true,
        dataType : 'json'

    }).done(primeraRequest, segundaRequest, avataresRequest);

    function primeraRequest(tamañosJQuery) {
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

    $.ajax({
        type : 'GET',
        url : 'http://localhost:5500/json/ingredientesJQuery.json',
        async : true,
        dataType : 'json'

    }).done(segundaRequest);
    function segundaRequest(ingredientesJQuery) {
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

    $.ajax({
        type : 'GET',
        url : 'http://localhost:5500/json/autoresJQuery.json',
        async : true,
        dataType : 'json'

    }).done(avataresRequest);
    function avataresRequest(autoresJQuery) {
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


});


