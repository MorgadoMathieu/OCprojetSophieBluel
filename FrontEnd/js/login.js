const btn_connexion = document.querySelector('.login-btn-connexion')
btn_connexion.addEventListener("click", async function(event){
    event.preventDefault()

    const urlLoginApi = "http://localhost:5678/api/users/login"

    //valeur des champs
    const email = document.getElementById('email')
    const password = document.getElementById('password')

    //Vérification que les champs ne sont pas vides
    if (!email || !password) {
        console.error('Les champs e-mail et mot de passe doivent être remplis.');
        return;
    }

    let body = {
        email: email.value, 
        password: password.value
    }
    
    //requete POST avec fetch
    const reponse = await fetch(urlLoginApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    //vérification de la réponse
    if(reponse.ok){
        const data = await reponse.json();
        localStorage.setItem("token", data.token);
        window.location.href = "http://127.0.0.1:5500/FrontEnd/index.html"
    } else {
        window.alert('Identifiants incorrects');
    }
})

