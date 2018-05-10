import React, {Component} from 'react';
import VizualizationMap from '../components/vizualizations-map.js';
import ReactLoading from 'react-loading';

export class VizualizationsView extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      content: [],
    }
  }

  componentDidMount() {
    let viewType = this.props.match.params.type;
    if (viewType==="map") {
      this.embedMap();
    }
  }

  embedMap() {
    this.setState({
      loading: false,
      content: <VizualizationMap/>
    });
  }

  render() {
    let pageContent;
    if (this.state.loading) {
      pageContent = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height='60px' width='60px' delay={0} />
          </div>;
    }
    else {
      pageContent = this.state.content;
    }
    return (
      <div>
        {pageContent}
      </div>
    );
  }
}
