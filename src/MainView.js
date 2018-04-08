import React from 'react';
import {FlickrList} from './FlickrList.js';
import {SearchBox} from './SearchBox.js';

export class MainView extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        searchList : []
      }
      this.updateSearchList = this.updateSearchList.bind(this)
      this.onValueSelected = this.onValueSelected.bind(this)
      this._List = React.createRef();
  
    }
  
    updateSearchList(newList)
    {
      var result = [];
      newList.map((i) =>{return i.tags}).forEach(
        (val,index)=>
        {
          var parts = val.split(" ");
          parts.forEach((val, index)=>{
            if(!result.includes(val))
            {
              result.push(val);
            } 
          })
        }
      )
      this.setState({searchList : result});
    }
  
    onValueSelected(value){
      this._List.current.filterList(value);
    }
  
    render(){
      return (
        <div>
          <SearchBox suggestions={this.state.searchList} onValueSelected={this.onValueSelected}/>
          <FlickrList onListFetched={this.updateSearchList} ref={this._List}/>
        </div>
      )
    }
  }