import React from 'react';
import {domain,escapeURLs} from '../common/constants.js';

export function ToggleClass(node, class1, class2) {
  let currentClassName = node.className;
  let classes = currentClassName.split(" ");
  let newClasses = [];
  if (classes.indexOf(class1)>-1) {
    for (let i=0; i<classes.length; i++) {
      let newClass = classes[i];
      if (newClass===class1) {
        newClass = class2;
      }
      newClasses.push(newClass);
    }
  }
  else {
    for (let i=0; i<classes.length; i++) {
      let newClass = classes[i];
      if (newClass===class2) {
        newClass = class1;
      }
      newClasses.push(newClass);
    }
    if (classes.indexOf(class2)===-1) {
      newClasses.push(class2)
    }
  }
  let replaceClass = newClasses.join(" ");
  node.className = replaceClass;
}

export function ReplaceClass(node, class1, class2) {
  let currentClassName = node.className;
  let classes = currentClassName.split(" ");
  let newClasses = [];
  for (let i=0; i<classes.length; i++) {
    let newClass = classes[i];
    if (newClass!==class1 && newClass!==class2) {
      newClasses.push(newClass);
    }
  }
  newClasses.push(class2);
  let replaceClass = newClasses.join(" ");
  node.className = replaceClass;
}

export function PreloaderCards(num) {
  if (typeof num==="undefined") {
    num=11;
  }
  let cards = [];
  for (let i=0;i<num;i++) {
    let card = <li key={i}>
        <div className="mock-card">
          <h4><div className="mock-title">Lorem ipsum dolor sit amet.</div></h4>
          <div className="mock-keywords">Lorem ipsum dolor sit amet.</div>
          <div className="mock-desription">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Aenean id odio neque.
          Suspendisse libero lorem, consequat ac nulla nec, porttitor ultricies arcu.
          Nam eget efficitur sem, eu tincidunt neque. Duis.</div>
        </div>
      </li>;
    cards.push(card);
  }
  return cards;
}

export function Emptyitemscard() {
  return <li key={0}>
        <p>&nbsp;</p>
        <h4 className="text-center">There are no letters matching these criteria</h4>
        <p>&nbsp;</p>
    </li>;
}

export function CompareFilterTopics(topicsArray) {
  let compareArray = [];
  for (let key in topicsArray) {
    compareArray.push(key);
  }
  let group = document.getElementsByClassName("topics-list")[0];
  let groupChildren = group.childNodes;
  for (let i=0; i<groupChildren.length; i++) {
    let groupChild = groupChildren[i];
    let groupChildValue = groupChild.childNodes[0].childNodes[0].innerText;
    if (compareArray.indexOf(groupChildValue)===-1) {
      groupChild.classList.add("disabled");
    }
    else {
      groupChild.className = groupChild.className.replace(/\bdisabled\b/g, "");
      groupChild.classList.remove("disabled");
      let topicLabel = groupChild.childNodes[0].children[2];
      topicLabel.children[0].textContent = topicsArray[groupChildValue];
    }
  }
}

export function CompareFilterGeneral(selector, filterArray) {
  let compareArray = [];
  for (let key in filterArray) {
    compareArray.push(key);
  }

  let group = document.getElementsByClassName(selector)[0];
  let groupChildren = group.childNodes;

  for (let i=0; i<groupChildren.length; i++) {
    let groupChild = groupChildren[i];
    let groupChildValue = groupChild.childNodes[0].innerText;
    if (compareArray.indexOf(groupChildValue)===-1) {
      groupChild.classList.add("disabled");
    }
    else {
      groupChild.className = groupChild.className.replace(/\bdisabled\b/g, "");
      groupChild.classList.remove("disabled");
      let topicLabel = groupChild.children[2];
      topicLabel.children[0].textContent = filterArray[groupChildValue];
    }
  }
}

// replace without /index.php/

export function NormalizeWPURL(href) {
  let normalizedURL = href;
  if (typeof href!=="undefined" && href!=="") {
    let newHref = href.replace("http://letters1916.maynoothuniversity.ie/learn/index.php/", domain+"/wp-post/");
    newHref = href.replace("http://letters1916.maynoothuniversity.ie/learn/", domain+"/wp-post/");
    newHref = newHref.replace(domain+"/learn/index.php/", domain+"/wp-post/");
    newHref = newHref.replace(domain+"/learn/", domain+"/wp-post/");
    if (newHref.includes("wp-content")) {
      newHref = newHref.replace("wp-post/", "");
    }
    if (newHref.includes(domain+"/wp-post/")) {
      let lastChar = newHref.slice(-1);
      if (lastChar==="/") {
        newHref = newHref.slice(0,-1);
      }

      let hrefEnding = newHref.substr(newHref.lastIndexOf('/') + 1);
      let hrefParent = "";
      hrefParent = newHref.replace(domain+"/wp-post/","");
      hrefParent = hrefParent.replace(hrefEnding,"");
      if (hrefParent!=="") {
        let hrefParentLastChar = hrefParent.slice(-1);
        if (hrefParentLastChar==="/") {
          hrefParent = hrefParent.slice(0,-1)+"%2F";
        }
      }
      normalizedURL = "/wp-post/"+hrefParent+hrefEnding;
    }
  }
  return normalizedURL;
}

export function NormalizeMenuWPURL(href) {
  let normalizedURL = href;
  if (escapeURLs.indexOf(href)===-1) {
    let newHref = href.replace("http://letters1916.maynoothuniversity.ie/learn/index.php/", domain+"/wp-post/");
    newHref = newHref.replace(domain+"/learn/index.php/", domain+"/wp-post/");
    let lastChar = newHref.slice(-1);
    if (lastChar==="/") {
      newHref = newHref.slice(0,-1);
    }

    let hrefEnding = newHref.substr(newHref.lastIndexOf('/') + 1);
    let hrefParent = "";
    hrefParent = newHref.replace(domain+"/wp-post/","");
    hrefParent = newHref.replace(domain+"/learn/","");
    hrefParent = hrefParent.replace(hrefEnding,"");
    if (hrefParent!=="") {
      let hrefParentLastChar = hrefParent.slice(-1);
      if (hrefParentLastChar==="/") {
        hrefParent = hrefParent.slice(0,-1)+"%2F";
      }
    }
    normalizedURL = "/wp-post/"+hrefParent+hrefEnding;
  }
  return normalizedURL;
}

export function stripHTML(html) {
  let tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText;
}

export function calculateDaysInMonth(year, month) {
  let monthStart = new Date(year, month, 1);
  let monthEnd = new Date(year, month + 1, 1);
  let monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
  return monthLength;
}

export function flattenDeep(arr) {
  return arr.reduce((acc, e) => Array.isArray(e) ? acc.concat(flattenDeep(e)) : acc.concat(e), []);
}

export function sessionCookie(userName, sessionActive, accessToken, expired) {
  let currentDate = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(currentDate.getDate() + 1);
  let expires = tomorrow;
  let expiredDate = new Date();
  expiredDate.setDate(currentDate.getDate() - 1);
  if (expired) {
    expires = expiredDate;
  }
  setCookie('lettersUsername',userName,expires);
  setCookie('lettersSessionactive',sessionActive,expires);
  setCookie('lettersAccesstoken',accessToken,expires);
}

export function checkSessionCookies() {
  if (getCookie('lettersSessionactive')) {
    let userName = getCookie('lettersUsername');
    let accessToken = getCookie('lettersAccesstoken');
    sessionStorage.setItem('userName', userName);
    sessionStorage.setItem('sessionActive', true);
    sessionStorage.setItem('accessToken', accessToken);
  }
  else {
    sessionStorage.setItem('userName', '');
    sessionStorage.setItem('sessionActive', false);
    sessionStorage.setItem('accessToken', '');
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

function setCookie(name,value,expires){
   document.cookie = name + "=" + value + ((expires==null) ? "" : ";expires=" + expires.toGMTString())
}
