import React from 'react';
import HamburgerButton from '../../../components/HamburgerButton{{#if sectionNames}}/HamburgerButton{{/if}}';

export default class HamburgerButtonTest extends React.PureComponent {
  render() {
    return (
      <div style=\{{padding: 20}}>
        <HamburgerButton/>
        <br/>
        <br/>
        <HamburgerButton activeState={'back'}/>
      </div>
    );
  }
}
