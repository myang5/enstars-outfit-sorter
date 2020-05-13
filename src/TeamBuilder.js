import React from 'react';
import { Image, AttrList } from './Main.js';
import Instructions from './Instructions.js';
import platform from './platform.svg';

export class TeamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isInstructions: false
    }
    this.toggleInstructions = this.toggleInstructions.bind(this);
  }

  toggleInstructions() {
    this.setState(state => { return { isInstructions: !state.isInstructions } });
  }

  render() {
    //console.log('TeamView render', this.props.activeJob);
    if (this.props.activeJob && this.props.teamMembers.length > 0) {
      const members = this.props.teamMembers.map((member, index) => {
        return <TeamMember key={index}
          index={index}
          member={member}
          selAttr={this.props.selAttr}
          toggleOutfitList={this.props.toggleOutfitList} />
      })
      const dataBtn = <div className='btn addData' onClick={() => this.props.getUserData(document.querySelector('#userData').value)}>Add</div>
      const helpBtn = <div className='btn help' onClick={this.toggleInstructions}>?</div>
      const sheetHref = 'https://docs.google.com/spreadsheets/d/' + this.props.sheetId;
      return (
        <>
          <div id='topMenu'>
            {/*{this.props.sheetId &&
              <span>using spreadsheet <a href={sheetHref}>{this.props.sheetId.slice(0, 7) + '...'}</a></span>
            }*/}
            <span>spreadsheet: </span>
            <input id='userData' type='text' defaultValue={this.props.sheetId} />
            {dataBtn}
            {helpBtn}
            {/*<div>Make sure to turn on link-sharing for your Google spreadsheet</div>*/}
          </div>
          <div id='teamViewContainer'>
            <div id='teamView'>
              {members}
            </div>
          </div>
          {this.state.isInstructions && <Instructions toggleInstructions={this.toggleInstructions} />}
        </>
      )
    } else return null;
  }
}

//trying to keep div same ratio
//https://stackoverflow.com/questions/12170261/how-to-auto-resize-a-div-with-css-while-keeping-aspect-ratio
function TeamMember(props) {
  const cls = 'teamMember' + (props.member.hasOwnProperty('Made') ? (!props.member['Made'] ? ' notMade' : '') : '');
  const alt = props.member ? `${props.member['Character']} ${props.member['Outfit']}` : null;
  return (
    <div className={cls} onClick={() => props.toggleOutfitList(props.index)}>
      <div className='imgContainer'>
        <Platform hasMember={props.member} />
        <Image obj={props.member} alt={alt} />
      </div>
      <AttrList attr={props.selAttr} bonus={props.member} maxValue={300} hideIcon={true} />
    </div>
  )
}

function Platform(props) {
  return (
    <>
      <img className='platform' src={platform} />
      {props.hasMember ? <div className='shadow' /> : null}
    </>
  )
}

export class JobViewContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isJobList: false,
    }
    this.toggleJobList = this.toggleJobList.bind(this);
  }

  toggleJobList() {
    this.setState((state, props) => { return { isJobList: !state.isJobList } });
  }

  render() {
    if (this.props.activeJob) {
      //console.log('JobViewContainer render');
      const jobViewProps = {
        attr: this.props.attr,
        activeJob: this.props.activeJob,
        teamMembers: this.props.teamMembers,
        toggleJobList: this.toggleJobList,
      }
      const jobListProps = {
        jobs: this.props.jobs,
        attr: this.props.attr,
        activeJob: this.props.activeJob,
        selectJob: this.props.selectJob,
        toggleJobList: this.toggleJobList,
      }
      return (
        <div id='jobView'>
          <JobView {...jobViewProps} />
          <div className='overlay' style={{ display: this.state.isJobList ? 'flex' : 'none' }}>
            <JobList {...jobListProps} />
          </div>

        </div>
      )
    } else return null;
  }
}

class JobView extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log('JobView render');
    const changeJobBtn = <div className='btn selectJob' onClick={this.props.toggleJobList}>Change Job</div>;
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
    return (
      <>
        <div className='header'>
          <div className='title'>
            <p>{this.props.activeJob['Job JP']}</p>
            {changeJobBtn}
          </div>
          <hr />
          <div className='statInfo'>
            <Image obj={this.props.activeJob} alt={this.props.activeJob['Job']} />
            <AttrList maxValue={1500} attr={attr} value={value} baseline={baseline} />
          </div>
        </div>
        <div className='workResult'>
          <ProgressBar baseline={baseline} value={value} />
        </div>
      </>
    )
  }
}

function ProgressBar(props) {
  //console.log('ProgressBar', props.value, props.baseline);
  const progress = Object.keys(props.baseline).reduce((accumulator, attr) => {
    const percent = props.value[attr] / props.baseline[attr] * (1 / 3);
    return accumulator + Math.min(percent, (1 / 3));
  }, 0);
  return (
    <>
      <div id='progressBarContainer'>
        <span id='progressBarHide' style={{ width: `${(1 - progress) * 100}%` }} />
        <span id='progressBar' style={{ width: `100%` }} />
      </div>
      <div className='status'>{`Work Result: ${Math.floor(progress * 100)}%`}</div>
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
        'Advanced': '【上級】',
        'Unit': 'Unit',
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
    //console.log('JobList componentDidMount')
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
    let menuOpts = Object.keys(this.state.menus);
    let menus = {}
    const data = new Set(this.props.jobs.map((job) => job['Type'] ? job['Type'].trim() : ''));
    menuOpts.forEach(opt => { if (opt.length > 0 && data.has(opt)) menus[opt] = this.state.menus[opt] });
    return menus;
  }

  getMenuJobs(menu) {
    return this.props.jobs.filter((job) => job['Type'] ? job['Type'].trim() === menu : false);
  }

  render() {
    //console.log('JobList render');
    const jobDetailBtn = <div className='btn selectJob' onClick={() => { this.props.selectJob(this.state.viewJob); this.props.toggleJobList(); }}>Select Job</div>
    const value = this.state.viewJob &&
      (
        <div className='overlayContent' id='jobList'>
          <div className='bottom left'>
            <JobTabMenu menus={this.getAvailableMenus()} activeMenu={this.state.activeMenu} toggleMenu={this.toggleMenu} />
            <JobSelect jobs={this.getMenuJobs(this.state.activeMenu)} viewJob={this.state.viewJob} toggleProperty={this.toggleProperty} />
          </div>
          <div className='top right'>
            <JobDetail job={this.state.viewJob} attr={this.props.attr} button={jobDetailBtn} toggleJobList={this.props.toggleJobList} />
          </div>
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
  const attr = props.attr.filter(attr => props.job[attr] > 0);
  const value = {};
  attr.forEach(attr => value[attr] = props.job[attr]);
  const closeBtn = <div className='btn closeJob' onClick={props.toggleJobList}>Cancel</div>;
  return (
    <div id='jobDetail'>
      <p>{props.job['Job JP']}</p>
      <Image obj={props.job} alt={props.job['Job']} />
      <AttrList maxValue={1500} attr={attr} value={value} />
      <div className='jobDetailBtns'>
        {props.button}
        {closeBtn}
      </div>
    </div>
  )
}
