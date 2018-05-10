import React from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {WPCustomRestPath} from '../common/constants.js';
import OwlCarousel from 'react-owl-carousel';
import {Link} from 'react-router-dom';

export default class HighlightsBlock extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      items: [],
    }

  }

  loadItems() {
    if (sessionStorage.getItem("highlights_list")!==null && sessionStorage.getItem("highlights_list").length>0) {
      let data = JSON.parse(sessionStorage.getItem("highlights_list"));
      this.setItems(data);
    }
    else {
      let context = this;
      axios.get(WPCustomRestPath+"category?slug=highlights&posts_per_page=6")
    	  .then(function (response) {
          let data = response.data;
          context.setItems(data);
        })
        .catch(function (error) {
    	    console.log(error);
    	});
    }
  }

  setItems(data) {
    let items = [];
    for (let i=0; i<data.length; i++) {
      let highlight = data[i];
      let descriptionText = highlight.description.replace(/<[^>]+>/ig," ");
      descriptionText = descriptionText.replace("&amp;", "&");
      if (descriptionText.length>100) {
        descriptionText = descriptionText.substring(0,100)+"...";
      }

      let item = <div className="item" key={i}>
        <Link to={"/wp-post/"+highlight.post_name}>
          <img src={highlight.thumbnail} className="img-responsive highlights-thumbnail" alt={highlight.post_title} />
        </Link>
        <div className="home-collection">
          <h4><Link to={"/wp-post/"+highlight.post_name}>{highlight.post_title}</Link></h4>
          <p>{descriptionText}</p>
        </div>
      </div>;
      items.push(item);
    }
    this.setState({
      loading: false,
      items: items
    });
  }
  componentDidMount() {
    this.loadItems();
  }

  render() {
    let owlNavText = ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'];
    let owlResponsive = {
        0:{
            items:1
        },
        600:{
            items:2
        },
        767:{
            items:3
        },
        992: {
          items:4
        }
    };
    let content;
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
          </div>;
    }
    else {
      content =  <div className="container">
          <OwlCarousel
            className="owl-theme"
            autoplay={true}
            autoplaytimeoutloop={5000}
            autoplayhoverpause="true"
            margin={10}
            nav
            items={4}
            navText={owlNavText}
            navContainerClass='news-nav-class'
            dots={false}
            responsive={owlResponsive}
            >
            {this.state.items}
          </OwlCarousel>
          </div>;
    }
    return (
      <section className="home-highlights">
        <h2 className="section-title">
          <span>Highlights</span>
        </h2>
        {content}
      </section>
    );
  }
}
