import React from 'react';
import gsx2json from './Gsx2json.js';
import Sidebar from './Sidebar.js';
import OutfitList from './OutfitList.js';

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
      return (event) => {
        const newSet = this.state[setName];
        if (this.state[setName].has(event.target.value)) {
          newSet.delete(event.target.value);
        }
        else {
          newSet.add(event.target.value);
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
      selCharas: this.state.selCharas,
      selOutfits: this.state.selOutfits,
      toggleValue: this.toggleValueInSet,
    }
    const outfitListProps = {
      query: Array.from(this.state.selCharas).concat(Array.from(this.state.selOutfits), Array.from(this.state.selAttr)),
      stringQuery: Array.from(this.state.selCharas).concat(Array.from(this.state.selOutfits)),
      attributes: this.state.attributes,
      selCharas: this.state.selCharas,
      selOutfits: this.state.selOutfits,
      selAttr: this.state.selAttr,
    }
    return (
      <>
        <OutfitList {...outfitListProps} />
        <Sidebar {...sidebarProps} />
      </>
    )
  }
}