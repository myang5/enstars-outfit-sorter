import React from 'react';

export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: '',
      filters: null,
    }
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  //const attrMapFunc = function (option) {
  //  return <CheckBox key={option} option={option} value={option} toggleValue={toggleValue('selAttr')} />
  //};

  componentDidMount() {
    const setsArr = this.getSetsFromOutfitArray(this.props.data);
    this.setState({ filters: setsArr });
  }

  toggleMenu(menu) {
    this.setState((state, props) => { return { activeMenu: state.activeMenu === menu ? '' : menu } })
  }

  getSetsFromOutfitArray(outfitsArr) {
    //console.log(outfitsArr);
    const setsArr = new Array(outfitsArr[0].length);
    for (let i = 0; i < setsArr.length; i++) { setsArr[i] = new Set() }; //fill with empty Sets
    for (let i = 0; i < outfitsArr[0].length; i++) { setsArr[i].add(outfitsArr[0][i]) } //add header to Set
    for (let i = 1; i < outfitsArr.length; i++) { //first row is headers
      const row = outfitsArr[i];
      for (let j = 0; j < row.length; j++) {
        setsArr[j].add(row[j]);
      }
    }
    console.log(setsArr);
    return setsArr;
  }

  render() {
    console.log('FilterBar render');
    if (this.state.filters) {
      const filters = this.state.filters.reduce((accumulator, set) => { //data is Array of Sets of unique values in each column
        const arr = Array.from(set);
        if (arr[0] !== 'ImageID') {
          const heading = arr[0];
          const selKey = 'sel' + heading;
          const optionsArr = Array.from(new Set(arr)).sort((a, b) => {
            const valA = isNaN(a) ? a.toUpperCase() : Number(a); //ignores case
            const valB = isNaN(b) ? b.toUpperCase() : Number(b);
            if (valA < valB) { return -1; }
            if (valA > valB) { return 1; }
            return 0;
          });
          accumulator.push(
            <Filter key={heading}
              heading={heading}
              isMenuActive={this.state.activeMenu === heading}
              toggleMenu={() => (this.toggleMenu(heading))}
              optionsArr={optionsArr}
              submitSelection={this.props.submitFilterSelection(selKey)}
            />
          );
        }
        return accumulator;
      }, []);
      //console.log(filters);
      filters.push( 
        <Filter key={'Total Bonus'}
        heading={'Total Bonus'}
        isMenuActive={this.state.activeMenu === 'Total Bonus'}
        toggleMenu={() => (this.toggleMenu('Total Bonus'))}
        optionsArr={this.props.attr}
        submitSelection={this.props.submitFilterSelection('selAttr')}
      />)
      return (
        <div id='filterBar'>
          {filters}
          {/*<CheckBoxOptions id='attrOpts' heading='Stat Bonus' optionsArr={this.props.attributes} selected={this.props.selAttr} toggleValue={toggleValue('selAttr')} mapFunc={attrMapFunc} />*/}
          {/*<SearchType toggleTrue={this.props.toggleTrue} toggleFalse={this.props.toggleFalse} />*/}
        </div>
      )
    }
    else return null;
  }
}

function SearchType(props) {
  return (
    <div className='options'>
      <div className='radioBtn'>
        <input type='radio' name='searchType' id='false' onClick={props.toggleFalse} defaultChecked />
        <label htmlFor='false'>Strict match <br /><span className='desc'>(find outfits that match all search criteria)</span></label>
      </div>
      <div className='radioBtn'>
        <input type='radio' name='searchType' id='true' onClick={props.toggleTrue} />
        <label htmlFor='true'>Inclusive match <br /><span className='desc'>(find outfits that match 1 or more criteria)</span></label>
      </div>
    </div>
  )
}

function CheckBoxOptions(props) {
  const options = props.optionsArr.map(props.mapFunc);

  return (
    <div className='options' id={props.id}>
      <div className='row'><p>{props.heading}</p></div>
      <div className='row'>{options}</div>
    </div>
  )
}

function CheckBox(props) {
  return (
    <div>
      <input type='checkbox' value={props.value} onClick={props.toggleValue} />
      <label htmlFor={props.option}>{props.option}</label>
    </div>
  )
}


{/*<Filter />
<FilterButton />
  <FilterMenu />
    <SelectAllBtn /> --> need it?
    <ClearBtn />
    <SearchBar />
    <SelectOptions />
    <CancelBtn />
    <OkBtn />*/}

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: new Set() };
    this.toggleOption = this.toggleOption.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.selectAll = this.selectAll.bind(this);
  }

  toggleOption(option) {
    const newSet = this.state.selected; //not actually creating a new Set copy?
    if (this.state.selected.has(option)) {
      newSet.delete(option);
    }
    else {
      newSet.add(option);
    }
    this.setState({ selected: newSet });
  }

  clearFilter() {
    this.setState({ selected: new Set() })
  }

  selectAll() {
    let optionsArr = this.props.optionsArr.slice();
    const index = optionsArr.indexOf(this.props.heading);
    optionsArr.splice(index, 1);
    this.setState({ selected: new Set(optionsArr) })
  }

  render() {
    return (
      <div className='filter'>
        <div className='filterHeading'>
          <p>{this.props.heading}</p>
          <p className='filterIcon' onClick={this.props.toggleMenu}>⯆</p>
        </div>
        {this.props.isMenuActive &&
          <FilterMenu heading={this.props.heading}
            optionsArr={this.props.optionsArr}
            selected={this.state.selected}
            submitSelection={() => this.props.submitSelection(this.state.selected)}
            toggleMenu={this.props.toggleMenu}
            toggleOption={this.toggleOption}
            clearFilter={this.clearFilter}
            selectAll={this.selectAll} />}
      </div>
    )
  }
}

class FilterMenu extends React.Component {
  render() {
    return (
      <div className='filterMenu'>
        <div>
          <button className='clearBtn' onClick={this.props.clearFilter}>Clear Filter</button>
          <button className='selectAllBtn' onClick={this.props.selectAll}>Select All</button>
        </div>
        <SelectOptions heading={this.props.heading}
          optionsArr={this.props.optionsArr}
          selected={this.props.selected}
          toggleOption={this.props.toggleOption} />
        <div>
          <button className='submitBtn' onClick={() => { this.props.toggleMenu(); this.props.submitSelection() }}>OK</button>
        </div>
      </div>
    )
  }
}

function SelectOptions(props) {
  let optionsArr = props.optionsArr.slice(0); //needed to create a real new (shallow) copy of the array
  if (optionsArr.indexOf(props.heading) > -1) { optionsArr.splice(optionsArr.indexOf(props.heading), 1, '') }
  const options = optionsArr.map(function (option) {
    if (option) {
      return (
        <li key={option}
          className={props.selected.has(option) ? 'selected' : ''}
          onClick={() => props.toggleOption(option)}>
          <div><span></span>{option}</div>
        </li>)
    }
  });
  return (
    <ul>
      {options}
    </ul>
  )
}

function ToggleOptionBtn(props) {
  return (
    <div className='toggleOpt'>
      <span>{props.value}</span>
      <button className='cancelBtn' value={props.value} onClick={props.toggleValue}>X</button>
    </div>
  )
}

