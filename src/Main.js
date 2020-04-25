import React from 'react';
import FilterBar from './FilterBar.js';
import OutfitList from './OutfitList.js';
import { apiKey, spreadsheetId } from './sheetsCreds.js';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [],
      units: [],
      outfitTypes: [],
      outfitTiers: ['Tier I', 'Tier II', 'Tier III'],
      attributes: ['Ac', 'Pa', 'Un', 'Sm', 'Te', 'Ch'],
      selCharas: new Set(),
      selOutfits: new Set(), 
      selUnits: new Set(), 
      selTiers: new Set(),
      selAttr: new Set(), //rows where selAttr > 0
      isInclusive: false,
    };
    this.toggleValueInSet = this.toggleValueInSet.bind(this);
    this.toggleSearchTypeTrue = this.toggleSearchTypeTrue.bind(this);
    this.toggleSearchTypeFalse = this.toggleSearchTypeFalse.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
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

  toggleSearchTypeTrue () {
    this.setState({isInclusive: true})
  }

  toggleSearchTypeFalse () {
    this.setState({isInclusive: false})
  }

  toggleValueInSet() {
    return (filter) => {
      return (value) => {
        const newSet = this.state[filter];
        if (this.state[filter].has(value)) {
          newSet.delete(value);
        }
        else {
          newSet.add(value);
        }
        console.log(newSet);
        this.setState({ [filter]: newSet });
      }
    }
  }

  clearFilter(filter) {
    return () => this.setState( {[filter]: new Set()})
  }

  render() {
    //console.log('render main component', performance.now())
    const sidebarProps = {
      characters: this.state.characters, //render selects and attributes check boxes
      outfitTypes: this.state.outfitTypes,
      units: this.state.units,
      outfitTiers: this.state.outfitTiers,
      attributes: this.state.attributes,
      selAttr: this.state.selAttr, //needed to toggle checkboxes
      selTiers: this.state.selTiers,
      selCharas: this.state.selCharas, //needed to render ToggleButtons
      selOutfits: this.state.selOutfits,
      selUnits: this.state.selUnits,
      toggleValue: this.toggleValueInSet,
      toggleTrue: this.toggleSearchTypeTrue,
      toggleFalse: this.toggleSearchTypeFalse,
      clearFilter: this.clearFilter,
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
      selAttr: this.state.selAttr,
      isInclusive: this.state.isInclusive,
    }
    return (
      <>
        <FilterBar {...sidebarProps} />
        {/*<OutfitList {...outfitListProps} />*/}
      </>
    )
  }
}