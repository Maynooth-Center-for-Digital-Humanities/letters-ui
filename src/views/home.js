import React, {Component} from 'react';
import Carousel from '../components/carousel.js';
import HomeAbout from '../components/home-about.js';
import HomeLettersBlock from '../components/home-letters-block.js';
import HighlightsBlock from '../components/highlights-block.js';
import VizualizationsBlock from '../components/home-vizualizations-block.js';
import HomeNews from '../components/home-news.js';

export class HomeView extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div>
        <div className="carousel-wrapper">
          <div className="container">
            <Carousel/>
          </div>
        </div>

        <section className="home-section">
          <div className="container">
            <div className="row">

              <div className="col-xs-12 col-sm-7 col-md-8">
                <HomeAbout />
              </div>

              <div className="col-xs-12 col-sm-5 col-md-4">
                <HomeNews />
              </div>

            </div>
          </div>
        </section>

        <HomeLettersBlock />

        <HighlightsBlock />

        <VizualizationsBlock />



      </div>
    );
  }
}
