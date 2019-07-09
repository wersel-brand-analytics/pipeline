/*
 * Copyright © 2019 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

const request = require('request');

function getGETRequestOptions() {
  return {
    method: 'GET',
    json: true
  }
}

function requestPromiseWrapper(options) {
  return new Promise((resolve, reject) => {
    request(options, (err, response, body) => {
      if (err) {
        return reject(err);
      }

      return resolve(body);
    });
  });
};


function getProgramType(parentType, artifactName) {
  if (parentType === 'Mapreduce') {
    return 'mapreduce';
  }

  if (artifactName === 'cdap-data-pipeline') {
    return 'workflows';
  }

  if (artifactName === 'cdap-data-streamts') {
    return 'spark';
  }

  return undefined;
}

module.exports = {
  getGETRequestOptions,
  requestPromiseWrapper,
  getProgramType
};
