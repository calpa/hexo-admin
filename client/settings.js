import React from 'react';
import { Link } from 'react-router-dom';

import SettingsCheckbox from './settings-checkbox';
// const SettingsTextbox = require('./settings-textbox');

const divStyle = {
  whiteSpace: 'nowrap',
};

const LineNumbers = () => (
  <SettingsCheckbox
    name="lineNumbers"
    enableOptions={{ editor: { lineNumbers: true } }}
    disableOptions={{ editor: { lineNumbers: false } }}
    label="Enable line numbering."
  />);

const SpellCheck = () => (
  <SettingsCheckbox
    name="spellcheck"
    enableOptions={{ editor: { inputStyle: 'contenteditable', spellcheck: true } }}
    disableOptions={{ editor: { inputStyle: null, spellcheck: false } }}
    label="Enable spellchecking. (buggy on older browsers)"
  />);

const AskImageFilename = () => (
  <SettingsCheckbox
    name="askImageFilename"
    label="Always ask for filename."
    style={{ width: '300px', display: 'inline-block' }}
  />);

const OverwriteImages = () => (
  <SettingsCheckbox
    name="overwriteImages"
    label="Overwrite images if file already exists."
    style={{ width: '425px', display: 'inline-block' }}
  />);

/*
const ImagePath = SettingsTextbox({
  name: 'imagePath',
  defaultValue: '/images',
  label: 'Image directory',
});

const ImagePrefix = SettingsTextbox({
  name: 'imagePrefix',
  defaultValue: 'pasted-',
  label: 'Image filename prefix',
});
*/

const Settings = () => (
  <div className="settings" style={divStyle}>
    <h1>Settings</h1>
    <p>
      Set various settings for your admin panel and editor.
    </p>
    <p>
      Hexo admin can be secured with a password.
      {' '}<Link to="auth-setup">Setup authentification here.</Link>
    </p>
    <hr />

    <h2>Editor Settings</h2>
    <LineNumbers />
    <SpellCheck />
    <hr />

    <h2>Image Pasting Settings</h2>
    <p>
      Hexo-admin allows you to paste images you copy from the web or elsewhere directly
      into the editor. Decide how you&apos;d like to handle the pasted images.
    </p>
    <AskImageFilename />
    <OverwriteImages />
    {/* {ImagePath}
    {ImagePrefix} */}
  </div>
);

export default Settings;
