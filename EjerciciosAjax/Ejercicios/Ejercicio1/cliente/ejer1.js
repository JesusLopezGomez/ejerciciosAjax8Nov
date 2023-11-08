let botonComprobar = document.getElementById("comprobar");
let mostrarDispo = document.getElementById("disponibilidad");


 botonComprobar.addEventListener("click",async function(){
    let login = document.getElementById("login").value;

        if(login){
            if(await comprobar(login)){
                mostrarDispo.textContent = "Disponible"; 
            }else{
                mostrarDispo.textContent = "No disponible";
            }
        }else{
            alert("Tiene que introducir un nombre de usuario");
        }
    })

async function comprobar(login){
    try{
        let response = await fetch(`https://intranetjacaranda.es/Ejercicios/compruebaDisponibilidad.php?login=${login}`);
        let responseText = await response.text();

        if(responseText === "si"){
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.log(err);
    }
}