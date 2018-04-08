import React from 'react';
import Autosuggest from 'react-autosuggest';

export class SearchBox extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        trackList : props.trackList,
        indexList : [],
        suggestions : props.suggestions,
        value: ""
      };
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.onChange = this.onChange.bind(this);
      }
  
      onSuggestionsFetchRequested({value, reason})
      {
       this.setState(
         {
           suggestions : this.props.suggestions.filter((val)=>{return val.startsWith(value)})
        });
      }
  
      renderSuggestion(suggestion) {return (<span>{suggestion}</span>)};
  
      onSuggestionsClearRequested(){this.setState({suggestions : []});}
  
      getSuggestionValue(suggestion){
        return suggestion;
      }
  
      onChange(event,info){
        this.setState({value : info.newValue});
        if(this.props.onValueSelected)
        {
          this.props.onValueSelected(info.newValue);
        }
      }
  
      render(){
        return (
          <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={
            {
              placeholder :"Search through picture tags...",
              value : this.state.value,
              onChange : this.onChange
            }
          }
          theme={
            {
            container : 'search-container',
            containerOpen : 'search-container-open',
            input: 'search-input',
            inputOpen: 'search-input-open',
            inputFocused:'search-input-focused',
            suggestionsContainer: 'search-suggestions-container',
            suggestionsContainerOpen:'search-suggestions-container-open',
            suggestionsList: 'search-suggestions-list',
            suggestion: 'search-suggestion',
            suggestionHighlighted: 'search-suggestion-highlighted'
            }
          }
        />
        );
      }
  }