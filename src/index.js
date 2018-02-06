import React from 'react';
import ReactDOM from 'react-dom';
import {InfiniteLoader, List, AutoSizer,WindowScroller} from 'react-virtualized';
import './index.css';

const IS_LOADING = 1
const IS_LOADED = 2
const API_URL = "https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json"

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
        list : [{title : 1},{title : 2},{title : 3},{title : 4},{title : 5}]
      };
      this.isRowLoaded = this.isRowLoaded.bind(this)
      this.rowRenderer = this.rowRenderer.bind(this)
      this.loadMoreRows = this.loadMoreRows.bind(this)
  }
  // Manage loading state of rows
  isRowLoaded({index}){ return !!this.state.loadedRowsMap[index];}

  //Render a list item
  rowRenderer({key, index, style}){
    const {loadedRowsMap} = this.state
    const post = this.state.list[index]
    let content

    if (loadedRowsMap[index] === IS_LOADED) {
      content = post.title
    }
    else {
      content = "Loading post..."
    }
    return (
      <div
        className="post"
        key={key}
        style={style}
        >
        {content}
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
      <div id="container">
        <InfiniteLoader
          isRowLoaded={this.isRowLoaded}
          loadMoreRows={this.loadMoreRows}
          rowCount={this.state.list.length}>
          {({onRowsRendered, registerChild}) => (
            <WindowScroller>
              {({ height, isScrolling, scrollTop }) => (
            <AutoSizer disableHeight>
              {({  width }) => (
              <List
                height={height}
                width={width}
                autoHeight={true}
                className="flickr-list"
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={this.state.list.length}
                rowHeight={50}
                rowRenderer={this.rowRenderer}/>
              )}
            </AutoSizer>
          )}
          </WindowScroller>
        )}
        </InfiniteLoader>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <div className="fullscreen">
  <Header/>
  <FlickrList/>
</div>, document.getElementById('root'));
