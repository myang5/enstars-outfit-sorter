import React from 'react';

//receive list of jobs from Main
//Spreadsheet columns:
//Type	Job	Job JP	Conditions	Idol Slots	Ac	Pa	Un	Sm	Te	Ch	Outfit Drops	Outfit Drops

export default class TeamBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedJob: null,
    }
  }
  render() {
    console.log('TeamBuilder render', this.props.jobs)
    return (
      <div id='teamBuilder'>
        <JobList jobs={this.props.jobs} />
      </div>
    )
  }
}

//mimic Work menu in-game
class JobList extends React.Component {
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
      activeJob: null,
    }
    this.toggleProperty = this.toggleProperty.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.getAvailableMenus = this.getAvailableMenus.bind(this);
    this.getSelectedJobs = this.getSelectedJobs.bind(this);
  }

  componentDidMount() {
    this.toggleMenu('Beginner');
  }

  toggleProperty(prop, value) {
    this.setState({ [prop]: value });
  }

  toggleMenu(menu) { //need to reset activeJob to first item
    const job = this.getSelectedJobs(menu)[0];
    this.setState({ activeMenu: menu, activeJob: job });
  }

  getAvailableMenus() {
    const menus = {};
    const data = new Set(this.props.jobs.map((job) => job['Type'].trim()));
    data.forEach(data => menus[data] = this.state.menus[data]);
    return menus;
  }

  getSelectedJobs(menu) {
    return this.props.jobs.filter((job) => job['Type'].trim() === menu);
  }

  render() {
    const value = this.state.activeJob && 
    (
      <div id='jobList'>
        <JobTabMenu menus={this.getAvailableMenus()} activeMenu={this.state.activeMenu} toggleMenu={this.toggleMenu} />
        <JobSelect jobs={this.getSelectedJobs(this.state.activeMenu)} activeJob={this.state.activeJob} toggleProperty={this.toggleProperty} />
        <JobDetailView job={this.state.activeJob} />
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
      <div key={job['Job JP'] + (props.activeJob === job ? ' selected' : '')}
        className={'jobOpt' + (props.activeJob === job ? ' selected' : '')}
        onClick={() => props.toggleProperty('activeJob', job)}>
        <p>{job['Job JP']}</p>
      </div>
    )
  });
  return <div id='jobSelect'>{jobs}</div>;
}

function JobDetailView(props) {
  const image = props.job['ImageID'] ?
    <img src={'https://drive.google.com/thumbnail?&id=' + props.job['ImageID']} /> :
    <div className='imgPlaceholder'><p>Image N/A</p></div>;
  return (
    <div id='jobView'>
      <p>{props.job['Job JP']}</p>
      {image}
      <p></p>
    </div>
  )
}

class TeamMember extends React.Component {

}

