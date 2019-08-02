import * as queryString from 'query-string';
import $ from 'jquery';
require('./index.css');

$(() => {
    console.log(queryString.parse(location.search));
})
