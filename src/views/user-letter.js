import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import BreadCrumbs from '../components/breadcrumbs';
import axios from 'axios';
import ReactLoading from 'react-loading';
import {APIPath,domain} from '../common/constants.js';
import {calculateDaysInMonth} from '../helpers/helpers';
import 'react-select/dist/react-select.css';
import KeywordsSelect from '../components/transcribe/keywords-select';
import AuthorsSelect from '../components/transcribe/authors-select';
import SourcesSelect from '../components/transcribe/sources-select';
import ConfirmModal from '../components/confirm-modal';
import {loadProgressBar} from 'axios-progress-bar';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Lightbox from 'react-image-lightbox';


export class UserLetterView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        title: "",
        additional_information: "",
        keywords: [],
        year: "1915",
        month: "",
        day: "",
        letter_from: "",
        gender: "",
        letter_to: "",
        language: "",
        source: "",
        doc_collection: "",
        recipient_location: "",
        creator_location: "",
        year_of_death_of_author: "",
        notes: "",
        images: [],
        additional_img_info: ["Letter"],
        terms_of_use: "",
        copyright_statement: "",
        pages:[],
      },
      errors: {
        title: false,
        language: false,
        source: false,
        terms: false,
        license: false,
      },
      filesErrorText: '',
      filesError: false,
      imageBlocks: [],
      daysOptions: [],
      upload_loader: false,
      progress_bar_text: "",
      progress_bar_width:0,
      redirect: false,
      imagesPreview: [],
      updateBtnText: "Submit",
      terms_of_useChecked: false,
      copyright_statementChecked1: false,
      copyright_statementChecked2: false,
      submitStatus: 0,
      loading: true,
      showDeleteConfirm: false,
      deleteConfirmSubmit:'',
      showDeleteLetterConfirm:false,
      deleteLetterConfirmSubmit: '',
      prevlocation: '',
      prevlocationpath: '',
      imagePaths: [],
      photoIndex: 0,
      isOpen: false,
      enableTranscription: false,
    }
    this.loadItem = this.loadItem.bind(this);
    this.calculateDays = this.calculateDays.bind(this);
    this.yearOfDeathList = this.yearOfDeathList.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.propChecked = this.propChecked.bind(this);
    this.handleSelectFormChange = this.handleSelectFormChange.bind(this);
    this.removeImageBlock = this.removeImageBlock.bind(this);
    this.addImageBlock = this.addImageBlock.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.errorValidation = this.errorValidation.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.reorderPages = this.reorderPages.bind(this);
    this.removeFormImage = this.removeFormImage.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    this.hideDeleteConfirm = this.hideDeleteConfirm.bind(this);
    this.assignItemStateValues = this.assignItemStateValues.bind(this);
    this.loadItemImages = this.loadItemImages.bind(this);
    this.deleteLetter = this.deleteLetter.bind(this);
    this.showDeleteLetterConfirm = this.showDeleteLetterConfirm.bind(this);
    this.hideDeleteLetterConfirm = this.hideDeleteLetterConfirm.bind(this);
    this.showBigImage = this.showBigImage.bind(this);
    this.enableTranscription = this.enableTranscription.bind(this);
  }

  handleFormChange(key,e) {
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    if (name==="month") {
      let year = parseInt(this.state.form.year,10);
      let month = parseInt(value,10)-1;
      this.calculateDays(year,month);
    }
    if (name==="year") {
      let year = parseInt(value,10);
      if (this.state.form.month!=="") {
        let month = parseInt(this.state.form.month,10)-1;
        this.calculateDays(year,month);
      }
    }
    let newState = Object.assign({}, this.state);
    if (name==="images") {
      let newImages = this.state.form.images;
      if (typeof newImages[key]==="undefined") {
        newImages.push(target.files[0]);
      }
      else {
        newImages[key] = target.files[0];
      }
      newState.form[name]=newImages;
    }
    else if (name==="additional_img_info") {
      let newAII = this.state.form.additional_img_info;
      newAII[key]=value;
      newState.form[name]=newAII;
    }
    else {
      newState.form[name]=value;
    }
    this.setState({
      newState
    });
    if (name==="terms_of_use" || name==="copyright_statement") {
      this.propChecked(name, value);
    }
  }

  propChecked(name, value) {
    if (name==="terms_of_use") {
      this.setState({
        terms_of_useChecked: value
      });
    }
    else if (name==="copyright_statement") {
      if (value==="the Material is out of copyright protection (i.e. that you are aware that the author of the Material died prior to 1 January 1943);") {
        this.setState({
          copyright_statementChecked1: true
        });
      }
      else if (value==="you have the rights to upload the Material in question for use or you have the permission of the relevant rightholder(s) to do so as outlined in the Letters of 1916 Terms for User Contributions") {
        this.setState({
          copyright_statementChecked2: true
        });
      }
    }


    //

    //
    if (this.value===true) {

    }
  }

  handleSelectFormChange(elementName, multiple, selectValue) {
    let newState = Object.assign({}, this.state);
    newState.form[elementName] = selectValue;
    this.setState({
      newState
    });
  }

  deleteLetter() {
    let letterId = this.props.match.params.letterId;
    let context = this;
    let path = APIPath+"delete-letter";
    let accessToken = sessionStorage.getItem('accessToken');
    let arrayData = {
      "id":letterId,
    }
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios({
      method: 'DELETE',
      url: path,
      data: arrayData,
      crossDomain: true,
    })
    .then(function (response) {

      context.setState({
        redirect: true,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  showDeleteLetterConfirm() {
    this.setState({
      showDeleteLetterConfirm: true,
      deleteLetterConfirmSubmit: this.deleteLetter
    });
  }

  hideDeleteLetterConfirm() {
    this.setState({
      showDeleteLetterConfirm: false
    });
  }

  handleFormSubmit(e) {
    e.preventDefault();
    let submitStatus= this.state.submitStatus;
    if (this.errorValidation()===true) {
      if (submitStatus>0) {
        return false;
      }
      this.setState({
        submitStatus: 1,
        updateBtnText: <span>Saving... <i className="fa fa-circle-o-notch fa-spin"></i></span>
      });
      let letterId = this.props.match.params.letterId;
      let context = this;
      let stateForm = Object.assign({}, this.state.form);
      let formData = new FormData();
      let hasImages = 0;
      // images
      if (stateForm.images.length>0) {
        hasImages = 1;
        stateForm.images.forEach(function(file) {
          formData.append("data[]",file);
        });
      }
      stateForm.images=[];
      formData.set("form", JSON.stringify(stateForm));
      formData.set("format", "uploader");
      formData.set("letter_id", letterId);
      let accessToken = sessionStorage.getItem('accessToken');
      axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
      context.setState({
        upload_loader:true
      });
  		axios({
        method: 'POST',
        url: APIPath+'upload-letter/'+letterId,
        data: formData,
        crossDomain: true,
        config: { headers: {'Content-Type': 'multipart/form-data' }},
        onUploadProgress: function (progressEvent){
          if (hasImages>0) {
            let percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            let progressBarText = "Uploading... "+parseFloat(percentCompleted).toFixed(2)+"%";
            let progressBarWidth = percentCompleted+"%";
            context.setState({
              progress_bar_text:progressBarText,
              progress_bar_width: progressBarWidth
            });
          }
        }
      })
  	  .then(function (response) {
        submitStatus = 0;
        if (response.data.status===true) {
          // show file errors
          let errorFiles = response.data.errors.files;
          if (errorFiles.length>0) {

            let fileLabels = "";
            for (var i=0;i<errorFiles.length; i++) {
              let errorFile = errorFiles[i];
              if (i>0) {
                fileLabels += ", ";
              }
              fileLabels += "\""+errorFile.filename+"\"";
            }
            let filesErrorText = "";

            if (errorFiles.length===1) {
              filesErrorText = "The file "+fileLabels+" is not a valid image file and it will not be added to your letter.";
            }
            else if (errorFiles.length>1){
              filesErrorText = "The files "+fileLabels+" are not a valid image files and will not be added to your letter.";
            }

            context.setState({
              filesErrorText: filesErrorText,
              filesError: true
            });
          }
          if (parseInt(letterId,10)===0) {
            context.setState({
              updateBtnText: <span>Saved successfully <i className="fa fa-check"></i></span>
            });
            setTimeout(function() {
              context.setState({
                upload_loader: false,
                progress_bar_text: "",
                progress_bar_width:0,
                redirect: true,
                updateBtnText: "Submit",
                submitStatus: 0,
              });
            },1000);
          }
          else if (parseInt(letterId,10)>0) {
            let btnText = response.data.message;
            context.assignItemStateValues(response.data.data);
            context.setState({
              updateBtnText: <span>{btnText} <i className="fa fa-check"></i></span>
            });
            setTimeout(function() {
              context.setState({
                upload_loader: false,
                progress_bar_text: "",
                progress_bar_width:0,
                updateBtnText: "Submit",
                submitStatus: 0,
              });
            },1000);
          }
        }
        else if (response.data.status===false) {
          context.setState({
            updateBtnText: <span>Error saving... <i className="fa fa-times"></i></span>,
            submitStatus: 0,
          });
          setTimeout(function() {
            context.setState({
              updateBtnText: "Submit",
            });
          },1000);
        }
  	  })
  	  .catch(function (error) {
  	    console.log(error);
  	  });
    }
  }

  errorValidation() {
    let newState = Object.assign({}, this.state);
    if (this.state.form.title.trim().length===0) {
      newState.errors["title"] = true;
      this.titleInput.focus();
      this.setState({
        newState
      });
      return false;
    }
    else {
      newState.errors["title"] = false;
    }
    if (this.state.form.language==="") {
      newState.errors["language"] = true;
      this.languageInput.focus();
      this.setState({
        newState
      });
      return false;
    }
    else {
      newState.errors["language"] = false;
    }
    if (this.state.form.source==="" || this.state.form.source===[]) {
      newState.errors["source"] = true;
      this.sourceInput.focus();
      this.setState({
        newState
      });
      return false;
    }
    else {
      newState.errors["source"] = false;
    }
    if (this.state.form.terms_of_use==="" || this.state.form.terms_of_use===false) {
      newState.errors["terms"] = true;
      this.termsInput.focus();
      this.setState({
        newState
      });
      return false;
    }
    else {
      newState.errors["terms"] = false;
    }
    if (this.state.form.copyright_statement==="" || this.state.form.copyright_statement===false) {
      newState.errors["license"] = true;
      this.licenseInput.focus();
      this.setState({
        newState
      });
      return false;
    }
    else {
      newState.errors["license"] = false;
    }
    this.setState({
      newState
    });
    return true;

  }

  calculateDays(year,month) {
    let days = calculateDaysInMonth(year,month);
    let daysOptions = [<option key={0} value=""> -- </option>];
    for (let i=1; i<=days; i++) {
      let day = i;
      if (i<10) {
        day = "0"+i;
      }
      daysOptions.push(<option key={i} value={day}>{day}</option>);
    }
    this.setState({
      daysOptions: daysOptions
    });
  }

  yearOfDeathList() {
    let thisYear = new Date().getFullYear();
    let optionsList = [];
    optionsList.push(<option value="" key={0}> -- </option>);
    for (let year=1915; year<=thisYear; year++) {
      optionsList.push(<option key={year} value={year}>{year}</option>);
    }
    return optionsList;
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const pages = this.reorderPages(
      this.state.form.pages,
      result.source.index,
      result.destination.index
    );
    this.setState({
      imagesPreview: this.loadItemImages(pages)
    });

    let letterId = this.props.match.params.letterId;
    let path = APIPath+"update-letter-pages-order/"+letterId;
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios({
      method: 'POST',
      url: path,
      data: {"pages":pages},
      crossDomain: true,
    })
    .then(function (response) {
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  reorderPages(list, startIndex, endIndex){
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  showDeleteConfirm(archive_filename) {
    this.setState({
      showDeleteConfirm: true,
      deleteConfirmSubmit: this.removeFormImage.bind(this, archive_filename)
    });
  }

  hideDeleteConfirm() {
    this.setState({
      showDeleteConfirm: false
    });
  }

  removeFormImage(archive_filename) {
    let letterId = this.props.match.params.letterId;
    let context = this;
    let path = APIPath+"delete-letter-page";
    let accessToken = sessionStorage.getItem('accessToken');
    let arrayData = {
      "id":letterId,
      "archive_filename":archive_filename
    }
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios({
      method: 'DELETE',
      url: path,
      data: arrayData,
      crossDomain: true,
    })
    .then(function (response) {
      let pagesData = response.data.data;
      context.setState({
        imagesPreview: context.loadItemImages(pagesData),
        showDeleteConfirm: false
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  loadItem() {
    let letterId = this.props.match.params.letterId;
    let context = this;
    let path = APIPath+"user-letter/"+letterId;
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios.get(path)
    .then(function (response) {
      let itemData = response.data.data;
      context.assignItemStateValues(itemData);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  assignItemStateValues(itemData) {
    let context = this;
    let date = itemData.date_created;
    let dateArr = date.split("-");
    let year = dateArr[0];
    let month = "";
    let day = "";
    if (typeof dateArr[1]!== undefined) {
      month = dateArr[1];
    }
    if (typeof dateArr[2]!== undefined) {
      context.calculateDays(year,month);
      day = dateArr[2];
    }
    let keywordsData = [];
    let topics = itemData.topics;
    for (let i=0;i<topics.length; i++) {
      let topic = topics[i];
      keywordsData.push({ label: topic.topic_name, value: topic.topic_id});
    }
    let pagesData = itemData.pages;
    let imagesPreview = context.loadItemImages(pagesData);

    let copyright_statementChecked1 = false;
    let copyright_statementChecked2 = false;
    if (itemData.copyright_statement==="the Material is out of copyright protection (i.e. that you are aware that the author of the Material died prior to 1 January 1943);") {
      copyright_statementChecked1 = true;
    }
    if (itemData.copyright_statement==="you have the rights to upload the Material in question for use or you have the permission of the relevant rightholder(s) to do so as outlined in the Letters of 1916 Terms for User Contributions") {
      copyright_statementChecked2 = true;
    }
    context.setState({
      imagesPreview: imagesPreview,
      terms_of_useChecked: itemData.terms_of_use,
      copyright_statementChecked1: copyright_statementChecked1,
      copyright_statementChecked2: copyright_statementChecked2,
      loading: false,
      form: {
        title: itemData.title,
        additional_information: itemData.description,
        keywords: keywordsData,
        year: year,
        month: month,
        day: day,
        letter_from: itemData.creator,
        gender: itemData.gender,
        letter_to: itemData.recipient,
        language: itemData.language,
        source: itemData.source,
        doc_collection: itemData.doc_collection,
        recipient_location: itemData.recipient_location,
        creator_location: itemData.creator_location,
        year_of_death_of_author: itemData.year_of_death_of_author,
        notes: itemData.notes,
        images: [],
        additional_img_info: ["Letter"],
        terms_of_use: itemData.terms_of_use,
        copyright_statement: itemData.copyright_statement,
        pages: pagesData
      },
    })
  }

  loadItemImages(pagesData) {
    if (pagesData.length>0) {
      let imagesPreviewItems = [];
      let imagePaths = [];
      let grid = 8;
      const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        padding: grid * 2,
        margin: `0 ${grid}px 0 0`,
        background: '#ffffff',
        position: 'relative',
        ...draggableStyle,
      });

      for (let j=0; j<pagesData.length; j++) {
        let pageData = pagesData[j];
        let newImage = <Draggable key={j} draggableId={"draggable-"+j} index={j}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                snapshot.isDragging,
                provided.draggableProps.style
              )}
            >
              <div className="btn btn-danger btn-xs remove-form-img" onClick={this.showDeleteConfirm.bind(this, pageData.archive_filename)}><i className="fa fa-trash"></i></div>
              <img
                key={j}
                onClick={this.showBigImage.bind(this,j)}
                className="img-thumbnail img-responsive form-page-thumbnail" src={domain+"/diyhistory/archive/square_thumbnails/"+pageData.archive_filename}
                alt="thumbnail" />
            </div>
          )}
        </Draggable>;
        imagesPreviewItems.push(newImage);
        imagePaths.push(domain+"/diyhistory/archive/fullsize/"+pageData.archive_filename);
      }

      let getListStyle = isDraggingOver => ({
        background: isDraggingOver ? '#f5f5f5' : '#ffffff',
        display: 'flex',
        padding: grid,
        overflow: 'auto',
      });
      let imagesPreview = <div className="form-pages-preview-container">
        <label>Pages</label>
        <DragDropContext
          onDragEnd={this.onDragEnd}
          >
          <Droppable droppableId="droppable-1" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {imagesPreviewItems}
              </div>
            )}
          </Droppable>

        </DragDropContext>
      </div>;

      this.setState({
        imagePaths: imagePaths
      });

      return imagesPreview;
    }
    else return [];
  }

  componentDidMount() {
    let letterId = this.props.match.params.letterId;
    if (parseInt(letterId,10)>0) {
      this.loadItem();
    }
    else if (parseInt(letterId,10)===0) {
      this.setState({
        loading: false,
      })
    }
    this.yearOfDeathList();
    loadProgressBar();
    if (typeof this.props.history.location.prevlocation!=="undefined") {
      this.setState({
        prevlocation: this.props.history.location.prevlocation,
        prevlocationpath: this.props.history.location.prevlocationpath,
      })
    }


    let enableTranscription = false;
    if (this.props.isAdmin) {
      enableTranscription = true;
    }
    this.setState({
      enableTranscription: enableTranscription
    });
  }

  removeImageBlock() {
    let newImageBlocks = this.state.imageBlocks;
    newImageBlocks.splice(-1,1);
    let newAII = this.state.form.additional_img_info;
    newAII.splice(-1,1);

    this.setState({
      imageBlocks:newImageBlocks,
      additional_img_info: newAII
    });
  }

  addImageBlock() {
    let newImageBlocks = this.state.imageBlocks;
    let key = newImageBlocks.length+1;

    let imageBlock = <div key={key} className="letter-form-image-block">
      <div className="form-group">
        <label>Image file</label>
        <input name="images" accept="image/*" type="file" onClick={(event)=> {event.target.value = null }} onChange={this.handleFormChange.bind(this, key)} />
      </div>

      <div className="form-group">
        <label>Additional image information</label>
        <div className="row">
          <div className="col-xs-12 col-sm-4">
            <select className="form-control" name="additional_img_info" onInput={this.handleFormChange.bind(this, key)}>
              <option value="Letter">Letter</option>
              <option value="Envelope">Envelope</option>
              <option value="Enclosure">Enclosure</option>
              <option value="Photograph">Photograph</option>
            </select>
          </div>
        </div>
      </div>
    </div>;
    let newAII = this.state.form.additional_img_info;
    newAII.push("Letter");

    newImageBlocks.push(imageBlock);
    this.setState({
      imageBlocks: newImageBlocks,
      additional_img_info: newAII
    });
  }

  showBigImage(key) {
    this.setState({
      isOpen: true,
      photoIndex: key
    });
  }

  enableTranscription() {
    let letterId = this.props.match.params.letterId;
    let context = this;
    let path = APIPath+"update-letter-transcription-status/"+letterId;
    let accessToken = sessionStorage.getItem('accessToken');
    axios.defaults.headers.common['Authorization'] = 'Bearer '+accessToken;
    axios({
      method: 'POST',
      url: path,
      crossDomain: true,
    })
    .then(function (response) {
      context.setState({
        redirect: true,
      });
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    let contentHTML,contentTitle,breadCrumbsArr = [],pageContent;
    let sessionActive = sessionStorage.getItem('sessionActive');
		if (sessionActive!=='true') {
      contentHTML = <p className="text-center">This is a protected page. <br/>To view this page you must first login or register.</p>
      pageContent = <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
            <h1>{contentTitle}</h1>
            <div className="item-container">{contentHTML}</div>
          </div>
        </div>
      </div>
    }
    else {
      if (this.state.loading) {
        pageContent = <div className="loader-container">
            <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60} delay={0} />
          </div>;
      }
      else {
        let photoIndex = this.state.photoIndex;
        let isOpen = this.state.isOpen;
        let imagePaths = this.state.imagePaths;
        let letterId = this.props.match.params.letterId;
        let deleteBtn = [];
        if (parseInt(letterId,10)>0) {
          deleteBtn = <button type="button" className="btn btn-danger pull-right" onClick={this.showDeleteLetterConfirm}><i className="fa fa-trash"></i> Delete</button>;
        }
        let redirectElement;
        if (this.state.redirect===true) {
          if (this.props.isAdmin) {
            redirectElement = <Redirect to={{
              pathname: '/admin/list-transcriptions',
              state: {from: 'user-letters/'+letterId},
            }}
            />;
          }
          else {
            redirectElement = <Redirect to={{
              pathname: '/user-letters',
              state: {from: 'user-letters/'+letterId},
            }}
            />;
          }

        }

        let titleError = "";
        if (this.state.errors.title) {
          titleError = " error-container-visible";
        }
        let languageError = "";
        if (this.state.errors.language) {
          languageError = " error-container-visible";
        }
        let sourceError = "";
        if (this.state.errors.source) {
          sourceError = " error-container-visible";
        }
        let termsError = "";
        if (this.state.errors.source) {
          termsError = " error-container-visible";
        }
        let licenseError = "";
        if (this.state.errors.source) {
          licenseError = " error-container-visible";
        }
        let filesError = "";
        if (this.state.filesError) {
          filesError = " error-container-visible";
        }
        let yearOfDeathListOptions = this.yearOfDeathList();
        if (parseInt(letterId,10)===0) {
          contentTitle = "New Letter";
        }
        else if (parseInt(letterId,10)>0) {
          contentTitle = "Update Letter";
        }
        let progressBar = "";
        let stateWidth = this.state.progress_bar_width;
        let stateText = this.state.progress_bar_text;
        let statusBarInnerStyle;
        if (this.state.upload_loader===true) {
          statusBarInnerStyle = {
            width: stateWidth
          }
          progressBar = <div className="upload-status-container" id="upload-xml-status">
              <div className="upload-status-bar-inner" style={statusBarInnerStyle}></div>
              <div className="upload-status-bar-text">{stateText}</div>
            </div>;
        }
        let enableTranscriptionBtn = [];
        if (this.state.enableTranscription && parseInt(this.props.match.params.letterId,10)>0) {
          enableTranscriptionBtn = <button type="button" className="btn btn-warning" onClick={this.enableTranscription}><i className="fa fa-check"></i> Enable transcription</button>;
        }

        contentHTML =
        <div>
          {this.state.imagesPreview}
          <form name="edit-letter" encType="multipart/form-data" onSubmit={this.handleFormSubmit}>

            <div className="form-group">
              <div className={"error-container"+titleError}>
                <p>Error Saving! Please enter the <b>Title/Caption</b> of the letter to continue.</p>
              </div>
              <label><sup>*</sup>Title/Caption</label>
              <input className="form-control" type="text" name="title" value={this.state.form.title} onChange={this.handleFormChange.bind(this, 0)} ref={(input) => { this.titleInput = input; }} />
              <p className="letter-form-description">For example: “Letter from Joseph MacDonagh to his sister Mary MacDonagh, 4 May 1916” or “Letter from Jennifer to her friend Ellen Martin [January 1916]”. Brackets indicate that information is unclear.</p>
            </div>

            <div className="form-group">
              <label>Additional Information</label>
              <textarea className="form-control" name="additional_information" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.additional_information}></textarea>
              <p className="letter-form-description">Here you may provide a brief summary of the letter and biographical information about the correspondents. This field is optional.</p>
            </div>

            <div className="form-group">
              <label>Keywords</label>
              <KeywordsSelect
                elementName="keywords"
                onChangeFunction={this.handleSelectFormChange.bind(this, "keywords", true)}
                multi={true}
                selected={this.state.form.keywords}
                removeSelected={false}/>
              <p className="letter-form-description">Choose keywords that best describe your letter. You may choose as many as are applicable.</p>
            </div>

            <div className="form-group">
              <label>Date the letter was written</label>
              <div className="row">
                <div className="col-xs-12 col-sm-4">
                  <select className="form-control" name="year" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.year}>
                    <option value="1915">1915</option>
                    <option value="1916">1916</option>
                    <option value="1917">1917</option>
                    <option value="1918">1918</option>
                    <option value="1919">1919</option>
                    <option value="1920">1920</option>
                    <option value="1921">1921</option>
                    <option value="1922">1922</option>
                    <option value="1923">1923</option>
                  </select>
                </div>
                <div className="col-xs-12 col-sm-4">
                  <select className="form-control" name="month" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.month}>
                    <option value="">--</option>
                    <option value="01">Jan</option>
                    <option value="02">Feb</option>
                    <option value="03">Mar</option>
                    <option value="04">Apr</option>
                    <option value="05">May</option>
                    <option value="06">Jun</option>
                    <option value="07">Jul</option>
                    <option value="08">Aug</option>
                    <option value="09">Sep</option>
                    <option value="10">Oct</option>
                    <option value="11">Nov</option>
                    <option value="12">Dec</option>
                  </select>
                </div>
                <div className="col-xs-12 col-sm-4">
                  <select className="form-control" name="day" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.day}>
                    {this.state.daysOptions}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Letter From</label>
              <AuthorsSelect
                elementName="letter_from"
                onChangeFunction={this.handleSelectFormChange.bind(this, "letter_from", false)}
                multi={false}
                selected={this.state.form.letter_from}
                removeSelected={true}/>
                <p className="letter-form-description">Select author’s name from the list or add a new name. If you know the person’s full name, please do not mention any titles (such as Mr, Mrs, Dr, Rev, Lord, Lady, Captain etc.) here but add them in the “title” field. Provide middle names if possible to help us identify individual authors.</p>
            </div>

            <div className="form-group">
              <label>{"Author's gender"}</label>
              <div className="row">
                <div className="col-xs-12 col-sm-4">
                  <select className="form-control" name="gender" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.gender}>
                    <option value="">--</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Letter To</label>
              <AuthorsSelect
                elementName="letter_to"
                onChangeFunction={this.handleSelectFormChange.bind(this, "letter_to", false)}
                multi={false}
                selected={this.state.form.letter_to}
                removeSelected={true}/>
              <p className="letter-form-description">Add recipient of letter, such as “Mary MacDonagh”. If you know the person’s full name, please do not mention any titles (such as Mr, Mrs, Dr, Rev, Lord, Lady, Captain etc.) here but add them in the “title” field. Provide middle names if possible to help us identify individual authors.</p>
            </div>

            <div className="form-group">
              <div className={"error-container"+languageError}>
                <p>Error Saving! Please select the <b>Language the letter is written in</b> of the letter to continue.</p>
              </div>
              <label><sup>*</sup>Language the letter is written in</label>
              <div className="row">
                <div className="col-xs-12 col-sm-4">
                  <select className="form-control" name="language" onChange={this.handleFormChange.bind(this, 0)} ref={(input) => { this.languageInput = input; }} value={this.state.form.language}>
                    <option value="">--</option>
                    <option value="Irish">Irish</option>
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className={"error-container"+sourceError}>
                <p>Error Saving! Please enter the <b>Source</b> of the letter to continue.</p>
              </div>
              <label ref={(input) => { this.sourceInput = input; }}><sup>*</sup>Source</label>
              <SourcesSelect
                elementName="source"
                onChangeFunction={this.handleSelectFormChange.bind(this, "source", false)}
                multi={false}
                selected={this.state.form.source}
                removeSelected={true}
                />
              <p className="letter-form-description">This may be a public institution, such as the “National Library of Ireland”, or a private collection, such as the “MacDonagh Family Collection”.</p>
            </div>

            <div className="form-group">
              <label>Document Collection/Number</label>
              <input className="form-control" type="text" name="doc_collection" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.doc_collection}/>
              <p className="letter-form-description">If your letter comes from a catalogued collection, please add further information such as the collection name and fond / item numbers.</p>
            </div>

            <div className="form-group">
              <label>Place (letter sent to)</label>
              <input className="form-control" type="text" name="recipient_location" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.recipient_location}/>
              <p className="letter-form-description">e.g. “Paris, France” Please add name of region wherever possible. Countries are treated as geographical rather than political entities. Use “Ireland” for places in Ulster and “England”, “Scotland” or “Wales” for places in Great Britain.</p>
            </div>

            <div className="form-group">
              <label>Place (letter sent from)</label>
              <input className="form-control" type="text" name="creator_location" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.creator_location}/>
              <p className="letter-form-description">e.g. “Dublin, Ireland” Please add name of region wherever possible. Countries are treated as geographical rather than political entities. Use “Ireland” for places in Ulster and “England”, “Scotland” or “Wales” for places in Great Britain.</p>
            </div>

            <div className="form-group">
              <label>Year of death of author</label>
              <div className="row">
                <div className="col-xs-12 col-sm-4">
                  <select className="form-control" name="year_of_death_of_author" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.year_of_death_of_author}>
                    {yearOfDeathListOptions}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea className="form-control" name="notes" onChange={this.handleFormChange.bind(this, 0)} value={this.state.form.notes}></textarea>
              <p className="letter-form-description">Please enter additional notes for the Letters 1916-1923 administrators, e.g. information about missing pages.</p>
            </div>

            <hr/>

            <h4>Upload Image</h4>
            <div className="letter-form-image-block">
              <div className="form-group">
                <div className={"error-container"+filesError}>
                  <p>{this.state.filesErrorText}</p>
                </div>
                <label>Image file</label>
                <input name="images" accept="image/*" type="file" onClick={(event)=> {event.target.value = null }} onChange={this.handleFormChange.bind(this,0)} />
              </div>

              <div className="form-group">
                <label>Additional image information</label>
                <div className="row">
                  <div className="col-xs-12 col-sm-4">
                    <select className="form-control" name="additional_img_info" onChange={this.handleFormChange.bind(this,0)}>
                      <option value="Letter">Letter</option>
                      <option value="Envelope">Envelope</option>
                      <option value="Enclosure">Enclosure</option>
                      <option value="Photograph">Photograph</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {this.state.imageBlocks}
            </div>

            <button type="button" className="btn btn-xs btn-default" onClick={this.removeImageBlock}>remove image</button><br/>
            <button type="button" className="btn btn-xs btn-default" onClick={this.addImageBlock}>add another image</button>

            <hr/>

            <div className="form-group">
              <div className={"error-container"+termsError}>
                <p>Error Saving! You must accept the <b>Terms of Use</b> to continue.</p>
              </div>
              <label><sup>*</sup>Terms of Use</label>
              <p>Before you can submit digital material to the Letters of 1916 Project, you must agree to the Letters of 1916 Terms for User Contributions. These terms can be found here</p>
              <label style={{fontWeight: "normal"}}>
                <input ref={(input) => { this.termsInput = input; }} name="terms_of_use" type="checkbox" value="I accept the terms & conditions. If you do not want to accept these terms, then please do not contribute content or descriptive data to the Letters of 1916 Project"  onChange={this.handleFormChange.bind(this, 0)} checked={this.state.terms_of_useChecked} /> <small>I accept the terms & conditions. If you do not want to accept these terms, then please do not contribute content or descriptive data to the Letters of 1916 Project</small>
              </label>
            </div>

            <div className="form-group">
              <div className={"error-container"+licenseError}>
                <p>Error Saving! You must confirm the <b>License and Consent</b> to continue.</p>
              </div>
              <label><sup>*</sup>LICENSE AND CONSENT</label>
              <p>In submitting Material to the collection, Maynooth University asks you to confirm that:</p>
              <label style={{fontWeight: "normal"}}>
                <input ref={(input) => { this.licenseInput = input; }} name="copyright_statement" type="radio" value="the Material is out of copyright protection (i.e. that you are aware that the author of the Material died prior to 1 January 1943);"
                checked={this.state.copyright_statementChecked1}
                onChange={this.handleFormChange.bind(this, 0)}/> <small>the Material is out of copyright protection (i.e. that you are aware that the author of the Material died prior to 1 January 1943);</small>
              </label>
              <label style={{fontWeight: "normal"}}>
                <input name="copyright_statement" type="radio" value="you have the rights to upload the Material in question for use or you have the permission of the relevant rightholder(s) to do so as outlined in the Letters of 1916 Terms for User Contributions"
                checked={this.state.copyright_statementChecked2} onChange={this.handleFormChange.bind(this, 0)}/> <small>you have the rights to upload the Material in question for use or you have the permission of the relevant rightholder(s) to do so as outlined in the Letters of 1916 Terms for User Contributions</small>
              </label>
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-letters pull-left"><i className="fa fa-save"></i> {this.state.updateBtnText}</button>

              {enableTranscriptionBtn}

              {deleteBtn}
            </div>
            <div className="row">
              <div className="col-xs-12">
                {progressBar}
              </div>
            </div>
            {redirectElement}
          </form>

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

        let breadCrumbsPath = {label:'User Letters', path:'/user-letters'};
        if (this.state.prevlocation!=="") {
          breadCrumbsPath = {label: this.state.prevlocation, path: this.state.prevlocationpath};
        }
        breadCrumbsArr.push(breadCrumbsPath);
        breadCrumbsArr.push({label:contentTitle,path:''});
        pageContent = <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
              <h1>{contentTitle}</h1>
              <div className="item-container letter-form-container">{contentHTML}</div>
            </div>
          </div>
        </div>
      }
    }
    return (
      <div>
        {pageContent}
        <ConfirmModal
          headerText="Delete page"
          bodyText="The page will be deleted. Continue?"
          buttonCancel={<button type="button" className="pull-left btn btn-primary btn-sm" onClick={this.hideDeleteConfirm}>Cancel</button>}
          buttonSuccess={<button type="button" className="btn btn-danger btn-sm" onClick={this.state.deleteConfirmSubmit}><i className="fa fa-trash-o"></i> Delete</button>}
          showModal={this.state.showDeleteConfirm}
        />


        <ConfirmModal
          headerText="Delete letter"
          bodyText="This letter will be deleted. Continue?"
          buttonCancel={<button type="button" className="pull-left btn btn-primary btn-sm" onClick={this.hideDeleteLetterConfirm}>Cancel</button>}
          buttonSuccess={<button type="button" className="btn btn-danger btn-sm" onClick={this.state.deleteLetterConfirmSubmit}><i className="fa fa-trash-o"></i> Delete</button>}
          showModal={this.state.showDeleteLetterConfirm}
        />
      </div>
    );
  }
}
