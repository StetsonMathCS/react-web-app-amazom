import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import * as B from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ProductGridAll, ProductGridSearch } from './ProductGrid';
import { ProductFromRoute } from './Product';

const qs = require('qs');

function App(props) {
    const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    return (
        <div className="App">
            <div className="container-fluid">
                <Router>
                    <B.Row>
                        <B.Col xs={1}>
                            <a href="/"><img src="/logo.png" width={150} /></a>
                        </B.Col>
                        <B.Col className="pt-5">
                            <B.Form method="get" action="/search/">
                                <B.Form.Group>
                                    <B.FormControl type="search" placeholder="Search" size="lg" name="query" defaultValue={params.query}/>
                                </B.Form.Group>
                            </B.Form>
                        </B.Col>
                    </B.Row>
                    <Switch>
                        <Route path="/product/:productid" component={ProductFromRoute}/>
                        <Route path="/search" component={ProductGridSearch}/>
                        <Route path="/" component={ProductGridAll}/>
                    </Switch>
            </Router>
        </div>
        </div>
    );
}

export default App;
