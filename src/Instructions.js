import React, { useState } from 'react';
import linkSharingOff from './instructions0.png';
import linkSharingOn from './instructions1.png';
import linkSharingOffMobile from './instructions2.PNG';
import linkSharingOnMobile from './instructions3.PNG';
import { UpDownArrow } from './Sidebar.js';

function useSetOrNullState(state, setState) {
  return function (value) {
    if (state === value) setState(null);
    else setState(value);
  }
}

export default function Instructions(props) {
  const [sharingInst, setSharingInst] = useState(null);
  const toggleSharingInst = useSetOrNullState(sharingInst, setSharingInst);
  return (
    <div className='overlay'>
      <div className='overlayContent' id='instructions'>
        <div className='topContainer'>
          <div className='top'>
            <h3>Don't see your outfit?</h3>
            <p>Add it to the <a target='_blank' href='https://docs.google.com/spreadsheets/d/1JeHlN1zcBwyBbBkyfsDiiqDZpLotkn770ewa1JCsekU/edit#gid=0'>outfit database spreadsheet!</a></p>
            <p>If you don't see a specific outfit, it's because the database currently doesn't have information for it. Please add its stats to the database and refresh the outfit sorter.</p>
            <hr />
            <h3>How to import user data</h3>
            <p>
              Make a copy of this <a target='_blank' href='https://docs.google.com/spreadsheets/d/1asGXfBIw2qe3xYX_mawgbjO34gYqsj6IBNRbzqtqNAQ/'>
                Google spreadsheet template</a> and fill it with your outfits.
            </p>
            <ul>
              <p><strong>Notes on the spreadsheet format</strong></p>
              <li>
                <strong>Must have:</strong> a sheet named Outfits with columns labeled Character, Outfit, and Made
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
              <p className='sharingHeading' onClick={() => toggleSharingInst('desktop')}>
                <UpDownArrow className='arrow' up={sharingInst === 'desktop'} />
                <strong>On desktop</strong>
              </p>
              {sharingInst === 'desktop' &&
                <>
                  <li>
                    <p>Click the 'Share' button in the top right corner and click 'Get shareable link'.</p>
                    <img src={linkSharingOff} alt='Turn on link sharing' />
                  </li>
                  <li>
                    <p>Copy the provided link.</p>
                    <img src={linkSharingOn} alt='Copy link' />
                  </li>
                </>
              }
            </ul>
            <ul>
              <p className='sharingHeading' onClick={() => toggleSharingInst('mobileApp')}>
                <UpDownArrow className='arrow' up={sharingInst === 'mobileApp'} />
                <strong>On Sheets mobile app</strong>
              </p>
              {sharingInst === 'mobileApp' &&
                <>
                  <li>
                    <p>{`Open the spreadsheet settings and tap 'Share & export'.`}</p>
                    <img src={linkSharingOffMobile} alt='Open mobile settings' />
                  </li>
                  <li>
                    <p>Turn 'Link sharing' on and copy the link.</p>
                    <img src={linkSharingOnMobile} alt='Turn link sharing on' />
                  </li>
                </>
              }
            </ul>
            <p>Copy and paste the spreadsheet link into the sorter and click 'Add'.</p>
            <p>OR get the spreadsheet ID and add it to the sorter URL:</p>
            <ul>
              <li>
                Your spreadsheet link will look something like this: <br />
                https://docs.google.com/spreadsheets/d/<strong>SPREADSHEET_ID</strong>/view...
              </li>
              <li>
                Get the SPREADSHEET_ID part of the link and add it to the sorter URL so it looks like this: <br />
                https://myang5.github.io/enstars-outfit-sorter/<strong>SPREADSHEET_ID</strong>

              </li>
            </ul>
            <p>This way you can save/bookmark the outfit sorter with your data instead of pasting the spreadsheet link every time.</p>
            <hr />
            <h3>About</h3>
            <p>Tool developed by <a href='https://twitter.com/gayandasleep'>Midori</a> (feel free to DM them with any feedback/bug reports/suggestions for features</p>
            <p>Game images pulled from <a href='https://twitter.com/sakasakitty/status/1230928809169498113'>Rai's render drive</a></p>
            <p>Directional arrow icons made by <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></p>
          </div>
        </div>
        <div className='bottomContainer'><div className='btn' onClick={props.toggleInstructions}>Close</div></div>

      </div>
    </div>
  )
}