document.addEventListener("DOMContentLoaded", async function () {
	await fetchWorksData(); // Récupère les données des travaux
    await fetchCategoriesData(); // Récupérer les données
    await createButtonsCategories(); // Créer les boutons après récupération
});


//*données de works
const urlWorksApi = "http://localhost:5678/api/works/"
let worksData = []

// création d'un tableau avec toutes les données dans api/works
async function fetchWorksData(){

	// faire la requete à l'api
	const reponse = await fetch(urlWorksApi)

	// convertir les données en JSON
	worksData = await reponse.json()

	// afficher les données
	console.log("works		", worksData)

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

	// afficher les données
	console.log("catégories	", categoriesData)

}


//* ajout des boutons selon les catégories
//TODO BASE DE CODE
//!<button class="btn-tous">Tous</button>

async function createButtonsCategories(){
	const btns = document.querySelector(".btns")
	categoriesData.forEach(function(item){
		const button = document.createElement('button')
		button.id = item.id +1
		button.className = "btn-categories"
		button.textContent = item.name
		
		//ajout de l'enfant button au parent btns
		btns.appendChild(button)
	})
}


const btnCategories = document.querySelector(".btn-categories")
btnCategories.addEventListener("click", function(){
	console.log("toto")
})


//* Ajouter un événement au bouton
//TODO 		BASE DE CODE
//! 		<figure>
//! 			<img src="assets/images/abajour-tahina.png" alt="Abajour Tahina">
//! 			<figcaption>test</figcaption>
//! 		</figure>



/////* fonctionnement des boutons de filtre
////const gallery = document.querySelector(".gallery")
////
////// bouton tous
////const btn_tous = document.querySelector(".btn-tous") 	
////btn_tous.addEventListener("click", function(){
////	gallery.innerHTML = "";
////	worksData.forEach(function(item){
////
////		//figure
////		const figure = document.createElement('figure')
////
////		//image
////		const image = document.createElement('img')
////		image.src = item.imageUrl
////		image.alt = item.category.name
////
////		//figcaption
////		const figcaption = document.createElement('figcaption')
////		figcaption.textContent = item.title
////
////		//ajout des balises img et figcaption au parent figure
////		figure.appendChild(image)
////		figure.appendChild(figcaption)
////
////		//ajout du container figure au parent gallery
////		gallery.appendChild(figure)
////	})
////})


//// bouton objets
////const btn_objets = document.querySelector(".btn-objets")
////btn_objets.addEventListener("click", function(){
////	gallery.innerHTML = "";
////
////	const objets = worksData.filter(function(item){
////		return item.category.name === "Objets"
////		
////	})
////
////	objets.forEach(function(item){
////
////		//figure
////		const figure = document.createElement('figure')
////
////		//image
////		const image = document.createElement('img')
////		image.src = item.imageUrl
////		image.alt = item.category.name
////
////		//figcaption
////		const figcaption = document.createElement('figcaption')
////		figcaption.textContent = item.title
////
////		//ajout des balises img et figcaption au parent figure
////		figure.appendChild(image)
////		figure.appendChild(figcaption)
////
////		//ajout du container figure au parent gallery
////		gallery.appendChild(figure)
////	})
////
////	console.log(objets)
////
////})



////// bouton appartement
////const btn_appartements = document.querySelector(".btn-appartements")
////btn_appartements.addEventListener("click", function(){
////
////	gallery.innerHTML = ""
////
////	const appartement = worksData.filter(function(item){
////		return item.category.name === "Appartements"
////	})
////
////	appartement.forEach(function(item){
////		//figure
////		const figure = document.createElement('figure')
////
////		//image
////		const image = document.createElement('img')
////		image.src = item.imageUrl
////		image.alt = item.category.name
////
////		//figcaption
////		const figcaption = document.createElement('figcaption')
////		figcaption.textContent = item.title
////
////		//ajout des balises img et figcaption au parent figure
////		figure.appendChild(image)
////		figure.appendChild(figcaption)
////
////		//ajout du container figure au parent gallery
////		gallery.appendChild(figure)
////	})
////})
////
////
////// boutons hotels & restaurants
////const btn_hotelsRestaurants = document.querySelector(".btn-hotelsRestaurants")
////btn_hotelsRestaurants.addEventListener("click", function(){
////
////	//* clear des anciens éléments du DOM
////	gallery.innerHTML = ""
////
////	//* création d'un tableau contenant uniquement les données qui ont pour nom de catégorie "Hotels & restaurants"
////	const hotelsRestaurants = worksData.filter(function(item){
////		return item.category.name === "Hotels & restaurants"
////	})
////
////	//* utilisation du tableau précédement créé pour afficher les données filtrés
////	hotelsRestaurants.forEach(function(item){
////		//figure
////		const figure = document.createElement('figure')
////
////		//image
////		const image = document.createElement('img')
////		image.src = item.imageUrl
////		image.alt = item.category.name
////
////		//figcaption
////		const figcaption = document.createElement('figcaption')
////		figcaption.textContent = item.title
////
////		//ajout des balises img et figcaption au parent figure
////		figure.appendChild(image)
////		figure.appendChild(figcaption)
////
////		//ajout du container figure au parent gallery
////		gallery.appendChild(figure)
////	})	
////})

//* modale
let modal = null;

const openModal = function (event) {
    event.preventDefault(); // Empêche les comportements par défaut
    const target = document.querySelector(event.target.getAttribute('data-target')); // Utilisation de data-target
    target.style.display = "flex"; // Affiche la modale
    target.setAttribute('aria-hidden', 'false');
    target.setAttribute('aria-modal', 'true');
    modal = target;

    // Ajout des listeners pour fermer la modale
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener("click", closeModal);
};

const closeModal = function (event) {
    event.preventDefault();
    modal.style.display = "none"; // Cache la modale
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-modal', 'false');
    modal.removeEventListener("click", closeModal);
	//TODO adapter  .js-modal-close
    modal.querySelector('.js-modal-close').removeEventListener("click", closeModal);
    modal = null;
};

// Ajout de l'event listener au bouton qui ouvre la modale
//document.querySelector('.btn-modal-open').addEventListener("click", openModal);


//TODO base de code
//!<div class="card"> 
//!<button class="btn-supprCard"></button>
//!<img src="http://localhost:5678/images/abajour-tahina1651286843956.png" class="card-img">
//!</div>

const cardsContainer = document.querySelector(".cards-container");
worksData.forEach(function(item){

	//div
	const div = document.createElement('div')
	div.classList.add("card")

	//class
	const button = document.createElement('button')
	button.classList.add("btn-supprCard")

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

