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
    this.onScrollThrottled = throttle(this.onScroll, 100);
    this.toggleSidebar = () => {
      document.querySelector('#sidebar').classList.toggle('toggledOn');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      // console.log(this.props.stringQuery);
      this.setState({ status: 'Loading...' }, () => {
        const sheetId = 'Stat Bonuses';
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetId}?key=${apiKey}`)
          .then(res => res.json())
          .then(res => {
            let outfits = filterGsData(res, { query: this.props.stringQuery, isInclusive: this.props.isInclusive }); //all outfits that match character/outfit (inclusive)
            // console.log(outfits);
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
            return { outfits: outfits, loadedOutfits: [], status: `${outfits.length} outfits found` }
          })
          .then(res => { this.setState(res, this.loadOutfits) });
      });
    }
  }

  //modified from this tutorial: https://alligator.io/react/react-infinite-scroll/
  //and also this https://blog.bitsrc.io/improve-your-react-app-performance-by-using-throttling-and-debouncing-101afbe9055
  onScroll(event) {
    event.persist() //didn't work without this 

    // Bails early if:
    // * it's already loading
    // * there's nothing left to load
    // console.log(this.state.isLoading, this.state.hasMore);
    if (this.state.isLoading || !this.state.hasMore) { return; }

    // Checks that the page has scrolled to the bottom
    if (event.target) {
      if (window.innerHeight + event.target.scrollTop >= event.target.scrollHeight - 600) {
        // console.log('loading more');
        this.loadOutfits();
      }
    }
  }

  loadOutfits() {
    this.setState({ isLoading: true }, () => {
      this.setState((state, props) => {
        // console.log('initial loaded outfits', state.loadedOutfits);
        let loadedOutfits = state.loadedOutfits;
        loadedOutfits = loadedOutfits.concat(state.outfits.slice(state.loadedOutfits.length, state.loadedOutfits.length + state.outfitsToLoad));
        const hasMore = loadedOutfits.length < state.outfits.length;
        // console.log('after loadOutfits', loadedOutfits);
        return { hasMore: hasMore, isLoading: false, loadedOutfits: loadedOutfits };
      });
    })
  }

  render() {
    const outfits = this.state.loadedOutfits.map((elt) =>
      <Outfit key={elt.character + elt.outfit} props={elt} attributes={this.props.attributes} selAttr={this.props.selAttr} />
    );
    // console.log('finished loading outfit list', performance.now())
    return (
      <div className='pageContent' onScroll={this.onScrollThrottled}>
        <div id='toggleSidebarBtn' onClick={this.toggleSidebar}></div>
        <p className='status'>{this.state.status}</p>
        <div id='outfitList'>{outfits}</div>
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
      <div className='rowContainer'>
        <OutfitImage imageUrl={properties.imageurl} />
        <AttrList attributes={props.attributes} props={props.props} />
      </div>
      {totalBonus()}
    </div>
  )
}

function AttrList(props) {
  return (
    <>
      {Object.keys(props.props).map(key => { //display all attributes
        if (props.attributes.includes(key.charAt(0).toUpperCase() + key.slice(1))) {
          return <p className='attr' key={key + props.props[key]}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${props.props[key]}`}</p>
        }
      })
      }
    </>
  )
}

function OutfitImage(props) {
  // props link looks like this https://drive.google.com/open?id=IMAGE_ID
  // or it could look like this https://drive.google.com/file/d/IMAGE_ID/view?usp=drivesdk
  // need to change it to be https://drive.google.com/uc?export=view&id=IMAGE_ID
  let imageUrl = null;
  // console.log(props.imageUrl);
  if (props.imageUrl) {
    if (props.imageUrl.match(/https:\/\/drive.google.com\/file\/d\/.+\/view\?usp=drivesdk/)) {
      imageUrl = props.imageUrl.replace('/view?usp=drivesdk', '');
      imageUrl = imageUrl.replace('file/d/', 'uc?export=view&id=');
    }
    else if (props.imageUrl.match(/https:\/\/drive.google.com\/open\?id=.+/)) {
      imageUrl = props.imageUrl.replace('open?', 'uc?export=view&');
    }
  }
  return <img className='outfitImg' src={imageUrl} />
}
