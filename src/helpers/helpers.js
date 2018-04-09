import React from 'react';

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

export function CompareFilterTopics(compareArray) {
  let group = document.getElementsByClassName("topics-list")[0];
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
    }
  }
}
export function CompareFilterGeneral(selector,compareArray) {
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
    }
  }
}
