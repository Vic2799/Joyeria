'use strict';



const API_URL = 'https://itacate.herokuapp.com/api/v1';

let categoryList;
showCategories();

function showCategories() {
    fetch(`${API_URL}/categories`)
        .then(response => response.json())
        .then((categories) => {
            categoryList = categories;
            const categoryResult = document.querySelector('#result');
            categoryResult.innerHTML = '';

            categoryList.forEach((category) => {
                showCategoryCard(category);
            })
        })
        .catch(() => {
            const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
            errorModalBody.textContent = 'Hubo un error obteniendo las categorias. Favor de intentar de nuevo.';
            $('#errorModal').modal('show');
        });
}

function showCategoryCard(category) {
    const categoryList = document.querySelector('#result');

    const div = document.createElement('div');
    div.classList.add('col-sm-4', 'col-lg-3', 'py-2');

    const card = document.createElement('div');
    card.classList.add('card', 'mb-4', 'w-100');
    card.style.minWidth = '10rem';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h6');
    cardTitle.classList.add('card-text');

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer', 'd-flex', 'justify-content-between', 'px-1');

    const EditCategoryButton = document.createElement('button');
    EditCategoryButton.classList.add('btn', 'btn-primary');
    EditCategoryButton.textContent = 'Editar';
    EditCategoryButton.onclick = () => {

        btnConfirmChange.onclick = () => {
           let newNameCategory = document.getElementById("NewTitle").value;
    fetch(`${API_URL}/category/${category.id}`, {
        method: 'PUT',
       headers: {
            'Content-Type': 'application/json;  charset=UTF-8'
        },
        body: JSON.stringify({"title": newNameCategory})
    })  .then(response => response.json())
        .then(() => showCategories())
        .catch(() => {
            const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
            errorModalBody.textContent = 'Hubo un error obteniendo las categorias. Favor de intentar de nuevo.';
            $('#errorModal').modal('show');
        });
    }
    $('#dialogChangeCategory').modal('show');
};

    const removeProductButton = document.createElement('button');
    removeProductButton.classList.add('btn', 'btn-link');
    removeProductButton.textContent = 'Eliminar';
    removeProductButton.onclick = () => {

        btnConfirmDelete.onclick = () => {
       fetch(`${API_URL}/category/${category.id}`, {
            method: 'DELETE'
         })
        .then(() => showCategories())
             .catch(() => {
             const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
             errorModalBody.textContent = 'Hubo un error obteniendo las categorias. Favor de intentar de nuevo.';
                 $('#errorModal').modal('show');
            });

        }

             $('#dialogDeleteCategory').modal('show');
    };


    cardTitle.textContent = `${category.title}`;

    cardBody.appendChild(cardTitle);

    cardFooter.appendChild(removeProductButton);
    cardFooter.appendChild(EditCategoryButton);
   card.appendChild(cardBody);
    card.appendChild(cardFooter);



    categoryList.appendChild(card);
}

    btnConfirmCreation.onclick = () => {
       var newCategory = document.getElementById("CreateCategory").value;
fetch(`${API_URL}/category`, {
    method: 'POST',
   headers: {
        'Content-Type': 'application/json;  charset=UTF-8'
    },
    body: JSON.stringify({"title": newCategory})
})  .then(response => response.json())
    .then(() => showCategories())
    .catch(() => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error obteniendo las categorias. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');
    });
}
//$('#dialogCreateCategory').modal('show');



