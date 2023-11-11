let municipio = document.getElementById("municipio");
let containerDiv = document.getElementById("containerList");
let cache = {};
let index = -1;

municipio.addEventListener("keyup",(event) => {
    if(municipio.value){
        autoCompleta(municipio.value,event.key);
    }
})

async function autoCompleta(letra,key){
    let keysPermitadas = ["ArrowUp","ArrowDown","Enter"];

    if(!keysPermitadas.includes(key)){//Cuando pulse una que no está permitida
        index = -1;
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
        let lista = document.getElementById("listaMunicipio");
        let municipiosLista = Array.from(lista.childNodes);

        if(key == "ArrowDown"){
            if(index == municipiosLista.length-1){
                lista.children[index].classList.remove("seleccionado");
                index = 0;
                municipiosLista[index].classList.add("seleccionado");            
            }else{
                index >= 0 ? lista.children[(index)].classList.remove("seleccionado") : "";
                index++;
                municipiosLista[index%municipiosLista.length].classList.add("seleccionado");            
            }
        }else if(key == "ArrowUp"){ 
            if(index == 0){
                lista.children[0].classList.remove("seleccionado");
                index = -1;
            }else if(index > 0){
                lista.children.item(index).classList.remove("seleccionado");
                municipiosLista[--index%municipiosLista.length].classList.add("seleccionado");    
            }
        }else if(key == "Enter" && municipiosLista[index]){
            municipio.value = municipiosLista[index].textContent; 
            lista.remove();
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