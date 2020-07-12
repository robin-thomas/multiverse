import React, { useContext } from 'react';

import { MDBInput } from 'mdbreact';

import { DataContext } from './DataProvider';

import styles from './TextInput.module.css';

const TextInput = (props) => {
  const ctx = useContext(DataContext);

  if (ctx.editable) {
    return (
      <MDBInput
        type={props.type ? props.type : 'text'}
        value={props.value ? props.value : ''}
        hint={props.hint}
        onChange={(e) => props.onChange(e.target.value)}
        size={props.size ? props.size : 'lg'}
        className={`${
          props.type === 'textarea' ? styles['input-area'] : styles['input']
        }`}
        onBlur={props.updateText}
        rows={3}
      />
    );
  } else {
    return props.value ? props.value : null;
  }
};

export default TextInput;
