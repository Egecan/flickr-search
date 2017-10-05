import React, { Component } from 'react';
import './App.css';
import fetchJsonp from 'fetch-jsonp'

function getData(url) {
  return fetchJsonp(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    jsonpCallback: "jsoncallback"
  })
      .then(handleErrors)
      .then(response => {
        return response.json();
      });
}

function handleErrors(response) {
  if (!response.ok && response.code >= 400) {
    throw Error(response.statusText);
  }
  return response;
}

function bringThumbnail(item) {
  return item.media.m.replace("_m.jpg", "_t.jpg");
}
function bringLargeImage(item) {
  return item.media.m.replace("_m.jpg", "_b.jpg");
}
function bringAuthor(item) {
  return item.author.match(/\(([^)]+)\)/)[1];
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
      hoveredId: 0,
      error: false,
      searchTerm: "",
      json: "",
      loaded: false
    };
    this.searchUpdated = this.searchUpdated.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  searchUpdated(event) {
    const searchValue = event.target.value;
    const baseUrl = `https://api.flickr.com/services/feeds/photos_public.gne?format=json`;
    let url = ``;

    if (!searchValue || searchValue.length === 0) {
      this.setState({
        json: null,
        error: false,
        loaded: false
      });
    } else {
      url = baseUrl + `&tags=` + searchValue;
      getData(url)
          .then(response => {
            this.setState({
              searchTerm: searchValue,
              json: response,
              error: false,
              loaded: true
            });
          })
          .catch(error => {
            console.log(error);
            this.setState({
              error: true,
              loaded: false
            });
          });
    }
  }

  onMouseOver(i) {
    this.setState({
      hovered: true,
      hoveredId: i
    });
  }
  onMouseOut() {
    this.setState({
      hovered: false
    });
  }

  render() {
    return (
        <div>
          <input
              type="text"
              placeholder="Search flickr"
              onChange={this.searchUpdated}
          />

          {this.state.error === true ? (
                  <h2>
                    An error has occurred. Please change your search query and try again
                  </h2>
              ) : null}

          {this.state.loaded === true &&
          this.state.json &&
          this.state.json.items &&
          this.state.json.items.length > 0 ? (
                  <div>
                    {this.state.json.items.map((item, i) => {
                      return (
                          <div className="thumbnail" key={i}>
                            <div className="image-container" >
                              <a href={bringLargeImage(item)} target="_blank">
                                <img id={i} src={bringThumbnail(item)} alt="thumbnail"
                                     onMouseOver={() => this.onMouseOver(i)}
                                     onMouseOut={this.onMouseOut}/>
                              </a>
                            </div>
                            <div className="desc">Author: <span className="author">{bringAuthor(item)}</span>
                            </div>
                            {this.state.hovered === true &&
                            this.state.hoveredId === i ?
                                <div className="tooltip">Tags=>
                                  <span className="tags">{item.tags}</span>
                                </div>
                                : null}
                          </div>
                      );
                    })}
                  </div>
              ) : null}
        </div>
    );
  }
}

export default App;
