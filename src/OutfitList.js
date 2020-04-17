import React from 'react';
import gsx2json from './Gsx2json.js';

export default class OutfitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      outfits: [],
      status: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      fetch('https://spreadsheets.google.com/feeds/list/1JeHlN1zcBwyBbBkyfsDiiqDZpLotkn770ewa1JCsekU/1/public/values?alt=json')
        .then(res => res.json())
        .then(res => {
          this.setState((state, props) => {
            let outfits = gsx2json(res, { query: this.props.stringQuery }).rows; //all outfits that match character/outfit (inclusive)
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
            return { isLoaded: true, outfits: outfits, status: `${outfits.length} outfits found` }
          })
        });
    }
  }

  render() {
    let body = null;
    if (!this.state.isLoaded) {
      body = <p className='status'>Loading...</p>
    } else {
      const outfits = this.state.outfits.map((elt) =>
        <Outfit key={elt.character + elt.outfit} props={elt} attributes={this.props.attributes} selAttr={this.props.selAttr} />
      );
      body = (<><p className='status'>{this.state.status}</p>{outfits}</>)
    }
    return (
      <div className='outfitList'>
        {body}
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
