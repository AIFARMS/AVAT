/*import React from 'react';
import { render } from '@testing-library/react';

import SelectionScreen from '../src/ui_elements/Pages/selection_screen';
import MainUpload from '../src/ui_elements/Pages/main_upload'
import CustomNavBar from './ui_elements/Components/nav_bar';
import AnnotationTable from './ui_elements/Components/change_table';

import Button from 'react-bootstrap/Button'
import {columns} from '../src/static_data/columns'

import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';


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
