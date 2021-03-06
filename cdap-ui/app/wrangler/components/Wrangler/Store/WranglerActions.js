/*
 * Copyright © 2016 Cask Data, Inc.
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

const WranglerActions = {
  setData: 'WRANGLER_SET_DATA',
  dropColumn: 'WRANGLER_DROP_COLUMN',
  splitColumn: 'WRANGLER_SPLIT_COLUMN',
  mergeColumn: 'WRANGLER_MERGE_COLUMN',
  renameColumn: 'WRANGLER_RENAME_COLUMN',
  upperCaseColumn: 'WRANGLER_UPPER_CASE_COLUMN',
  lowerCaseColumn: 'WRANGLER_LOWER_CASE_COLUMN',
  titleCaseColumn: 'WRANGLER_TITLE_CASE_COLUMN',
  subStringColumn: 'WRANGLER_SUBSTRING_COLUMN',
  sortColumn: 'WRANGLER_SORT_COLUMN',
  setFilter: 'WRANGLER_SET_FILTER',
  deleteHistory: 'WRANGLER_DELETE_HISTORY',
  undo: 'WRANGLER_UNDO',
  redo: 'WRANGLER_REDO',
  addChart: 'WRANGLER_VISUALIZATION_ADD',
  editChart: 'WRANGLER_VISUALIZATION_EDIT',
  deleteChart: 'WRANGLER_VISUALIZATION_DELETE',
  reset: 'WRANGLER_RESET'
};

export default WranglerActions;
