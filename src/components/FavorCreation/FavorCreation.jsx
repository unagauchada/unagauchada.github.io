// @flow

import React from "react"
import Media, { MediaOverlay } from "react-md/lib/Media"
import Avatar from "react-md/lib/Avatars"
import Paper from "react-md/lib/Papers"
import TextField from "react-md/lib/TextFields"
import Button from "react-md/lib/Buttons"
import MainPage from "../MainPage"
import InputImage from "/home/gaston/Escritorio/unagauchada_firebase-master/src/components/InputImage/InputImage.jsx"
import SelectField from 'react-md/lib/SelectFields';
import "./FavorCreation.scss"

class FavorCreation extends React.Component{

  constructor(props) {
    super(props)
    this.state = { 
        title: "", 
        category: "", 
        location: "", 
        imgURL: `https://unsplash.it/350/150/?random&time=${new Date().getTime()}`,
        text: ""  }
  }

  handleChange = property => value => {
    this.setState({
      [property]: value
    })
  }

  newFavor = () => {
    /*firebase
      .auth(app)
      .newFavorWith(this.state.title, this.state.category, this.state.location, this.state.imgURL, this.state.text)
      .catch(error => console.error(error)) */
  }

  render = () => (
     <favorForm>
      <Paper zDepth={2}>
        <header>
          Crear favor
          <TextField
            id="title"
            placeholder="Mi favor"
            fullWidth={true}
            customSize="title"
            leftIcon={
                <Avatar
                    src={`https://unsplash.it/40/40?random&time=${new Date().getTime()}`}
                    role="presentation"
                />
                }
            size={10}
            className="md-cell--bottom"
            value={this.state.title}
            onChange={this.handleChange("title")}
          />
        </header>
        <section>
          <InputImage/>
        </section>
        <section>
          <TextField
            id="text"
            placeholder="Descripcion de mi favor"
            rows={4}
            className="md-cell--bottom"
            onChange={this.handleChange("text")}
          />
          <SelectField
            id="categoria"
            label="Categoria"
            defaultValue={"otros"}
            menuItems={["categoria 1", "categoria 2"]} //llenar con categorias de db
            className="md-cell"
          />
          <SelectField
            id="localizacion"
            label="Localizacion"
            defaultValue={"unknown"}
            menuItems={["algun lugar", "otro lugar"]} //llenar con categorias de db
            className="md-cell"
          />
          {" "}
        </section>
        <footer
          className="md-cell md-cell--12 md-dialog-footer md-dialog-footer--inline"
          style={{ alignItems: 'center', margin: 0 }}
        >
           <Button 
              raised
              label="Vista previa" 
              secondary
              className="md-btn--dialog"
           />
           <Button 
              raised 
              label="Aceptar" 
              primary 
              className="md-btn--dialog md-cell--right"
              onClick={this.newFavor} />
        </footer>
      </Paper>
    </favorForm>
    )
}

export default FavorCreation