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
      userLt: "",
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
    rootRef.child("scores").on("value", snap =>
      this.setState({
        userCat: _.map(
          snap.val(),
          (achievement, name) =>
            ({
                  ...achievement,
                  name
                })
        ).sort((x,y) => x.lt-y.lt)
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

  openUserAdd = cat => this.setState({userAdd:true})
  closeUserAdd= () => this.setState({userAdd:false})

  userAdd = () =>{
    console.log("Adding User category:" + this.state.userNam )
    rootRef
      .child("scores")
      .child(this.state.userNam)
      .child("lt")
      .set(parseInt(this.state.userLt))
    this.closeUserAdd()
  }

  openUserMod = cat => this.setState({userMod:true, userNam: cat.name, userLt: cat.lt, modding:cat })
  closeUserMod= () => this.setState({userMod:false})

  userMod = () =>{
    console.log("Modifying User category:" + this.state.userNam )
    rootRef
      .child("scores")
      .child(this.state.userNam).remove()
    rootRef
      .child("scores")
      .child(this.state.userNam)
      .child("lt")
      .set(parseInt(this.state.userLt))
    this.closeUserMod()
  }

  openUserDel = cat => this.setState({userDel:true, userNam: cat.name, userLt: cat.lt })
  closeUserDel= () => this.setState({userDel:false})

  userDel = () =>{
    console.log("Modifying User category:" + this.state.userNam )
    rootRef
      .child("scores")
      .child(this.state.userNam).remove()
    this.closeUserDel()
  }


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
    		<CardTitle>Categorias de Usuario </CardTitle>
    		<CardText>
    		  	<List>
    		  	  {this.state.userCat.map((userCat, i) =>
    		  	  	<ListItem primaryText={userCat.name}
                  secondaryText ={( 0 == (this.state.userCat.length -1 )) ?"Desde " + 0  + " puntos":
                  (i == this.state.userCat.length -1)?"Dese " + (this.state.userCat[i-1].lt +1 )  + " puntos":
                    "Hasta " + userCat.lt + " puntos"
                    }
    		  	  		leftIcon={<Button
                    disabled={this.state.userCat.length == 1} 
                    tooltipLabel={this.state.userCat.length == 1 &&"No se permite eliminar a la unica categoria"}
                    onClick={() => this.openUserDel(userCat)}> 
                    delete </Button>
                  }
    		  	  		rightIcon={<Button onClick={() =>this.openUserMod(userCat)}> create </Button>}
    		  	  	/>
    		  	  )}
    		  	</List>
    		  	<Button 
    		  		flat
    		  		label="Agregar"
    		  		onClick={() => this.openUserAdd()} 
    		  		primary
    		  	/> 
    		</CardText>
    	</Card>
    	<Dialog
          visible={this.state.userAdd}
          title="Agregar Categoria de Usuario"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.userAdd,
            primary: true,
            disabled: !this.state.userNam 
              || this.state.userCat.map(cat => cat.name).some(name => name === this.state.userNam)
              ||!this.state.userLt
              ||!(typeof this.state.userLt) == 'number'
              ||(this.state.userLt%1),
            label: 'Aceptar',
          },{
            onClick: this.closeUserAdd,
            primary: true,
            label: 'Cancelar',
          }]}
        >
        <TextField
            label="Nombre de la Categoria"
            required
            onChange={text => this.setState({userNam: text})}
            error={this.state.userCat.map(cat => cat.name).some(name => name === this.state.userNam)}
            errorText={this.state.userNam==""?"Este campo es obligatorio.":"Este nombre ya esta utilizado."}
          />
        <TextField
            label="Hasta que puntaje?"
            required
            type='number'
            floating={true}
            onChange={text => this.setState({userLt: text})}
            error={(this.state.userLt%1) || this.state.userCat.map(cat => cat.lt).some(lt => lt == this.state.userLt)}
            errorText={
              (this.state.userLt == "") ? "Ingrese un entero":
              this.state.userCat.map(cat => cat.lt).some(lt => lt == this.state.userLt)?"Otra categoria tiene este puntaje minimo.":
              ""
            }
          />
    	</Dialog>
    	<Dialog
          visible={this.state.userMod}
          title="Editar categoria de usuario"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.userMod,
            primary: true,
            label: 'Aceptar',
          },{
            onClick: this.closeUserMod,
            primary: true,
            label: 'Cancelar',
          }]}
        >
    		<TextField
            label="Nombre de la Categoria"
            required
            value={this.state.userNam}
            onChange={text => this.setState({userNam: text})}
            error={this.state.userCat.map(cat => cat.name).some(name => name === this.state.userNam)
              && this.state.userNam != this.state.modding.name }
            errorText={this.state.userNam==""?"Este campo es obligatorio.":"Este nombre ya esta utilizado."}
          />
        <TextField
            label="Hasta que puntaje?"
            required
            value={this.state.userLt}
            type='number'
            floating={true}
            onChange={text => this.setState({userLt: text})}
            error={(this.state.userLt%1) || this.state.userCat.map(cat => cat.lt).some(lt => lt == this.state.userLt)}
            errorText={
              (this.state.userLt == "") ? "Ingrese un entero":
              this.state.userCat.map(cat => cat.lt).some(lt => lt == this.state.userLt)
              && this.state.userLt != this.state.modding.lt ?"Otra categoria tiene este puntaje minimo.":
              ""
            }
          />
    	</Dialog>
    	<Dialog
          visible={this.state.userDel}
          title="Cuenta Eliminada"
          onHide={this.closeDialog}
          modal
          actions={[{
            onClick: this.userDel,
            primary: true,
            label: 'Aceptar',
          },{
            onClick: this.closeUserDel,
            primary: true,
            label: 'Cancelar',
          }]}
        >
    		Estas seguro que deseas eliminar esta categoria?
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