import React from 'react';
import linkSharingOff from './instructions0.png';
import linkSharingOn from './instructions1.png';

export default function Instructions(props) {
  return (
    <div className='overlay'>

      <div className='overlayContent' id='instructions'>
        <div className='topContainer'>
          <div className='top'>
            <h3>How to Import User Data</h3>
            <p>
              Make a copy of this <a target='_blank' href='https://docs.google.com/spreadsheets/d/1asGXfBIw2qe3xYX_mawgbjO34gYqsj6IBNRbzqtqNAQ/edit?usp=sharing'>
                Google spreadsheet template</a> and fill it with your outfits.
            </p>
            <ul>
              <p><strong>Notes on the spreadsheet format</strong></p>
              <li>
                <strong>Must have:</strong> a sheet named Outfits with columns labeled Character, Outfit, and Made.
              </li>
              <li>
                <strong>Optional: </strong> the Idol Status sheet and Validation Lists sheet
              </li>
              <li>
                The character and outfit names should match the spelling and translations in the database's <a target='_blank' href='https://docs.google.com/spreadsheets/d/1JeHlN1zcBwyBbBkyfsDiiqDZpLotkn770ewa1JCsekU/edit#gid=350164119'>Validation Lists</a>.
              </li>
            </ul>
            <p>
              <strong>Turn link sharing on for the spreadsheet.</strong> Otherwise the sorter will not be able to access the contents.
            </p>
            <ul>
              <p><strong>On desktop:</strong></p>
              <li>
                <p>Click the 'Share' button in the top right corner and click 'Get shareable link'.</p>
                <img src={linkSharingOff} alt='Turn on link sharing' />
              </li>
              <li>
                <p>Copy the provided link.</p>
                <img src={linkSharingOn} alt='Copy link' />
              </li>
            </ul>
            <p>
              Copy the spreadsheet link into the sorter and click 'Add user data'.
            </p>
          </div>
        </div>
        <div className='bottomContainer'><div className='btn' onClick={props.toggleInstructions}>Close</div></div>

      </div>
    </div>
  )
}