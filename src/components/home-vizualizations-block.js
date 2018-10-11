import React from 'react';
import {Link} from 'react-router-dom';
import mapThumb from '../assets/images/letters-map-thumbnail.png';
import graphThumb from '../assets/images/letters-graph-thumbnail.png';
import TwitterFeed from './twitter-feed';

export default class VizualizationsBlock extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      items: [],
    }

  }

  render() {
    return (
      <section className="home-vizualizations">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-4">
                  <div className="vizualization-block">
                    <h3 className="section-title">
                      <span>Interactive Map</span>
                    </h3>
                    <p className="text-justify">Our interactive world map helps you discover the local and global networks in which Irish people interacted a century ago.</p>
                    <Link to="/vizualizations/map">
                      <img src={mapThumb} alt="map vizualization thumbnail" className="img-thumbnail img-responsive" />
                    </Link>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-4">
                  <div className="vizualization-block">
                    <h3 className="section-title">
                      <span>Network diagram</span>
                    </h3>
                    <p>Based on more than 5000 letters by over 2000 correspondents, this diagram provides an insight into their professional and private relationships.</p>
                    <Link to="/vizualizations/graph">
                      <img src={graphThumb} alt="graph vizualization thumbnail" className="img-thumbnail img-responsive" />
                    </Link>
                  </div>
                </div>
                <div className="col-xs-12 col-sm-4">
                  <TwitterFeed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
