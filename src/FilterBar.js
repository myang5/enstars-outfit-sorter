import React from 'react';

export default function FilterBar(props) {
  const toggleValue = props.toggleValue();

  const attrMapFunc = function (option) {
    return <CheckBox key={option} option={option} value={option} toggleValue={toggleValue('selAttr')} />
  };

  const tierMapFunc = function (option, index) {
    return <CheckBox key={option} option={option} value={index + 1} toggleValue={toggleValue('selTiers')} />
  };

  return (
    <div id='sidebar' className='toggledOn'>
      {/*<CheckBoxOptions id='attrOpts' heading='Stat Bonus' optionsArr={props.attributes} selected={props.selAttr} toggleValue={toggleValue('selAttr')} mapFunc={attrMapFunc} />*/}
      {/*<div className='options'><p>Filter data by...</p></div>*/}
      {/*<SearchType toggleTrue={props.toggleTrue} toggleFalse={props.toggleFalse} />*/}
      <Filter heading='Unit' optionsArr={props.units} selected={props.selUnits} toggleValue={toggleValue('selUnits')} clearFilter={props.clearFilter('selUnits')} />
      <Filter heading='Character' optionsArr={props.characters} selected={props.selCharas} toggleValue={toggleValue('selCharas')} clearFilter={props.clearFilter('selCharas')} />
      {/*<CheckBoxOptions id='tierOpts' heading='Outfit Tier' optionsArr={props.outfitTiers} selected={props.selTiers} toggleValue={toggleValue('selTiers')} mapFunc={tierMapFunc} />*/}
      <Filter heading='Outfit Type' optionsArr={props.outfitTypes} selected={props.selOutfits} toggleValue={toggleValue('selOutfits')} clearFilter={props.clearFilter('selOutfits')} />
    </div>
  )
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
  constructor() {
    super();
    this.state = { isMenu: true };
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    this.setState((state, props) => { return { isMenu: !state.isMenu } })
  }

  render() {
    return (
      <div className='filter'>
        <div className='filterHeading'>
          <p>{this.props.heading}</p>
          <p onClick={this.toggleMenu}>⯆</p>
        </div>
        {this.state.isMenu &&
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
  if (props.optionsArr.indexOf(props.heading) > -1) { props.optionsArr.splice(props.optionsArr.indexOf(props.heading), 1, '') }
  const options = props.optionsArr.map(function (option) {
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
  //add selected class to options that are selected
  props.selected.forEach((value) => {

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

