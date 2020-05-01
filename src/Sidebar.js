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
    const setsArr = new Array(outfitsArr[0].length);
    for (let i = 0; i < setsArr.length; i++) { setsArr[i] = new Set() }; //fill with empty Sets
    for (let i = 0; i < outfitsArr[0].length; i++) { setsArr[i].add(outfitsArr[0][i]) } //add header to Set
    for (let i = 1; i < outfitsArr.length; i++) { //first row is headers
      const row = outfitsArr[i];
      for (let j = 0; j < row.length; j++) {
        setsArr[j].add(row[j]);
      }
    }
    //pop unwanted sets
    return setsArr;
  }

  toggleMenu(menu) {
    this.setState((state, props) => { return { activeMenu: state.activeMenu === menu ? '' : menu } })
  }



  //return (
  //  <div id='sidebar' className='toggledOn'>
  //    {/* <SearchButton /> */}
  //    <CheckBoxOptions id='attrOpts' heading='Stat Bonus' optionsArr={props.attributes} selected={props.selAttr} toggleValue={toggleValue('selAttr')} mapFunc={attrMapFunc} />
  //    <div className='options'><p>Filter data by...</p></div>
  //    <SearchType toggleTrue={props.toggleTrue} toggleFalse={props.toggleFalse} />
  //    <SelectOptions id='unitOpts' heading='Unit' optionsArr={props.units} selected={props.selUnits} toggleValue={toggleValue('selUnits')} clearFilter={props.clearFilter('selUnits')} />
  //    <SelectOptions id='charaOpts' heading='Character' optionsArr={props.characters} selected={props.selCharas} toggleValue={toggleValue('selCharas')} clearFilter={props.clearFilter('selCharas')} />
  //    <CheckBoxOptions id='tierOpts' heading='Outfit Tier' optionsArr={props.outfitTiers} selected={props.selTiers} toggleValue={toggleValue('selTiers')} mapFunc={tierMapFunc} />
  //    <SelectOptions id='outfitOpts' heading='Outfit Type' optionsArr={props.outfitTypes} selected={props.selOutfits} toggleValue={toggleValue('selOutfits')} clearFilter={props.clearFilter('selOutfits')} />
  //  </div>
  //)
  render() {
    if (this.state.filters) {
      const filters = this.state.filters.reduce((accumulator, set) => { //data is Array of Sets of unique values in each column
        const arr = Array.from(set);
        if (arr[0] !== 'ImageID' && this.props.attr.indexOf(arr[0]) < 0) {
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
      return (
        <div id='sidebar' className='toggledOn'>
          <button onClick={this.props.toggleOutfitList}>Close</button>
          <div className='filterHeading filter'><p>Stat Bonus</p></div>
          <CheckBoxOptions optionsArr={this.props.attr} submitSelection={this.props.submitFilterSelection('selAttr')} />
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

//function SelectOptions(props) {
//  if (props.optionsArr.indexOf(props.heading) > -1) { props.optionsArr.splice(props.optionsArr.indexOf(props.heading), 1, '') }
//  const options = props.optionsArr.map(function (option) {
//    if (option) { return <option key={option} value={option}>{option}</option> }
//  });
//  const selected = Array.from(props.selected).map((value) =>
//    <ToggleOptionBtn key={value} value={value} toggleValue={props.toggleValue} />
//  );

//  return (
//    <div className='options' id={props.id}>
//      <div className='row'>
//        <p>{props.heading}</p>
//        <ClearFilterButton clearFilter={props.clearFilter} />
//      </div>
//      <select className='row' defaultValue='none' onChange={props.toggleValue}>
//        <option disabled value='none'>(select an option)</option>
//        {options}
//      </select>
//      <div>{selected}</div>
//    </div>
//  )
//}


