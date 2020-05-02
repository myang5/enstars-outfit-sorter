import React from 'react';
import { AttrList } from './Main.js';
import { OutfitImage } from './OutfitList.js';

//receive list of jobs from Main
//Spreadsheet columns:
//Type	Job	Job JP	Conditions	Idol Slots	Ac	Pa	Un	Sm	Te	Ch	Outfit Drops	Outfit Drops

//mimic Work menu in-game

export class JobView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isJobList: false,
    }
    this.toggleJobList = this.toggleJobList.bind(this);
  }

  toggleJobList() {
    console.log('toggleJobList');
    this.setState((state, props) => { return { isJobList: !state.isJobList } });
  }

  render() {
    if (this.props.activeJob) {
      //console.log('JobView render activeJob', this.props.activeJob);
      const selectBtn = <div className='btn selectJob' onClick={() => this.toggleJobList()}>Change Job</div>;
      const attr = this.props.attr.filter(attr => this.props.activeJob[attr] > 0);
      const baseline = {};
      const value = {};
      attr.forEach(attr => {
        baseline[attr] = this.props.activeJob[attr];
        //for each attr, iterate over teamMembers Array and accumulate their attr values
        value[attr] = this.props.teamMembers.reduce((accumulator, member) => {
          if (member) {
            return accumulator + member[attr];
          } else return accumulator
        }, 0);
      });
      const jobListProps = {
        jobs: this.props.jobs,
        attr: this.props.attr,
        activeJob: this.props.activeJob,
        selectJob: this.props.selectJob,
        toggleJobList: this.toggleJobList,
      }
      return (
        <div id='jobView'>
          <div className='header'>
            <p>{this.props.activeJob['Job JP']}</p>
            <JobImage job={this.props.activeJob} />
            {selectBtn}
          </div>
          <div className='statInfo'>
            <AttrList statusBarWidth={8} maxValue={900} attr={attr} value={value} baseline={baseline} />
            <ProgressBar baseline={baseline} value={value} />
          </div>

          {this.state.isJobList && <JobList {...jobListProps} />}
        </div>
      )
    } else return null;
  }
}

function JobImage(props) {
  const image = props.job['ImageID'] ?
    <img src={'https://drive.google.com/thumbnail?&id=' + props.job['ImageID']} alt={props.job['Job']} /> :
    <div className='imgPlaceholder'><p>Image N/A</p></div>;
  return image;
}

function ProgressBar(props) {
  console.log('ProgressBar', props.value, props.baseline);
  const progress = Object.keys(props.baseline).reduce((accumulator, attr) => {
    const percent = props.value[attr] / props.baseline[attr] * (1 / 3);
    return accumulator + Math.min(percent, (1 / 3));
  }, 0);
  const width = 9;
  console.log('ProgressBar progress', progress);
  return (
    <>
    <div id='progressBarContainer' style={{ width: `${width}rem` }}>
      <span id='progressBarHide' style={{ width: `${(1 - progress) * width}rem` }} />
      <span id='progressBar' style={{ width: `${width}rem` }} />
    </div>
  <div className='status'>{`Progress: ${Math.floor(progress * 100)}%`}</div>
    </>
  )
}

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
    this.setState({ activeMenu: this.props.activeJob['Type'], viewJob: this.props.activeJob })
  }

  toggleProperty(prop, value) {
    this.setState({ [prop]: value });
  }

  toggleMenu(menu) { //need to reset viewJob to first item
    const job = this.getMenuJobs(menu)[0];
    this.setState({ activeMenu: menu, viewJob: job });
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
    const jobDetailBtn = <div className='btn selectJob' onClick={() => { this.props.selectJob(this.state.viewJob); this.props.toggleJobList(); }}>Select Job</div>
    const value = this.state.viewJob &&
      (
        <div id='jobList'>
          <JobTabMenu menus={this.getAvailableMenus()} activeMenu={this.state.activeMenu} toggleMenu={this.toggleMenu} />
          <JobSelect jobs={this.getMenuJobs(this.state.activeMenu)} viewJob={this.state.viewJob} toggleProperty={this.toggleProperty} />
          <JobDetail job={this.state.viewJob} attr={this.props.attr} button={jobDetailBtn} toggleJobList={this.props.toggleJobList} />
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
        {props.menus[key]}
      </div>
    )
  });
  return <div id='jobTabMenu'>{tabs}</div >;
}

function JobSelect(props) {
  const jobs = props.jobs.map(job => {
    const isViewing = props.viewJob['Job'] === job['Job'];
    const key = job['Job JP'] + (isViewing ? ' selected' : '');
    return (
      <div key={key}
        className={'jobOpt' + (isViewing ? ' selected' : '')}
        onClick={() => props.toggleProperty('viewJob', job)}>
        {job['Job JP']}
      </div>
    )
  });
  return <div id='jobSelect'>{jobs}</div>;
}

function JobDetail(props) {
  const image = props.job['ImageID'] ?
    <img src={'https://drive.google.com/thumbnail?&id=' + props.job['ImageID']} alt={props.job['Job']} /> :
    <div className='imgPlaceholder'><p>Image N/A</p></div>;
  const attr = props.attr.filter(attr => props.job[attr] > 0);
  const value = {};
  attr.forEach(attr => value[attr] = props.job[attr]);
  const closeBtn = <div className='btn closeJob' onClick={props.toggleJobList}>Cancel</div>;
  return (
    <div id='jobDetail'>
      <p>{props.job['Job JP']}</p>
      <JobImage job={props.job} />
      <AttrList statusBarWidth={8} maxValue={900} attr={attr} value={value} />
      {props.button}
      {closeBtn}
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
        return <TeamMember key={index} index={index} member={member} selAttr={this.props.selAttr} toggleOutfitList={this.props.toggleOutfitList} />
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
      {props.member !== 0 &&
        <>
          {props.member['ImageID'] && <OutfitImage {...props.member} />}
          <AttrList attr={props.selAttr} bonus={props.member} statusBarWidth={4.2} maxValue={300} />
        </>
      }
    </div>
  )
}

