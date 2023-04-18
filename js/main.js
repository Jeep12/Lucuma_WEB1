"use strict";
const url = 'https://60c935747dafc90017ffc4ed.mockapi.io/api/albumnes';

let MAXAleatorios = 3; // esta variable es la cantidad de aleatorios que agregara
let jsonAux;// A esta variable le asigno el json para hacer el filtrado de busqueda

//Variables globales para el uso de classLists y no tenes que declararla cada vez que quiera remover clases
let noticias = document.getElementById("noticias");
let informacion = document.getElementById("informacion");
let articulosInfo = document.getElementById("articulos");

inicioInformacion();
inicioNoticias();
EnviarParteArticulos();

let parteInformacion = document.querySelectorAll("#inicio");
parteInformacion.forEach(e=>e.addEventListener("click",inicioInformacion));

async function inicioInformacion() {
   // cuando se ejecuta esta funcion remueve las clases que le agrege para los links de navegacion que queria que tengan solo una columna
    articulosInfo.classList.remove("ocultar");
    noticias.classList.remove("ocultar");
    informacion.classList.remove("col-sm-12");
   
    fetch("http://localhost/lucuma/inicioInfomacion.html").then (respuesta => {
        if (respuesta.ok){
            respuesta.text().then(ParteInformacion => {
            informacion.innerHTML=ParteInformacion;
            })
        }else {
            informacion.innerHTML="Error";
        }
    }) .catch(error => {
            console.log(error);
            informacion.innerHTML = "<h1>Error - Connection Failed!</h1>";
        });
} 

async function inicioNoticias() {
    fetch("http://localhost/lucuma/inicioNoticias.html").then (respuesta => {
        if (respuesta.ok){
            respuesta.text().then (ParteNoticias => {
            noticias.innerHTML=ParteNoticias;
            })
        }else {
            noticias = "Error";
        }
    })
        .catch(error => {
            console.log(error);
            noticias.innerHTML = "<h1>Error - Connection Failed!</h1>";
        });
} 

let parteAutores = document.querySelectorAll("#autores");
parteAutores.forEach(e=>e.addEventListener("click",quienesSomos));

async function quienesSomos() {
    noticias.classList.add("ocultar");
    informacion.classList.add("col-sm-12");
    articulosInfo.classList.add("ocultar");
    fetch("http://localhost/lucuma/quienesSomos.html").then(respuesta => {
        if (respuesta.ok){
            respuesta.text().then(ParteQuienesSomos => {
                informacion.innerHTML=ParteQuienesSomos;
            })
        }else{
            informacion.innerHTML="Error";
        }
    })
        .catch(error => {
            console.log(error);
            informacion.innerHTML = "<h1>Error - Connection Failed!</h1>";
        });
}
async function EnviarParteArticulos() {
    fetch("http://localhost/lucuma/articulos.html").then(respuesta => {
        if (respuesta.ok){
            respuesta.text().then(ParteArticulos => {
                articulosInfo.innerHTML=ParteArticulos;
            })
        }else{
            informacion.innerHTML="Error";
        }
    })
        .catch(error => {
            console.log(error);
            articulosInformacion.innerHTML = "<h1>Error - Connection Failed!</h1>";
        });
    }

    let recomendados = document.querySelectorAll("#recomendaciones");
    recomendados.forEach(e=>e.addEventListener("click",EnviarAlbumnesRecomendados));

    async function EnviarAlbumnesRecomendados() {
 
        noticias.classList.add("ocultar");
        informacion.classList.add("col-sm-12");
        articulosInfo.classList.add("ocultar");
        fetch("http://localhost/lucuma/tablaDinamica.html").then (respuesta => {
            if (respuesta.ok){
                respuesta.text().then(ParteTablaDinamica => {
                informacion.innerHTML=ParteTablaDinamica;

                let enviar = document.getElementById("enviar");
                enviar.addEventListener("click",agregar);

                let buscar = document.getElementById("buscarGenero");
                buscar.addEventListener("click", busquedaGeneros);

                let restaurarTabla = document.getElementById("restaurar");
                restaurarTabla.addEventListener("click",restaurar);

                let cargarAleatorios =  document.getElementById("aleatorios");
                cargarAleatorios.addEventListener("click",generarAleatorio);

                EnviarDatos();
            })
        }else {
            informacion="Error";
        }
    })  
    .catch(error => {
        console.log(error);
        informacion.innerHTML = "<h1>Error - Connection Failed!</h1>";
    });
    
}


// ------PARTE REST----------  ------PARTE REST----------  ------PARTE REST----------  ------PARTE REST---------- 


async function EnviarDatos() {
    let eliminarSeleccionado =  document.getElementById("eliminar");
    let actualizarSeleccionado = document.getElementById("update");
    let tabla = document.getElementById("tabla");
    // Lo primero que hace la funcion es poner un titulo en la tabla que dice que esta cargando esperando la respuesta del servicio rest
    tabla.innerHTML="<h1> Cargando... </h1>";
    try {
        let res = await fetch(url);
        let json = await res.json();
        // cuando ya recibo el json vacio la tabla
        tabla.innerHTML=" ";
        // y despues cargo el titulo y los elementos del servicio
        tabla.innerHTML += 
        "<tr>"+
        "<td>"+"Artista"+"</td>"+
        "<td>"+"Album"+"</td>"+
        "<td>"+"Año"+"</td>"+
        "<td>"+"Genero"+"</td>"+
        "<td>"+"#"+"</td>"+
        "</tr>";
    for (const albumnes of json) {
            let artista = albumnes.nombreBanda;
            let album = albumnes.nombreAlbum;
            let anio = albumnes.anioAlbum;
            let genero = albumnes.generoAlbum;
            // creo el input para poder seleccionar una fila y asi eliminarla o actualizarla
            let check = "<input type="+"radio"+" id="+"check "+"name="+"check"  +" >";
            tabla.innerHTML += 
            "<tr>"+
            "<td>" +artista+"</td>"+
            "<td>" +album+"</td>"+
            "<td>" +anio+"</td>"+
            "<td>" +genero+"</td>"+
            "<td>"+check+"</td>"
            +"</tr>";  
            // sobre escribo (acumulo) los elementos con innerHTML
        } 
        //Llamo al boton eliminar del dom
       eliminarSeleccionado.addEventListener("click",borrarSelect);
        function borrarSelect (event){
            event.preventDefault();
            for (let i = 0;i<json.length;i++){
                //Corro un for con el tamaño del json, ya que cada fila va a tener un input
                if (check[i].checked){
                    //en cada iteracion va a preguntar si ese input esta checkeado y si lo esta,llamo a la funcion eliminar 
                    //con el id como parametro de la fila chekeada 
                    eliminar(json[i].id);
                    
                }
            }
        }

        //llamo al boton update del dom
        actualizarSeleccionado.addEventListener("click", actualizarSelect);
        function actualizarSelect (event){
            event.preventDefault();
            // corro un for con el tamaño del json
            for (let i = 0;i<json.length;i++){
                if (check[i].checked){
                    // pregunta si en cada iteracion el input esta chekeado, si lo esta envia el id a la funcion actualizar
                    actualizar(json[i].id);
                    
                }
            }
        }
        //asigno el json que traemos desde mockapi a jsonAux para poder trabajar con los filtros de busqueda
        jsonAux=json  
    } catch (error) {
        console.log(error);
    }	 
}
//FUNCION QUE AGREGO UN JSON AL SERVICIO
async function agregar(event) {
    event.preventDefault();
    let artista = document.getElementById("nombreArtista").value;
    let album = document.getElementById("nombreAlbumn").value;
    let anio = document.getElementById("albumAnio").value;
    let genero = document.getElementById("seleccionGenero").value;
    //creo el objeto json para despues enviarlo al servicio con el metodo post
    let albumnes = {
        "nombreBanda": artista,
        "nombreAlbum":album,
        "anioAlbum":anio,
		"generoAlbum": genero
	}
    //Condicion para que no se envien datos vacios
    if (artista!="" && album!= "" && anio!=""){
        try {
            let res = await fetch(url, {
                "method": "POST",
                "headers": { "Content-type": "application/json" },
                "body": JSON.stringify(albumnes)
            });
            
            if (res.status == 201) {
                console.log("Creado!");
            }
        } catch (error) {
            console.log(error);
        }  
    }else {
        alert("Tiene los campos vacios");
    }
}

//FUNCION PARA ELIMINAR UNA FILA, RECIBE COMO PARAMETRO LA FILA (ID) EN SU LLAMADO EN LA FUNCION EnviarDatos
async function eliminar(id) {
    try {
        let res = await fetch(url + "/" + id, {
            "method": "DELETE",
			"headers": { "Content-type": "application/json" }
        });
        console.log("Borrado");
    } catch (error) {
        console.log(error);
    }   
}
// FUNCION PARA ACTUALIZAR FILA SELECCIONADA, RECIBE COMO PARAMETRO LA FILA (ID) EN SU LLAMADO EN LA FUNCION EnviarDatos
async function actualizar(id) {
    let artista = document.getElementById("nombreArtista").value;
    let album = document.getElementById("nombreAlbumn").value;
    let anio = document.getElementById("albumAnio").value;
    let genero = document.getElementById("seleccionGenero").value;
    let albumnes = {
        "nombreBanda": artista,
        "nombreAlbum":album,
        "anioAlbum":anio,
		"generoAlbum": genero
	}
    if (artista!="" && album!= "" && anio!=""){
	try {
        let res = await fetch(url + "/" + id, {
            "method": "PUT",
			"headers": { "Content-type": "application/json" },
			"body": JSON.stringify(albumnes)
		});
    } catch (error) {
        console.log(error);
    } 
  }else {
      alert("Tiene los campos vacios");
  }
}

function busquedaGeneros (event){
    event.preventDefault();
    let tabla = document.getElementById("tabla");
    //Vuelvo a agarrar del dom la tabla
    let seleccionBusqueda = document.getElementById("buscarGeneros").value;
    //agarro el valor del select y se lo mando como parametro a la funcion impresionBusqueda junto con la tabla
    impresionBusqueda(tabla,seleccionBusqueda);
}

function impresionBusqueda (tabla,seleccion){
    //Borro todo el contenido de la tabla que ya esta cargardo por la funcion EnviarDatos
    tabla.innerHTML= " ";
    //Cargo el titulo de la tabla
    tabla.innerHTML +=
    "<tr>"+
    "<td>" +"Artista"+"</td>"+
    "<td>" +"Album"+"</td>"+
    "<td>" +"Año"+"</td>"+
    "<td>" +"Genero"+"</td>"+
    "<td>"+"#"+"</td>"
    +"</tr>"; 
    
    for (let i =0;i<jsonAux.length;i++){
        // recorro todo jsonAux que seria igual al json, y pregunto si el generoAlbum  es igual a la seleccion que 
        //se la pase por parametro en la funcion busquedaGeneros
        if (jsonAux[i].generoAlbum==seleccion){
            // imprimimos el json.generoAlbum que coincida con la seleccion de busqueda
            // y como al principio vaciamos la tabla, si elige otra seleccion de busqueda, vaciaria la anterior impresa y pondria la que coincida
            tabla.innerHTML +=
            "<tr>"+
            "<td>" +jsonAux[i].nombreBanda+"</td>"+
            "<td>" +jsonAux[i].nombreAlbum+"</td>"+
            "<td>" +jsonAux[i].anioAlbum+"</td>"+
            "<td>" +jsonAux[i].generoAlbum+"</td>"+
            "<td>"+"#"+"</td>"
            +"</tr>"; 
        }  
    }
}
// FUNCION PARA ACTUALIZAR TOTALMENTE LA TABLA
function restaurar (event){
    event.preventDefault();
    //Vuelvo a traer del dom la tabla
    let tabla = document.getElementById("tabla");
    //la vacio para que no se repitan los datos
    tabla.innerHTML= " ";
    // y llamo a la funcion EnviarDatos para volver a cargarla con lo que tenga mockapi
    EnviarDatos();
}
 async function generarAleatorio (event){
     event.preventDefault();
     let jsonAleatorio = [{
        "nombreBanda": "AC/DC",
        "nombreAlbum":"Black In Black",  
        "anioAlbum":1980,
         "generoAlbum": "Rock"
     },{
      "nombreBanda": "Metallica",
        "nombreAlbum":"Metallica",
        "anioAlbum":1991,
        "generoAlbum": "Rock"
     },{
         "nombreBanda": "Bon Jovi",
         "nombreAlbum":"Slippery When Wet",
         "anioAlbum":1986,
         "generoAlbum": "Rock"
     },{
         "nombreBanda": "Bob Marley",
         "nombreAlbum":"Legend",
         "anioAlbum":1984,
         "generoAlbum": "Reggae"
     },{
        "nombreBanda": "Led Zeppelin",
         "nombreAlbum":"Led Zeppelin IV",
         "anioAlbum":1971,
         "generoAlbum": "Rock"
     }];
     for (let i = 0;i<MAXAleatorios;i++){
         //Genero un numero aleatorio para que seleccion un json del arreglo y lo agregue aleatoriamente al servicio
         let numeroRandom =  Math.floor((Math.random() *jsonAleatorio.length));
         try {
             let res = await fetch(url, {
                 "method": "POST",
                 "headers": { "Content-type": "application/json" },
                 "body": JSON.stringify(jsonAleatorio[numeroRandom]),
            });
         } catch (error) {
             console.log(error);
         }   
    }

 }    




