import React from 'react';
import renderer from 'react-test-renderer';

import SelectionScreen from '../src/ui_elements/Pages/selection_screen';
import MainUpload from '../src/ui_elements/Pages/main_upload';


/*import React from 'react';
import { render } from '@testing-library/react';

import SelectionScreen from '../src/ui_elements/Pages/selection_screen';
import MainUpload from '../src/ui_elements/Pages/main_upload'
import CustomNavBar from './ui_elements/Components/nav_bar';
import AnnotationTable from './ui_elements/Components/change_table';

import {columns} from '../src/static_data/columns'


//========= SelectionScreen =========//

test('Selection Screen - Video Upload', () => {
  const SelectionScreen_test = render(<SelectionScreen/>);
  expect(SelectionScreen_test.getByRole('button', {name: "Video Upload"}));
});

test('Selection Screen - Video Upload', () => {
  const SelectionScreen_test = render(<SelectionScreen/>);
  expect(SelectionScreen_test.getByRole('button', {name: "Multiview"}));
});

//========= CustomNavBar =========//

test('CustomNavBar - Upload', () => {
  const CustomNavBar_test = render(<CustomNavBar/>);
  expect(CustomNavBar_test.getByRole('option', {name: "Upload"}));
});

test('CustomNavBar - Youtube', () => {
  const CustomNavBar_test = render(<CustomNavBar/>);
  expect(CustomNavBar_test.getByRole('option', {name: "Youtube"}));
});

/* test('CustomNavBar - EditSeg', () => {
  const CustomNavBar_test = render(<CustomNavBar/>);
  expect(CustomNavBar_test.getByRole('option', {name: "EditSeg"}));
}); */

//========= CustomNavBar =========//
/*
test('AnnotationTable - EditSeg', () => {
  const AnnotationTable_test = render(<AnnotationTable annotation_data={[]} columns={columns}/>);
  expect(AnnotationTable_test.getByRole('option', {name: "EditSeg"}));
});
*/
