let botonComprobar = document.getElementById("comprobar");
let mostrarDispo = document.getElementById("disponibilidad");


 botonComprobar.addEventListener("click",async function(){
    let login = document.getElementById("login").value;

        if(login){
            comprobarConAlternativa(login)
        }else{
            alert("Tiene que introducir un nombre de usuario");
        }
    })

async function comprobarConAlternativa(login){
    try{
        const formData = new FormData();
        formData.append("login", login);
        
        let response = await fetch(`https://intranetjacaranda.es/Ejercicios/compruebaDisponibilidadXML.php`,{
            method : "POST",
            body : formData
        });

        let responseText = await response.text();

        const parser = new DOMParser();
        const xml = parser.parseFromString(responseText,"application/xml");

        let disponible = xml.getElementsByTagName("disponible")[0].textContent;

        if(disponible === "si"){
            mostrarDispo.textContent = `El nombre de usuario ${login} esta disponible`;
        }else{
            mostrarDispo.textContent = `Alternativas al nombre de usuario`;
            
            const ul = document.createElement("ul");
            const logins = Array.from(xml.getElementsByTagName("login"))
            
            logins.forEach(login => {
                const li = document.createElement("li");
                li.appendChild(document.createTextNode(login.textContent));
                ul.appendChild(li);
            })
            
            mostrarDispo.appendChild(ul);
        }
    }catch(err){
        console.log(err);
    }
}