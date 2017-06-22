import React from 'react'

import MainPage from '../MainPage'
import PublicationList from '../PublicationList'

class Home extends React.Component {
  constructor() {
        super();
        this.state = {
            searchText: "SearchText default de Home"
        };
    }


componentWillMount= () => this.setState({ searchText: this.props.searchText})


componentWillReceiveProps = nextProps => this.setState({ searchText: nextProps.searchText})


render = () => {

	return (
    	<MainPage>
        	<PublicationList searchText={this.state.searchText}/>
    	</MainPage>
	)
}

}

export default Home