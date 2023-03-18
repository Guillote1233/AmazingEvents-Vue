const cardContainer = document.getElementById('eventCard');
const fragment = document.createDocumentFragment();
const catCheckbox = document.getElementById('filterCat');
const searchValue = document.querySelector('input[placeholder="Search..."]');
const backgroundLoader = document.getElementById('back-loader');
const loader = document.getElementById('spinner');

const showLoader = () => {
    backgroundLoader.classList.remove('d-none');
    loader.classList.add('spinner-border');
};

const hideLoader = () => {
    backgroundLoader.classList.add('d-none')
    loader.classList.remove('spinner-border');
};

let data = [];
let categories = [];

async function getData() {
    try {
        const apiUrl = "../assets/js/amazing.json";
        const response = await fetch(apiUrl);
        const json = await response.json();
        data = json;
        const dataEvents = data.events.filter(elem => elem.date < data.currentDate);
        hideLoader();
        createCard(dataEvents, cardContainer);
        categories = createCategoryList(dataEvents);
        createCheckboxFilter(categories, catCheckbox);
        searchValue.addEventListener('keyup', () => {
            let dataFilter = filterFinal(dataEvents)
            createCard(dataFilter, cardContainer)
        })
        
        catCheckbox.addEventListener('change', ()=> {
            let dataFilter = filterFinal(dataEvents)
            createCard(dataFilter, cardContainer)
        })
    } catch (error) {
        console.log(error);
    }
}
showLoader();
getData();


function createCard(array, container){
    container.innerHTML = ""
    if(array.length > 0){
        array.forEach(items => {
            let div = document.createElement("div")
            div.className = "card col-lg-2 col-md-3 col-sm-12"
            div.innerHTML += `
                <img src="${items.image}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${items.name}</h5>
                    <p class="card-text">${items.category}</p>
                    <div class="price">
                        <h6>$ ${items.price}</h6>
                        <a href="../pages/details.html?id=${items._id}" class="btn btn-primary">Details</a>
                    </div>
                </div>`
            fragment.appendChild(div);
            
        });
    }else{
        container.innerHTML = `<img src="../assets/img/notfound.gif" alt="not-found">`;
    }
    container.appendChild(fragment);
}

function createCategoryList(array){
    let categories = array.map(cat => cat.category);
    categories = categories.reduce((accum, elem) => {
        if(!accum.includes(elem)){
            accum.push(elem);
        }
        return accum;
    },[])
        return categories;
}

function createCheckboxFilter(array, container){
    array.forEach(category => {
        let div = document.createElement('div');
        div.className = `checkbox-container ${category.toLowerCase()}`
        div.innerHTML += `<input type="checkbox" id=${category.toLowerCase()} name="category">
        <label for="${category.toLowerCase()}">${category}</label>`
        container.appendChild(div);
    })
}

function searchFilter(array, value){
    let filterData = array.filter(elem => elem.name.toLowerCase().includes(value.toLowerCase()));
    return filterData;
}

function checkboxFilter(array){
    let checked = document.querySelectorAll('input[type="checkbox"]:checked');
    let filteredList = [];

    if(checked.length > 0){
        for(let i=0; i < checked.length; i++){
            filteredList = filteredList.concat(array.filter(elem => elem.category.toLowerCase().includes(checked[i].id.toLowerCase())))
        }
    }else{
        filteredList = array;
    }
    return filteredList;
}

function filterFinal(array){
    let arrayFiltered = searchFilter(array, searchValue.value);
    arrayFiltered = checkboxFilter(arrayFiltered);
    return arrayFiltered;
}