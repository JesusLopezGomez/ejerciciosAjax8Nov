let municipio = document.getElementById("municipio");
let containerDiv = document.getElementById("containerList");

municipio.addEventListener("keyup",(event) => {
    if(municipio.value){
        autoCompleta(municipio.value);
    }
    console.log(event.key);
})

async function autoCompleta(letra){
    const formData = new FormData();
    formData.append("municipio",letra);
   
    const response = await fetch("https://intranetjacaranda.es/Ejercicios/autocompletaMunicipios.php",{
        method : "POST",
        body : formData
    });
    
    const municipios = await response.json();

    if(document.querySelector("ul") != null){
        document.querySelector("ul").remove();
    }

    let ul = document.createElement("ul");
    ul.setAttribute("id","listaMunicipio");
    containerDiv.appendChild(ul);

    municipios.forEach(municipio => {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(municipio));
        ul.appendChild(li);
    });
}