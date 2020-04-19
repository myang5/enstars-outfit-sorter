import React from 'react';
import Sidebar from './Sidebar.js';
import OutfitList from './OutfitList.js';
import { apiKey, spreadsheetId } from './sheetsCreds.js';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      outfitTypes: [],
      units: [],
      attributes: ['Ac', 'Pa', 'Un', 'Sm', 'Te', 'Ch'],
      selCharas: new Set(), //query rows with select characters
      selOutfits: new Set(), //query rows with selected outfits
      selUnits: new Set(), //rows where selAttr > 0
      selAttr: new Set(), //rows where selAttr > 0
      isInclusive: false,
    };
    this.toggleValueInSet = this.toggleValueInSet.bind(this);
    this.toggleSearchTypeTrue = this.toggleSearchTypeTrue.bind(this);
    this.toggleSearchTypeFalse = this.toggleSearchTypeFalse.bind(this);
  }

  componentDidMount() {
    const sheetId = 'Validation Lists';
    //fetch info for sidebar
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetId}?key=${apiKey}&majorDimension=COLUMNS`)
      .then(result => result.json())
      .then(result => {
        const resultObj = result.values;
        const characters = resultObj.filter((arr) => arr[0] === 'Character');
        const outfitTypes = resultObj.filter((arr) => arr[0] === 'Outfit Type');
        const units = resultObj.filter((arr) => arr[0] === 'Unit');
        this.setState({ characters: characters[0], outfitTypes: outfitTypes[0], units: units[0] });
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

  toggleSearchTypeTrue () {
    this.setState({isInclusive: true})
  }

  toggleSearchTypeFalse () {
    this.setState({isInclusive: false})
  }

  render() {
    console.log('render main component', performance.now())
    const sidebarProps = {
      characters: this.state.characters,
      outfitTypes: this.state.outfitTypes,
      units: this.state.units,
      attributes: this.state.attributes,
      selCharas: this.state.selCharas,
      selOutfits: this.state.selOutfits,
      selUnits: this.state.selUnits,
      toggleValue: this.toggleValueInSet,
      toggleTrue: this.toggleSearchTypeTrue,
      toggleFalse: this.toggleSearchTypeFalse,
    }
    const query = Object.keys(this.state).reduce((accumulator, key) => { //concat values in Sets that hold selected values
      const field = this.state[key];
      if (!Array.isArray(field)) { return accumulator.concat(Array.from(field)); }
      else return accumulator.concat([]);
    }, []);
    query.push(this.state.isInclusive);
    const stringQuery = Object.keys(this.state).reduce((accumulator, key) => { //create array of Sets that hold selected values
      const field = this.state[key];
      if (!Array.isArray(field) && typeof(field) === 'object' && key !== 'selAttr' && field.size > 0) {accumulator.push(field); return accumulator}
      else return accumulator;
    }, []);
    const outfitListProps = {
      query: query,
      stringQuery: stringQuery,
      attributes: this.state.attributes,
      selCharas: this.state.selCharas,
      selOutfits: this.state.selOutfits,
      selUnits: this.state.selUnits,
      selAttr: this.state.selAttr,
      isInclusive: this.state.isInclusive,
    }
    return (
      <>
        <OutfitList {...outfitListProps} />
        <Sidebar {...sidebarProps} />
      </>
    )
  }
}