import React, { PureComponent } from 'react';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import Slider from 'react-md/lib/Sliders';
import { userSelector } from "../../redux/getters"
import { connect } from "react-redux"
import FilteredPublicationList from "./FilteredPublicationList"
import ProfileInformation from "./ProfileInformation"
import rootRef from "../../libs/db"
import _ from "lodash"

import CircularProgress from 'react-md/lib/Progress/CircularProgress';

@connect(state => ({ user: userSelector(state) }))
export default class ProfileMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { 
        activeTabIndex: 0, 
        tabTwoChildren: null,
        submissions: null
    };
    this._handleTabChange = this._handleTabChange.bind(this);
  }

  componentWillUnmount() {
    if (this._timeout) {
      clearTimeout(this._timeut);
    }
  }

  componentDidMount = () => {
    this.getSubmissions()
  }

  _handleTabChange(activeTabIndex) {
    if (activeTabIndex === 1 && !this.state.tabTwoChildren) {
      // Fake async loading
      this._timeout = setTimeout(() => {
        this._timeout = null;

        this.setState({
          tabTwoChildren: [
            <Slider id="slider" defaultValue={30} key="slider" className="md-cell md-cell--12" />,
          ],
        });
      }, 3000);
    }

    this.setState({ activeTabIndex });
  }

  getSubmissions = () => {
    rootRef.child("submissions").on("value", snap =>
      this.setState({
        submissions: snap.val()
      })
    )
  }

  filterPublications = publication => {
    return publication.user === this.props.user.uid
  }

  filterSubmissions = publication => {
    if (typeof this.state.submissions[publication.id] === 'undefined') {
      return false
    }else{
      return typeof this.state.submissions[publication.id][this.props.user.uid] !== 'undefined'
    }
  }

  render() {
    const { activeTabIndex } = this.state;
    let { tabTwoChildren } = this.state;

    if (!tabTwoChildren && activeTabIndex === 1) {
      tabTwoChildren = <CircularProgress id="loading-tab-two" key="loading" />;
    }

    return (
      <TabsContainer onTabChange={this._handleTabChange} activeTabIndex={activeTabIndex} panelClassName="md-grid" colored>
        <Tabs tabId="tab">
          <Tab label="Informacion">
            <ProfileInformation user={this.props.user}/>
          </Tab>
          <Tab label="Publicaciones">
            <FilteredPublicationList filter={this.filterPublications}/>
          </Tab>
          <Tab label="Postulaciones">
            {this.state.submissions && <FilteredPublicationList filter={this.filterSubmissions}/>}
          </Tab>
        </Tabs>
      </TabsContainer>
    );
  }
}