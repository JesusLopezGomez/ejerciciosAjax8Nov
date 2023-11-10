let select = document.getElementById("provincias");

async function cargarProvincias(){
    let response = await fetch("https://intranetjacaranda.es/Ejercicios/cargaProvinciasJSON.php");
    let responseJson = await response.json();

    let provincias = responseJson;
    for(let i in provincias){
        let option = new Option(provincias[i],i);
        select.appendChild(option);
    }
}

cargarProvincias();

select.addEventListener("change",async (event) => {
    let formData = new FormData()
    formData.append("provincia",select.value);
    let response = await fetch("https://intranetjacaranda.es/Ejercicios/cargaMunicipiosJSON.php",
    {
        method:"POST",
        body : formData
    });
    
    let responseJson = await response.json();
    
    const municipios = responseJson;

    if(document.getElementById("selectMunicipios") != null){
        document.getElementById("selectMunicipios").remove();
    }
    
    let selectMunicipios = document.createElement("select");
    selectMunicipios.setAttribute("id","selectMunicipios");

    for(let i in municipios){
        let option = new Option(municipios[i],i);
        selectMunicipios.appendChild(option);
    }
    document.body.appendChild(selectMunicipios);
})