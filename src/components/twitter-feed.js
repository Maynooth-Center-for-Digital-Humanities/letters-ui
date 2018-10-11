import React from 'react';

export default class TwitterFeed extends React.Component {


    componentDidMount() {
      let addScript = document.createElement('script');
      let scriptContent = document.createTextNode('!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?"http":"https";if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");');
      addScript.appendChild(scriptContent);
      document.body.appendChild(addScript);
    }

  render() {

    return(
      <div>
        <a className="twitter-timeline" data-height="480" href="https://twitter.com/Letters1916" data-widget-id="382284620286275584" data-background="#fcfcf9">Tweets by @Letters1916</a>
      </div>
    );
  }
}
