import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import {archivePath} from '../../common/constants';

export default class TranscriptionPagesList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      thumbnails:[],
      images:[],
      loading: false,
    };
    this.renderThumbnails = this.renderThumbnails.bind(this);
  }

  renderThumbnails() {
    let newThumbnails = [];
    if (typeof this.props.pages!=="undefined" && this.props.pages.length>0) {
      let pages = this.props.pages;
      for (let i=0;i<pages.length; i++) {
        let page = pages[i];
        let transcriptionStatus = page.transcription_status;
        let pageStatus = [];
        if (parseInt(transcriptionStatus,10)===0) {
          pageStatus = <small className="label label-success">Open</small>;
        }
        if (parseInt(transcriptionStatus,10)===1) {
          pageStatus = <small className="label label-warning">Waiting Approval</small>;
        }
        if (parseInt(transcriptionStatus,10)===2) {
          pageStatus = <small className="label label-danger">Completed</small>;
        }
        let pageCount = i+1;
        let thumbnail =<div className="item" key={i}>
          <a className='img-thumbnail'
            onClick={this.props.function.bind(this,i)}
            >
            <div className="transcription-page-select-status">{pageStatus}</div>
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
      this.setState({
        thumbnails: newThumbnails,
        loading:false,
      });
    }
  }

  componentDidMount() {
    this.renderThumbnails();
  }

  componentDidUpdate(prevProps) {  
    if (prevProps!==this.props) {
      this.renderThumbnails();
    }
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
