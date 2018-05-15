import React, {Component} from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import Lightbox from 'react-image-lightbox';
import BreadCrumbs from '../components/breadcrumbs';
import {APIPath,archivePath} from '../common/constants.js';
import OwlCarousel from 'react-owl-carousel';
import {ToggleClass} from '../helpers/helpers.js';
import LetterUploadXML from '../helpers/letter-upload-xml.js';

export class ItemView extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      title: '',
      source: '',
      creator: '',
      sent_location: '',
      language: '',
      letter_ID: 0,
      recipient: '',
      time_zone: '',
      collection: '',
      description: '',
      date_created: '',
      number_pages: 0,
      request_time: '',
      terms_of_use: '',
      collection_ID: '',
      creator_gender: '',
      doc_collection: '',
      creator_location: '',
      modified_timestamp: '',
      recipient_location: '',
      copyright_statement: '',
      year_of_death_of_author: 0,
      thumbnails:[],
      images:[],
      imagesPaths:[],
      transcriptions:[],
      transcriptionActive:'',
      imageActive:'',
      imageActiveLoading:true,
      imageActiveLoaderHeight: 400,
      photoIndex: 0,
      isOpen: false,
      downloadLink: []
    };

    this.toggleLetterInfo = this.toggleLetterInfo.bind(this);
    this.showPage = this.showPage.bind(this);
    this.showBigImage = this.showBigImage.bind(this);
  }

  toggleLetterInfo(e) {
    e.stopPropagation();
    let element = this.infoTrigger;
    let child = element.children[0];
    ToggleClass(child, "", "closed");

    let infoContainer = this.infoContainer;
    ToggleClass(infoContainer, "", "closed");
  }

  componentWillUnmount() {
    this.setState({loading:true});
  }

  showPage(key) {
    console.log(key);
		this.setState({
      transcriptionActive:this.state.transcriptions[key] ,
      imageActive:this.state.images[key],
      imageActiveLoading:true
    });
	}

  handleImageLoaded(key) {
    let containerHeight = this.imageContainer.clientHeight;
    this.setState({
      imageActiveLoading:false ,
      imageActiveLoaderHeight:containerHeight
    });
  }

  showBigImage(key) {
    this.setState({
      isOpen: true,
      photoIndex: key
    });
  }

  loadItem() {
    let itemContext = this;
    let getPath = "";
    let itemId = 0;
    let letterId = 0;
    if (typeof itemContext.props.match.params.itemId!=="undefined") {
      itemId = itemContext.props.match.params.itemId;
      getPath = APIPath+'show/'+itemId;
    }
    else if (typeof itemContext.props.match.params.letterId!=="undefined") {
      letterId = itemContext.props.match.params.letterId;
      getPath = APIPath+'show-letter/'+letterId;
    }
    else {
      return false;
    }
		axios.get(getPath)
	  .then(function (response) {
      let responseData = response.data.data;
      let dateSent = '';

      if (responseData.date_created.length>0) {
        dateSent = new Date(responseData.date_created);
        let daySent = dateSent.getDate();
        if (daySent<10) {
          daySent = '0'+daySent;
        }
        let months = ['January','February','March','May','June','July','August','September','October','November','December'];
        dateSent = daySent+' '+months[dateSent.getMonth()]+ ' '+dateSent.getFullYear();
      }
      // pages
      let thumbnails = [];
      let images = [];
      let transcriptions = [];
      let imagePaths = [];
      for (let p=0;p<responseData.pages.length; p++) {
        let page = responseData.pages[p];
        let pageCount = p+1;
        let thumbnail =<div className="item" key={p}>
          <a className='img-thumbnail'
            onClick={itemContext.showPage.bind(itemContext,p)}>
            <img
              data-id={page.page_id}
              src={archivePath+'square_thumbnails/'+page.archive_filename}
              alt=''
              className='img-responsive page-thumbnail' />
              <label className="item-count">{pageCount}</label>
          </a>

        </div>;
        thumbnails.push(thumbnail);

        let image = <img
          onClick={itemContext.showBigImage.bind(itemContext,p)}
          key={'image-'+p}
          data-id={page.page_id}
          src={archivePath+'fullsize/'+page.archive_filename}
          alt=''
          className='letter-details-big-img img-thumbnail img-responsive'
          onLoad={itemContext.handleImageLoaded.bind(itemContext, p)}
          ref={(imageContainer) => { itemContext.imageContainer = imageContainer; }}
          />;
        images.push(image);

        let imagePath = archivePath+'fullsize/'+page.archive_filename;
        imagePaths.push(imagePath);

        let transcription;
        if (page.transcription!=="") {
          transcription = <div data-id={page.page_id} key={'transcription-'+p} className='page-transcription'>
            <h4>Page transcription</h4>
            <div dangerouslySetInnerHTML={{__html: page.transcription}}></div>
          </div>
        }
        transcriptions.push(transcription);
      }
      let fileLink = [];
      if (typeof responseData.file!=="undefined" && responseData.file.link.length>0) {
        fileLink = <a download href={responseData.file.link}>{responseData.file.original_filename} <i className="fa fa-download"></i></a>;
      }
      itemContext.setState({
        loading:false,
        title: responseData.title,
        source: responseData.source,
        creator: responseData.creator,
        language: responseData.language,
        sent_location: responseData.sent_location,
        letter_ID: responseData.letter_ID,
        recipient: responseData.recipient,
        time_zone: responseData.time_zone,
        collection: responseData.collection,
        description: responseData.description,
        date_created: dateSent,
        number_pages: responseData.number_pages,
        request_time: responseData.request_time,
        terms_of_use: responseData.terms_of_use,
        collection_ID: responseData.collection_ID,
        creator_gender: responseData.creator_gender,
        doc_collection: responseData.doc_collection,
        creator_location: responseData.creator_location,
        modified_timestamp: responseData.modified_timestamp,
        recipient_location: responseData.recipient_location,
        copyright_statement: responseData.copyright_statement,
        year_of_death_of_author:responseData.year_of_death_of_author,
        thumbnails: thumbnails,
        images: images,
        transcriptions: transcriptions,
        imageActive: images[0],
        imagePaths: imagePaths,
        transcriptionActive: transcriptions[0],
        downloadLink: fileLink
      });
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  }

  componentDidMount() {
    this.loadItem();
  }

  componentDidUpdate(prevProps, prevState) {
    let itemId = 0;
    let letterId = 0;
    if (typeof prevProps.match.params.itemId!=="undefined") {
      itemId = prevProps.match.params.itemId;
    }
    if (typeof this.props.match.params.letterId!=="undefined") {
      letterId = this.props.match.params.letterId;
    }
    if (itemId>0 && letterId>0) {
      this.loadItem();
    }
  }

  render() {
    let breadCrumbsArr = [{label:'Browse',path:'/browse'},{label:this.state.title,path:''}];
    let content;
    let owlNavText = ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'];
    let owlResponsive = {
        0:{
          items:2
        },
        500:{
          items:2
        },
        992:{
          items:3
        }
    };
    let owlThumbnails = this.state.thumbnails;
    let activeImg;
    if (this.state.imageActiveLoading) {
      let activeImgStyle={height: this.state.imageActiveLoaderHeight+"px"};
      activeImg = <div className="loader-container active-img-loader" style={activeImgStyle}>
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px'  delay={0} />
          <div className="hidden">{this.state.imageActive}</div>
          </div>;
    }
    else {
      activeImg = this.state.imageActive;
    }
    if (this.state.loading) {
      content = <div className="item-container">
          <div className="loader-container item-loader">
            <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px'  delay={0} />
          </div>
        </div>;
    }
    else {
      const { photoIndex, isOpen, imagePaths } = this.state;
      let letterUploadBox = "";
      if (sessionStorage.getItem('sessionActive')==="true") {
        letterUploadBox = <LetterUploadXML/>;
      }
      let creatorRow,
        dateCreatedRow,
        sentLocationRow,
        sourceCollectionRow,
        languageRow,
        numpagesRow,
        recipientRow,
        recipientLocationRow,
        sourceRow,
        downloadRow;
        if (this.state.creator!=="") {
          creatorRow = <tr><th>From:</th><td>{this.state.creator}</td></tr>;
        }
        if (this.state.date_created!=="") {
          dateCreatedRow = <tr><th>Date Sent:</th><td>{this.state.date_created}</td></tr>
        }
        if (this.state.sent_location!=="") {
          sentLocationRow = <tr><th>Sent from:</th><td>{this.state.sent_location}</td></tr>
        }
        if (this.state.doc_collection!=="") {
          sourceCollectionRow = <tr><th>Original collection:</th><td>{this.state.doc_collection}</td></tr>
        }
        if (this.state.language!=="") {
          languageRow = <tr><th>Written in:</th><td>{this.state.language}</td></tr>
        }
        if (this.state.number_pages!=="") {
          numpagesRow = <tr><th>Pages:</th><td>{this.state.number_pages}</td></tr>
        }
        if (this.state.recipient!=="") {
          recipientRow = <tr><th>Recipient:</th><td>{this.state.recipient}</td></tr>
        }
        if (this.state.recipient_location!=="") {
          recipientLocationRow = <tr><th>Recipient Location:</th><td>{this.state.recipient_location}</td></tr>
        }
        if (this.state.source!=="") {
          sourceRow = <tr><th>Source:</th><td>{this.state.source}</td></tr>
        }
        if (sessionStorage.getItem('sessionActive')==="true" && this.state.downloadLink.length>0) {
          downloadRow = <tr><th>Download XML:</th><td>{this.state.downloadLink}</td></tr>
        }

      let letterDetailsInfo = <div>
        <table className="letter-details-table">
          <tbody>
            {creatorRow}
            {dateCreatedRow}
            {sentLocationRow}
            {recipientRow}
            {recipientLocationRow}
            {languageRow}
            {numpagesRow}
            {sourceRow}
            {sourceCollectionRow}
            {downloadRow}
          </tbody>
        </table>
      </div>;

      content = <div className="item-container">
        <h2>{this.state.title}</h2>
        <div className="row">
          <div className="col-xs-12 col-sm-8 col-md-8 col-lg-7">
            <div className="letter-info-container" ref={(infoContainer) => { this.infoContainer = infoContainer; }}>
              <h4>Letter information
                <div className="btn btn-default btn-xs pull-right toggle-info-btn" ref={(infoTrigger) => { this.infoTrigger = infoTrigger; }} onClick={this.toggleLetterInfo.bind(this)}>
                  <i className="fa fa-angle-down"></i>
                </div>
              </h4>
              {letterDetailsInfo}
            </div>
            {this.state.transcriptionActive}
            <p className="letter-description">{this.state.description}</p>
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4 col-lg-5">
            <div className="letter-big-img-container">
              {activeImg}
            </div>
            <OwlCarousel
              className="owl-theme item-pages-thumbnails"
              loop={false}
              margin={10}
              nav
              responsive={owlResponsive}
              navText={owlNavText}
              navContainerClass='item-thumbnails-nav'
              dots={false}>
                {owlThumbnails}
              </OwlCarousel>
              {letterUploadBox}
          </div>
        </div>

        {isOpen && (
          <Lightbox
            mainSrc={imagePaths[photoIndex]}
            nextSrc={imagePaths[(photoIndex + 1) % imagePaths.length]}
            prevSrc={imagePaths[(photoIndex + imagePaths.length - 1) % imagePaths.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + imagePaths.length - 1) % imagePaths.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % imagePaths.length,
              })
            }
          />
        )}
      </div>;
    }
    return (
      <div className="container item-view">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            {content}
          </div>
        </div>
      </div>
    );
  }
}
