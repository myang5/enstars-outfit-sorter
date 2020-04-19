import React from 'react';
import filterGsData from './Gsx2json.js';
import { apiKey, spreadsheetId } from './sheetsCreds.js';
import throttle from 'lodash.throttle';

export default class OutfitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      hasMore: true,
      status: '',
      outfits: [],
      loadedOutfits: [],
      outfitsToLoad: 20,
    };
    this.onScroll = this.onScroll.bind(this);
    this.loadOutfits = this.loadOutfits.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.setState({ status: 'Loading...' }, () => {
        const sheetId = 'Stat Bonuses';
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetId}?key=${apiKey}`)
          .then(res => res.json())
          .then(res => {
            let outfits = filterGsData(res, { query: this.props.stringQuery, isInclusive: this.props.isInclusive }); //all outfits that match character/outfit (inclusive)
            //console.log(outfits);
            if (this.props.selAttr.size > 0) {
              for (let i = outfits.length - 1; i >= 0; i--) {
                let queried = false;
                for (let attr of this.props.selAttr) {
                  if (outfits[i][attr.toLowerCase()]) { //inclusive search by attr
                    queried = true;
                    break;
                  }
                  // if (!outfits[i][attr.toLowerCase()]) { //currently only keeps outfits that meet all attr criteria (exclusive)
                  //   outfits.splice(i, 1);
                  //   break;
                  // }
                }
                if (!queried) outfits.splice(i, 1);
              }
            }
            outfits.sort((a, b) => { //sort from highest to lowest queried stat bonus
              let totalBonusA = 0;
              let totalBonusB = 0;
              for (let attr of this.props.selAttr) {
                totalBonusA += a[attr.toLowerCase()];
                totalBonusB += b[attr.toLowerCase()];
              }
              return totalBonusB - totalBonusA;
            })
            return { outfits: outfits, loadedOutfits: outfits.slice(0, this.state.outfitsToLoad), status: `${outfits.length} outfits found` }
          })
          .then(res => this.setState(res));
      });
    }
  }

  //modified from this tutorial: https://alligator.io/react/react-infinite-scroll/
  onScroll(event) {
      const {
        state: {
          isLoading,
          hasMore,
        },
      } = this;

      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (isLoading || !hasMore) { console.log('not loadin'); return; }

      // Checks that the page has scrolled to the bottom
      if (
        window.innerHeight + event.target.scrollTop
        >= event.target.scrollHeight - 500
      ) {
        console.log('loading more');
        this.loadOutfits();
      }
  }

  loadOutfits() {
    this.setState({ isLoading: true }, () => {
      this.setState((state, props) => {
        // console.log(state.outfits.slice(state.loadedOutfits.length, state.outfitsToLoad));
        // console.log()
        let loadedOutfits = state.loadedOutfits;
        loadedOutfits = loadedOutfits.concat(state.outfits.slice(state.loadedOutfits.length, state.loadedOutfits.length + state.outfitsToLoad));
        const hasMore = loadedOutfits.length < state.outfits.length;
        return { hasMore: hasMore, isLoading: false, loadedOutfits: loadedOutfits  };
      });
    })
  }

  render() {
    const outfits = this.state.loadedOutfits.map((elt) =>
      <Outfit key={elt.character + elt.outfit} props={elt} attributes={this.props.attributes} selAttr={this.props.selAttr} />
    );
    // console.log('finished loading outfit list', performance.now())
    return (
      <div className='outfitList' onScroll={this.onScroll}>
        <p className='status'>{this.state.status}</p>
        {outfits}
        {!this.state.hasMore &&
          <p className='status'>End of results</p>
        }
      </div>
    )
  }
}

function Outfit(props) {
  const properties = props.props;
  // const attr = Object.keys(properties).map(key => { //display all attributes
  //   if (props.attributes.includes(key.charAt(0).toUpperCase() + key.slice(1))) {
  //     return <span key={key + properties[key]}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${properties[key]}`}</span>
  //   }
  // });
  const totalBonus = () => { //display total bonus of queried attrs if any have been queried
    if (props.selAttr.size > 0) {
      const total = Array.from(props.selAttr)
        .reduce((accumulator, currVal) => accumulator + properties[currVal.toLowerCase()], 0);
      return <span>{`TOTAL BONUS: ${total}`}</span>;
    }
    else return null;
  }
  return (
    <div className='outfit'>
      <span>{`${properties.character} - ${properties.outfit}`}</span>
      <hr />
      <AttrList attributes={props.attributes} props={props.props} />
      {totalBonus()}
    </div>
  )
}

function AttrList(props) {
  return (
    <div className='attrList'>
      {Object.keys(props.props).map(key => { //display all attributes
        if (props.attributes.includes(key.charAt(0).toUpperCase() + key.slice(1))) {
          return <span key={key + props.props[key]}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${props.props[key]}`}</span>
        }
      })
      }
    </div>
  )
}
