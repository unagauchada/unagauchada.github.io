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


componentWillMount= () => this.setState({
      searchText: this.props.searchText,
      searchLoc: this.props.searchLoc,
      searchCat: this.props.searchCat
    })


componentWillReceiveProps = nextProps => this.setState({
    searchText: nextProps.searchText,
    searchLoc:  nextProps.searchLoc,
    searchCat:  nextProps.searchCat
})


render = () => {

	return (
    	<MainPage>
        	<PublicationList searchText={this.state.searchText} searchLoc={this.state.searchLoc} searchCat={this.state.searchCat}/>
    	</MainPage>
	)
}

}

export default Home