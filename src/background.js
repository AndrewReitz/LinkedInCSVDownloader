/*
 * Copyright (C) 2013 Andrew Reitz
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'linkedin' },
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

chrome.pageAction.onClicked.addListener(function() {
  var people = document.getElementsByClassName('people');

  var stringBuilder = [];
  var headers = ['FirstName', 'LastName', 'Title', 'Location', 'Industry'];
  stringBuilder.push(headers.join(','));

  for (var i = 0; i < people.length; i++) {
	  var person = people[i];
	  if (!person.getElementsByClassName('title')[0]) {
	    continue;
	  }
	  var name = person.getElementsByClassName('title')[0].innerText;
	  var firstName = name.split(' ')[0];
	  var lastName = name.split(' ')[1];
	  var title = person.getElementsByClassName('description')[0].textContent;
	  var demographic = person.getElementsByClassName('demographic')[0].children;
	  var location_ = demographic[1].innerText;
	  var industry = demographic[3].innerText;

	  var buildRow = [
	  '"' + firstName + '"',
	  '"' + lastName + '"',
	  '"' + title + '"',
	  '"' + location_ + '"',
	  '"' + industry + '"'];
	  stringBuilder.push(buildRow.join(','));
  }

  var myBlob = new Blob([stringBuilder.join('\n')], {"type": "text\/plain"});
  var myLink = document.createElement('a');
  document.body.appendChild(myLink);
  myLink.href = window.URL.createObjectURL(myBlob);
  myLink.download = "linkedinData.csv";
  myLink.click();
})
