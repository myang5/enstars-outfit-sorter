import React from 'react';
import Sidebar from './Sidebar.js';
import OutfitList from './OutfitList.js';
import {apiKey, spreadsheetId} from './sheetsCreds.js';

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
    const sheetId = 'Validation Lists';
    //fetch info for sidebar
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetId}?key=${apiKey}&majorDimension=COLUMNS`)
      .then(result => result.json())
      .then(result => {
        //console.log(result);
        const resultObj = result.values;
        const characters = resultObj.filter((arr) => arr[0] === 'Character');
        const outfitTypes = resultObj.filter((arr) => arr[0] === 'Outfit Type');
        this.setState({ characters: characters[0], outfitTypes: outfitTypes[0] });
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