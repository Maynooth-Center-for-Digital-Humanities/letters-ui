import React, {Component} from 'react';
import VizualizationMap from '../components/vizualizations-map.js';
import VizualizationGraph from '../components/vizualizations-graph.js';
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
    if (viewType==="graph") {
      this.embedGraph();
    }
  }

  embedMap() {
    this.setState({
      loading: false,
      content: <VizualizationMap/>
    });
  }

  embedGraph() {
    this.setState({
      loading: false,
      content: <VizualizationGraph/>
    });
  }

  render() {
    let pageContent;
    if (this.state.loading) {
      pageContent = <div className="loader-container">
          <ReactLoading type='spinningBubbles' color='#738759' height={60} width={60} delay={0} />
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
