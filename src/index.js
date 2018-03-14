import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router,Route,Link, Switch} from 'react-router-dom'
import {InfiniteLoader, List, AutoSizer,WindowScroller} from 'react-virtualized';
import MediaQuery from 'react-responsive';
import './index.css';

const IS_LOADING = 1
const IS_LOADED = 2
//const API_KEY = "4b28bee1d7e7f34d4c21545b2b8c60f3";
//const API_CODE = "6ccb42909e2a4973";
const API_URL = "https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json"
const AUTHOR_PAGE_URL = "https://www.flickr.com/photos/{id}/"
const DETAIL_URL = "/detail"
const DEFAULT_LOAD_TEXT = "Loading post..."
const DEFAULT_TITLE = " - Missing Title -  "
const IMG_PLACEHOLDER_URL = "http://via.placeholder.com/150x100?text=?"

require('es6-promise').polyfill();
var fetchJsonp=require('fetch-jsonp');
class Header extends React.Component {
  render() {
    return (
      <header>
        <h1>Matteo Mazzola - Potato Challenge</h1>
      </header>
    );
  }
}

class FlickrList extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        loadedRowCount: 0,
        loadedRowsMap: {},
        loadingRowCount: 0,
        list : [{title : 1},{title : 2},{title : 3},{title : 4},{title : 5}],
        postWidth:0
      };
      this.isRowLoaded = this.isRowLoaded.bind(this)
      this.rowRenderer = this.rowRenderer.bind(this)
      this.loadMoreRows = this.loadMoreRows.bind(this)
      this.onListResize = this.onListResize.bind(this)
    }
  // Manage loading state of rows
  isRowLoaded({index}){ return !!this.state.loadedRowsMap[index];}

  // Manage dynamic width of List
  onListResize(dimensions){
    this.setState({
      postWidth: dimensions.width - 200
    });
  }

  //Render a list item
  rowRenderer({key, index, style}){
    const {loadedRowsMap} = this.state
    const post = this.state.list[index]
    let title
    let image
    let loaded = false
    let dateString

    if (loadedRowsMap[index] === IS_LOADED) {
      title = post.title
      image = post.media.m
      let date = new Date(post.published)
      dateString = [dayOfTheMonth(date) , monthShortName(date), date.getFullYear(),"at" , date.getHours()+":"+date.getMinutes()].join(" ")
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
        <Link to={DETAIL_URL}><img className="image" alt={post.title} src={image}/></Link>
        {
          loaded ? 
          <div className="main-content">
            <h1 style={{width:this.state.postWidth}}>
              <Link to={DETAIL_URL}>{title.trim() ? title : DEFAULT_TITLE}</Link>
            </h1>
            <MediaQuery query="(max-width: 800px)">
                <span>Published: {dateString} </span>
              </MediaQuery>
            <div className="detail-content">
              <a href={AUTHOR_PAGE_URL.replace("{id}", post.author_id)} >Post author</a>
              <MediaQuery query="(min-width: 800px)">
                <span>Published: {dateString} </span>
              </MediaQuery>
              <a href={post.link}>View on Flickr</a>
            </div> 
          </div>
          :<div className="default-content">{title}</div>
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
    
    return fetchJsonp(API_URL,{jsonpCallbackFunction : "jsonFlickrFeed"})
    .then(response=> response.json()
      .then(data => {
        for (var i = startIndex; i <= stopIndex; i++) {
          loadedRowsMap[i] = IS_LOADED
        }
        this.setState({
          loadingRowCount: loadingRowCount - loadingRows,
          loadedRowCount: loadedRowCount + loadingRows,
          list: data.items
        })
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
            {({ height, isScrolling, scrollTop }) => (
          <AutoSizer disableHeight
            onResize={this.onListResize}>
            {({  width }) => (
            <List
              id="post-list"
              height={height}
              width={width}
              className="flickr-list"
              onRowsRendered={onRowsRendered}
              ref={registerChild}
              rowCount={this.state.list.length}
              rowHeight={100}
              rowRenderer={this.rowRenderer}/>
            )}
          </AutoSizer>
        )}
        </WindowScroller>
      )}
      </InfiniteLoader>
    );
  }
}

// ========================================

class DetailPost extends React.Component
{

  render()
  {
    return (
    <h2>My Detail View</h2>
    )
  }

}

//========================================


ReactDOM.render(
  <Router>
  <div className="fullscreen">
    <Header/>
    <div id="container">
      <h1>Flickr Public Feed</h1>
        <Switch>
          <Route exact path="/" component={FlickrList} />
          <Route path={DETAIL_URL +"?post=:post"} component={DetailPost} />
        </Switch>
    </div>
  </div>
  </Router>, document.getElementById('root'));

//==========================================

function dayOfTheMonth(date){
  var dateString = date.getDate().toString();
  let lastChar = dateString.charAt(dateString.length-1)
  if(lastChar === "1"){
    dateString +="st"
  }
  else if(lastChar === "2"){
    dateString +="nd"
  }
  else if(lastChar === "3"){
    dateString +="rd"
  }else{
    dateString +="th"
  }
  return dateString;
}

function monthShortName(date){
  var months = ["Jan","Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep","Oct", "Nov", "Dec"]
  return months[date.getMonth()]
}