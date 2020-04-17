import React from 'react';

export default function Sidebar(props) {
  const toggleValue = props.toggleValue();
  return (
    <div className='sidebar'>
      {/* <SearchButton /> */}
      <AttrOptions id='attrOpts' optionsArr={props.attributes} toggleValue={toggleValue('selAttr')} />
      <SelectOptions id='charaOpts' heading='Characters' optionsArr={props.characters} selected={props.selCharas} toggleValue={toggleValue('selCharas')} />
      <SelectOptions id='outfitOpts' heading='Outfit Type' optionsArr={props.outfitTypes} selected={props.selOutfits} toggleValue={toggleValue('selOutfits')} />
    </div>
  )
}

function AttrOptions(props) {
  const options = props.optionsArr.map(function (option) {
    if (option) {
      return (
        <div key={option}>
          <input type='checkbox' value={option} onClick={props.toggleValue} />
          <label htmlFor={option}>{option}</label>
        </div>
      )
    }
  });
  return (
    <div className='options' id={props.id}>
      <h3>Stat Bonus</h3>
      {options}
    </div>
  )
}

function SelectOptions(props) {
  const options = props.optionsArr.map(function (option) {
    if (option) {
      return (
        <option key={option} value={option}>{option}</option>
      )
    }
  });
  const selected = Array.from(props.selected).map((value) =>
    <ToggleOption key={value} value={value} toggleValue={props.toggleValue} />
  );
  return (
    <div className='options' id={props.id}>
      <h3>{props.heading}</h3>
      <select className='options' onChange={props.toggleValue}>{options}</select>
      <div>{selected}</div>
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

