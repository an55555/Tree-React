import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tree from './tree.jsx'





class App extends Component {
    constructor(props){
        super(props);

    }
    componentDidMount(nextProps){

    }
    componentWillUnmount(){

    }
    render() {
        return (
           <Tree/>
    );
    }
}

export default App;
