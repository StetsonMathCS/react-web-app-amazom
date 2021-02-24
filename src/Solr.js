
const axios = require('axios').default;

function solrSearch(query, sort, start, limit) {
    if(!sort) { sort = ''; }
    return axios.post('http://localhost:8983/solr/amazom/query',
        { 'query': query, 'sort': sort, 'offset': start, 'limit': limit })
        .then(function(response) {
            return response.data.response;
        })
        .catch(function(error) {
            console.log(error);
        });
}

export function getProductById(id) {
    return solrSearch('id:'+id, null, 0, 1).then(function(results) {
        if(results && results.docs && results.docs.length === 1) {
            return results.docs[0];
        } else {
            return null;
        }
    });
}

export function getAllProducts(start) {
    return solrSearch('*:*', 'reviews_i desc', start, 50);
}

export function searchProducts(query, start) {
    return solrSearch(query.split(' ').map(q => "name_t:"+q+" desc_t:"+q).join(' AND '), 'score desc', start, 50);
}

