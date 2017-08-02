import React from "react"
import _ from "lodash"
import { connect } from "react-redux"
import Button from "react-md/lib/Buttons/Button"
import Dialog from "react-md/lib/Dialogs"
import Snackbar from "react-md/lib/Snackbars";
import Divider from 'react-md/lib/Dividers';
import rootRef from "../../libs/db"
import { userSelector } from "../../redux/getters"
import MetricsGraphics from 'react-metrics-graphics';
import Card from "react-md/lib/Cards/Card"
import CardTitle from "react-md/lib/Cards/CardTitle"
import CardText from "react-md/lib/Cards/CardText"
import CardActions from "react-md/lib/Cards/CardActions"
import MainPage from '../MainPage'
import Plot from './Plot'
import Switch from 'react-md/lib/SelectionControls/Switch';
import "./statistics.scss"
import "./graphics.scss"

@connect(state => ({ user: userSelector(state) }))
class Statistics extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            transactions: [],
            
            transactionsDates: [],
            transactionsValues: [],
            transactionsPrices: [],
            creationDates: [],
            creationValues: [],
            showGain: false,
        }
    }

    componentDidMount = () => {
        this.getTransactions()
    }

    onPlotClick = (data) => {
        console.log(data);
    };

    getTransactions = () => {
        rootRef.child("credits").on("value", snap => {
    
            let transactions = _.flattenDeep(
                _.map(
                    snap.val(), userTransactions => _.map(
                        Object.values(userTransactions), each => {
                            let { value, date, type, price } = each
                            date = new Date(date)
                            return { value, date, type, price }
                        }
                    )
                )
            )

            transactions = _.sortBy(transactions, (each) => each.date)

            this.setState({
                transactions: transactions                
            });

            this.fetchDataTransactions(transactions)

            /*initial transaction marks the creation of an user*/
            this.fetchDataUsers(_.filter(transactions, (transaction) => transaction.type === "Initial"))
        
        });
    }

  fetchDataTransactions = transactions => {

    console.log(transactions)
    let totalValue = 0
    let totalPrice = 0

    var transactionsDates = [];
    var transactionsValues = [];
    var transactionsPrices = [];
    _.forEach(transactions, (each) => {

        transactionsDates.push(each.date);

        totalValue = totalValue + each.value
        transactionsValues.push(totalValue);

        totalPrice = totalPrice + each.price
        transactionsPrices.push(totalPrice);
    })

    this.setState({
    transactionsDates: transactionsDates,
    transactionsValues: transactionsValues,
    transactionsPrices: transactionsPrices
    });
  }

  fetchDataUsers = transactions => {

    var amountCreated = 0

    var creationDates = [];
    var creationValues = [];
    _.forEach(transactions, (each) => {
        creationDates.push(each.date);

        amountCreated++
        creationValues.push(amountCreated);
    })

    this.setState({
    creationDates: creationDates,
    creationValues: creationValues,
    });
  }

  toggleShowGain = value => {
      this.setState({showGain: !this.state.showGain})
  }

  render = () => { 
    return (
      <MainPage>
      <statisticsCards>
        <Card
        className="md-block-centered md-cell--top "
        >
            <CardTitle
                title={"Compra de creditos"}
            >
                <Switch 
                    className="md-cell--right title-element" 
                    id="switch1" 
                    name="lights" 
                    label={this.state.showGain && "Mostrando ganancias" || "Mostrando creditos"}
                    labelBefore={true}
                    value={this.state.showGain}
                    onChange={this.toggleShowGain} />
            </CardTitle>
            <CardText key="descr" className="descr">
                {this.state.transactions &&
                <Plot
                    id="transactions"
                    xData={this.state.transactionsDates}
                    yData={this.state.showGain && this.state.transactionsPrices || this.state.transactionsValues}
                    onPlotClick={this.onPlotClick}
                    type="scatter"
                />
                }
            </CardText>          
        </Card>
        <Card
        className="md-block-centered md-cell--top "
        >
            <CardTitle title={"Creacion de usuarios"} />
            <CardText key="descr" className="descr">
                {console.log(this.state.creationValues)}
                <Plot
                    id="userCreation"
                    xData={this.state.creationDates}
                    yData={this.state.creationValues}
                    onPlotClick={this.onPlotClick}
                    type="scatter"
                />
            </CardText>          
        </Card>
      </statisticsCards>
      </MainPage>
    )
  }
}

export default Statistics
