import React from 'react';
import {Carousel} from 'react-bootstrap';
import axios from 'axios';
import ReactLoading from 'react-loading';
import cheerio from 'cheerio';
import {WPRestPath} from '../common/constants.js';


import defaultImg from '../assets/images/carousel/default.png';

class ControlledCarousel extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      loading: true,
      index: 0,
      direction: null,
      nextIcon: <span className="fa fa-angle-right"></span>,
      prevIcon: <span className="fa fa-angle-left"></span>,
      images: []
    };
  }

  handleSelect(selectedIndex, e) {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  }

  getImages() {
    let context = this;
    axios.get(WPRestPath+"pages/6")
  	  .then(function (response) {
        let newContent = response.data.content.rendered;
        let $ = cheerio.load(newContent);
        let images = [];
        $('#slider_2 > li').each(function(index,element) {
          let imagePath = $(this).attr("data-thumb");
          let imageTitle = $(this).attr("data-title");
          let imageDescription = $(this).attr("data-description");
          let carouselItemStyle = {
            backgroundImage: 'url('+imagePath+')',
            backgroundSize: 'cover',
          }
          let carouselTitle = "";
          if (imageTitle !=="") {
            carouselTitle = <h3>{carouselTitle}</h3>;
          }
          let carouseDescription = "";
          if (imageDescription!=="") {
            carouseDescription = <p>{imageDescription}</p>;
          }
          let carouselItem = <Carousel.Item key={index}>
            <div className="carousel-img" style={carouselItemStyle}></div>
            <img width={1170} height={585} alt="" src={defaultImg} />
            <Carousel.Caption>
              {carouselTitle}
              {carouseDescription}
            </Carousel.Caption>
          </Carousel.Item>
          images.push(carouselItem);
        });
        context.setState({
          images: images,
          loading: false
        })

      })
      .catch(function (error) {
  	    console.log(error);
  	});
  }

  componentDidMount() {
    this.getImages();
  }

  render() {
    const { index, direction } = this.state;
    let content;
    let extraStyle = {
      minHeight: "250px",
      paddingTop: "100px"
    }
    if (this.state.loading) {
      content = <div style={extraStyle}>
          <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
          </div>
        </div>;
    }
    else {
      content = <Carousel
        activeIndex={index}
        direction={direction}
        onSelect={this.handleSelect}
        nextIcon={this.state.nextIcon}
        prevIcon={this.state.prevIcon}
        index={this.state.index}
      >
        {this.state.images}
      </Carousel>;
    }
    let defaultStyle = {
      minHeight: "250px"
    }
    return (
      <div style={defaultStyle}>
        {content}
      </div>
    );
  }
}

export default ControlledCarousel;
