const axios = require('axios').default;

export function getSimilarProducts(productid, count) {
    return axios.get('http://127.0.0.1:5002/similar?productid='+productid+'&count='+count)
        .then(function(response) {
            return response.data;
        })
        .catch(function(error) {
            console.log(error);
        });
}

