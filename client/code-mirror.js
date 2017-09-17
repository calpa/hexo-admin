
const React = require('react');
const CM = require('codemirror/lib/codemirror');

const PT = React.PropTypes;
const api = require('./api');

const CodeMirror = React.createClass({
  propTypes: {
    onScroll: PT.func,
    forceLineNumbers: PT.bool,
    adminSettings: PT.object,
  },

  componentDidUpdate(prevProps) {
    if (prevProps.initialValue !== this.props.initialValue) {
      this.cm.setValue(this.props.initialValue);
    }
    // on forcing line numbers, set or unset linenumbers if not set in adminSettings
    if (prevProps.forceLineNumbers !== this.props.forceLineNumbers) {
      if (!(this.props.adminSettings.editor || {}).lineNumbers) {
        this.cm.setOption('lineNumbers', this.props.forceLineNumbers);
      }
    }
  },

  componentDidMount() {
    require('codemirror/mode/markdown/markdown');

    const editorSettings = {
      value: this.props.initialValue || '',
      theme: 'default',
      mode: 'markdown',
      lineWrapping: true,
    };
    for (const key in this.props.adminSettings.editor) {
      editorSettings[key] = this.props.adminSettings.editor[key];
    }

    this.cm = CM(this.getDOMNode(), editorSettings);
    this.cm.on('change', (cm) => {
      this.props.onChange(cm.getValue());
    });
    this.cm.on('scroll', (cm) => {
      const node = cm.getScrollerElement();
      const max = node.scrollHeight - node.getBoundingClientRect().height;
      this.props.onScroll(node.scrollTop / max);
    });
    const box = this.getDOMNode().parentNode.getBoundingClientRect();
    this.cm.setSize(box.width, box.height - 32);

    window.addEventListener('resize', this._onResize);

    document.addEventListener('paste', this._onPaste);
  },

  _onResize() {
    const box = this.getDOMNode().parentNode.getBoundingClientRect();
    // need to subtract header to get proper height without flexbox (see #124)
    this.cm.setSize(box.width, box.height - 32);
  },

  componentWillUnmount() {
    document.removeEventListener('paste', this._onPaste);
    document.removeEventListener('resize', this._onResize);
  },

  _onPaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    if (!items.length) return;
    let blob;
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].kind == 'file') {
        blob = items[i].getAsFile();
        break;
      }
    }
    if (!blob) return;

    const settings = this.props.adminSettings;
    const reader = new FileReader();
    reader.onload = (event) => {
      let filename = null;
      if (settings.options) {
        if (settings.options.askImageFilename) {
          const filePath = settings.options.imagePath ? settings.options.imagePath : '/images';
          filename = prompt(`What would you like to name the photo? All files saved as pngs. Name will be relative to ${filePath}.`, 'image.png');
        }
      }
      console.log(filename);
      api.uploadImage(event.target.result, filename).then(res =>
        this.cm.replaceSelection(`\n![${res.msg}](${res.src})`),
      );
    };
    reader.readAsDataURL(blob);
  },

  render() {
    return <div />;
  },
});

module.exports = CodeMirror;
