import React, { useState, useEffect } from 'react';
import * as B from 'react-bootstrap';
import * as I from 'react-bootstrap-icons';
import { getProductById } from './Solr';
import { getSimilarProducts } from './Similar';
import StackGrid from "react-stack-grid";

function ProductRating(props) {
    const p = props.product;
    const rating = p.rating_f;
    if(rating) {
        const stars = [];
        let i = 1;
        for(; i <= Math.floor(rating); i++) {
            stars.push((<I.StarFill key={i} size={22} color="gold" />));
        }
        if(rating - Math.floor(rating) > 0) {
            stars.push((<I.StarHalf key={i} size={22} color="gold" />));
            i++;
        }
        for(; i <= 5; i++) {
            stars.push((<I.Star key={i} size={22} color="gold" />));
        }
        return (<div>{stars}<br/>{p.reviews_i} review{p.reviews_i === 1 ? "" : "s"}</div>);
    } else {
        return null;
    }
}

function Price(props) {
    if(props.price && props.price > 0) {
        return (<div><strong>$</strong> {props.price}</div>);
    } else {
        return null;
    }
}

export function ProductCard(props) {
    const p = props.product;
    if(p) {
        const imgs = p.image_s.split('|');
        return (
            <>
                <B.Card className="m-1">
                    <a href={"/product/"+p.id} className="text-center">
                        <B.Card.Img variant="top" src={imgs[0]} style={{maxWidth: 280, maxHeight: 400, width: "auto", height: "auto"}}/>
                    </a>
                    <B.Card.Body>
                        <B.Card.Title>{p.name_t}</B.Card.Title>
                        <Price price={p.price_f}/>
                        <ProductRating {...props}/>
                    </B.Card.Body>
                </B.Card>
            </>
        );
    } else {
        return null;
    }
}

export function ProductFromRoute(props) {
    const [product, setProduct] = useState(null);
    const productid = props.match.params.productid;
    useEffect(() => {
        getProductById(productid).then(function(p) {
            setProduct(p);
        });
    }, [productid]);

    const [similar, setSimilar] = useState([]);
    useEffect(() => {
        if(product && product.id) {
            getSimilarProducts(product.id, 15).then(function(results) {
                if(results) {
                    const similarProducts = [];
                    (async () => {
                        for(const sim of results) {
                            await getProductById(sim.productid).then(function(prod) {
                                similarProducts.push(prod);
                            });
                        }
                    })().then(() => setSimilar(similarProducts));
                }
            });
        }
    }, [product]);

    if(product) {
        const imgs = product.image_s.split('|');
        return (
            <>
                <B.Row>
                    <B.Col>
                        <img className="float-left mr-3 mb-3" src={imgs[0]} style={{maxWidth: 600}}/>
                        <h2>{product.name_t}</h2>
                        <p>{product.desc_t}</p>
                        <p><a href={product.url_s} target="_blank"><I.Cart4 size={22} className="pb-1" /> Amazon Link</a></p>
                        <ProductRating {...props} product={product} />
                    </B.Col>
                </B.Row>
                <B.Row className="mt-5">
                    <B.Col>
                        <h2 className="text-center">Similar Products</h2>
                        <StackGrid columnWidth={300} monitorImagesLoaded duration={0}>
                            {similar.map(s => (<ProductCard product={s}/>))}
                        </StackGrid>
                    </B.Col>
                </B.Row>
            </>
        );
    } else {
        return null;
    }
}


