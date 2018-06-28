import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import {archivePath} from '../../common/constants';

export default class TranscriptionPagesList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      thumbnails:[],
      images:[],
      loading: true
    };
    this.renderThumbnails = this.renderThumbnails.bind(this);
  }

  renderThumbnails() {
    let newThumbnails = [];
    if (typeof this.props.pages!=="undefined" && this.props.pages.length>0) {
      let pages = this.props.pages;
      for (let i=0;i<pages.length; i++) {
        let page = pages[i];
        let pageCount = i+1;
        let thumbnail =<div className="item" key={i}>
          <a className='img-thumbnail'
            onClick={this.props.function.bind(this,i)}
            >
            <img
              data-id={page.page_id}
              src={archivePath+'square_thumbnails/'+page.archive_filename}
              alt=''
              className='img-responsive page-thumbnail' />
              <label className="item-count">{pageCount}</label>
          </a>
        </div>;
        newThumbnails.push(thumbnail);
      }
    }
    this.setState({
      thumbnails: newThumbnails,
      loading:false
    });
  }

  componentDidMount() {
    this.renderThumbnails();
  }
  
  render() {
    let owlNavText = ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'];
    let owlResponsive = {
        0:{
          items:1
        },
        400:{
          items:4
        },
        992:{
          items:8
        },
        1200:{
          items:12
        }
    };
    let content = [];
    if (this.state.loading===false) {
      content = <OwlCarousel
        className="owl-theme item-pages-thumbnails"
        loop={false}
        margin={10}
        nav
        responsive={owlResponsive}
        navText={owlNavText}
        navContainerClass='item-thumbnails-nav'
        dots={false}>
          {this.state.thumbnails}
      </OwlCarousel>
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}
