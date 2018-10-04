import React from 'react';
import './Search.css';

const Search = ({value, onChange, onSubmit,children}) => 
  <form className='test' onSubmit={onSubmit}>
    <input
      type = "text"
      value ={value}
      onChange = {onChange}
    />
    <button type="submit">
      {children}
    </button>   
  </form>

export default Search;