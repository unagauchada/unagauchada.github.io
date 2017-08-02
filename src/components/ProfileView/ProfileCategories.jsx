import React from "react"
import _ from "lodash"
import List from "react-md/lib/Lists/List";
import Button from "react-md/lib/Buttons";
import TextField from "react-md/lib/TextFields"
import ListItem from "react-md/lib/Lists/ListItem";
import Card from "react-md/lib/Cards/Card"
import CardTitle from "react-md/lib/Cards/CardTitle"
import CardText from "react-md/lib/Cards/CardText"
import FontIcon from "react-md/lib/FontIcons"
import Dialog from "react-md/lib/Dialogs"
import { connect } from "react-redux"
import rootRef from "../../libs/db"

class ProfileCategories extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    	modding:{},
      publications:[],
      favorCat: [],
      userCat: [],
      userAdd: false,
      userNam: "",
      userMod: false,
      userDel: false,
      favAdd: false,
      favNam: "",
      favMod: false,
      favDel: false,
    }
  }

  componentDidMount = () => {
    this.getFavorCat()
    this.getUserCat()
    this.getPublications()
  }

  getPublications = () =>
    rootRef.child("publications").on("value", snap => {
      this.setState({
        publications: _.map(
          snap.val(),
          (publication, id) =>
            publication
              ? {
                  ...publication,
                  id
                }
              : null
        )
      })
  })

  getFavorCat = () =>
    rootRef.child("categories").on("value", snap => {
      this.setState({
        favorCat: _.map(
          snap.val(),
          (category, id) =>
            category
              ? {
                  ...category,
                  id
                }
              : null
        )
      })
    })

    getUserCat = () => {
    rootRef.child("⁠⁠⁠achievements").on("value", snap =>
      this.setState({
        userCat: _.map(
          snap.val(),
          (achievement, name) =>
            ({
                  ...achievement,
                  name
                })
        )
      })
    )      
  }

  openFavAdd = () => this.setState({favAdd:true})
  closeFavAdd= () => this.setState({favAdd:false, favNam: ""})

  favAdd = () =>{
  	console.log("Adding Favor category:" + this.state.favNam)
  	rootRef
  		.child("categories")
  		.push({name: this.state.favNam})
  	this.closeFavAdd()
  }

  openFavMod = fav => this.setState({favMod:true, favNam:fav.name, modding:fav})
  closeFavMod= () => this.setState({favMod:false, favNam: ""})

  favMod = () =>{
  	rootRef
  		.child("categories")
  		.child(this.state.modding.id)
  		.set({name: this.state.favNam})
  	this.closeFavMod()
  }

  openFavDel = fav => this.setState({favDel:true, favNam:fav.name, modding:fav})
  closeFavDel= () => this.setState({favDel:false})

  defaultPub = pub => rootRef.child("publications").child(pub.id).child("category").set("default")

  favDel = fb =>{
  	this.state.publications.filter(pub => pub.category == this.state.modding.id).map(this.defaultPub);
  	rootRef.child("categories").child(this.state.modding.id).remove()
  	this.closeFavDel()
  }

  openUserAdd = () => this.setState({userAdd:true})
  closeUserAdd= () => this.setState({userAdd:false})

  openUserMod = () => this.setState({userMod:true})
  closeUserMod= () => this.setState({userMod:false})

  openUserDel = () => this.setState({userDel:true})
  closeUserDel= () => this.setState({userDel:false})


  render = () => {
    return (
    <div className="md-grid" style={{ width: "100%" }} >
    	<Card className="md-cell--left" style={{ width: "45%" }}>
    		<CardTitle>Categorias de Favor</CardTitle>
    		<CardText>
    	  		<List>
    	    		{this.state.favorCat.map(favCat => 
    	    			<ListItem primaryText={favCat.name}
    		  	  			leftIcon={
    		  	  			<Button 
    		  	  				tooltipLabel={favCat.id == "default"&&"Categoria por defecto"}
    		  	  				disabled={favCat.id == "default"}  
    		  	  				onClick={() => this.openFavDel(favCat)}
    		  	  			> delete </Button>
    		  	  			} 
    	    				rightIcon={<Button onClick={() => this.openFavMod(favCat)}> create </Button>}
    	    			/>
    	    		)}
    	  		</List>
    	  		<Button
    	  			flat
    	  			onClick={this.openFavAdd}
    	  			label="Agregar" 
    	  			primary
    	  		/> 
    	 	</CardText>
    	</Card>
    	<Card className="md-cell--right" style={{ width: "45%" }}>
    		<CardTitle>Categorias de Usuario</CardTitle>
    		<CardText>
    		  	<List>
    		  	  {this.state.userCat.map(favCat =>
    		  	  	<ListItem primaryText={favCat.name}
    		  	  		leftIcon={<Button  onClick={this.openUserDel}> delete </Button>}
    		  	  		rightIcon={<Button onClick={this.openUserMod}> create </Button>}
    		  	  	/>
    		  	  )}
    		  	</List>
    		  	<Button 
    		  		flat
    		  		label="Agregar"
    		  		onClick={this.openUserAdd} 
    		  		primary
    		  	/> 
    		</CardText>
    	</Card>
    	<Dialog
          visible={this.state.userAdd}
          title="Editar Categoria de Usuario"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.closeUserAdd,
            primary: true,
            label: 'Aceptar',
          }]}
        >
    		agregar categoria de usuario
    	</Dialog>
    	<Dialog
          visible={this.state.userMod}
          title="Cuenta Eliminada"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.closeUserMod,
            primary: true,
            label: 'Aceptar',
          }]}
        >
    		editar categoria de usuario
    	</Dialog>
    	<Dialog
          visible={this.state.userDel}
          title="Cuenta Eliminada"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.closeDeleted,
            primary: true,
            label: 'Aceptar',
          }]}
        >
    		eliminar categoria de usuario
    	</Dialog>
    	<Dialog
          visible={this.state.favAdd}
          title="Cuenta Eliminada"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.favAdd,
            disabled: this.state.favNam == "" || this.state.favorCat.map(cat => cat.name).some(name => name === this.state.favNam),
            primary: true,
            label: 'Aceptar',
          },{
            onClick: this.closeFavAdd,
            primary: true,
            label: 'Cancelar',
          }]}
        >
    		<TextField
      			label="Nombre de la Categoria"
      			placeholder={this.state.favNam}
      			required
      			onChange={text => this.setState({favNam: text})}
      			error={this.state.favorCat.map(cat => cat.name).some(name => name === this.state.favNam)}
      			errorText={"Este nombre ya esta utilizado."}
      		/>
    	</Dialog>
    	<Dialog
          visible={this.state.favMod}
          title="Editar categoria"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.favMod,
            disabled: this.state.favNam == "" || this.state.favorCat.map(cat => cat.name).some(name => name === this.state.favNam),
            primary: true,
            label: 'Aceptar',
          },{
            onClick: this.closeFavMod,
            primary: true,
            label: 'Cancelar',
          }]}
        >        
    		<TextField
      			label="Nombre de la Categoria"
      			placeholder={this.state.favNam}
      			required
      			onChange={text => this.setState({favNam: text})}
      			error={this.state.favorCat.map(cat => cat.name).some(name => name === this.state.favNam) && this.state.favNam != this.state.modding.name}
      			errorText={"Este nombre ya esta utilizado."}
      		/>
    	</Dialog>
    	<Dialog
          visible={this.state.favDel}
          title="Eliminar Categoria"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.favDel,
            primary: true,
            label: 'Aceptar',
          },{
            onClick: this.closeFavDel,
            primary: true,
            label: 'Cancelar',
          }]}
        >
    		Estas seguro que deseas eliminar la categoria "{this.state.favNam}" ?
    	</Dialog>
    </div>
    )
  }
}

export default ProfileCategories