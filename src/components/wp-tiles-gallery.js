import React, {Component} from 'react';
import Gallery from 'react-grid-gallery';

export default class TilesGallery extends Component {
  constructor(props){
      super(props);
      this.state = {
          images: this.props.images
      };
  }

  render () {
    return (
            <div style={{
                display: "block",
                minHeight: "1px",
                width: "100%",
                overflow: "auto"}}>
            <Gallery
        images={this.state.images}
        enableImageSelection={false}/>
            </div>
    );
  }
}
