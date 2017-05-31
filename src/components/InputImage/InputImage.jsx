import React, { PureComponent } from 'react';
import FileInput from 'react-md/lib/FileInputs';
import Media from "react-md/lib/Media"

export default class InputImage extends PureComponent {

  constructor(props) {
    super(props);

    this.state = { images: [] };
    this.display = <img src={`https://unsplash.it/40/40?random&time=${new Date().getTime()}`} alt="default" />
  }

  _handleFileSelect = (file) => {
    const images = this.state.images.slice();
    const { name, size, lastModified, type, uploadResult } = this.props.file;

    this.display = <img src={uploadResult} alt={name} />;

    this.setState({ images });
  };

  render() {
    const { images } = this.state;

    return (
      <div className="md-grid file-input-grid">
        <FileInput
          id="imageInput1"
          label="Seleccione una imagen para su favor"
          onLoad={this._handleFileSelect}
          accept="image/*"
          primary
          name="images-1"
        />
      <div className="md-cell md-cell--12">
        <Media aspectRatio="16-9">
          {this.display}
        </Media>
      </div>
      </div>
    );
  }
}