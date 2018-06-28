import React from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {WPCustomRestPath} from '../common/constants.js';
import OwlCarousel from 'react-owl-carousel';
import {Link} from 'react-router-dom';
import {stripHTML} from '../helpers/helpers.js';

export default class HomeNews extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      items: [],
    }

  }

  loadItems() {
    if (sessionStorage.getItem("homenews_list")!==null && sessionStorage.getItem("homenews_list").length>0) {
      let data = JSON.parse(sessionStorage.getItem("homenews_list"));
      this.setItems(data);
    }
    else {
      let context = this;
      axios.get(WPCustomRestPath+"category?slug=news&posts_per_page=12&orderby=date")
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
      let descriptionText = stripHTML(highlight.description);
      if (descriptionText.length>100) {
        descriptionText = descriptionText.substring(0,100)+"...";
      }

      let item = <div className="item" key={i}>
        <h4><Link to={"/wp-post/"+highlight.post_name}>{highlight.post_title}</Link></h4>
        <div className="news-thumb">

          <Link to={"/wp-post/"+highlight.post_name}>
            <img src={highlight.thumbnail} className="img-responsive highlights-thumbnail" alt={highlight.post_title} />
          </Link>
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
    let content;
    if (this.state.loading) {
      content = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60} delay={0} />
          </div>;
    }
    else {
      content =  <OwlCarousel className="owl-theme home-news" loop margin={10} nav items={1} navText={owlNavText} navContainerClass='news-nav-class' dots={false}>
            {this.state.items}
          </OwlCarousel>;
    }
    return (
      <div>
        <h2>News</h2>
        {content}
      </div>
    );
  }
}
