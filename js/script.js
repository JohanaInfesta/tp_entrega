//Cargar contenido html en el index
function navigate(url) {
    $.get(url, function (data) {
        $('.main-content').html(data);
        if ($('.main-content').find('.js-topten').length) {
            getRankingList().then(function(list){
                if (!list.length) {
                    initRanking();
                } else {
                    renderList();
                }
            });
        }
    });
}

//Llama a la funcion navegaite con el contenido de portadas.html cuando inicializa la página
$(document).ready(function () {
    navigate('../html/portadas.html');
});

function renderList() {
    $('.tabla-topten tbody').html('<div class="loading"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>');
    getRankingList().then(function(list){
        
        $('.tabla-topten tbody').html('');
        
        list.sort(function(a, b){
            return a.position - b.position;
        });
        
        list.forEach(function(ranking){
            renderRanking(ranking);
        });
    });
}

//Hace un llamado a AJAX le pide la pagina manga.html con ID y por medio de una ventana emergente devuelve solo el contenido pedido
function openManga(id) {
    $.get('../html/manga.html', function (data) {
        let body = $('.modal-body');
        body.html(data);
        let manga = body.find(id);
        if (manga) {
            body.html(manga);
        } else {
            body.html('No se encontro el contenido');
        }
        $('#manga-modal').modal('show');
    });

}

//js para topten.html

//variables globales para las funciones relacionadas a topten.html
let groupId = 35;
let servicioRest = 'https://web-unicen.herokuapp.com/api/thing/';

//getRankingList devuelve una promesa, mediante promise, de la lista completa de datos en el servicio Rest
function getRankingList() {
    return new Promise(function (resolve, reject) {
        let list = [];
        $.get(servicioRest + 'group/' + groupId, function (data) {
            data.information.forEach(function (i) {
                
                let thing = {};
                
                if (typeof i['thing'] === 'object')
                    thing = i['thing'];
                
                thing.id = i['_id'];
                list.push(thing);
            });
            resolve(list);
        });
    });
}

//daleteRanking borra mediante el id a los objetos del servicio Rest
function deleteRanking(id) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: "DELETE",
            url: servicioRest + id,
            success: function (resultData) {
                resolve(resultData);
            },
            error: function (jqxml, status, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}

//Resetea el servicio Rest dejandolo sin elementos.
function cleanList() {
    return new Promise(function (resolve, reject) {
        getRankingList().then(function (list) {
            console.log(list);
            let promises = [];
            list.forEach(function (item) {
                promises.push(deleteRanking(item.id));
            });

            resolve(Promise.all(promises));
        });
    });
}

//createRanking crea los elementos en el servicio Rest
function createRanking(ranking) {
    return new Promise(function(resolve, reject){
        let info = {
            group: groupId,
            thing: ranking,
        };
        $.ajax({
            method: "POST",
            dataType: 'JSON',
            data: JSON.stringify(info),
            contentType: "application/json; charset=utf-8",
            url: servicioRest,
            success: function (resultData) {
                resolve(resultData);
            },
            error: function (jqxml, status, errorThrown) {
                reject(errorThrown);
            }
        });
    });
}

//utilizando la funcion createRanking le da valores al thing y crea tantos elementos como json tiene en el array de list.
function initRanking() { //init=inicializar || cuando se cargue la pagina de la tabla y el servicio este vacio esta funcion crea los elementos por defecto, y cuando se preciona el boton reset.
    let list = [{
        position: 1,
        image: 'http://i59.servimg.com/u/f59/18/97/06/08/29303111.jpg',
        title: 'One Piece',
        author: 'Eiichiro Oda',
        category: '+16',
    }, {
        position: 2,
        image: 'https://k61.kn3.net/taringa/2/7/7/3/1/5/49/kainenr/F09.jpg',
        title: 'Assasination Classroom',
        author: 'Yusei Matsui',
        category: 'ATP',
    }, {
        position: 3,
        image: 'https://68.media.tumblr.com/73e7004abae9880e43dd7189f14faf9e/tumblr_or1ekfoPxW1ukld20o5_1280.png',
        title: 'Shingeki no kyojin',
        author: 'Hajime Isayama',
        category: '+16',
    }, {
        position: 4,
        image: 'http://images.sgcafe.net/2014/05/Haikyuu_Poster.png',
        title: 'Haikyuu',
        author: 'Haruichi Furudate',
        category: 'ATP',
    }, {
        position: 5,
        image: 'http://1.bp.blogspot.com/-jVkgRIvF8_s/UT4PHQjACVI/AAAAAAAABdY/n6DeD_kYOVY/s1600/king01.jpg',
        title: 'Kingdom',
        author: 'Yasuhisa Hara',
        category: '+11',
    }, {
        position: 6,
        image: 'https://1.bp.blogspot.com/-rZ4hLBhLsoI/V7yiAL_KT5I/AAAAAAAAEtE/BrrtHhUnVxwnrFKpi7Zx5gi0IaWgt3nRwCK4B/s1600/%252811%2529.jpg',
        title: 'Nanatsu no taizai',
        author: 'Nakaba Suzuki',
        category: 'ATP',
    }, {
        position: 7,
        image: 'https://rr.img.naver.jp/mig?src=http%3A%2F%2Flivedoor.blogimg.jp%2Fotamemo%2Fimgs%2F4%2Fb%2F4b6deefa.jpg&twidth=1200&theight=1200&qlt=80&res_format=jpg&op=r',
        title: 'One punch-Man',
        author: 'One',
        category: '+16',
    }, {
        position: 8,
        image: 'https://s-media-cache-ak0.pinimg.com/originals/b8/51/98/b85198d0409a4c2e3bac1f9fdf3beca3.jpg',
        title: 'Boku dake ga inai Machi(Desaparecido)',
        author: 'Kei Sanbe',
        category: 'ATP',
    }, {
        position: 9,
        image: 'https://lh3.googleusercontent.com/-sTSMelNNCQ0/VpNucBmc7bI/AAAAAAAAFAU/YcYMBgv7GHI/w720-h1280/Screenshot_2016-01-04-21-35-45.png',
        title: 'Tokyo Ghoul',
        author: 'Sui Ishida',
        category: '+18',
    }, {
        position: 10,
        image: 'https://s.yimg.com/ut/api/res/1.2/dVpkCf6kerPbntEM4I.Epg--/dz02MDA7aD02MDA7cT04MTtmaT1maXQ7YXBwaWQ9eXR3bWFsbA--/http://imgcld.zenfs.com:80/ps_image_prod/item/p069972886965-item-6246xf3x0400x0600-m.jpg',
        title: 'Boku no hero academia',
        author: 'Kohei Horikoshi',
        category: 'ATP',
    }];

    cleanList().then(function (results) {
        let promises = [];
        
        for (let i = 0; i < list.length; i++) {
            promises.push(createRanking(list[i]));
        }
        
        Promise.all(promises).then(renderList);
    });
}
//renderRanking crea con los elementos del servicio Rest las filas de la tabla
function renderRanking(ranking){
    $.get('../html/ranking.html', function(html){
        let list = $(html);
        list.find('.js-ranking-position').append(ranking.position);
        let img = new Image();
        img.src = ranking.image;
        list.find('.js-ranking-image').append(img);
        list.find('.js-ranking-title').append(ranking.title);
        list.find('.js-ranking-author').append(ranking.author);
        list.find('.js-ranking-category').append(ranking.category);
        list.find('.js-ranking-btn').attr('id', ranking.id);
        $('.tabla-topten tbody').append(list);
    });
}

function addRanking(){
    
    let elemento = {
        position: $('.js-input-position').val(),
        image: $('.js-input-image').val(),
        title: $('.js-input-title').val(),
        author: $('.js-input-author').val(),
        category: $('.js-input-category').val(),
    }
    
    $('.js-input-position').val('');
    $('.js-input-image').val('');
    $('.js-input-title').val('');
    $('.js-input-author').val('');
    $('.js-input-category').val('');
    createRanking(elemento).then(renderList);
}

function cleanNewsletter(){
    $('.js-input-newsletter').val('');
    alert('¡Gracias por suscribirte a nuestro newsletter!');
}