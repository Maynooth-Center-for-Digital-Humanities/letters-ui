//import React from 'react';
import axios from 'axios';
import {APIPath} from '../common/constants.js';
import {WPRestPath,WPCustomRestPath} from '../common/constants.js';

export function preloadContent() {
  sessionStorage.setItem('carousel_images',[]);
  sessionStorage.setItem('home_about',[]);
  sessionStorage.setItem('topics_list',[]);
  sessionStorage.setItem('sources_list',[]);
  sessionStorage.setItem('authors_list',[]);
  sessionStorage.setItem('genders_list',[]);
  sessionStorage.setItem('languages_list',[]);
  sessionStorage.setItem('date_created_list',[]);

  loadHomeCarousel();
  loadHomeAbout();
  loadTopics();
  loadSources();
  loadAuthors();
  loadPeople();
  loadGenders();
  loadLanguages();
  loadDateCreated();

  loadDiscoverPost();
  loadTranscribePost();
  loadContributePost();

}

function loadHomeCarousel() {
  axios.get(WPRestPath+"pages/?slug=carousel")
    .then(function (response) {
      sessionStorage.setItem("carousel_images", JSON.stringify(response));
    })
    .catch(function (error) {
      console.log(error);
  });
}

function loadHomeAbout() {
  axios.get(WPCustomRestPath+"post", {
      params: {
        "slug": "about-the-project"
      }
    })
    .then(function (response) {
      let newData = response.data;
      let newTitle = newData.post_title;
      let newContent = newData.post_excerpt;
      let about = {
        title: newTitle,
        content: newContent,
        slug: newData.slug
      }
      sessionStorage.setItem("home_about", JSON.stringify(about));
    })
    .catch(function (error) {
      console.log(error);
  });
}

function loadDiscoverPost() {
  axios.get(WPCustomRestPath+"post", {
      params: {
        "slug": "discover-the-collection"
      }
    })
    .then(function (response) {
      let newData = response.data;
      let discoverPost = {
        title: newData.post_title,
        content: newData.post_excerpt,
        slug: newData.slug,
        thumbnail: newData.thumbnail,
        permalink: newData.permalink,
      }
      sessionStorage.setItem("home_discover_collection", JSON.stringify(discoverPost));
    })
    .catch(function (error) {
      console.log(error);
  });
}

function loadTranscribePost() {
  axios.get(WPCustomRestPath+"post", {
      params: {
        "slug": "transcribe-letters"
      }
    })
    .then(function (response) {
      let newData = response.data;
      let transcribePost = {
        title: newData.post_title,
        content: newData.post_excerpt,
        slug: newData.slug,
        thumbnail: newData.thumbnail,
        permalink: newData.permalink,
      }
      sessionStorage.setItem("home_transcribe_letters", JSON.stringify(transcribePost));
    })
    .catch(function (error) {
      console.log(error);
  });
}

function loadContributePost() {
  axios.get(WPCustomRestPath+"post", {
      params: {
        "slug": "contribute-letters"
      }
    })
    .then(function (response) {
      let newData = response.data;
      let contributePost = {
        title: newData.post_title,
        content: newData.post_excerpt,
        slug: newData.slug,
        thumbnail: newData.thumbnail,
        permalink: newData.permalink,
      }
      sessionStorage.setItem("home_contribute", JSON.stringify(contributePost));
    })
    .catch(function (error) {
      console.log(error);
  });
}

function loadTopics() {
  axios.get(APIPath+"topics?status=1&transcription_status=2")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('topics_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}

function loadSources() {
  axios.get(APIPath+"sources?status=1&transcription_status=2")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('sources_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}

function loadAuthors() {
  axios.get(APIPath+"authors?status=1&transcription_status=2")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('authors_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}

function loadPeople() {
  axios.get(APIPath+"people?status=1&transcription_status=2")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('people_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}

function loadGenders() {
  axios.get(APIPath+"genders?status=1&transcription_status=2")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('genders_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}


function loadLanguages() {
  axios.get(APIPath+"languages?status=1&transcription_status=2")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('languages_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}

function loadDateCreated() {
  axios.get(APIPath+"date_created?status=1&transcription_status=2")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('date_created_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}
