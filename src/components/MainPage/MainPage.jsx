import React from "react"
import { Link } from "react-router-dom"
import List from "react-md/lib/Lists/List"
import ListItem from "react-md/lib/Lists/ListItem"
import FontIcon from "react-md/lib/FontIcons"
import firebase from "firebase"
import rootRef from "../../libs/db"
import "./MainPage.scss"

const HomeIcon = () => <FontIcon>home</FontIcon>
const ProfileIcon = () => <FontIcon>account_circle</FontIcon>
const CreditIcon = () => <FontIcon>shopping_cart</FontIcon>
const StadisticsIcon = () => <FontIcon>trending_up</FontIcon>

const GetStatisticsButton = () => {
  let admin = false
  rootRef
    .child("users")
    .child(firebase.auth().currentUser.uid)
    .on("value", snap => admin = snap.val().admin)
  if (admin) {
    return( 
      <Link to="/statistics">
        <ListItem leftIcon={<StadisticsIcon />} primaryText="Ver Estadisticas" />
      </Link>)
  }else return null
}

const SideBar = () => (
  <aside>
    <List>
      <Link to="/">
        <ListItem leftIcon={<HomeIcon />} primaryText="Inicio" />
      </Link>
      {firebase.auth().currentUser &&
      <div>
        <Link to={"/profile/"+firebase.auth().currentUser.uid}>
          <ListItem leftIcon={<ProfileIcon />} primaryText="Mi Perfil" />
        </Link>
        <Link to="/buy">
          <ListItem leftIcon={<CreditIcon />} primaryText="Comprar Créditos" />
        </Link>
        <GetStatisticsButton />
      </div>
      }
    </List>
  </aside>
)

const MainPage = ({ children }) => (
  <main className="mainPage">
    <SideBar />
    <content>
      {children}
    </content>
  </main>
)

export default MainPage
