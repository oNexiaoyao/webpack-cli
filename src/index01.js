import * as queryString from 'query-string';
import $ from 'jquery';
require('./index01.css');

$(() => {
    console.log(queryString.parse(location.search));
})
