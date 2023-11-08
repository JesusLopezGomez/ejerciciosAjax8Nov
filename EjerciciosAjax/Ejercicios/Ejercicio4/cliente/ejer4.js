let select = document.getElementById("provincias");

async function cargarProvincias(){
    let response = await fetch("https://intranetjacaranda.es/Ejercicios/cargaProvinciasXML.php");
    let responseText = await response.text();
    
    const parser = new DOMParser();
    const xml = parser.parseFromString(responseText,"application/xml");

    const provincias = Array.from(xml.getElementsByTagName("provincia"));
    provincias.forEach(provincia => {
        let option = new Option(provincia.querySelector("nombre").textContent,provincia.querySelector("codigo").textContent)
        select.appendChild(option);
    })
}

cargarProvincias();

select.addEventListener("change",async (event) => {
    let formData = new FormData()
    formData.append("provincia",select.value);
    let response = await fetch("https://intranetjacaranda.es/Ejercicios/cargaMunicipiosXML.php?provincia="+select.value,
    {
        method:"POST",
        body : formData
    });
    let responseText = await response.text();
    
    const parser = new DOMParser();
    const xml = parser.parseFromString(responseText,"application/xml");

})