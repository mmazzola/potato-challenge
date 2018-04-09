import React from 'react';
import MediaQuery from 'react-responsive';
import {Link} from 'react-router-dom';
import {InfiniteLoader, List,WindowScroller} from 'react-virtualized';
import {getPublishedDate} from './utils.js'

const IS_LOADING = 1
const IS_LOADED = 2
const API_URL = "https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json"
const AUTHOR_PAGE_URL = "https://www.flickr.com/photos/{id}/"
const DEFAULT_LOAD_TEXT = "Loading post..."
const DEFAULT_TITLE = " - Missing Title -  "
const IMG_PLACEHOLDER_URL = "https://via.placeholder.com/200x200?text=?"
const DETAIL_URL = "/detail"


require('es6-promise').polyfill();
var fetchJsonp=require('fetch-jsonp');

export class FlickrList extends React.Component {
    constructor(props){
      super(props);
      this.state = {
          loadedRowCount: 0,
          loadedRowsMap: {},
          loadingRowCount: 0,
          list : [],
          backupList : [],
          screen:
          {
            width : 0,
            height : 0,
            rowScaleDown: 0,
            textScaleDown:0
          }
        };
        this.isRowLoaded = this.isRowLoaded.bind(this)
        this.rowRenderer = this.rowRenderer.bind(this)
        this.loadMoreRows = this.loadMoreRows.bind(this)
        this.getRowHeight = this.getRowHeight.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.filterList = this.filterList.bind(this);
        this.noRowsRenderer = this.noRowsRenderer.bind(this);
      }
      componentWillMount(){
        this.loadMoreRows(0,5);
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();
      }
  
      componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
      }
  
      updateWindowDimensions() {
        let rowScaleDown = 0.2;
        let textScaleDown = 0.66;
        if(window.innerWidth < 400){
          rowScaleDown = 0.25;
          textScaleDown = 0.53;
        }
        this.setState({screen : 
          { width: window.innerWidth, height: window.innerHeight,
          textScaleDown : textScaleDown, rowScaleDown : rowScaleDown }});
        
        if(this._List)
        {
          this._List.recomputeRowHeights();
        }
      }
  
    //Handle search value on tags  
    filterList(value){
      if(value)
      {
        this.setState(
          {
            list : this.state.backupList.filter( (p)=>{
              return p.tags.split(" ").filter(
                (t) =>{
                  return t.startsWith(value);
                }
              ).length > 0;
            })
        })
      }
      else{
        this.setState(
          {
            list : this.state.backupList
          })
      }
    }
  
    //Handles different screen sizes for the row height of the list
    getRowHeight(){
      return this.state.screen.width * this.state.screen.rowScaleDown; 
    }
    
    // Manage loading state of rows
    isRowLoaded({index}){ return !!this.state.loadedRowsMap[index];}
  
    //Render an empty list
    noRowsRenderer(){
      let text = this.state.backupList.length ? "Sorry, there are no posts with this tag :("
      : "Just a second...";
      return(
      <div className="post" style={{justifyContent:"center"}}>
        <h1 style={{maxWidth:this.state.screen.width * this.state.screen.textScaleDown,
          fontSize: this.state.screen.width * 0.03}}>
          {text}      
        </h1>
      </div>
    );
    }
  
    //Render a list item
    rowRenderer({key, index, style, isVisible}){
      const {loadedRowsMap} = this.state
      const post = this.state.list[index]
      let title
      let image
      let loaded = false
      let dateString
  
      if (loadedRowsMap[index] === IS_LOADED) {
        title = post.title
        image = post.media.m
        dateString = getPublishedDate(post.published);
        loaded = true
      }
      else {
        title = DEFAULT_LOAD_TEXT
        image = IMG_PLACEHOLDER_URL 
      }
  
      return (
        <div
          className="post"
          key={key}
          style={style}
          >
  
          <Link className="image-link" to={{pathname : DETAIL_URL, state : post}}>
            <img className="image" 
            style={{maxWidth:this.state.screen.width * this.state.screen.rowScaleDown}}
            alt={post.title} src={image}/>
          </Link>
          {
            loaded ?
            <div className="main-content">
              <h1  className="main-title" style={{maxWidth:this.state.screen.width * this.state.screen.textScaleDown}}>
                <Link to={{pathname : DETAIL_URL, state : post}}>{title.trim() ? title : DEFAULT_TITLE}</Link>
              </h1>
              <MediaQuery query="(max-width: 800px)">
                  <span>Published: {dateString} </span>
                </MediaQuery>
              <div className="detail-content">
                <a href={AUTHOR_PAGE_URL.replace("{id}", post.author_id)} className="button">Post author</a>
                <MediaQuery query="(min-width: 800px)">
                  <span>Published: {dateString} </span>
                </MediaQuery>
                <a href={post.link} className="button">View on Flickr</a>
              </div> 
            </div>
            :<div className="main-content">{title}</div>
        }
        </div>
      )
    }
  
    //Load more rows from API
    loadMoreRows({startIndex, stopIndex}){
      const {loadedRowsMap, loadingRowCount, loadedRowCount } = this.state
      const loadingRows = stopIndex - startIndex + 1
      for (var i = startIndex; i <= stopIndex; i++) {
        loadedRowsMap[i] = IS_LOADING
      }
  
      this.setState({
        loadingRowCount: loadingRowCount + loadingRows
      })
      
      const that = this;
      return fetchJsonp(API_URL,{jsonpCallbackFunction : "jsonFlickrFeed"})
      .then(response=> response.json()
        .then(data => {
          for (var i = startIndex; i <= stopIndex; i++) {
            loadedRowsMap[i] = IS_LOADED
          }
          that.setState({
            loadingRowCount: loadingRowCount - loadingRows,
            loadedRowCount: loadedRowCount + loadingRows,
            list: data.items,
            backupList : data.items
          })
          if(that.props.onListFetched){
            that.props.onListFetched(data.items);
          }
        })
      );
    }
  
    render() {
      return (
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={this.state.list.length}>
          {({onRowsRendered, registerChild}) => (
            <WindowScroller>
              {({ height, width,isScrolling,scrollTop }) => (
              <List
                ref ={(l) => {this._List = l; registerChild(l);}}
                height={height}
                autoHeight
                autoWidth
                width={width}
                className="white-border"
                onRowsRendered={onRowsRendered}
                rowCount={this.state.list.length}
                rowHeight={this.getRowHeight}
                scrollTop={scrollTop}
                isScrolling = {isScrolling}
                rowRenderer={this.rowRenderer}
                noRowsRenderer = {this.noRowsRenderer}/>
              )}
          </WindowScroller>
        )}
        </InfiniteLoader>
      );
    }
  }