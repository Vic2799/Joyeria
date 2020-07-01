'use strict';

import { putQuotationProduct, getProductById } from '../js/db/quotation.js'

let productMap = new Map();
let categoryList;
const API_URL = 'https://itacate.herokuapp.com/api/v1';

fetch(`${API_URL}/products`)
    .then(response => response.json())
    .then((products) => {
        /* productMap = products.reduce((res, obj)=> {
            res[obj.id] = obj;
            return res;
        }, {});*/
        productMap = new Map(products.map( p => [p.id, p]))
        console.log(productMap)
    })
    .then(() => showMenu())
    .catch(() => {
        const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
        errorModalBody.textContent = 'Hubo un error obteniendo productos. Favor de intentar de nuevo.';
        $('#errorModal').modal('show');
    });

function showMenu() {
    //  const value = 1;
    const categoryMenu = document.querySelector('#menu');
    categoryMenu.innerHTML = '';

    const categoryButton = document.createElement('button');
    categoryButton.classList.add('btn', 'btn-secondary', 'px-4', 'py-3');
    categoryButton.type = 'button';
    categoryButton.textContent = 'Todos';
    categoryButton.onclick = (() => {
        const cats = document.querySelectorAll('#menu .btn');
        cats.forEach(btn => {
            btn.classList.add('btn-secondary');
            btn.classList.remove('btn-primary');
        });

        categoryButton.classList.remove('btn-secondary');
        categoryButton.classList.add('btn-primary');
        showProducts(0);
    });
    categoryButton.click(); // show 'Todos' as default

    categoryMenu.appendChild(categoryButton);

    fetch(`${API_URL}/categories`)
        .then(response => response.json())
        .then((categories) => {
            categoryList = categories;
            categories.forEach((category) => {
                const categoryButton = document.createElement('button');
                categoryButton.classList.add('btn', 'btn-secondary', 'px-4', 'py-3');
                categoryButton.type = 'button';
                categoryButton.textContent = category.title;
                categoryButton.onclick = (() => {
                    const cats = document.querySelectorAll('#menu .btn');
                    cats.forEach(btn => {
                        btn.classList.add('btn-secondary');
                        btn.classList.remove('btn-primary');
                    });

                    categoryButton.classList.remove('btn-secondary');
                    categoryButton.classList.add('btn-primary');
                    showProducts(category.id);
                });
                categoryMenu.appendChild(categoryButton);
            });
        }).catch((error) => {
            console.log(error);
            const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
            errorModalBody.textContent = 'Hubo un problema al obtener las categorías, por favor intente más tarde.';
            $('#errorModal').modal('show');
        });


}

function showProducts(categoryId) {

    const productResult = document.querySelector('#result');
    productResult.innerHTML = '';
    if (categoryId) {
        Object.values(productMap).filter(( product) => product.category_id === categoryId)
            .forEach((product) => {
                showProductCard(product);
            })

    } else {
        Object.values(productMap).forEach((product) => {
            showProductCard(product);
        })
    }
}

function showProductCard(product) {
    const productListResult = document.querySelector('#result');

    const card = document.createElement('div');
    card.classList.add('card', 'mb-4', 'w-100');
    card.style.minWidth = '10rem';

    const img = document.createElement('img');
    img.classList.add('card-img-top', 'm-auto');
    img.style = 'max-width: 158px;'
    img.src = product.image_url || 'https://cdn.onlinewebfonts.com/svg/img_148071.png';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h6');
    cardTitle.classList.add('card-text');

    cardTitle.textContent = `${product.title}`;

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    const cardAddButton = document.createElement('button');
    cardAddButton.classList.add('btn', 'btn-success', 'w-100');
    cardAddButton.textContent = 'Agregar';

    const cardEditButton = document.createElement('button');
    cardEditButton.classList.add('btn', 'btn-link', 'w-100');
    cardEditButton.textContent = 'Editar';

    cardAddButton.onclick = () => {
        putQuotationProduct(product.id, 1)
            .then(() => {
                cardAddButton.disabled = true;
                cardAddButton.classList.remove('btn-success');
                cardAddButton.textContent = 'Agregado';
                cardEditButton.disabled = true;
                cardEditButton.classList.remove('btn-link');
                cardEditButton.textContent = '';

                const toast = document.createElement('div');
                toast.innerHTML = successToastHtml;
                toastContainer.prepend(toast.firstElementChild);

                $('#toastContainer .toast:first').toast('show');
            })
            .catch(() => {
                const toast = document.createElement('div');
                toast.innerHTML = errorToastHtml;
                toastContainer.prepend(toast.firstElementChild);

                $('#toastContainer .toast:first').toast('show');
            });
    }


    cardEditButton.onclick = () => {
        console.log(typeof productMap);
        const prod = productMap.get(product.id);
        console.log(prod);
        newTitleProduct.value = prod.title;
        newWidth.value = prod.width;
        btnConfirmChange.onclick = () => {
            let newNameProduct = document.getElementById("newTitleProduct").value;


        fetch(`${API_URL}/product/${category.id}`, {
            method: 'PUT',
           headers: {
                'Content-Type': 'application/json;  charset=UTF-8'
            },
            body: JSON.stringify({"title": newNameProduct})
        })  .then(response => response.json())
            .then(() => showCategories())
            .catch(() => {
                const errorModalBody = document.querySelector('#errorModal .modal-content > div.modal-body');
                errorModalBody.textContent = 'Hubo un error obteniendo las categorias. Favor de intentar de nuevo.';
                $('#errorModal').modal('show');
            });
        }
        $('#dialogChangeProduct').modal('show');

    };

    const separator = document.createElement('hr');
    separator.classList.add('my-1');


    cardBody.appendChild(cardTitle);
    console.log(product.id + 'a');
    // show add product button disabled if it has already been added to the quotation
    getProductById(product.id)
        .then(product => {
            if (product !== undefined && product.quantity > 0) {
                cardAddButton.disabled = true;
                cardAddButton.classList.remove('btn-primary');
                cardAddButton.textContent = 'Agregado';
            }
            cardFooter.appendChild(cardEditButton);
            cardFooter.appendChild(cardAddButton);
        });

    card.appendChild(img);
    card.appendChild(separator); // add separator
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    productListResult.appendChild(card);
}

const successToastHtml = `
<div class="toast bg-success" role="alert" aria-live="assertive" aria-atomic="true"
    data-delay="3000">
    <div class="toast-header">
        <strong class="mr-auto">Producto agregado correctamente</strong>
        <button type="button" class="ml-2 mb-1 close stretched-link" data-dismiss="toast"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</div>
`;

const errorToastHtml = `
<div class="toast bg-danger" role="alert" aria-live="assertive" aria-atomic="true"
    data-delay="3000">
    <div class="toast-header">
        <strong class="mr-auto">Hubo un error al intentar agregar el producto</strong>
        <button type="button" class="ml-2 mb-1 close stretched-link" data-dismiss="toast"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</div>
`;
