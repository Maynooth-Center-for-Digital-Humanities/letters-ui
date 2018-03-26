import React, {Component} from 'react';
import BreadCrumbs from '../components/breadcrumbs';

export class ContentView extends Component {
  componentDidMount() {

  }

  render() {
    let aboutTitle = 'Letters of 1916-1923';
    let aboutHTML = <div>
      <h2>{aboutTitle}</h2>
      <p>Letters of 1916 is Ireland’s first crowdsourced public humanities project.
      It has created an online collection of letters about Ireland written around the time of the Easter Rising.
      Letters cover all aspects of life, from major political events, the Easter Rising and the Great War, to letters that provide us with a candid and unmediated glimpse into ordinary life, love and work a century ago.
      There are thousands of letters in the collection connecting hundreds of lives.</p>

      <p>Letters have been collected from public institutions around the world as well as from private, family collections.
      This database allows you to explore the letters in great detail facilitating two modes of discovery: search and browse.</p>

      <p>If you are looking for a specific word, person, place, or event, go to the Search page and enter the term in the simple search box.
      If you don’t have a specific query, go to the Browse page where you can explore the collection by date or theme.</p>

      <p>Once letters are displayed, you can further refine your search by filtering options on the right hand side of the page.
      New letters are constantly being added to this database, so search results may differ from time to time.</p>

      <p>Both images of the letters and transcripts are available to view.
      This provides the best of both words.
      Images convey the personality of the letter writer: their handwriting, their writing style, notes and doodles, giving us insights into their mood and state of mind.</p>

      <p>Transcriptions, on the other hand, make it easier to read difficult handwriting.
      These letters have been transcribed by thousands of people around the world and proofed by the Letters of 1916 team.
      Even so, there will be errors in transcription.
      Please let us know if you spot any of these by clicking on the Share & Feedback tab and reporting the error.</p>

      <p>We are constantly adding new letters to the collection, both institutional and private.
      Letters can be added to the Contribute database directly through this link.
      If you have too many letters to be added one by one, please get in touch with us here.</p>
    </div>;

    let contentName = this.props.match.params.contentName;
    let contentHTML,
      contentTitle;
    if (contentName==="about") {
      contentHTML = aboutHTML;
      contentTitle = aboutTitle;
    }
    let breadCrumbsArr = [{label:contentTitle,path:''}];
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <BreadCrumbs items={breadCrumbsArr}></BreadCrumbs>
              {contentHTML}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
