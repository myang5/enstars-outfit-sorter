import React from 'react';
import throttle from 'lodash.throttle';
import { Image, AttrList } from './Main.js';

export default class OutfitList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      isLoading: false,
      hasMore: true,
      loadedOutfits: [],
      outfitsToLoad: 30,
    };
    this.onScroll = this.onScroll.bind(this);
    this.loadOutfits = this.loadOutfits.bind(this);
    this.onScrollThrottled = throttle(this.onScroll, 100);
    this.toggleSidebar = () => {
      document.querySelector('#sidebar').classList.toggle('toggledOn');
    }
  }

  componentDidMount() {
    //console.log('OutfitList componentDidMount')
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
    //console.log(this.props);
    const outfits = this.state.loadedOutfits.map((elt) =>
      !this.props.teamMembers.includes(elt) ?
        <OutfitCard key={elt.Character + elt.Outfit + elt['Total Bonus']}
          info={elt}
          selAttr={this.props.selAttr}
          setMember={this.props.setMember} /> :
        null
    );
    //console.log('finished loading outfit list', performance.now())
    let placeholders = [];
    for (let i = 0; i < 4; i++) {
      placeholders.push(<div key={i} className="outfit-placeholder"></div>)
    }
    //console.log('OutfitList render');
    return (
      <div id='outfitView' onScroll={this.onScrollThrottled}>
        <div id='outfitList' className={this.props.view}>
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
  const cls = 'outfitCard' + (props.info.hasOwnProperty('Made') ? (!props.info['Made'] ? ' notMade' : '') : '');
  const attrListProps = { attr: props.selAttr, statusBarWidth: 4.2, maxValue: 300 }
  if (props['AddedStat']) { attrListProps.value = props.info }
  else { attrListProps.bonus = props.info }
  return (
    <div className={cls} onClick={() => props.setMember(props.info)}>
      <p>{props.info['Character']}</p>
      <p>{props.info['Outfit']}</p>
      <hr />
      <div className='rowContainer'>
        <Image obj={props.info} alt={`${props.info['Character']} ${props.info['Outfit']}`} />
        <AttrList {...attrListProps} />
      </div>
      {('Total Bonus' in props.info) && <span>{`TOTAL BONUS: ${props.info['Total Bonus']}`}</span>}
    </div>
  )
}

//function OutfitRow(props) {
//  return (
//    <>
//      {Object.keys(props.info).map(key => {
//        if (key !== 'ImageID') {
//          return (
//            <div key={key} className='outfitCell'>
//              <p>{props.info[key]}</p>
//            </div>
//          )
//        }
//      })}
//    </>
//  )
//}
