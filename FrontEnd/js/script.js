window.addEventListener("DOMContentLoaded", async function () {
	await fetchWorksData(); 			// Récupère les données des travaux
    await fetchCategoriesData(); 		// Récupérer les données
    createButtonsCategories(); 	// Créer les boutons après récupération
	
	getCategoriesName();
	editMode();

	//* affiche les travaux lors du chargement de la page
	showWorks("Tous")

	//* Gérer les deux modales
	handleModal("modal-deleteWorks", "btn-modal-open-delete", "close-delete");
	handleModal("modal-addWorks", "btn-modal-open-add", "close-add");
	showWorksModal();
	
	let selectedCategory = "Tous"
	const btnsContainer = document.querySelector(".btns");

	btnsContainer.addEventListener("click", function (event) {
		// Vérifie si l'élément cliqué a la classe "btn-categories"
		if (event.target.classList.contains("btn-categories")) {
			
			selectedCategory = event.target.textContent
			//exécute la fonction avec la catégorie du bouton cliqué
			showWorks(selectedCategory)
		}
	})

	// au clique sur le bouton, supprime la donnée de l'api et cache la card du site
	document.querySelectorAll(".btn-supprCard").forEach(button => {
	    button.addEventListener("click", function () {
	        const id = this.id; // Récupération de l'ID depuis le bouton
	        hideCard(this);     // Cache la carte correspondante
	        deleteData(id);     // Supprime la donnée de l'API
	    });
	});

	//*au clic du bouton, appel la fonction clearToken
	const btnClearToken = document.querySelector(".btn-clearToken")
	btnClearToken.addEventListener("click", function(){
		clearToken()
	})

	//#region gestion des modales
	
		//* Récupérer les modales
    	const modalDeleteWorks = document.getElementById("modal-deleteWorks");
		const modalAddWorks = document.getElementById("modal-addWorks");
	
		//* Récupérer les boutons de fermeture des modales
		const btnModalOpenDelete = document.getElementById("btn-modal-open-delete");
		const btnModalOpenAdd = document.getElementById("btn-modal-open-add");
    	const closeModalButton = document.querySelector(".close-add");
		const backAddButton = document.querySelector(".back-add");
	
		//bouton ouverture de la modale "Delete Works"
		btnModalOpenDelete.addEventListener("click", function () {
			modalDeleteWorks.style.display = "block";
			clearInputsData();
		});
	
		// Bouton ouverture de la modale "Add Works"
		btnModalOpenAdd.addEventListener("click", function () {
			modalDeleteWorks.style.display = "none";
			modalAddWorks.style.display = "block";
			clearInputsData();
			checkInputs()
		});
	
		// Bouton de fermeture des modales
		closeModalButton.addEventListener("click", function () {
			modalAddWorks.style.display = "none";
			console.log("close add")
			modalDeleteWorks.style.display = "none";
			console.log("close delete")
			clearInputsData();
		});
	
		// Gestionnaire pour basculer de la modale "Add Works" à "Delete Works"
		backAddButton.addEventListener("click", function () {
			modalAddWorks.style.display = "none"; // Fermer la modale Add Works
			modalDeleteWorks.style.display = "block"; // Ouvrir la modale Delete Works
			clearInputsData();
		});

	//#endregion gestion des modales

	//#region gestion input de la modale "Add Works"

	//#region gestion input de l'image

		//#region gère la mise en page de l'input de l'image dans la modale
		const inputFile = document.getElementById("file-input");
		const imgPreview = document.getElementById("image-preview");
		const inputContainer = document.querySelector(".modal-add-body-container1-input")

		inputFile.addEventListener("change", function () {
			if(inputFile.files && inputFile.files[0]) {
				const file = inputFile.files[0];
				
				if(file.type.startsWith("image/")) {
					const imageUrl = URL.createObjectURL(file);

					inputContainer.style = "display: none";
					imgPreview.style = "display: block";
					imgPreview.src = imageUrl;
					imgPreview.height =  200
					imgPreview.padding = 10

				}else{
					console.error("Le fichier n'est pas une image");
				}
			}
		})
	//#endregion gère la mise en page de l'input de l'image dans la modale


		const addImage = document.getElementById("modal-add-body-container1-img");
		const fileInput = document.getElementById("file-input");

		fileInput.addEventListener("change", function () {
			const file = fileInput.files[0]; // Récupère le fichier sélectionné
		
			if (file) {
				const reader = new FileReader();
			
				reader.onload = function (item) {
					addImage.src = item.target.result; // Change l'attribut `src` de l'image
					if (addImage.src !== "") {
						imageChanged = true;
						console.log("l'image a changée");
						checkInputs();
					}
				};

				reader.readAsDataURL(file); // Lis le fichier et génère une URL de données
				
			} else {
				console.log("image pas changé");
			}
		});
	//#endregion gestion input de l'image

	//#region gestion input du titre
		//change la valeur de titleChanged si la valeur du titre est changée
		const addTitle = document.getElementById("titre")
		addTitle.value = ""		
		addTitle.addEventListener("change", function(){
			if(addTitle.value != "") {
				titleChanged = true
				console.log("le titre a changé")
				checkInputs();
			}else{
				console.log("le titre a pas changé")
			}
		})
	//#endregion gestion input du titre

	//#region gestion input de la catégorie
		//change la valeur de categoryChanged si la valeur de la catégorie est changée
		const addCategory = document.getElementById("categorie");

		addCategory.addEventListener("change", function () {
			const selectedOption = addCategory.options[addCategory.selectedIndex];
			if (selectedOption.id !== 0) {
				categoryChanged = true;
				console.log("la categorie a changée : " + selectedOption.id);
				checkInputs();
			} else {
				categoryChanged = false;
				console.log("la catégorie a changé");
			}
		});
	//#endregion gestion input de la catégorie

	//#endregion gestion input de la modale "Add Works"


	
	//envoie les données à l'api
	btnValider.addEventListener("click", function(){
		const selectedOption = addCategory.options[addCategory.selectedIndex];
		addData(inputFile.files[0], addTitle.value, selectedOption.id)
	})	


	checkInputs()
});

let imageChanged = false;
let titleChanged = false;
let categoryChanged = false;

const btnValider = document.querySelector(".modal-add-footer-btn-valider")



// #region fonctions appels à l'API
//*données de works
const urlWorksApi = "http://localhost:5678/api/works/"
let worksData = []

// création d'un tableau avec toutes les données dans api/works
async function fetchWorksData(){

	// faire la requete à l'api
	const reponse = await fetch(urlWorksApi)

	// convertir les données en JSON
	worksData = await reponse.json()
}

//*données de catégories
const urlCategoriesApi = "http://localhost:5678/api/categories/"
let categoriesData = []

// création d'un tableau avec toutes les données dans api/works
async function fetchCategoriesData(){

	// faire la requete à l'api
	const reponse = await fetch(urlCategoriesApi)

	// convertir les données en JSON
	categoriesData = await reponse.json()
}

// #endregion fonctions appels à l'API


// Ajout des boutons selon les catégories
function createButtonsCategories(){
	//!TODO BASE DE CODE
	//!<button id="1" class="btn-categories">Tous</button>
	const btns = document.querySelector(".btns")
	categoriesData.forEach(function(item){
		const button = document.createElement('button')
		//supprimer l'id des boutons
		button.id = item.id + 1
		button.className = "btn-categories"
		button.textContent = item.name
		
		//ajout de l'enfant button au parent btns
		btns.appendChild(button)
	})
}

// Ajouter un événement au conteneur parent
const gallery = document.querySelector(".gallery")
function showWorks(categoryName) {
	gallery.innerHTML = "";
	//!TODO BASE DE CODE
	//!<figure class="card-1">
	//!	<img src="http://localhost:5678/images/abajour-tahina1651286843956.png" alt="Objets">
	//!	<figcaption>Abajour Tahina</figcaption>
	//!</figure>

	worksData.forEach(function(item){
		if(categoryName === item.category.name || categoryName === "Tous"){
			//figure
			const figure = document.createElement('figure')
			figure.className = "card-" + item.id
			
			//image
			const image = document.createElement('img')
			image.src = item.imageUrl
			image.alt = item.category.name
		
			//figcaption
			const figcaption = document.createElement('figcaption')
			figcaption.textContent = item.title
		
			//ajout des balises img et figcaption au parent figure
			figure.appendChild(image)
			figure.appendChild(figcaption)
		
			//ajout du container figure au parent gallery
			gallery.appendChild(figure)
		}
	})
}

// Fonction générique pour gérer une modale
let btnModalSuppr = document.querySelector(".btn-supprCard")
function handleModal(modalId, buttonId, closeClass) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(buttonId);
    const close = document.querySelector(`.${closeClass}`);

    // Ouvre la modale au clic sur le bouton
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // Ferme la modale au clic sur le bouton de fermeture
    close.onclick = function () {
        modal.style.display = "none";
    };

	// Ferme la modale au clic à l'extérieur du contenu
	window.addEventListener("click", function (event) {
		if (event.target === modal) {
			modal.style.display = "none";
		}
	});
}

// affiche les cards dans la modal
function showWorksModal(){
	//!TODO base de code
	//! <div class="card"> 
	//! 	<button class="btn-supprCard"> IMAGE DE POUBELLE </button>
	//! 	<img src="http://localhost:5678/images/abajour-tahina1651286843956.png" class="card-img" id="1">
	//! </div>

	const cardsContainer = document.querySelector(".cards-container");

	cardsContainer.innerHTML = "";

	worksData.forEach(function(item){

		//div
		const div = document.createElement('div')	
		div.classList.add("card")

		//bouton
		const button = document.createElement('button')
		button.classList.add("btn-supprCard")
		button.id = item.id
		button.innerHTML = '<i class="fa-solid fa-trash-can fa-xs" style="color: #ffffff;"></i>'

		//img
		const image = document.createElement('img')
		image.src = item.imageUrl
		image.classList.add("card-img")

		//ajout des button et image à la div
		div.appendChild(button)
		div.appendChild(image)

		//ajout de la div au container des cards
		cardsContainer.appendChild(div)
	})
}

// cache les cards dans la modal ET dans la gallery
function hideCard(button) {
    // Récupère l'élément parent `.card` et le supprime
    const cardElement = button.closest(".card");
    if (cardElement) {
        cardElement.remove(); // Supprime également cet élément
    }

    // Récupère l'élément `figure` correspondant
    const figure = document.querySelector(".card-" + button.id);
    if (figure) {
        figure.remove(); // Supprime complètement l'élément du DOM
    }
}

//supprime la donnée de l'api
async function deleteData(id) {
	const token = localStorage.getItem("token")
	const urlDeletedData = urlWorksApi + id

	const index = worksData.findIndex(item => item.id === id);
    if (index !== 1) {
        worksData.splice(index, 1); // Supprime l'élément du tableau
        console.log(`Donnée de worksData avec l'ID ${id} supprimée.`);
    } else {
        console.warn(`Aucune donnée trouvée avec l'ID ${id} dans worksData.`);
    }

	// pour récup database.sqlite sur git hub 
	const response = await fetch(urlDeletedData, {
		method: 'DELETE',
		headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },

	})

	if (response.ok) {
        console.log(`Donnée avec l'ID ${id} supprimée.`);
    } else {
        console.error(`Erreur HTTP : ${response.status}`);
    }
}

//Fonction qui génère des options dans la liste déroulante selon les catégories existantes
function getCategoriesName() {
	//TODO BASE DE CODE
	//! <select class="modal-add-listeDeroulante">
	//!		<option value=""></option>
	//!		<option value="Objets">Objets</option>
	//!		<option value="Appartements">Appartements</option>
	//!	</select>

	const select = document.querySelector(".modal-add-body-container2-select")

	//boucle qui génère une option pour chaques catégories
	categoriesData.forEach(function(item){
		const option = document.createElement('option')
		option.value = item.name
		option.textContent = item.name
		option.className = "class-option"
		option.id = item.id

		//attribut l'option généré à son parent (select)
		select.appendChild(option)
	}
)}

//Gère l'affichage quand on est connecté au comtpe
function editMode(){
	const bandeauEdit = document.querySelector(".editMode")
	const btnsCategories = document.querySelector(".btns")
	const btnModalOpenDelete = document.getElementById("btn-modal-open-delete")
	const login = document.getElementById("login")
	const logout = document.getElementById("logout")

	if (localStorage.getItem("token") === null) {
		bandeauEdit.style = "display:none"
		btnsCategories.style = "display:flex"
		btnModalOpenDelete.style = "display:none"
		login.style = "display:flex"
		logout.style = "display:none"
	}

	else{
		bandeauEdit.style = "display:flex"
		btnsCategories.style = "display:none"
		btnModalOpenDelete.style = "display:flex"
		login.style = "display:none"
		logout.style = "display:flex"
	}
}

//Clear le token et rédirige vers la page de connexion
function clearToken(){
	localStorage.removeItem("token")
	window.location.href = "http://127.0.0.1:5500/FrontEnd/index.html"
}

//vérifie si tout les inputs sont remplis
function checkInputs(){
	console.log("imageChanged", imageChanged, "titleChanged", titleChanged, "categoryChanged", categoryChanged)
	if(imageChanged && titleChanged && categoryChanged){
		console.log("Tout les éléments ont changés")
		btnValider.style = "background-color: #1D6154"
		btnValider.disabled = false
	}
	else{
		btnValider.style = "background-color: lightgrey"
		btnValider.disabled = true
	}
}

//clear les données rempli dans les inputs de la modale
function clearInputsData(){
	//image
	const imgPreview = document.getElementById("image-preview");
	imgPreview.style = "display: none"
	imgPreview.src = ""
	imageChanged = false


	//titre
	const inputTitle = document.getElementById("titre")
	inputTitle.value = ""
	titleChanged = false

	//categories
	const inputCategory = document.getElementById("categorie");
	//inputContainer
	const inputContainer = document.querySelector(".modal-add-body-container1-input")
	inputCategory.value = ""
	categoryChanged = false
	inputContainer.style = "display: flex"
}

/* fonction qui créer une nouvelle donnée avec l'api */
async function addData(image, title, categoryId){
	const token = localStorage.getItem("token");
	const urlApi = "http://localhost:5678/api/works/"

	const formData = new FormData()
	formData.append("image", image)
	formData.append("title", title)
	formData.append("category", categoryId)

	const response = await fetch(urlApi, {
		method: 'POST',

		headers: {
			'Authorization': `Bearer ${token}`,
		},

		body: formData,
	})

    if (!response.ok) {
		console.log(`erreur : ${response.status}`);
    }


	window.alert("Travail ajouté avec succès")
	await fetchWorksData()
	clearInputsData()
	console.log("checkInputs")
	checkInputs()
	showWorks("Tous")
	showWorksModal()
	document.querySelectorAll(".btn-supprCard").forEach(button => {
	    button.addEventListener("click", function () {
	        const id = this.id; // Récupération de l'ID depuis le bouton
	        hideCard(this);     // Cache la carte correspondante
	        deleteData(id);     // Supprime la donnée de l'API
	    });
	})
	console.log(worksData)
}
