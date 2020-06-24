'use strict';

const API_URL = 'https://itacate.herokuapp.com/api/v1';

const quotationId = (new URL(window.location)).searchParams.get('quotation');

if (quotationId) {
    fetch(`${API_URL}/quotation/${quotationId}`)
        .then(res => res.json())
        .then(quotation => {

        });
}