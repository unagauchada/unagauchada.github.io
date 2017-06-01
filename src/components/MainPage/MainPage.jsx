import React from "react"
import { Link } from "react-router-dom"
import List from "react-md/lib/Lists/List"
import ListItem from "react-md/lib/Lists/ListItem"
import FontIcon from "react-md/lib/FontIcons"
import "./MainPage.scss"

const HomeIcon = () => <FontIcon>home</FontIcon>
const ExplorIcon = () => <FontIcon>group_work</FontIcon>
const ProfileIcon = () => <FontIcon>account_circle</FontIcon>
const CreditIcon = () => <FontIcon>shopping_cart</FontIcon>

const SideBar = () => (
  <aside>
    <List>
      <Link to="/">
        <ListItem leftIcon={<HomeIcon />} primaryText="Inicio" />
      </Link>
      <Link to="/">
        <ListItem leftIcon={<ExplorIcon />} primaryText="Explorar" />
      </Link>
      <Link to="/">
        <ListItem leftIcon={<ProfileIcon />} primaryText="Mi Perfil" />
      </Link>
      <Link to="/buy">
        <ListItem leftIcon={<CreditIcon />} primaryText="Comprar Créditos" />
      </Link>
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
