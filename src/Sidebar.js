import React from 'react';

export default function Sidebar(props) {
  const toggleValue = props.toggleValue();



  return (
    <div id='sidebar' className='toggledOn'>
      {/* <SearchButton /> */}
      <AttrOptions id='attrOpts' optionsArr={props.attributes} toggleValue={toggleValue('selAttr')} />
      <div className='options'><p>Filter data by...</p></div>
      <SearchType toggleTrue={props.toggleTrue} toggleFalse={props.toggleFalse} />
      <SelectOptions id='unitOpts' heading='Unit' optionsArr={props.units} selected={props.selUnits} toggleValue={toggleValue('selUnits')} clearFilter={props.clearFilter('selUnits')} />
      <SelectOptions id='charaOpts' heading='Character' optionsArr={props.characters} selected={props.selCharas} toggleValue={toggleValue('selCharas')} clearFilter={props.clearFilter('selCharas')} />
      <TierOptions id='tierOpts' optionsArr={props.outfitTiers} toggleValue={toggleValue('selTiers')} />
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

function AttrOptions(props) {
  const options = props.optionsArr.map(function (option) {
    return (
      <div key={option}>
        <input type='checkbox' value={option} onClick={props.toggleValue} />
        <label htmlFor={option}>{option}</label>
      </div>
    )
  });
  return (
    <div className='options' id={props.id}>
      <div className='row'><p>Stat Bonus</p></div>
      <div className='row'>{options}</div>
    </div>
  )
}

function TierOptions(props) {
  const options = props.optionsArr.map(function (option, index) {
    return (
      <div key={option}>
        <input type='checkbox' value={index + 1} onClick={props.toggleValue} />
        <label htmlFor={option}>{option}</label>
      </div>
    )
  });
  return (
    <div className='options' id={props.id}>
      <div className='row'><p>Outfit Tier</p></div>
      <div className='row'>{options}</div>
    </div>
  )
}

function SelectOptions(props) {
  if (props.optionsArr.indexOf(props.heading) > -1) { props.optionsArr.splice(props.optionsArr.indexOf(props.heading), 1, '') }
  const options = props.optionsArr.map(function (option) {
    if (option) { return <option key={option} value={option}>{option}</option> }
  });
  const selected = Array.from(props.selected).map((value) =>
    <ToggleOption key={value} value={value} toggleValue={props.toggleValue} />
  );
  return (
    <div className='options' id={props.id}>
      <div className='row'>
        <div><p>{props.heading}</p></div>
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
      <button className='clearBtn' onClick={props.clearFilter}>X</button>
      <span>Clear</span>
    </div>
  )
}

function ToggleOption(props) {
  return (
    <div className='toggleOpt'>
      <span>{props.value}</span>
      <button className='cancelBtn' value={props.value} onClick={props.toggleValue}>X</button>
    </div>
  )
}

