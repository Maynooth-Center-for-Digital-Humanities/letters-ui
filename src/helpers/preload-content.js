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
  loadGenders();
  loadLanguages();
  loadDateCreated();

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

function loadTopics() {
  axios.get(APIPath+"topics")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('topics_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}

function loadSources() {
  axios.get(APIPath+"sources")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('sources_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}

function loadAuthors() {
  axios.get(APIPath+"authors")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('authors_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}

function loadGenders() {
  axios.get(APIPath+"genders")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('genders_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}


function loadLanguages() {
  axios.get(APIPath+"languages")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('languages_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}

function loadDateCreated() {
  axios.get(APIPath+"date_created")
	  .then(function (response) {
      let data = response.data.data;
      sessionStorage.setItem('date_created_list', JSON.stringify(data));
    })
    .catch(function (error) {
	    console.log(error);
	});
}
