import React from 'react';

import Editor from 'react-froala-wysiwyg';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

const TextEditor = ({ input, setInput }) => (
  <Editor
    tag="textarea"
    model={input}
    onModelChange={setInput}
    config={{
      toolbarButtons: ['bold', 'italic', 'underline', 'undo', 'redo'],
    }}
  />
);

export default TextEditor;
