//import React from 'react';
import axios from 'axios';
import {APIPath} from '../common/constants.js';
import {WPRestPath} from '../common/constants.js';
import cheerio from 'cheerio';

export function preloadContent() {
  sessionStorage.setItem('home_carousel',[]);
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
  axios.get(WPRestPath+"pages/6")
    .then(function (response) {
      let newContent = response.data.content.rendered;
      let $ = cheerio.load(newContent);
      let items = [];
      $('#slider_2 > li').each(function(index,element) {
        let imagePath = $(this).attr("data-thumb");
        let imageTitle = $(this).attr("data-title");
        let imageDescription = $(this).attr("data-description");
        let item = {
          index: index,
          imagePath: imagePath,
          imageTitle: imageTitle,
          imageDescription: imageDescription,
        }
        items.push(item);
      });
      sessionStorage.setItem('home_carousel',JSON.stringify(items));
    })
    .catch(function (error) {
      console.log(error);
  });
}

function loadHomeAbout() {
  axios.get(WPRestPath+"pages", {
      params: {
        "slug": "about-the-project"
      }
    })
    .then(function (response) {
      let newData = response.data[0];
      let newTitle = newData.title.rendered;
      let newContent = stripHTML(newData.content.rendered);
      newContent = newContent.substring(0,500)+"...";
      let about = {
        title: newTitle,
        content: newContent
      }
      sessionStorage.setItem('home_about',JSON.stringify(about));
    })
    .catch(function (error) {
      console.log(error);
  });

  function stripHTML(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText;
  }
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
