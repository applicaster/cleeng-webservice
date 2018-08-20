import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import OfferDialog from './OfferDialog';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  tableContainer: {},
  layout: {
    width: 'auto'
  },
  title: {
    display: 'inline',
    marginRight: 10
  },
  paper: {
    padding: 10
  },
  textField: {
    width: 300
  },
  titleContainer: {
    marginBottom: 15
  },
  button: {
    marginTop: -10
  }
});

class OffersTable extends Component {
  constructor(props) {
    super();
    const { offers = [] } = props;
    this.state = {
      offerDialogOpen: false,
      selectedOffer: {},
      selectedOfferIndex: -1,
      offers
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.offers && this.props.offers) {
      this.setState({ offers: this.props.offers });
    }
  }

  offerClick = selectedOfferIndex => {
    const selectedOffer =
      selectedOfferIndex === -1 ? {} : this.state.offers[selectedOfferIndex];
    this.setState({ offerDialogOpen: true, selectedOffer, selectedOfferIndex });
  };

  deleteOfferClick = selectedOfferIndex => {
    const { offers: _offers } = this.state;
    const offers = [..._offers];
    offers.splice(selectedOfferIndex, 1);
    this.props.onOffersChanged && this.props.onOffersChanged(offers);
    this.setState({
      offers
    });
  };

  handleOfferDialogClose = result => {
    const { selectedOfferIndex, offers: _offers } = this.state;
    const offers = [..._offers];
    if (result) {
      if (selectedOfferIndex === -1) {
        offers.push(result);
      } else {
        offers[selectedOfferIndex] = {
          ...offers[selectedOfferIndex],
          ...result
        };
      }
      this.props.onOffersChanged && this.props.onOffersChanged(offers);
    }
    this.setState({
      offerDialogOpen: false,
      selectedOffer: {},
      selectedOfferIndex: -1,
      offers
    });
  };

  render() {
    const { classes } = this.props;
    const { offers = [] } = this.state;
    return (
      <div>
        <Typography variant="subheading" gutterBottom className={classes.title}>
          Offers
        </Typography>
        <Button
          mini
          variant="fab"
          color="primary"
          aria-label="Add"
          className={classes.button}
          onClick={() => {
            this.offerClick(-1);
          }}
        >
          <AddIcon />
        </Button>

        <Table className={classes.table} aria-labelledby="publishers">
          <TableHead>
            <TableRow>
              <TableCell>OfferId</TableCell>
              <TableCell>AuthId</TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offers.map((offer, i) => {
              const { authId, offerId } = offer;
              return (
                <TableRow
                  key={i}
                  hover
                  onClick={() => {
                    this.offerClick(i);
                  }}
                >
                  <TableCell>{offerId}</TableCell>
                  <TableCell>{authId}</TableCell>
                  <TableCell>
                    {' '}
                    <Tooltip title="Delete">
                      <IconButton aria-label="Delete">
                        <DeleteIcon
                          onClick={e => {
                            e.stopPropagation();
                            this.deleteOfferClick(i);
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <OfferDialog
          open={this.state.offerDialogOpen}
          offer={this.state.selectedOffer}
          handleClose={this.handleOfferDialogClose}
        />
      </div>
    );
  }
}

export default withStyles(styles)(OffersTable);
