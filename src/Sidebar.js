import React from 'react';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: '',
      filters: null,
    }
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    const setsArr = this.getSetsFromOutfitArray(this.props.data);
    this.setState({ filters: setsArr });
  }

  getSetsFromOutfitArray(outfitsArr) {
    //console.log(outfitsArr);
    const filters = this.props.filters; //Array of spreadsheet headers that should be filters
    const setsArr = new Array(filters.length);
    for (let i = 0; i < setsArr.length; i++) { setsArr[i] = new Set() }; //fill with empty Sets
    for (let i = 0; i < filters.length; i++) { setsArr[i].add(filters[i]) } //add header to Set
    for (let i = 0; i < outfitsArr.length; i++) {
      const row = outfitsArr[i];
      for (let j = 0; j < filters.length; j++) {
        setsArr[j].add(row[filters[j]]);
      }
    }
    return setsArr;
  }

  toggleMenu(menu) {
    this.setState((state, props) => { return { activeMenu: state.activeMenu === menu ? '' : menu } })
  }

  render() {
    if (this.state.filters) {
      const filters = this.state.filters.map(set => { //data is Array of Sets of unique values in each column
        const optionsArr = Array.from(set);
        const heading = optionsArr[0];
        const selKey = 'sel' + heading;
        optionsArr.sort();
        return (
          <Filter key={heading}
            heading={heading}
            isMenuActive={this.state.activeMenu === heading}
            toggleMenu={() => (this.toggleMenu(heading))}
            optionsArr={optionsArr}
            submitSelection={this.props.submitFilterSelection(selKey)}
          />
        );
      });
      //console.log(filters);
      return (
        <div id='sidebar' className='toggledOn'>
          <button onClick={this.props.toggleOutfitList}>Close</button>
          {/*<div className='filterHeading filter'><p>Stat Bonus</p></div>*/}
          {/*<CheckBoxOptions optionsArr={this.props.attr} submitSelection={this.props.submitFilterSelection('selAttr')} />*/}
          <div className='filterHeading filter'><p>Filter data by...</p></div>
          <SearchType toggleTrue={this.props.toggleTrue} toggleFalse={this.props.toggleFalse} />
          {filters}


        </div>
      )
    }
    else return null;
  }
}

class CheckBoxOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: new Set() };
    this.toggleOption = this.toggleOption.bind(this);
  }

  toggleOption(option) {
    const newSet = this.state.selected; //not actually creating a new Set copy?
    if (this.state.selected.has(option)) { newSet.delete(option) }
    else { newSet.add(option); }
    this.setState({ selected: newSet }, this.props.submitSelection(this.state.selected));
  }

  render() {
    const attrMapFunc = (option) => {
      return <CheckBox key={option} option={option} toggleOption={() => this.toggleOption(option)} />
      //return (
      //  <span key={option} className={'icon ' + option.toLowerCase()} onClick={() => this.toggleOption(option)}>
      //    {option}
      //  </span>
      //)
    }
    const options = this.props.optionsArr.map(attrMapFunc);
    return (
      <div className='filter attrOptions'>
        {options}
      </div>
    )
  }
}

function CheckBox(props) {
  return (
    <div>
      <input type='checkbox' onClick={props.toggleOption} />
      <span className={'icon ' + props.option.toLowerCase()}>{props.option}</span>
    </div>
  )
}

function SearchType(props) {
  return (
    <div className='filter'>
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

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: new Set() };
    this.toggleOption = this.toggleOption.bind(this);
    this.clearSelect = this.clearSelect.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
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

  clearSelect() {
    this.setState({ selected: new Set() })
  }

  selectAll() {
    let optionsArr = this.props.optionsArr.slice();
    const index = optionsArr.indexOf(this.props.heading);
    optionsArr.splice(index, 1);
    this.setState({ selected: new Set(optionsArr) })
  }

  clearFilter() {
    this.clearSelect();
    this.props.submitSelection(new Set());
  }

  render() {
    return (
      <div className='filter'>
        <div className='filterHeading'>
          <p className='filterIcon' onClick={this.props.toggleMenu}>⯆</p>
          <p onClick={this.props.toggleMenu}>{this.props.heading}</p>
          {this.state.selected.size > 0 && <a onClick={this.clearFilter}>clear filter</a>}
        </div>
        {this.props.isMenuActive &&
          <FilterMenu heading={this.props.heading}
            optionsArr={this.props.optionsArr}
            selected={this.state.selected}
            submitSelection={() => this.props.submitSelection(this.state.selected)}
            toggleMenu={this.props.toggleMenu}
            toggleOption={this.toggleOption}
            clearSelect={this.clearSelect}
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
          <button className='clearBtn' onClick={this.props.clearSelect}>Clear</button>
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
  if (optionsArr.indexOf(props.heading) > -1) { optionsArr.splice(optionsArr.indexOf(props.heading), 1) }
  const options = optionsArr.map(function (option) {
    return (
      <li key={option}
        className={props.selected.has(option) ? 'selected' : ''}
        onClick={() => props.toggleOption(option)}>
        <div><span></span>{option}</div>
      </li>)
  });
  return (
    <ul>
      {options}
    </ul>
  )
}


