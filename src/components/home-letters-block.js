import React from 'react';
import {Link} from 'react-router-dom';

import {domain} from '../common/constants';
import axios from 'axios';
import {WPCustomRestPath} from '../common/constants.js';

export default class HomeLettersBlock extends React.Component {
  constructor() {
    super();
    this.state = {
      block1: {
        url: '',
        thumbnail: [],
        title: '',
        content: '',
      },
      block2: {
        url: '',
        thumbnail: [],
        title: '',
        content: '',
      },
      block3: {
        url: '',
        thumbnail: [],
        title: '',
        content: '',
      },
    }

    this.createBlock = this.createBlock.bind(this);
  }

  loadBlock1() {
    if (sessionStorage.getItem("home_discover_collection")!==null && sessionStorage.getItem("home_discover_collection").length>0) {
      let data = JSON.parse(sessionStorage.getItem("home_discover_collection"));
      let block = this.createBlock(data, true);
      this.setState({
        block1: {
          url: block.url,
          thumbnail: block.thumbnail,
          title: block.title,
          content: block.content,
        }
      });
    }
    else {
      let context = this;
      axios.get(WPCustomRestPath+"post", {
          params: {
            "slug": "discover-the-collection"
          }
        })
        .then(function (response) {
          let newData = response.data;
          let discoverPost = {
            title: newData.post_title,
            content: newData.post_excerpt,
            slug: newData.slug,
            thumbnail: newData.thumbnail,
            permalink: newData.permalink,
          }
          let block = context.createBlock(discoverPost, true);
          context.setState({
            block1: {
              url: block.url,
              thumbnail: block.thumbnail,
              title: block.title,
              content: block.content,
            }
          });
        })
        .catch(function (error) {
          console.log(error);
      });
    }
  }

  loadBlock2() {
    if (sessionStorage.getItem("home_transcribe_letters")!==null && sessionStorage.getItem("home_transcribe_letters").length>0) {
      let data = JSON.parse(sessionStorage.getItem("home_transcribe_letters"));
      let block = this.createBlock(data, false);
      this.setState({
        block2: {
          url: block.url,
          thumbnail: block.thumbnail,
          title: block.title,
          content: block.content,
        }
      });
    }
    else {
      let context = this;
      axios.get(WPCustomRestPath+"post", {
          params: {
            "slug": "transcribe-letters"
          }
        })
        .then(function (response) {
          let newData = response.data;
          let discoverPost = {
            title: newData.post_title,
            content: newData.post_excerpt,
            slug: newData.slug,
            thumbnail: newData.thumbnail,
            permalink: newData.permalink,
          }
          let block = context.createBlock(discoverPost, false);
          context.setState({
            block2: {
              url: block.url,
              thumbnail: block.thumbnail,
              title: block.title,
              content: block.content,
            }
          });
        })
        .catch(function (error) {
          console.log(error);
      });
    }
  }

  loadBlock3() {
    if (sessionStorage.getItem("home_contribute")!==null && sessionStorage.getItem("home_contribute").length>0) {
      let data = JSON.parse(sessionStorage.getItem("home_contribute"));
      let block = this.createBlock(data, false);
      this.setState({
        block3: {
          url: block.url,
          thumbnail: block.thumbnail,
          title: block.title,
          content: block.content,
        }
      });
    }
    else {
      let context = this;
      axios.get(WPCustomRestPath+"post", {
          params: {
            "slug": "contribute-letters"
          }
        })
        .then(function (response) {
          let newData = response.data;
          let discoverPost = {
            title: newData.post_title,
            content: newData.post_excerpt,
            slug: newData.slug,
            thumbnail: newData.thumbnail,
            permalink: newData.permalink,
          }
          let block = context.createBlock(discoverPost, false);
          context.setState({
            block3: {
              url: block.url,
              thumbnail: block.thumbnail,
              title: block.title,
              content: block.content,
            }
          });
        })
        .catch(function (error) {
          console.log(error);
      });
    }
  }

  createBlock(data, browse=false) {
    if (data.length===0) {
      return false;
    }
    let url = 'wp-post'+data.permalink.replace(domain, '');
    if (browse) {
      url = "/browse";
    }

    let block = {
      url: url,
      thumbnail: data.thumbnail,
      title: data.title,
      content: data.content,
    }
    return block;
  }

  componentDidMount() {
    this.loadBlock1();
    this.loadBlock2();
    this.loadBlock3();
  }

  render() {
    return (
      <section className="home-blocks">
        <div className="container">
          <div className="row">

            <div className="col-xs-12 col-sm-4">
              <div className="home-block">
                <div className="home-block-thumbnail">
                  <Link href={this.state.block1.url} to={this.state.block1.url}>
                    <img src={this.state.block1.thumbnail} alt={this.state.block1.title} className="img-responsive"/>
                  </Link>
                </div>
                <h4><Link href={this.state.block1.url} to={this.state.block1.url}>{this.state.block1.title}</Link></h4>
                <p>{this.state.block1.content}</p>
              </div>
            </div>

            <div className="col-xs-12 col-sm-4">
              <div className="home-block">
                <div className="home-block-thumbnail">
                  <Link href={this.state.block2.url} to={this.state.block2.url}>
                    <img src={this.state.block2.thumbnail} alt={this.state.block2.title} className="img-responsive"/>
                  </Link>
                </div>
                <h4><Link href={this.state.block2.url} to={this.state.block2.url}>{this.state.block2.title}</Link></h4>
                <p>{this.state.block2.content}</p>
              </div>
            </div>

            <div className="col-xs-12 col-sm-4">
              <div className="home-block">
                <div className="home-block-thumbnail">
                  <Link href={this.state.block3.url} to={this.state.block3.url}>
                    <img src={this.state.block3.thumbnail} alt={this.state.block3.title} className="img-responsive"/>
                  </Link>
                </div>
                <h4><Link href={this.state.block3.url} to={this.state.block3.url}>{this.state.block3.title}</Link></h4>
                <p>{this.state.block3.content}</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }
}
