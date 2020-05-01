import React from 'react';
import { AttrList } from './Main.js';
import { OutfitImage } from './OutfitList.js';

//receive list of jobs from Main
//Spreadsheet columns:
//Type	Job	Job JP	Conditions	Idol Slots	Ac	Pa	Un	Sm	Te	Ch	Outfit Drops	Outfit Drops

//mimic Work menu in-game
export class JobList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menus: {
        'Beginner': '【初級】',
        'Intermediate': '【中級】',
        'Unit': 'Unit',
        //'Daily': '日替わり',
        'ES Building': 'ESビル',
        'Limited': '期間限定',
      },
      activeMenu: null,
      viewJob: null,
    }
    this.toggleProperty = this.toggleProperty.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.getAvailableMenus = this.getAvailableMenus.bind(this);
    this.getMenuJobs = this.getMenuJobs.bind(this);
  }

  componentDidMount() {
    console.log('JobList componentDidMount')
    this.toggleMenu('Beginner');
  }

  toggleProperty(prop, value) {
    this.setState({ [prop]: value });
  }

  toggleMenu(menu) { //need to reset viewJob to first item
    const job = this.getMenuJobs(menu)[0];
    this.setState({ activeMenu: menu, viewJob: job });
    this.props.selectJob(job);
  }

  getAvailableMenus() {
    const menus = {};
    const data = new Set(this.props.jobs.map((job) => job['Type'].trim()));
    data.forEach(data => menus[data] = this.state.menus[data]);
    return menus;
  }

  getMenuJobs(menu) {
    return this.props.jobs.filter((job) => job['Type'].trim() === menu);
  }

  render() {
    //console.log('JobList render', this.state.viewJob)
    const value = this.state.viewJob &&
      (
        <div id='jobList'>
          <JobTabMenu menus={this.getAvailableMenus()} activeMenu={this.state.activeMenu} toggleMenu={this.toggleMenu} />
          <JobSelect jobs={this.getMenuJobs(this.state.activeMenu)} viewJob={this.state.viewJob} toggleProperty={this.toggleProperty} />
          <JobDetailView job={this.state.viewJob} attr={this.props.attr} selectJob={this.props.selectJob} />
        </div>
      )
    return value;
  }
}

function JobTabMenu(props) {
  const tabs = Object.keys(props.menus).map(key => {
    return (
      <div key={key}
        className={'jobTab' + (props.activeMenu === key ? ' selected' : '')}
        onClick={() => props.toggleMenu(key)}>
        <p>{props.menus[key]}</p>
      </div>
    )
  });
  return <div id='jobTabMenu'>{tabs}</div >;
}

function JobSelect(props) {
  const jobs = props.jobs.map(job => {
    return (
      <div key={job['Job JP'] + (props.viewJob === job ? ' selected' : '')}
        className={'jobOpt' + (props.viewJob === job ? ' selected' : '')}
        onClick={() => props.toggleProperty('viewJob', job)}>
        <p>{job['Job JP']}</p>
      </div>
    )
  });
  return <div id='jobSelect'>{jobs}</div>;
}

function JobDetailView(props) {
  const image = props.job['ImageID'] ?
    <img src={'https://drive.google.com/thumbnail?&id=' + props.job['ImageID']} alt={props.job['Job']} /> :
    <div className='imgPlaceholder'><p>Image N/A</p></div>;
  const attr = props.attr.filter(attr => props.job[attr] > 0);
  const value = {};
  attr.forEach(attr => value[attr] = props.job[attr]);
  return (
    <div id='jobView'>
      <p>{props.job['Job JP']}</p>
      {image}
      <AttrList statusBarWidth={8} maxValue={900} attr={attr} value={value} />
      <div className='selectJobBtn' onClick={() => props.selectJob(props.job)}> <p>Select Job</p></div>
    </div>
  )
}

export class TeamView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    //console.log('TeamView render', this.props.activeJob);
    if (this.props.activeJob && this.props.teamMembers.length > 0) {
      const members = this.props.teamMembers.map((member, index) => {
        return <TeamMember key={index} index={index} member={member} toggleOutfitList={this.props.toggleOutfitList} />
      })
      return (
        <div id='teamView'>
          {members}
          {/*<TeamStatus />*/}
        </div>
      )
    } else return null;
  }
}

function TeamMember(props) {
    return (
      <div className={`teamMember ${props.index}`} onClick={() => props.toggleOutfitList(props.index)}>
        { props.member['ImageID'] && <OutfitImage {...props.member} />}
      </div>
    )
}

