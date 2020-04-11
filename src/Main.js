import React from 'react';
import gsx2json from './Gsx2json.js';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      outfitTypes: [],
      attributes: ['Ac', 'Pa', 'Un', 'Sm', 'Te', 'Ch'],
      selCharas: new Set(), //query rows with select characters
      selOutfits: new Set(), //query rows with selected outfits
      selAttr: new Set(), //rows where selAttr > 0
    };
    this.toggleValueInSet = this.toggleValueInSet.bind(this);
  }

  componentDidMount() {
    fetch('https://spreadsheets.google.com/feeds/list/1JeHlN1zcBwyBbBkyfsDiiqDZpLotkn770ewa1JCsekU/4/public/values?alt=json')
      .then(res => res.json())
      .then(result => {
        const resultObj = gsx2json(result);
        //console.log(resultObj);
        this.setState({ characters: resultObj.columns.character, outfitTypes: resultObj.columns.outfittypes });
      })
  }

  toggleValueInSet() {
    return (setName) => {
      return (value) => {
        const newSet = this.state[setName];
        if (this.state[setName].has(value)) {
          newSet.delete(value);
        }
        else {
          newSet.add(value);
        }
        this.setState({ [setName]: newSet });
      }
    }
  }

  render() {
    const sidebarProps = {
      characters: this.state.characters,
      outfitTypes: this.state.outfitTypes,
      attributes: this.state.attributes,
      toggleValue: this.toggleValueInSet,
    }
    const outfitListProps = {
      query: Array.from(this.state.selCharas).concat(Array.from(this.state.selOutfits)),
      attr: this.state.selAttr,
    }
    return (
      <>
        <OutfitList {...outfitListProps} />
        <Sidebar {...sidebarProps} />
      </>
    )
  }
}

function Sidebar(props) {
  const toggleValue = props.toggleValue();
  return (
    <div className='sidebar'>
      <Options id='attrOpts' className='attrOpt' optionsArr={props.attributes} toggleValue={toggleValue('selAttr')} />
      <Options id='charaOpts' className='charaOpt' optionsArr={props.characters} toggleValue={toggleValue('selCharas')} />
      <Options id='outfitOpts' className='outfitOpt' optionsArr={props.outfitTypes} toggleValue={toggleValue('selOutfits')} />
    </div>
  )
}

function Options(props) {
  const options = props.optionsArr.map(function (option) {
    if (option) {
      return (
        <div key={option} className={props.className}>
          <input type='checkbox' name={option} onClick={() => props.toggleValue(option)} />
          <label htmlFor={option}>{option}</label>
        </div>
      )
    }
  });
  return <div className='options' id={props.id}>{options}</div>
}

class OutfitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { outfits: [] };
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query || this.props.attr !== prevProps.attr) {
      fetch('https://spreadsheets.google.com/feeds/list/1JeHlN1zcBwyBbBkyfsDiiqDZpLotkn770ewa1JCsekU/1/public/values?alt=json')
        .then(res => res.json())
        .then(res => {
          this.setState({ outfits: gsx2json(res, { query: this.props.query }).rows })
        });
      //const attrs = Array.from(this.props.attr)
    }
  }

  render() {
    const outfits = this.state.outfits.map((elt) => <Outfit key={elt.character + elt.outfit} props={elt} />);
    return <div className='outfitList'>{outfits}</div>
  }
}

function Outfit(props) {
  const properties = props.props;
  try {
    return (
      <div className='outfit'>
        <p>{properties.character}</p>
        <p>{properties.outfit}</p>
      </div>
    )
  }
  catch (err) {
    return null;
  }
}