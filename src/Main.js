import React from 'react';
import SideBar from './Sidebar.js';
import OutfitList from './OutfitList.js';
import { apiKey, spreadsheetId } from './sheetsCreds.js';
import { filterData, convertOutfitArraysToObjects } from './Gsx2json.js';

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoaded: false,
      data: null, //Array of Objects representing rows
      attr: ['Ac', 'Pa', 'Un', 'Sm', 'Te', 'Ch'],
      selAttr: new Set(), //rows where selAttr > 0
      isInclusive: false,
      view: 'card',
    };
    this.submitFilterSelection = this.submitFilterSelection.bind(this);
    this.calculateTotalBonus = this.calculateTotalBonus.bind(this);
    this.toggleSearchTypeTrue = this.toggleSearchTypeTrue.bind(this);
    this.toggleSearchTypeFalse = this.toggleSearchTypeFalse.bind(this);
  }

  componentDidMount() {
    console.log('Main componentDidMount')
    const sheetId = 'Stat Bonuses';
    //fetch info for sidebar
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetId}?key=${apiKey}`)
      .then(result => result.json())
      .then(result => {
        let data = result.values; //Array of Arrays representing sheet rows
        const newState = { isLoaded: true };
        data[0].forEach((arr) => { if (arr[0] !== 'ImageID') newState['sel' + arr[0]] = new Set() }) //Create set for each header to keep track of selected values
        newState.data = data;
        this.setState(newState);
      })
  }

  toggleSearchTypeTrue() {
    this.setState({ isInclusive: true })
  }

  toggleSearchTypeFalse() {
    this.setState({ isInclusive: false })
  }

  submitFilterSelection(filter) {
    return (value) => {
      console.log('submitFilterSelection', value)
      this.setState({ [filter]: value });
    }
  }

  calculateTotalBonus(outfits, attrSet) { //outfits is Array of Objects of each outfit info
    //console.log(outfits);
    console.log('Main calculateTotalBonus', attrSet);
    outfits.forEach(outfitObj => {
      let total = 0;
      Array.from(attrSet).forEach(attr => total += outfitObj[attr]);
      outfitObj['Total Bonus'] = total;
    });

    //outfits.sort((a, b) => { //sort from highest to lowest queried stat bonus
    //  let totalBonusA = 0;
    //  let totalBonusB = 0;
    //  for (let attr of this.props.selAttr) {
    //    totalBonusA += a[attr.toLowerCase()];
    //    totalBonusB += b[attr.toLowerCase()];
    //  }
    //  return totalBonusB - totalBonusA;
    //})
    return outfits;
  }

  sortByFilter(outfits, filter, isAscending = true) {
    if (filter === 'Total Bonus') {
      outfits.sort((a, b) => isAscending ? a[filter] - b[filter] : b[filter] - a[filter])
    }
  }

  render() {
    console.log('Main render');
    if (this.state.isLoaded) {
      const query = Object.keys(this.state).reduce((accumulator, key) => { //make Object of Sets that hold selected values
        const value = this.state[key];
        if (key.includes('sel') && key !== 'selAttr' && value.size > 0) { accumulator[key] = value; }
        return accumulator;
      }, {});
      const filteredData = filterData(this.state.data, { query: query, isInclusive: this.state.isInclusive });
      let outfits = convertOutfitArraysToObjects(filteredData);
      if (this.state.selAttr.size > 0) {
        outfits = this.calculateTotalBonus(outfits, this.state.selAttr);
        this.sortByFilter(outfits, 'Total Bonus', false);
      }
      const queryStr = Object.keys(this.state).reduce((accumulator, key) => {
        const value = this.state[key];
        if (key.includes('sel') && value.size > 0) { 
          accumulator += key + ':' + Array.from(value) + ' '; 
        }
        return accumulator;
      }, '');
      //console.log(queryStr);
      const outfitListProps = {
        key: queryStr,
        query: query,
        outfits: outfits,
        view: this.state.view,
        status: `${outfits.length} outfits found`,
        attr: this.state.attr,
        selAttr: this.state.selAttr,
      }
      const sidebarProps = {
        attr: this.state.attr,
        data: filteredData,
        submitFilterSelection: this.submitFilterSelection,
        toggleTrue: this.toggleSearchTypeTrue,
        toggleFalse: this.toggleSearchTypeFalse,
      }
      const mergedObj = { ...sidebarProps, ...query };
      return (
        <>
          <SideBar {...mergedObj} />
          <OutfitList {...outfitListProps} />
        </>
      )
    }
    else return <p>Loading</p>;
  }
}