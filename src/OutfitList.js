import React from 'react';
import throttle from 'lodash.throttle';

export default class OutfitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      hasMore: true,
      loadedOutfits: [],
      outfitsToLoad: 40,
    };
    this.onScroll = this.onScroll.bind(this);
    this.loadOutfits = this.loadOutfits.bind(this);
    this.onScrollThrottled = throttle(this.onScroll, 100);
    this.toggleSidebar = () => {
      document.querySelector('#sidebar').classList.toggle('toggledOn');
    }
  }

  componentDidMount() {
    console.log('OutfitList componentDidMount');
    this.loadOutfits();
  }

  //modified from this tutorial: https://alligator.io/react/react-infinite-scroll/
  //and also this https://blog.bitsrc.io/improve-your-react-app-performance-by-using-throttling-and-debouncing-101afbe9055
  onScroll(event) {
    event.persist() //didn't work without this 

    //Bails early if:
    //* it's already loading
    //* there's nothing left to load
    //console.log(this.state.isLoading, this.state.hasMore);
    if (this.state.isLoading || !this.state.hasMore) { return; }

    //Checks that the page has scrolled to the bottom
    if (event.target) {
      if (window.innerHeight + event.target.scrollTop >= event.target.scrollHeight - 600) {
        //console.log('loading more');
        this.loadOutfits();
      }
    }
  }

  loadOutfits() {
    this.setState({ isLoading: true }, () => {
      this.setState((state, props) => {
        let loadedOutfits = state.loadedOutfits;
        loadedOutfits = loadedOutfits.concat(props.outfits.slice(state.loadedOutfits.length, state.loadedOutfits.length + state.outfitsToLoad));
        const hasMore = loadedOutfits.length < props.outfits.length;
        //console.log('after loadOutfits', loadedOutfits);
        return { hasMore: hasMore, isLoading: false, loadedOutfits: loadedOutfits };
      });
    })
  }

  render() {
    const outfits = this.state.loadedOutfits.map((elt) =>
      this.props.view === 'sheet' ?
        <OutfitRow key={elt.Character + elt.Outfit + elt['Total Bonus']} info={elt} /> :
        <OutfitCard key={elt.Character + elt.Outfit + elt['Total Bonus']} info={elt} attr={this.props.attr} selAttr={this.props.selAttr} />
    );
    //console.log('finished loading outfit list', performance.now())
    let placeholders = [];
    for (let i = 0; i < 4; i++) {
      placeholders.push(<div key={i} className="outfit-placeholder"></div>)
    }
    console.log('OutfitList render');
    //console.log('loaded Outfits', this.state.loadedOutfits)
    return (
      <div id='outfitView' onScroll={this.onScrollThrottled}>
        <div id='toggleSidebarBtn' onClick={this.toggleSidebar}></div>
        {this.props.view === 'card' && <p className='status'>{this.props.status}</p>}
        <div key={this.props.queryStr} id='outfitList' className={this.props.view}>
          {outfits}
          {this.props.view === 'card' && placeholders}
        </div>
        {!this.state.hasMore && this.props.view === 'card' &&
          <p className='status'>End of results</p>
        }
      </div>
    )
    //return (
    //  <div className={'outfitView ' + this.props.view} onScroll={this.onScrollThrottled}>
    //    {/*<div id='toggleSidebarBtn' onClick={this.toggleSidebar}></div>*/}
    //    {this.props.view === 'card' && <p className='status'>{this.props.status}</p>}
    //    <div id='outfitList'>
    //      {outfits}
    //      {placeholders}
    //    </div>
    //    {!this.state.hasMore && this.props.view === 'card' &&
    //      <p className='status'>End of results</p>
    //    }
    //  </div>
    //)
  }
}

function OutfitCard(props) {
  return (
    <div className='outfitCard'>
      <p>{props.info['Character']}</p>
      <p>{props.info['Outfit']}</p>
      <hr />
      <div className='rowContainer'>
        <OutfitImage imageId={props.info['ImageID']} />
        <AttrList attr={props.attr} info={props.info} />
      </div>
      {('Total Bonus' in props.info) && <span>{`TOTAL BONUS: ${props.info['Total Bonus']}`}</span>}
    </div>
  )
}

function OutfitRow(props) {
  return (
    <>
      {Object.keys(props.info).map(key => {
        if (key !== 'ImageID') {
          return (
            <div key={key} className='outfitCell'>
              <p>{props.info[key]}</p>
            </div>
          )
        }
      })}
    </>
  )
}

function AttrList(props) {
  const statusBarWidth = 4.2;
  return (
    <div className='attrList'>
      {props.attr.map(attr => { //display all attributes
          return (
            <div className='attr' key={attr + props.info[attr]}>
              <span className={'icon ' + attr.toLowerCase()}>{attr}</span>
              <span className='numberText'>{'+' + props.info[attr]}</span>
              <span className='statusBarContainer' style={{ width: `${statusBarWidth}rem` }}>
                <span className={'statusBar ' + attr.toLowerCase()}
                  style={{ width: `${props.info[attr] / 300 * statusBarWidth}rem` }} />
              </span>
            </div>
          )
        })}
    </div>
  )
}

function OutfitImage(props) {
  //OLD METHOD, OutfitImage should now receive the image id directly
  //props link looks like this https://drive.google.com/open?id=IMAGE_ID
  //or it could look like this https://drive.google.com/file/d/IMAGE_ID/view?usp=drivesdk
  //or it could look like this https://drive.google.com/file/d/IMAGE_ID/view
  //need to change it to be    https://drive.google.com/thumbnail?&id=IMAGE_ID
  let imageUrl = null;
  if (props.imageId && props.imageId.toLowerCase() !== 'missing') {
    imageUrl = 'https://drive.google.com/thumbnail?&id=' + props.imageId
    return <img className='outfitImg' src={imageUrl} />
  }
  else return <div className='outfitImg'>Image N/A</div>
}
