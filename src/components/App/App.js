import React, { Component } from 'react';
import API from '../../utils/API';
import './App.css';
import Search from '../Search';
import Table from '../Table';
import Button from '../Button';

import {
    DEFAULT_QUERY,
    PATH_BASE,
    PATH_SEARCH,
    PARAM_SEARCH,
    PARAM_PAGE
} from '../../constants';


class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
    };

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const {hits, page} = result;
    const {searchKey, results} = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
    
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: {
        ...results,
        [searchKey]: {hits: updatedHits, page}
      }
    });
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    API.getArticles(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({error}));
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onSearchSubmit(event) {
    const{searchTerm} = this.state;
    this.setState({searchKey:searchTerm});

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  onDismiss(id) {
     const {searchKey, results} = this.state;
     const {hits, page} = results[searchKey];

     const isNotId = item => item.objectID !== id;
     const updatedHits = hits.filter(isNotId);

     this.setState({
      //  result: Object.assign({}, this.state.result, {hits: updatedHits})
      results: {...results, [searchKey]: {hits: updatedHits, page}}
     });
  }

  componentDidMount() {
    this._isMounted = true;

    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {results, searchKey, searchTerm, error} = this.state;
    const page = (
                  results && 
                  results[searchKey] &&
                  results[searchKey].page
                  ) || 0;

    const list = (
                  results && 
                  results[searchKey] &&
                  results[searchKey].hits
                  ) || [];
  
    return (
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        
        {error
        ? <div className="interactions">
          <p>Something went wrong</p>
        </div>
        : <Table 
          list={list}
          onDismiss={this.onDismiss}
        />
        }
      
        <div className="interactions">
          <Button onClick = {() => this.fetchSearchTopStories(searchKey, page+1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
};

export default App;