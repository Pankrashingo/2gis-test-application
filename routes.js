'use strict';

// This file contains definitions of rules how location URLs are translated
// to parameters for stores in Catberry application.
//
// Format:
// /some/:parameter[store1,store2,store3]
//
// More details here:
// https://github.com/catberry/catberry/blob/master/docs/index.md#routing

module.exports = [
	'/:page[Pages]',
	'/:page[Pages]?what=:what[search/Firm]&where=:where[search/Firm]&page=:page[search/Firm]&rubric=:rubric[search/Firm]&q=:query[search/Geo]&rubrics=:rubrics[search/Firm]&id=:id[Profile]&hash=:hash[Profile]&firm_id=:firm_id[Filials]'
];
