let municipio = document.getElementById("municipio");
let containerDiv = document.getElementById("containerList");
let cache = {};

municipio.addEventListener("keyup",(event) => {
    if(municipio.value){
        autoCompleta(municipio.value,event.key);
    }else{
        containerDiv.innerHTML ="";
    }
})

async function autoCompleta(letra,key){
    let keysPermitadas = ["ArrowUp","ArrowDown","Enter"];

    if(!keysPermitadas.includes(key)){//Cuando pulse una que no está permitida  
        //Si ya existe una lista anterior la borro para que no se duplique información de varias peticiones
        if(document.querySelector("#listaMunicipio") != null){
            document.querySelector("#listaMunicipio").remove();
        }
        //Y ahora creo una lista nueva con su id y se la añado al div correspondiente
        let ul = document.createElement("ul");
        ul.setAttribute("id","listaMunicipio");
        containerDiv.appendChild(ul);
        //Si la cache no tiene la letra hago la peticion a la api
        if(!cache[letra]){
            const municipios = await getMunicipiosPorLetra(letra);
            cache[letra] = municipios;
            //Recorro los muncipios
            municipios.forEach(municipio => {
                anniadirSugerencia(municipio, ul);
            });
        }else{//Y si la cache tiene la letra recupero los municipios de la cache
            //Recorro los municipios que están guardados en la cache
            cache[letra].forEach(municipio => {
                anniadirSugerencia(municipio, ul);
            }); 
        }

    }else if(keysPermitadas.includes(key)){ //Cuando pulse una de las teclas permitidas
        const lista = document.getElementById("listaMunicipio"); //Recupero la lista 
        let liSeleccionado = lista.getElementsByClassName("seleccionado"); //De la lista saco los elementos que están seleccionado
        let indexSeleccionado = Array.from(lista.childNodes).indexOf(liSeleccionado[0]); //Saco la posicion del seleccionado de la lista

        if(key == "ArrowDown"){ //Cuando le de a la fecha para abajo
            //Al indexSeleccionado le sumo 1 y le hago el resto del tamaño de la lista para que no se salga de rango
            indexSeleccionado = (indexSeleccionado+1)%lista.childNodes.length; 
            //Mientras que el index seleccionado sea menor que el tamaño de la lista y el liSeleccionado existe
            if(indexSeleccionado < lista.childNodes.length && liSeleccionado[0]){
                liSeleccionado[0].classList.remove("seleccionado");//Le borro la clase seleccionado al liSeleccionado
            }
            /*Y ahora recupero el item de la lista que iría despues del seleccionado ya que al index le he sumado uno antes. 
            Lo selecciono añadiendo la clase seleccionado a ese li*/
            lista.children.item(indexSeleccionado).classList.add("seleccionado"); 
        }else if(key == "ArrowUp"){ //Cuando le de a la fecha para arriba
            indexSeleccionado--; //Al index seleccionado le voy restando uno

            if(indexSeleccionado >= 0 && liSeleccionado[0]){//Mientras el index sea mayor que 0 y el liSeleccionade existe
                //Le borro la clase seleccionado al liSeleccionado
                liSeleccionado[0].classList.remove("seleccionado");
                //Le añado la clase seleccionado al li que iría anterior al seleccionado.
                lista.children.item(indexSeleccionado).classList.add("seleccionado");
            }else if(indexSeleccionado < 0 && liSeleccionado[0]){//Cuando el indexSeleccionado sea menor que 0 y liSeleccioando existe
                //Borro la clase seleccionado li de la posicion 0 de la lista.
                lista.children.item(0).classList.remove("seleccionado");
            }

        }else if(key == "Enter" && liSeleccionado[0]){//Cuando le de a enter y existe un seleccionado
            municipio.value = liSeleccionado[0].textContent //El valor de input lo actualizo y le pongo el textContent de liSeleccionado
            lista.remove();//Y borro la lista, de tal forma que se borran las sugerencias
        }
    }

}

function anniadirSugerencia(municipio, ul) {
    //Creo un li con el textContent del nombre de cada municipio y se le añado a lista.
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(municipio));
    ul.appendChild(li);
}

async function getMunicipiosPorLetra(letra) {
    //Creo un formData
    const formData = new FormData();
    //Le añado el parametro de municipio y el valor
    formData.append("municipio", letra);
    //Hago la peticion post, que nos devuelve todos los municipios que empiecen por la letra que le he hemos introducido al formData
    //De modo que añado el formData al body de la petición
    const response = await fetch("https://intranetjacaranda.es/Ejercicios/autocompletaMunicipios.php", {
        method: "POST",
        body: formData
    });
    //Recupero los municipios en formato Json
    const municipios = await response.json();
    return municipios;
}