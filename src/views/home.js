import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Carousel from '../components/carousel.js';
import OwlCarousel from 'react-owl-carousel';
import HomeAbout from '../components/home-about.js';

import owl1 from '../assets/images/carousel/IMG_8475.JPG';
import owl2 from '../assets/images/carousel/IMG_3207.jpg';
import owl3 from '../assets/images/carousel/IMG_8933.JPG';
import recent1 from '../assets/images/carousel/KIC-Document-4.jpg';
import recent2 from '../assets/images/carousel/1649.jpg';
import recent3 from '../assets/images/carousel/16June.jpg';
import col1 from '../assets/images/carousel/IMG_1086.JPG';
import col2 from '../assets/images/carousel/IMG_1089.JPG';
import col3 from '../assets/images/carousel/IMG_1097.JPG';
import col4 from '../assets/images/carousel/IMG_1107a.jpg';
import col5 from '../assets/images/carousel/IMG_1109.JPG';
import col6 from '../assets/images/carousel/IMG_1111.JPG';
import col7 from '../assets/images/carousel/IMG_8475.JPG';
import col8 from '../assets/images/carousel/IMG_8476.JPG';
import col9 from '../assets/images/carousel/IMG_8790.JPG';
import col10 from '../assets/images/carousel/IMG_8793.JPG';
import col11 from '../assets/images/carousel/IMG_8794.JPG';
import col12 from '../assets/images/carousel/IMG_8932.JPG';
import wri1 from '../assets/images/writers/bridemorris.jpg';
import wri2 from '../assets/images/writers/capuchins_dominicoconnor_albertbibby.jpg';
import wri3 from '../assets/images/writers/casement.jpg';
import wri4 from '../assets/images/writers/clonbrock.jpg';

export class HomeView extends Component {

  componentDidMount() {
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
            items:4
        }
    };
    return (
      <div>
        <div className="carousel-wrapper">
          <div className="container">
            <Carousel></Carousel>
          </div>
        </div>

        <section className="home-section">
          <div className="container">
            <div className="row">

              <div className="col-xs-12 col-sm-7 col-md-8">
                <HomeAbout />
              </div>

              <div className="col-xs-12 col-sm-5 col-md-4">
                <h2>News</h2>
                <OwlCarousel className="owl-theme" loop margin={10} nav items={1} navText={owlNavText} navContainerClass='news-nav-class' dots={false}>
                  <div className="item">
                    <h4>New letters added</h4>
                    <div className="news-thumb">
                      <img src={owl1} className="img-responsive img-thumbnail" alt="" />
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat lorem at.</p>
                    </div>
                  </div>
                  <div className="item">
                    <h4>Letters presentation</h4>
                    <div className="news-thumb">
                      <img src={owl2} className="img-responsive img-thumbnail" alt="" />
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat lorem at.</p>
                    </div>
                  </div>
                  <div className="item">
                    <h4>New letters added</h4>
                    <div className="news-thumb">
                      <img src={owl3} className="img-responsive img-thumbnail" alt="" />
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat lorem at.</p>
                    </div>
                  </div>
                </OwlCarousel>
              </div>
            </div>
          </div>
        </section>

        <section className="home-recently-added">
          <div className="container">
            <h2 className="section-title"><span>Recently added letters</span></h2>
            <div className="row">

              <div className="col-xs-12 col-sm-4">
                <img src={recent1} className="img-responsive" alt="" />
                <div className="home-recent-item">
                  <h4><a>The Father Mathew O.S.F.C.</a></h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat lorem at.</p>
                </div>
              </div>
              <div className="col-xs-12 col-sm-4">
                <img src={recent2} className="img-responsive" alt="" />
                <div className="home-recent-item">
                  <h4><a>The National Margarine Company</a></h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat lorem at.</p>
                </div>
              </div>
              <div className="col-xs-12 col-sm-4">
                <img src={recent3} className="img-responsive" alt="" />
                <div className="home-recent-item">
                  <h4><a>Dublin United Trades Council</a></h4>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed feugiat lorem at.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="featured-collections">
          <div className="container">
            <h2 className="section-title"><span>Featured collections</span></h2>
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
              <div className="item">
                <img src={col1} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Easter Rising Ireland 1916</a></h4>
                  <p>The Easter Rising began on Monday 24 April 1916 and ended on Saturday 29 April...</p>
                </div>
              </div>
              <div className="item">
                <img src={col2} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Art and literature</a></h4>
                  <p>The artistic life of the country continued throughout 1916...</p>
                </div>
              </div>
              <div className="item">
                <img src={col3} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Battle of the Somme</a></h4>
                  <p>Irish Divisions were involved in the Battle of the Somme from 1 July 1916 - 18 November 1916...</p>
                </div>
              </div>
              <div className="item">
                <img src={col4} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Business</a></h4>
                  <p>Letters about business come from a variety of sources, from official documents in the National Archives...</p>
                </div>
              </div>
              <div className="item">
                <img src={col5} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Children</a></h4>
                  <p>Letters to, from, and about children are contained in this section, from poignant letters from fathers...</p>
                </div>
              </div>
              <div className="item">
                <img src={col6} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>City and town life</a></h4>
                  <p>Letters in this category cover many aspects of life in Ireland’s cities and towns: business...</p>
                </div>
              </div>
              <div className="item">
                <img src={col7} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Country life</a></h4>
                  <p>Country life Letters about country life are about life on estates and at big houses...</p>
                </div>
              </div>
              <div className="item">
                <img src={col8} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Crime</a></h4>
                  <p>Crime, as all aspects of life, continued throughout 1916. Many, although not all...</p>
                </div>
              </div>
              <div className="item">
                <img src={col9} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Faith</a></h4>
                  <p>Letters about faith come from all walks of life. Not just from the many clergy involved in the Great War...</p>
                </div>
              </div>
              <div className="item">
                <img src={col10} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Family life</a></h4>
                  <p>Many letters in the collection are about families: relations between parents...</p>
                </div>
              </div>
              <div className="item">
                <img src={col11} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Irish question</a></h4>
                  <p>Letters in this category pertain, by and large, to the question of Home Rule from both Unionist and Nationalist...</p>
                </div>
              </div>
              <div className="item">
                <img src={col12} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Last letters before death</a></h4>
                  <p>This is possibly the most poignant letters of the collection. Here we collect all the last letters...</p>
                </div>
              </div>
            </OwlCarousel>
            <div className="row">
          {/*    <div className="col-xs-12 col-sm-6 col-md-3">
                <img src={col1} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Easter Rising Ireland 1916</a></h4>
                  <p>The Easter Rising began on Monday 24 April 1916 and ended on Saturday 29 April...</p>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-3">
                <img src={col2} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Art and literature</a></h4>
                  <p>The artistic life of the country continued throughout 1916...</p>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-3">
                <img src={col3} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Battle of the Somme</a></h4>
                  <p>Irish Divisions were involved in the Battle of the Somme from 1 July 1916 - 18 November 1916...</p>
                </div>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-3">
                <img src={col4} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Business</a></h4>
                  <p>Letters about business come from a variety of sources, from official documents in the National Archives...</p>
                </div>
              </div>
              <div className="clearfix visible-md-block"></div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <img src={col5} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Children</a></h4>
                  <p>Letters to, from, and about children are contained in this section, from poignant letters from fathers...</p>
                  </div>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <img src={col6} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>City and town life</a></h4>
                  <p>Letters in this category cover many aspects of life in Ireland’s cities and towns: business...</p>
                  </div>
              </div>
              <div className="clearfix visible-sm-block"></div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <img src={col7} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Country life</a></h4>
                  <p>Country life Letters about country life are about life on estates and at big houses...</p>
                </div>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <img src={col8} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Crime</a></h4>
                  <p>Crime, as all aspects of life, continued throughout 1916. Many, although not all...</p>
                </div>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <img src={col9} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Faith</a></h4>
                  <p>Letters about faith come from all walks of life. Not just from the many clergy involved in the Great War...</p>
                  </div>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <img src={col10} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Family life</a></h4>
                  <p>Many letters in the collection are about families: relations between parents...</p>
                  </div>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <img src={col11} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Irish question</a></h4>
                  <p>Letters in this category pertain, by and large, to the question of Home Rule from both Unionist and Nationalist...</p>
                  </div>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <img src={col12} className="img-responsive" alt="" />
                <div className="home-collection">
                  <h4><a>Last letters before death</a></h4>
                  <p>This is possibly the most poignant letters of the collection. Here we collect all the last letters...</p>
                  </div>
              </div> */}
            </div>
            <div className="row">
              <div className="col-xs-12">
                <Link to="/collections" className="btn btn-default pull-right">More collections...</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-writers">
          <div className="container">
            <h2 className="section-title"><span>Featured writers</span></h2>
            <div className="row">

              <div className="col-xs-12 col-sm-3">
                <img src={wri1} className="img-responsive" alt="" />
                <div className="home-writers">
                  <h4><a>Bride Morris</a></h4>
                </div>
              </div>

              <div className="col-xs-12 col-sm-3">
                <img src={wri2} className="img-responsive" alt="" />
                <div className="home-writers">
                  <h4><a>Capuchins Dominic Connor &amp; Albert Bibby</a></h4>
                </div>
              </div>

              <div className="col-xs-12 col-sm-3">
                <img src={wri3} className="img-responsive" alt="" />
                <div className="home-writers">
                  <h4><a>Casement</a></h4>
                </div>
              </div>

              <div className="col-xs-12 col-sm-3">
                <img src={wri4} className="img-responsive" alt="" />
                <div className="home-writers">
                  <h4><a>Clon Brock</a></h4>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    );
  }
}
