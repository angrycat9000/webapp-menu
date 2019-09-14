import NestedMenu from './NestedMenu'


/*
    TreeList is deprecated used NestedMenu instead.  This is provided for 
    backwards compatibility with version 2.0

    Remove this class when bumping to version 3.0
*/
export default class TreeList extends NestedMenu {}

Object.defineProperty(TreeList, 'tagName', {value: 'wam-treelist'});