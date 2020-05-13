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
      idolStats: null,
      attr: ['Ac', 'Pa', 'Un', 'Sm', 'Te', 'Ch'],
      selAttr: [], //Array of  strings from attr matching relevant attributes
      jobs: null, //Array of Obj of all job rows in database spreadsheet
      activeJob: null,
      filters: null, //Array of headers for each column to filter by
      isInclusive: false,
      //view: 'card',
      isOutfitList: false,
      teamMembers: [],
      teamSlot: null, //Store index of teamMember user is currently choosing
    };
    this.submitFilterSelection = this.submitFilterSelection.bind(this);
    this.toggleSearchTypeTrue = this.toggleSearchTypeTrue.bind(this);
    this.toggleSearchTypeFalse = this.toggleSearchTypeFalse.bind(this);
    this.toggleMade = this.toggleMade.bind(this);
    this.sortByFilter = this.sortByFilter.bind(this);
    this.sortOutfits = this.sortOutfits.bind(this);
    this.toggleOutfitList = this.toggleOutfitList.bind(this);
    this.selectJob = this.selectJob.bind(this);
    this.setMember = this.setMember.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.handleErrors = this.handleErrors.bind(this);
    this.getTopTeam = this.getTopTeam.bind(this);
  }

  componentDidMount() {
    //console.log('Main componentDidMount')
    const sheetId = 'Stat Bonuses';
    //fetch info for Sidebar
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetId}?key=${apiKey}`)
      .then(result => result.json())
      .then(result => {
        let data = result.values; //Array of Arrays representing sheet rows
        const newState = {};
        const filters = []
        data[0].forEach((arr) => { //Create set for each header to keep track of selected values
          if (arr !== 'ImageID' && arr !== 'Total' && !this.state.attr.includes(arr)) {
            filters.push(arr); newState['sel' + arr] = new Set()
          }
        })
        let outfits = convertArraysToObjects(data);
        outfits = this.filterIfColumnIsEmpty(outfits, ['Unit', 'Character', 'Outfit']);
        newState.allOutfits = outfits;
        newState.filters = filters;
        this.setState(newState);
      })
      .then(() => {
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
            if (this.props.sheetId) {
              //console.log(this.props.sheetId);
              this.getUserData(this.props.sheetId)
            }
          })
      })
  }

  //filter out row only if even one given column is empty
  filterIfColumnIsEmpty(arr, columnsArr) {
    return arr.filter((row) => {
      const result = columnsArr.map(column => row[column] ? true : false);
      return result.reduce(function (accumulator, currVal) { return accumulator && currVal }, true);
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
    //console.log('SelectJob', job);
    if (this.state.activeJob !== job) {
      const newState = { ...this.state };
      newState.activeJob = job;
      newState.teamMembers = new Array(job['Idol Slots']).fill(0);
      const outfitSource = this.state.userOutfits ? this.state.userOutfits : this.state.allOutfits;
      newState.selAttr = Object.keys(job).filter(key => this.state.attr.includes(key) && job[key] > 0);
      if (outfitSource) {
        newState.outfits = this.prepareOutfitData(outfitSource, newState);
        newState.teamMembers = this.getTopTeam(outfitSource, job);
      }
      this.setState(newState);
    }
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

  sortOutfits(filter, isAscending) {
    this.setState((state, props) => {
      let outfits = [...state.outfits];
      this.sortByFilter(outfits, filter, isAscending);
      //console.log('sortOutfits', filter, outfits);
      return { outfits: outfits }
    })
  }

  sortByFilter(outfits, filter, isAscending = true) {
    outfits.sort((a, b) => isAscending ? a[filter] - b[filter] : b[filter] - a[filter])
  }

  submitFilterSelection(filter) {
    return (value) => {
      //console.log('submitFilterSelection', value)
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

  setMember(newMember) {
    this.setState((state) => {
      let teamCopy = state.teamMembers.slice();
      this.setMemberAtSlot(teamCopy, newMember, state.teamSlot);
      return { teamMembers: teamCopy, isOutfitList: false };
    })
  }

  setMemberAtSlot(team, newMember, teamSlot) {
    //can't have same chara on team twice
    //assume if user chooses outfit for chara on team they are changing their outfit
    //and also switch places of relevant charas like in the game
    for (let i = 0; i < team.length; i++) {
      if (newMember['Character'] === team[i]['Character']) {
        const slotToChange = i;
        const oldMember = team[teamSlot];
        team[slotToChange] = oldMember;
        break;
      }
    }
    team[teamSlot] = newMember;
  }

  //get top team from userOutfits or allOutfits
  //total bonus needs to be calculated already
  //should take job conditions into account but should ignore filters in case filters interfere with outfits available 
  //ex. one character is selected, but team can't be filled with same character
  //also allow for case where team won't be filled JIC like if user provides sheet with < 5 outfits
  getTopTeam(outfitSource, job, idolStats = null) {
    let teamMembers = new Array(job['Idol Slots']).fill(0);
    let attrSet = Object.keys(job).filter(key => this.state.attr.includes(key) && job[key] > 0);
    const conditions = this.getJobConditions(job);
    let outfits = conditions.length > 0 ? filterData(outfitSource, { conditions: this.getJobConditions(job) }) : outfitSource;
    outfits = this.addIdolStatus(outfits, idolStats);
    outfits = this.calculateTotalBonus(outfits, attrSet);
    this.sortByFilter(outfits, 'Total Bonus', false);
    //while team still has empty slots, and while there are still outfits left
    //keep trying to set a team member at empty slots
    let i = 0;
    while (teamMembers.includes(0) && i < outfits.length) {
      //don't try to set team member if character is already in team (avoid setting weaker outfits)
      //outfit list is already sorted by total bonus so only need to check if character is same
      let isPresent = teamMembers.map(member => member ? member['Character'] === outfits[i]['Character'] : false);
      if (!isPresent.includes(true)) {
        const teamSlot = teamMembers.indexOf(0);
        this.setMemberAtSlot(teamMembers, outfits[i], teamSlot);
      }
      i++;
    }
    return teamMembers;
  }

  //filter outfits based on any selected queries and conditions in activeJob
  //calculate total bonus for selected attributes
  //sort outfits in descending order by total bonus
  //return outfit Obj of Arrays
  prepareOutfitData(data, state) {
    //create new deep copy of outfitList, but slows performance
    //be careful about how other functions may mutate data
    //let newData = JSON.parse(JSON.stringify(data)) 
    let queryConfig = this.getQueryAndConditions(state);
    queryConfig.isInclusive = state.isInclusive;
    let outfits = filterData(data, queryConfig);
    outfits = this.addIdolStatus(outfits, state.idolStats);
    if (state.selAttr.length > 0) {
      outfits = this.calculateTotalBonus(outfits, state.selAttr);
      this.sortByFilter(outfits, 'Total Bonus', false);
    }
    return outfits;
  }

  //returns Object with query and conditions given passed-in state
  getQueryAndConditions(state) {
    const query = Object.keys(state).reduce((accumulator, key) => { //make Object of Sets that hold selected values
      const value = state[key];
      if (key.includes('sel') && key !== 'selAttr' && value.size > 0) { accumulator[key] = value; }
      return accumulator;
    }, {});
    //console.log(query);
    const conditions = state.activeJob ? this.getJobConditions(state.activeJob) : [];
    return { query: query, conditions: conditions };
  }

  getJobConditions(job) {
    return job['Conditions'] ? job['Conditions'].split(',').map(str => str.trim()) : [];
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

  addIdolStatus(outfits, idolStats) {
    if (idolStats) {
      outfits.forEach(outfitObj => {
        const stats = idolStats[outfitObj['Character']];
        //stats might not exist if user has misspelled idol name
        if (stats && !outfitObj['AddedStat']) {
          Object.keys(stats).forEach(attr => {
            //attr might not exist if user has misspelled attr
            if (outfitObj.hasOwnProperty(attr)) {
              outfitObj[attr] += stats[attr];
            }
          });
          outfitObj['AddedStat'] = true;
        }
      });
    }
    //console.log('addIdolStatus', outfits)
    return outfits
  }

  checkResponseOk(response) {
    if (response.ok || response.status === 200) {
      return response.json();
    } else {
      throw response;
    }
  }

  getUserData(url) {
    if (url.length > 0) {
      //url format: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/possible-extra-content
      let urlStr = url.replace('https://docs.google.com/spreadsheets/d/', '');
      const sheetId = urlStr.indexOf('/') > 0 ? urlStr.slice(0, urlStr.indexOf('/')) : urlStr;
      //console.log(sheetId);
      //if (sheetId !== this.state.userSheetId) { user might be re-adding sheet w altered data
      let fetchOutfits = fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${'Outfits'}?key=${apiKey}`).then(res => this.checkResponseOk(res)).catch(e => this.handleErrors(e));
      let fetchIdolStats = fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${'Idol Status'}?key=${apiKey}`).then(res => this.checkResponseOk(res)).catch(e => this.handleErrors(e));
      Promise.all([fetchOutfits, fetchIdolStats])
        .then(values => {
          const [outfitData, idolStatData] = values;
          console.log(outfitData, idolStatData)
          if (outfitData) {
            let data = outfitData.values; //Array of Arrays representing sheet rows
            //check if 'Outfits' sheet columns are labeled correctly
            let headers = data[0].map(header => header.toUpperCase());
            if (!headers.includes('CHARACTER') || !headers.includes('OUTFIT') || !headers.includes('MADE')) {
              this.handleErrors({ error: { status: 'HEADER NOT FOUND' } });
            }
            else {
              //keep user data as Array of Arrays? assumes columns are in the same order
              //--> convert to object so keys can be used instead of index
              data[0] = headers //ignore column case jic
              let userList = convertArraysToObjects(data);
              userList = userList.filter(row => row['CHARACTER'] && row['OUTFIT']) //filter out empty rows
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
              //console.log('userlist length', userList.length);
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
              }, []);
              let idolStats = null;
              if (idolStatData.values) {
                const userStatus = convertArraysToObjects(idolStatData.values);
                idolStats = {};
                userStatus.forEach(idol => {
                  const name = idol['Character'];
                  delete idol['Character'];
                  idolStats[name] = idol;
                });
              }
              const newState = { ...this.state };
              newState.idolStats = idolStats;
              newState.userOutfits = userOutfits;
              newState.teamMembers = this.getTopTeam(userOutfits, newState.activeJob, idolStats);
              newState.outfits = this.prepareOutfitData(userOutfits, newState);
              newState.userSheetId = sheetId;
              newState.selMade = new Set();
              this.setState(newState);
            }
          }
        });
    }
  }

  handleErrors(response) {
    //console.log(response);
    response.json().then(response => {
      if (response.error) {
        let status = '';
        if (response.error.code === 403 && response.error.status.includes('PERMISSION_DENIED')) {
          status += "Sorter did not have permission to access your spreadsheet. Don't forget to turn link-sharing on!";
        }
        if (response.error.code === 400 && response.error.status.includes('INVALID_ARGUMENT')) {
          if (response.error.message.includes('Outfits')) {
            status += "Sorter did not find a sheet called 'Outfits' in your spreadsheet.";
          }
          if (response.error.message.includes('Idol Stats')) {
            status += "Sorter did not find a sheet called 'Idol Stats' in your spreadsheet.";
          }
        }
        if (response.error.status === ('HEADER NOT FOUND')) {
          console.log("Error: Sorter did not find 'Character', 'Outfit', and 'Made' columns in your spreadsheet.")
          return null;
        }
        else { status += response.error.message }
        throw new Error(status);
      }
    })
      .catch(e => console.log(e));
  }

  render() {
    if (this.state.outfits && this.state.jobs) {
      //console.log('Main render', this.state.selMade)
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
        selMade: this.state.selMade,
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
          <div className='overlay' style={{ display: this.state.isOutfitList ? 'flex' : 'none' }}>
            <div className='overlayContent'>
              <SideBar {...sidebarProps} />
              <OutfitList {...outfitListProps} />
            </div>
          </div>
        </>
      )
    }
    else return <div id='loading'>Loading...</div>
  }
}

export function Image(props) {
  let image = null;
  if (!props.obj['ImageID'] || props.obj['ImageID'] === 'MISSING') {
    image = <div className='imgPlaceholder'><div>{props.alt}</div></div>
  }
  else {
    //was using 'https://drive.google.com/uc?export=view&id=' 
    //also tried 'https://drive.google.com/uc?export=download&id=' but high-res images seem to cause loading issues
    //using 'https://drive.google.com/thumbnail?id=' which fetches the low-res thumbnail
    //fine for chibi render images but noticeable quality drop for work bgs which are originally about 2048px x 1026px
    image = <img src={'https://drive.google.com/thumbnail?id=' + props.obj['ImageID']} alt={props.alt} />
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
  const hideIcon = props.hideIcon || false;
  return (
    <div className='attrList'>
      {props.attr.map(attr => {
        const value = (props.value ? props.value[attr] : 0) + (props.bonus ? props.bonus[attr] : 0);
        //const numberText = (props.value ? props.value[attr] : '') + (props.bonus ? ` +${props.bonus[attr]}` : '').trim();
        let numberText = value;
        if (props.bonus) {
          if (!props.bonus['AddedStat']) { numberText = '+' + numberText }
        }
        //const progressText = props.baseline ?
        //  `${props.value[attr]}/${props.baseline[attr]}`
        //  : '';
        const statusBarProps = {
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
    <span className='statusBarContainer'>
      {props.baseline &&
        <span className='baseline'
          style={{ marginLeft: `${props.baseline / props.maxValue * 100}%` }} />
      }
      <span className={'statusBar ' + props.attr.toLowerCase()}
        style={{ width: `${props.value / props.maxValue * 100}%` }} />
    </span>
  )
}

export function AttrIcon(props) {
  return <span className={'icon ' + props.attr.toLowerCase()}>{props.attr}</span>
}