import React, { PureComponent } from 'react';
import Tabs from 'react-md/lib/Tabs/Tabs';
import Tab from 'react-md/lib/Tabs/Tab';
import TabsContainer from 'react-md/lib/Tabs/TabsContainer';
import Slider from 'react-md/lib/Sliders';
import FilteredPublicationList from "./FilteredPublicationList"
import ProfileInformation from "./ProfileInformation"
import ProfileCategories from "./ProfileCategories.jsx"
import rootRef from "../../libs/db"
import _ from "lodash"
import { userSelector } from "../../redux/getters"
import { connect } from "react-redux"

import CircularProgress from 'react-md/lib/Progress/CircularProgress';

@connect(state => ({ currentUser: userSelector(state) }))
export default class ProfileMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { 
        activeTabIndex: 0, 
        tabTwoChildren: null,
        reports: [],
        submissions: null,
        currentUser: {admin: false},
    };
    this._handleTabChange = this._handleTabChange.bind(this);
  }

  componentWillUnmount() {
    if (this._timeout) {
      clearTimeout(this._timeut);
    }
  }

  componentDidMount = () => {
    this.getCurrentUser(this.props.currentUser.uid)
    this.getReports()
    this.getSubmissions()
  }

  componentWillReceiveProps = nextProps => {
    this.getCurrentUser(nextProps.currentUser.uid)
    this.getSubmissions()      
    this.setState({activeTabIndex:0})
  }
  
  getCurrentUser = user => {
    rootRef
      .child("users")
      .child(user)
      .on("value", snap => this.setState({ currentUser: snap.val() }))
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

  filterPublications = user => publication => {
    return (publication.user === user && !publication.blocked && !publication.canceled)
  }

  filterReportedPublications = reports => publication => {
    return reports.some(rep => rep.id == publication.id) 
  }

  getReports = () =>
    rootRef.child("reports").on("value", snap => {
      this.setState({
        reports: _.map(
          snap.val(),
          (report, id) =>
            report
              ? {
                  ...report,
                  id
                }
              : null
        )
      })
    })

  filterSubmissions = user => publication => {
    if ((typeof this.state.submissions[publication.id] === 'undefined') || (publication.end < new Date()) || publication.canceled || publication.blocked) {
      return false
    }else{
      return typeof this.state.submissions[publication.id][user] !== 'undefined'
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
          <Tab label="Informacion" >
            <ProfileInformation user={this.props.user}/>
          </Tab>
          {(this.props.user === this.props.currentUser.uid || this.state.currentUser.admin) &&
          <Tab label="Publicaciones">
            <FilteredPublicationList filter={this.filterPublications(this.props.user)}/>
          </Tab>
          }
          {(this.props.user === this.props.currentUser.uid || this.state.currentUser.admin) &&
          <Tab label="Postulaciones">
            {this.state.submissions && <FilteredPublicationList filter={this.filterSubmissions(this.props.user)}/>}
          </Tab>
          }
          {(this.props.user === this.props.currentUser.uid && this.state.currentUser.admin) &&
          <Tab label="Publicaciones Reportadas">
            <FilteredPublicationList filter={this.filterReportedPublications(this.state.reports)}/> 
          </Tab>
          }
          {(this.props.user === this.props.currentUser.uid && this.state.currentUser.admin) &&
          <Tab label="Categorias">
            <ProfileCategories test="asd"/> 
          </Tab>
          }

        </Tabs>
      </TabsContainer>
    );
  }
}