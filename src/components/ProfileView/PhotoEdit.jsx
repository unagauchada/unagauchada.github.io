import React, { PureComponent } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import FileUpload from 'react-md/lib/FileInputs/FileUpload';
import FontIcon from "react-md/lib/FontIcons"
import Avatar from "react-md/lib/Avatars"

import { connect } from "react-redux"
import { userSelector } from "../../redux/getters"

@connect(state => ({ user: userSelector(state) }))
export default class FileUploadExample extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { files: {}, image: "" };
    this._timeout = null;
    this._onLoad = this._onLoad.bind(this);
    this._setUpload = this._setUpload.bind(this);
    this._handleProgress = this._handleProgress.bind(this);
  }

  componentWillUnmount() {
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }

  componentDidMount = () => {
    this.setStateImage(this.props.photoURL)
  }

  setStateImage = (image) => {
    this.setState({ image });
  }

  _setUpload(upload) {
    this._upload = upload;
  }

  _onLoad(file, uploadResult) {
    const { name, size, type, lastModified } = file;

    this.setStateImage(uploadResult)
    this.props.setImage(file)

    const files = {};
    files[name] = {
      name,
      type,
      size,
      lastModified: new Date(lastModified),
      uploadResult,
    };

    this._timeout = setTimeout(() => {
      this._timeout = null;
      this.setState({ progress: null });
    }, 2000);

    this.setState({ files, progress: 100 });
  }

  setFile = (file) => {
    this.setState({ file });
  }

  _handleProgress(file, progress) {
    // The progress event can sometimes happen once more after the abort
    // has been called. So this just a sanity check
    if (this.state.file === file) {
      this.setState({ progress });
    }
  }

  renderImage = () => {
    if (this.state.image && this.state.image !== ""){ 
      console.log(this.state.image)
      return  <Avatar 
                className="bigAvatar"
                style={{fontSize: 100, height: 100, width: 100 }} 
                src={this.state.image} 
                role="presentation" />
    }else return <Avatar 
                    style={{fontSize: 100, height: 100, width: 100 }} 
                    icon={<FontIcon style={{fontSize: 100, height: 100, width: 100 }}>person</FontIcon>} 
                    role="presentation" />
  }

  render() {
    return (
      <div>
        <section className="header md-cell md-cell--12 md-cell--middle md-text-center ">
          {this.renderImage()}
        </section>
        <section className="header md-cell md-cell--12 md-cell--middle md-text-center ">
        <FileUpload
          id="ImageUpload"
          accept="image/*"
          primary
          name="file-upload"
          iconChildren='photo_camera'
          ref={this._setUpload}
          label="Selecciona una imagen"
          onLoadStart={this.setFile}
          onProgress={this._handleProgress}
          onLoad={this._onLoad}
          flat
          iconBefore
        />
        </section>
      </div>
    );
  }
}