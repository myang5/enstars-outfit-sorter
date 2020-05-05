import React from 'react';
import { TeamView, JobViewContainer } from './TeamBuilder.js'
import SideBar from './Sidebar.js';
import OutfitList from './OutfitList.js';
import { apiKey, spreadsheetId } from './sheetsCreds.js';
import { filterData, convertArraysToObjects } from './Gsx2json.js';

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      allOutfits: null, //Array of Obj of all outfit rows in database spreadsheet
      userOutfits: null, //Array of Obj of user outfit rows, null when user has no data/removes their data
      outfits: null, //Outfits to display after allOutfits or userOutfits has been filtered
      userSheetId: null,
      jobs: null, //Array of Obj of all job rows in database spreadsheet
      attr: ['Ac', 'Pa', 'Un', 'Sm', 'Te', 'Ch'],
      filters: null, //Array of headers for each column to filter by
      selAttr: [], //Array of  strings from attr matching relevant attributes
      isInclusive: false,
      view: 'card',
      isOutfitList: false,
      activeJob: null,
      teamMembers: [],
      teamSlot: null, //Store index of teamMember user is currently choosing
    };
    this.prepareOutfitData = this.prepareOutfitData.bind(this)
    this.submitFilterSelection = this.submitFilterSelection.bind(this);
    this.calculateTotalBonus = this.calculateTotalBonus.bind(this);
    this.toggleSearchTypeTrue = this.toggleSearchTypeTrue.bind(this);
    this.toggleSearchTypeFalse = this.toggleSearchTypeFalse.bind(this);
    this.toggleMade = this.toggleMade.bind(this);
    this.sortByFilter = this.sortByFilter.bind(this);
    this.sortOutfits = this.sortOutfits.bind(this);
    this.toggleOutfitList = this.toggleOutfitList.bind(this);
    this.selectJob = this.selectJob.bind(this);
    this.setMember = this.setMember.bind(this);
    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {
    console.log('Main componentDidMount')
    const nextSheetId = 'Jobs';
    //fetch info for TeamBuilder
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${nextSheetId}?key=${apiKey}`)
      .then(result => result.json())
      .then(result => {
        let data = result.values; //Array of Arrays representing sheet rows
        const jobs = convertArraysToObjects(data);
        this.setState({ jobs: jobs });
        let i = 0;
        while (jobs[i]['Type'] !== 'Beginner') { i++; }
        this.selectJob(jobs[i]);
      })
      .then(() => {
        const sheetId = 'Stat Bonuses';
        //fetch info for Sidebar
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetId}?key=${apiKey}`)
          .then(result => result.json())
          .then(result => {
            let data = result.values; //Array of Arrays representing sheet rows
            const newState = {};
            const filters = []
            data[0].forEach((arr) => { if (arr !== 'ImageID' && !this.state.attr.includes(arr)) { filters.push(arr); newState['sel' + arr] = new Set() } }) //Create set for each header to keep track of selected values
            const outfits = convertArraysToObjects(data);
            newState.allOutfits = outfits;
            newState.outfits = this.prepareOutfitData(outfits, this.state);
            newState.filters = filters;
            this.setState(newState);
          })
      })
  }

  toggleOutfitList(index = null) {
    //console.log('toggleOutfitList', index);
    this.setState((state) => {
      const newState = { isOutfitList: !state.isOutfitList, teamSlot: index }
      return newState;
    });
  }

  selectJob(job) {
    console.log('SelectJob', job);
    if (this.state.activeJob !== job) {
      const newState = {
        activeJob: job,
        teamMembers: new Array(job['Idol Slots']).fill(0),
      }
      const outfitSource = this.state.userOutfits ? this.state.userOutfits : this.state.allOutfits;
      newState.selAttr = Object.keys(job).filter(key => this.state.attr.includes(key) && job[key] > 0);
      if (this.state.outfits) { newState.outfits = this.prepareOutfitData(outfitSource, newState); }
      this.setState(newState);
    }
  }

  setMember(newMember) {
    this.setState((state, props) => {
      let newTeam = state.teamMembers.slice();
      let index = state.teamSlot;
      //can't have same chara on team twice
      //assume if user chooses outfit for chara on team they are changing their outfit
      for (let i = 0; i < newTeam.length; i++) {
        if (newMember['Character'] === newTeam[i]['Character']) { index = i; break; }
      }
      newTeam[index] = newMember;
      return { teamMembers: newTeam, isOutfitList: false };
    })
  }

  toggleSearchTypeTrue() {
    this.setState({ isInclusive: true })
  }

  toggleSearchTypeFalse() {
    this.setState({ isInclusive: false })
  }

  toggleMade() {
    let newMade = null;
    if (this.state.selMade.size === 0) {
      newMade = new Set([true]);
    } else newMade = new Set()
    this.submitFilterSelection('selMade')(newMade);
  }

  submitFilterSelection(filter) {
    return (value) => {
      console.log('submitFilterSelection', value)
      this.setState((state) => {
        let newState = { ...state };
        newState[filter] = value;
        const outfitSource = newState.userOutfits ? newState.userOutfits : newState.allOutfits;
        const outfits = this.prepareOutfitData(outfitSource, newState)
        newState.outfits = outfits;
        return newState;
      });
    }
  }

  //returns Object with query and conditions given passed-in state
  getQueryAndConditions(state) {
    const query = Object.keys(state).reduce((accumulator, key) => { //make Object of Sets that hold selected values
      const value = state[key];
      if (key.includes('sel') && key !== 'selAttr' && value.size > 0) { accumulator[key] = value; }
      return accumulator;
    }, {});
    //console.log(query);
    const conditions = state.activeJob ?
      state.activeJob['Conditions'] ? state.activeJob['Conditions'].split(',').map(str => str.trim()) : []
      : [];
    return { query: query, conditions: conditions };
  }

  //filter outfits based on any selected queries and conditions in activeJob
  //calculate total bonus for selected attributes
  //sort outfits in descending order by total bonus
  //return outfit Obj of Arrays
  prepareOutfitData(data, state) {
    let queryConfig = this.getQueryAndConditions(state);
    queryConfig.isInclusive = state.isInclusive;
    let outfits = filterData(data, queryConfig);
    if (state.selAttr.length > 0) {
      outfits = this.calculateTotalBonus(outfits, state.selAttr);
      this.sortByFilter(outfits, 'Total Bonus', false);
    }
    //console.log('prepareOutfitData', selAttr)
    return outfits;
  }

  calculateTotalBonus(outfits, attrSet) { //outfits is Array of Objects of each outfit info
    //console.log('Main calculateTotalBonus', attrSet);
    outfits.forEach(outfitObj => {
      let total = 0;
      attrSet.forEach(attr => total += outfitObj[attr]);
      outfitObj['Total Bonus'] = total;
    });
    return outfits;
  }

  sortByFilter(outfits, filter, isAscending = true) {
    outfits.sort((a, b) => isAscending ? a[filter] - b[filter] : b[filter] - a[filter])
  }

  sortOutfits(filter, isAscending) {
    this.setState((state, props) => {
      let outfits = [...state.outfits];
      this.sortByFilter(outfits, filter, isAscending);
      //console.log('sortOutfits', filter, outfits);
      return { outfits: outfits }
    })
  }

  getUserData(url) {
    if (url.length > 0) {
      //url format: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/possible-extra-content
      let urlStr = url.replace('https://docs.google.com/spreadsheets/d/', '');
      const sheetId = urlStr.indexOf('/') > 0 ? urlStr.slice(0, urlStr.indexOf('/')) : urlStr;
      console.log(sheetId);
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${'Outfits'}?key=${apiKey}`)
        .then(res => res.json())
        .then(res => this.handleErrors(res))
        .then(res => {
          if (res) {
            let data = res.values; //Array of Arrays representing sheet rows
            //check if 'Outfits' sheet columns are labeled correctly
            let headers = data[0].map(header => header.toUpperCase());
            if (!headers.includes('CHARACTER') || !headers.includes('OUTFIT') || !headers.includes('MADE')) {
              this.handleErrors({ error: { status: 'HEADER NOT FOUND' } });
            }
            else {
              //keep user data as Array of Arrays? assumes columns are in the same order
              //--> convert to object so keys can be used instead of index
              data[0] = headers //ignore column case jic
              const userList = convertArraysToObjects(data);
              userList.sort((a, b) => { //sort by character then outfit A->Z
                if (a['CHARACTER'].toUpperCase() === b['CHARACTER'].toUpperCase()) {
                  if (a['OUTFIT'].toUpperCase() < b['OUTFIT'].toUpperCase()) {
                    return -1;
                  }
                  else if (a['OUTFIT'].toUpperCase() > b['OUTFIT'].toUpperCase()) {
                    return 1;
                  }
                  return 0;
                }
                else if (a['CHARACTER'].toUpperCase() < b['CHARACTER'].toUpperCase()) {
                  return -1;
                }
                else if (a['CHARACTER'].toUpperCase() > b['CHARACTER'].toUpperCase()) {
                  return 1;
                }
                return 0;
              });
              console.log('userlist length', userList.length);
              //how to filter outfits with least time complexity?
              //a) iterate over userList, find corresponding outfit, leave out outfits not in database
              //b) iterate over outfits, check if outfit is in userList, outfits not in database will not be displayed
              //both are O(userList.length * outfits.length)
              //c) check if outfit is in userList when filtering data
              //adds complexity to filtering so no good
              let outfits = [...this.state.allOutfits];
              let userOutfits = outfits.reduce((acc, outfit) => {
                //practice binary search algorithm
                let outfitMatch = false;
                let low = 0;
                let high = userList.length - 1;
                //console.log('looking for ', outfit);
                while (!outfitMatch) { //check if Character and Outfit combo is in userList
                  //console.log('numbers', low, high, low > high);
                  if (high < low) { break; }
                  let middle = Math.floor(low + (high - low) / 2);
                  //console.log('middle', middle, userList[middle]);
                  if (userList[middle]['CHARACTER'].toUpperCase() === outfit['Character'].toUpperCase()) {
                    if (userList[middle]['OUTFIT'].toUpperCase() < outfit['Outfit'].toUpperCase()) {
                      low = middle + 1;
                    }
                    else if (userList[middle]['OUTFIT'].toUpperCase() > outfit['Outfit'].toUpperCase()) {
                      high = middle - 1;
                    }
                    else { outfitMatch = userList[middle] }
                  }
                  else if (userList[middle]['CHARACTER'].toUpperCase() < outfit['Character'].toUpperCase()) {
                    low = middle + 1;
                  }
                  else if (userList[middle]['CHARACTER'].toUpperCase() > outfit['Character'].toUpperCase()) {
                    high = middle - 1;
                  }
                }
                if (outfitMatch) {
                  if (Object.keys(outfitMatch).includes('MADE')) {
                    outfit['Made'] = outfitMatch['MADE'] === 'TRUE' ? true : false;
                  }
                  acc.push(outfit);
                  return acc;
                }
                else return acc;
              }, [])
              return userOutfits;
            }
          }
        })
        .then(outfits => {
          if (outfits) {
            this.setState((state) => {
              //clear team in case of outfits that aren't in userList
              const emptyTeam = state.teamMembers.map(member => 0);
              const preparedOutfits = this.prepareOutfitData(outfits, state)
              return { userSheetId: sheetId, userOutfits: outfits, outfits: preparedOutfits, teamMembers: emptyTeam, selMade: new Set() }
            });
          }
        })
    }
  }

  handleErrors(response) {
    //console.log(response);
    if (response.error) {
      if (response.error.code === 403 && response.error.status.includes('PERMISSION_DENIED')) {
        console.log("Error: Sorter did not have permission to access your spreadsheet. Don't forget to turn link-sharing on!")
        return;
      }
      if (response.error.code === 400 && response.error.status.includes('INVALID_ARGUMENT')) {
        console.log("Error: Sorter did not find a sheet called 'Outfits' in your spreadsheet.")
        return;
      }
      if (response.error.status === ('HEADER NOT FOUND')) {
        console.log("Error: Sorter did not find 'Character', 'Outfit', and 'Made' columns in your spreadsheet.")
        return;
      }
    }
    else return response;
  }

  render() {
    if (this.state.outfits && this.state.jobs) {
      //outfitList doesn't update without key. 100 is an arbitrary number
      let outfitListKey = this.state.outfits.slice(0, 100);
      outfitListKey = JSON.stringify(outfitListKey);
      const jobViewProps = {
        activeJob: this.state.activeJob,
        teamMembers: this.state.teamMembers,
        jobs: this.state.jobs,
        attr: this.state.attr,
        selAttr: this.state.selAttr,
        selectJob: this.selectJob,
      }
      const teamViewProps = {
        sheetId: this.state.userSheetId,
        selAttr: this.state.selAttr,
        activeJob: this.state.activeJob,
        teamMembers: this.state.teamMembers,
        toggleOutfitList: this.toggleOutfitList,
        getUserData: this.getUserData,
      }
      const outfitListProps = {
        key: outfitListKey,
        outfits: this.state.outfits,
        teamMembers: this.state.teamMembers,
        view: this.state.view,
        attr: this.state.attr,
        selAttr: this.state.selAttr,
        setMember: this.setMember,
        toggleOutfitList: this.toggleOutfitList,
      }
      const sidebarProps = {
        selAttr: this.state.selAttr,
        data: this.state.allOutfits,
        filters: this.state.filters,
        status: `showing ${this.state.outfits.length} outfits`,
        submitFilterSelection: this.submitFilterSelection,
        toggleTrue: this.toggleSearchTypeTrue,
        toggleFalse: this.toggleSearchTypeFalse,
        toggleMade: this.state.hasOwnProperty('selMade') && this.toggleMade,
        toggleOutfitList: this.toggleOutfitList,
        sortOutfits: this.sortOutfits,
      }
      return (
        <>
          <div id='teamBuilder'>
            <TeamView {...teamViewProps} />
            {this.state.activeJob && <JobViewContainer {...jobViewProps} />}
          </div>
          <div className='overlay' style={{ top: this.state.isOutfitList ? '0' : '100vh' }}>
            <div className='overlayContent'>
              <SideBar {...sidebarProps} />
              <OutfitList {...outfitListProps} />
            </div>
          </div>
        </>
      )
    }
    else return <div>Loading...</div>;
  }
}

export function Image(props) {
  let image = null;
  if (!props.obj['ImageID'] || props.obj['ImageID'] === 'MISSING') {
    image = <div className='imgPlaceholder'>{props.alt}</div>
  }
  else {
    image = <img src={'https://drive.google.com/thumbnail?&id=' + props.obj['ImageID']} alt={props.alt} />
  }
  return image;
}


//this Image class slows down load time...
//https://stackoverflow.com/questions/39777833/image-onload-event-in-isomorphic-universal-react-register-event-after-image-is
//class Image extends React.PureComponent {
//  constructor(props) {
//    super(props);
//    this.state = {
//      error: null,
//    }
//    this.onError = this.onError.bind(this);
//  }
//  onError() {
//    this.setState({ isLoaded: true, error: true });
//  }

//  render() {
//    console.log(this.props.obj);
//    if (this.state.error) {
//      if (!this.props.obj['ImageID'] || this.props.obj['ImageID'] === 'MISSING') {
//        return <div className='imgPlaceholder'>Image N/A</div>
//      }
//      return <div className='imgPlaceholder'>Failed to load image</div>
//    }
//    return (
//      <img src={'http://drive.google.com/uc?export=view&id=' + this.props.obj['ImageID']}
//        alt={this.props.alt}
//        ref={this.image}
//        onError={this.onError} />
//    )
//  }
//}


//statusBarWidth: Integer as width of status bar in rem
//maxValue: maximum value of status bar
//attr: Array of Strings ot indicate which attributes to display
//value: Obj of attr to display and corresponding values to calculate status bar (optional if bonus is provided)
//bonus: Obj of attr to display and corresponding bonus values (optional if value is provided)
//baseline: Obj of attr to display baseline job reqs on StatusBar
export function AttrList(props) {
  const statusBarWidth = props.statusBarWidth || 5;
  const height = props.attr.length * 1.2 + 'rem';
  const hideIcon = props.hideIcon || false;
  return (
    <div className='attrList' style={{ height: height }}>
      {props.attr.map(attr => {
        const value = (props.value ? props.value[attr] : 0) + (props.bonus ? props.bonus[attr] : 0);
        const numberText = (props.value ? props.value[attr] : '') + (props.bonus ? ` +${props.bonus[attr]}` : '').trim();
        //const progressText = props.baseline ?
        //  `${props.value[attr]}/${props.baseline[attr]}`
        //  : '';
        const statusBarProps = {
          width: statusBarWidth,
          attr: attr,
          value: value,
          maxValue: props.maxValue,
        }
        if (props.baseline) { statusBarProps.baseline = props.baseline[attr] }
        return (
          <div className='attr' key={attr}>
            {!hideIcon && <AttrIcon attr={attr} />}
            <span className='numberText'>{numberText}</span>
            <StatusBar {...statusBarProps} />
            {props.baseline && <span className='numberText'>{`${props.value[attr] > props.baseline[attr] ? '+' : ''}${props.value[attr] - props.baseline[attr]}`}</span>}
          </div>
        )
      })}
    </div>
  )
}

function StatusBar(props) {
  return (
    <span className='statusBarContainer' style={{ width: `${props.width}rem` }}>
      {props.baseline &&
        <span className='baseline'
          style={{ marginLeft: `${props.baseline / props.maxValue * props.width}rem` }} />
      }
      <span className={'statusBar ' + props.attr.toLowerCase()}
        style={{ width: `${props.value / props.maxValue * props.width}rem` }} />
    </span>
  )
}

export function AttrIcon(props) {
  return <span className={'icon ' + props.attr.toLowerCase()}>{props.attr}</span>
}