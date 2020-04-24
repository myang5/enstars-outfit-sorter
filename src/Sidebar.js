import React from 'react';

export default function Sidebar(props) {
  const toggleValue = props.toggleValue();

  const attrMapFunc = function (option) {
    return <CheckBox key={option} option={option} value={option} toggleValue={toggleValue('selAttr')} />
  };

  const tierMapFunc = function (option, index) {
    return <CheckBox key={option} option={option} value={index + 1} toggleValue={toggleValue('selTiers')} />
  };

  return (
    <div id='sidebar' className='toggledOn'>
      {/* <SearchButton /> */}
      <CheckBoxOptions id='attrOpts' heading='Stat Bonus' optionsArr={props.attributes} selected={props.selAttr} toggleValue={toggleValue('selAttr')} mapFunc={attrMapFunc} />
      <div className='options'><p>Filter data by...</p></div>
      <SearchType toggleTrue={props.toggleTrue} toggleFalse={props.toggleFalse} />
      <SelectOptions id='unitOpts' heading='Unit' optionsArr={props.units} selected={props.selUnits} toggleValue={toggleValue('selUnits')} clearFilter={props.clearFilter('selUnits')} />
      <SelectOptions id='charaOpts' heading='Character' optionsArr={props.characters} selected={props.selCharas} toggleValue={toggleValue('selCharas')} clearFilter={props.clearFilter('selCharas')} />
      <CheckBoxOptions id='tierOpts' heading='Outfit Tier' optionsArr={props.outfitTiers} selected={props.selTiers} toggleValue={toggleValue('selTiers')} mapFunc={tierMapFunc} />
      <SelectOptions id='outfitOpts' heading='Outfit Type' optionsArr={props.outfitTypes} selected={props.selOutfits} toggleValue={toggleValue('selOutfits')} clearFilter={props.clearFilter('selOutfits')} />
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

function SelectOptions(props) {
  if (props.optionsArr.indexOf(props.heading) > -1) { props.optionsArr.splice(props.optionsArr.indexOf(props.heading), 1, '') }
  const options = props.optionsArr.map(function (option) {
    if (option) { return <option key={option} value={option}>{option}</option> }
  });
  const selected = Array.from(props.selected).map((value) =>
    <ToggleOptionBtn key={value} value={value} toggleValue={props.toggleValue} />
  );

  return (
    <div className='options' id={props.id}>
      <div className='row'>
        <p>{props.heading}</p>
        <ClearFilterButton clearFilter={props.clearFilter} />
      </div>
      <select className='row' defaultValue='none' onChange={props.toggleValue}>
        <option disabled value='none'>(select an option)</option>
        {options}
      </select>
      <div>{selected}</div>
    </div>
  )
}

function ClearFilterButton(props) {
  return (
    <div className='clearFilter'>
      <button className='clearBtn' onClick={props.clearFilter}>Clear</button>
    </div>
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

