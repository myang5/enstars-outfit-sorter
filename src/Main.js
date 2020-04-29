import React from 'react';
import TeamBuilder from './TeamBuilder.js'
import SideBar from './Sidebar.js';
import OutfitList from './OutfitList.js';
import { apiKey, spreadsheetId } from './sheetsCreds.js';
import { filterData, convertArraysToObjects } from './Gsx2json.js';

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      jobData: null,
      attr: ['Ac', 'Pa', 'Un', 'Sm', 'Te', 'Ch'],
      selAttr: new Set(),
      isInclusive: false,
      view: 'card',
    };
    this.prepareOutfitData = this.prepareOutfitData.bind(this)
    this.submitFilterSelection = this.submitFilterSelection.bind(this);
    this.calculateTotalBonus = this.calculateTotalBonus.bind(this);
    this.toggleSearchTypeTrue = this.toggleSearchTypeTrue.bind(this);
    this.toggleSearchTypeFalse = this.toggleSearchTypeFalse.bind(this);
  }

  componentDidMount() {
    console.log('Main componentDidMount')
    const sheetId = 'Stat Bonuses';
    //fetch info for Sidebar
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetId}?key=${apiKey}`)
      .then(result => result.json())
      .then(result => {
        let data = result.values; //Array of Arrays representing sheet rows
        const newState = {};
        data[0].forEach((arr) => { if (arr[0] !== 'ImageID') newState['sel' + arr[0]] = new Set() }) //Create set for each header to keep track of selected values
        newState.data = data;
        this.setState(newState);
      })
    const nextSheetId = 'Jobs';
    //fetch info for TeamBuilder
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${nextSheetId}?key=${apiKey}`)
      .then(result => result.json())
      .then(result => {
        let data = result.values; //Array of Arrays representing sheet rows
        this.setState({ jobData: data });
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

  prepareOutfitData(data, queryConfig) {
    const filteredData = filterData(data, queryConfig);
    let outfits = convertArraysToObjects(filteredData);
    if (this.state.selAttr.size > 0) {
      outfits = this.calculateTotalBonus(outfits, this.state.selAttr);
      this.sortByFilter(outfits, 'Total Bonus', false);
    }
    return outfits;
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
    if (this.state.data && this.state.jobData) {
      const query = Object.keys(this.state).reduce((accumulator, key) => { //make Object of Sets that hold selected values
        const value = this.state[key];
        if (key.includes('sel') && key !== 'selAttr' && value.size > 0) { accumulator[key] = value; }
        return accumulator;
      }, {});
      let queryStr = Object.keys(this.state).reduce((accumulator, key) => {
        const value = this.state[key];
        if (key.includes('sel') && value.size > 0) {
          accumulator += key + ':' + Array.from(value) + ' ';
        }
        return accumulator;
      }, '');
      queryStr += `isInclusive: ${this.state.isInclusive}`
      const outfits = this.prepareOutfitData(this.state.data, { query: query, isInclusive: this.state.isInclusive })
      const jobs = convertArraysToObjects(this.state.jobData);
      const teamBuilderProps = {
        jobs: jobs,
        attr: this.state.attr,
      }
      const outfitListProps = {
        key: queryStr,
        queryStr: queryStr,
        query: query,
        outfits: outfits,
        view: this.state.view,
        status: `${outfits.length} outfits found`,
        attr: this.state.attr,
        selAttr: this.state.selAttr,
      }
      const sidebarProps = {
        attr: this.state.attr,
        data: this.state.data,
        submitFilterSelection: this.submitFilterSelection,
        toggleTrue: this.toggleSearchTypeTrue,
        toggleFalse: this.toggleSearchTypeFalse,
      }
      return (
        <>
          <TeamBuilder {...teamBuilderProps} />
          <div id='bottomContainer'>
            <SideBar {...sidebarProps} />
            <OutfitList {...outfitListProps} />
          </div>

        </>
      )
    }
    else return null;
  }
}