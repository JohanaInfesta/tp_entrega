//Cargar contenido html en el index
function navigate(url) {
    $.get( url, function( data ) {
        $( '.main-content' ).html( data );
    
    });
}

//Llama a la funcion navegaite con el contenido de portadas.html cuando inicializa la página
$(document).ready(function(){
    navigate('../html/portadas.html');
});

//Hace un llamado a AJAX le pide la pagina manga.html y por ID y por medio de una ventana emergente devuelve solo el contenido pedido
function openManga(id) {
    $.get('../html/manga.html', function( data ) {
        let body = $('.modal-body');
        body.html( data );
        let manga = body.find(id);
        if (manga) {
            body.html(manga);
        }else {
            body.html('No se encontro el contenido');
        }
        $('#manga-modal').modal('show');
    });
    
}