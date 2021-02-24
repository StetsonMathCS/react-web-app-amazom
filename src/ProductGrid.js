import React, { useState, useEffect } from 'react';
import * as B from 'react-bootstrap';
import StackGrid from "react-stack-grid";
import { ProductCard } from './Product';
import { getAllProducts, searchProducts } from './Solr';

const qs = require('qs');

function Pager(props) {
    const query = props.query;
    const pageCount = props.pageCount;
    const pageNum = props.pageNum;
    const pageLinks = [];
    for(let i = 0; i < pageCount; i++) {
        pageLinks.push(<a key={i} className={`${"btn btn-secondary "+(i===pageNum ? "disabled" : "")}`} href={"/search/"+qs.stringify({query: query, start: i*50}, { addQueryPrefix: true })}>{i+1}</a>);
    }
    return (<div className="text-center mb-3"><B.ButtonGroup>{pageLinks}</B.ButtonGroup></div>);
}

export function ProductGrid(props) {
    const products = props.products;
    if(products) {
        return (
            <>
                <Pager {...props}/>
                <StackGrid columnWidth={300} monitorImagesLoaded duration={0}>
                    {products.map(p => <ProductCard key={p.id} product={p}/>)}
                </StackGrid>
                <Pager {...props}/>
            </>
        );
    } else {
        return null;
    }
}

export function ProductGridAll(props) {
    const [products, setProducts] = useState(null);
    useEffect(() => {
        getAllProducts(0).then(function(results) {
            setProducts(results.docs);
        });
    }, []);
    return (<ProductGrid products={products}/>);
}

export function ProductGridSearch(props) {
    const [products, setProducts] = useState(null);
    const [pageCount, setPageCount] = useState(null);
    const [pageNum, setPageNum] = useState(null);
    const params = qs.parse(props.location.search, { ignoreQueryPrefix: true });
    const query = params.query;
    let start = params.start;
    if(!start) { start = 0; }
    useEffect(() => {
        searchProducts(query, start).then(function(results) {
            setPageCount(Math.ceil(results.numFound/50.0));
            setPageNum(Math.floor(start/50.0));
            setProducts(results.docs);
        });
    }, []);
    return (<ProductGrid products={products} pageCount={pageCount} pageNum={pageNum} query={query} />);
}
