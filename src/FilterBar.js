import React from 'react';

export default class FilterBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeMenu: '' }
    this.toggleValue = this.props.toggleValue();
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  //const attrMapFunc = function (option) {
  //  return <CheckBox key={option} option={option} value={option} toggleValue={toggleValue('selAttr')} />
  //};

  //const tierMapFunc = function (option, index) {
  //  return <CheckBox key={option} option={option} value={index + 1} toggleValue={toggleValue('selTiers')} />
  //};

  toggleMenu(menu) {
    this.setState((state, props) => { return { activeMenu: state.activeMenu === menu ? '' : menu } })
  }

  render() {
    const filters = Object.keys(this.props).reduce((accumulator, key) => { //concat values in Sets that hold selected values
      if (Array.isArray(this.props[key]) && key !== 'tiers' && key !== 'attr') {
        const selKey = 'sel' + key.replace(key.charAt(0), key.charAt(0).toUpperCase());
        const heading = this.props[key][0];
        accumulator.push(
          <Filter key={heading}
            heading={heading}
            isMenuActive={this.state.activeMenu===heading}
            toggleMenu={() => (this.toggleMenu(heading))}
            optionsArr={this.props[key]}
            selected={this.props[selKey]}
            toggleValue={this.toggleValue(selKey)}
            clearFilter={this.props.clearFilter(selKey)}
          />
        );
        
      }
      return accumulator;
    }, []);
    return (
      <div id='filterBar'>
        {filters}
        {/*<CheckBoxOptions id='attrOpts' heading='Stat Bonus' optionsArr={this.props.attributes} selected={this.props.selAttr} toggleValue={toggleValue('selAttr')} mapFunc={attrMapFunc} />*/}
        {/*<div className='options'><p>Filter data by...</p></div>*/}
        {/*<SearchType toggleTrue={this.props.toggleTrue} toggleFalse={this.props.toggleFalse} />*/}
        {/*<Filter heading='Unit' optionsArr={this.props.units} selected={this.props.selUnits} toggleValue={this.toggleValue('selUnits')} clearFilter={this.props.clearFilter('selUnits')} />
        <Filter heading='Character' optionsArr={this.props.characters} selected={this.props.selCharas} toggleValue={this.toggleValue('selCharas')} clearFilter={this.props.clearFilter('selCharas')} />
        <CheckBoxOptions id='tierOpts' heading='Outfit Tier' optionsArr={this.props.outfitTiers} selected={this.props.selTiers} toggleValue={toggleValue('selTiers')} mapFunc={tierMapFunc} />
        <Filter heading='Outfit Type' optionsArr={this.props.outfitTypes} selected={this.props.selOutfits} toggleValue={this.toggleValue('selOutfits')} clearFilter={this.props.clearFilter('selOutfits')} />*/}
      </div>
    )
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

{/*<SelectOptions heading='Unit' optionsArr={props.units} selected={props.selUnits} toggleValue={toggleValue('selUnits')} clearFilter={props.clearFilter('selUnits')} />*/ }
class Filter extends React.Component {
  render() {
    return (
      <div className='filter'>
        <div className='filterHeading'>
          <p>{this.props.heading}</p>
          <p onClick={this.props.toggleMenu}>⯆</p>
        </div>
        {this.props.isMenuActive &&
          <FilterMenu heading={this.props.heading}
            optionsArr={this.props.optionsArr}
            selected={this.props.selected}
            toggleValue={this.props.toggleValue}
            clearFilter={this.props.clearFilter} />}
      </div>
    )
  }
}

class FilterMenu extends React.Component {
  render() {
    return (
      <div className='filterMenu'>
        <div>
          <button className='clearBtn' onClick={this.props.clearFilter}>Clear</button>
        </div>
        <SelectOptions heading={this.props.heading}
          optionsArr={this.props.optionsArr}
          selected={this.props.selected}
          toggleValue={this.props.toggleValue} />
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
          onClick={() => props.toggleValue(option)}>
          <span></span>
          {option}
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

