import React from 'react';

export default class TwitterFeed extends React.Component {

  render() {

    return(
      <div>
      <a class="twitter-timeline" href="https://twitter.com/Letters1916" data-widget-id="382284620286275584">Tweets by @Letters1916</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
      </div>
    );
  }
}