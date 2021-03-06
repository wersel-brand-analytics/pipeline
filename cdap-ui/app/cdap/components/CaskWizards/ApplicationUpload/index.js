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
import React, { Component, PropTypes } from 'react';

import WizardModal from 'components/WizardModal';
import Wizard from 'components/Wizard';
import ApplicationUploadWizardConfig from 'services/WizardConfigs/ApplicationUploadWizardConfig';
import ApplicationUploadStore from 'services/WizardStores/ApplicationUpload/ApplicationUploadStore';
import ApplicationUploadActions from 'services/WizardStores/ApplicationUpload/ApplicationUploadActions';
import {UploadApplication} from 'services/WizardStores/ApplicationUpload/ActionCreator';
import NamespaceStore from 'services/NamespaceStore';
import T from 'i18n-react';
import ee from 'event-emitter';
import globalEvents from 'services/global-events';

export default class ApplicationUploadWizard extends Component {
  constructor(props) {
    super(props);
    this.eventEmitter = ee(ee);
    this.state = {
      showWizard: props.isOpen || false
    };
    this.successInfo = {};
  }
  componentWillUnmount() {
    ApplicationUploadStore.dispatch({
      type: ApplicationUploadActions.onReset
    });
  }
  onSubmit() {
    return UploadApplication().map((res) => {
      this.buildSuccessInfo();
      this.eventEmitter.emit(globalEvents.APPUPLOAD);
      return res;
    });
  }
  toggleWizard(returnResult) {
    if (this.state.showWizard && this.props.onClose) {
      this.props.onClose(returnResult);
    }
    this.setState({
      showWizard: !this.state.showWizard
    });
  }
  buildSuccessInfo() {
    let state = ApplicationUploadStore.getState();
    // TODO: change this when the backend gives back the app name when the jar file is uploaded successfully
    let name = state.uploadFile.file.name.substring(0, state.uploadFile.file.name.indexOf('-'));
    let namespace = NamespaceStore.getState().selectedNamespace;
    let defaultSuccessMessage = T.translate('features.Wizard.ApplicationUpload.success');
    let buttonLabel = T.translate('features.Wizard.ApplicationUpload.callToAction');
    let linkLabel = T.translate('features.Wizard.GoToHomePage');
    this.successInfo.message = `${defaultSuccessMessage} "${name}".`;
    this.successInfo.buttonLabel = buttonLabel;
    this.successInfo.buttonUrl = `/cdap/ns/${namespace}/apps/${name}`;
    this.successInfo.linkLabel = linkLabel;
    this.successInfo.linkUrl = `/cdap/ns/${namespace}`;
  }
  render() {
    let input = this.props.input;
    let headerLabel = input.headerLabel;
    let wizardModalTitle = (headerLabel ? headerLabel : T.translate('features.Resource-Center.Application.modalheadertitle'));
    return (
      <WizardModal
        title={wizardModalTitle}
        isOpen={this.state.showWizard}
        toggle={this.toggleWizard.bind(this, false)}
        className="artifact-upload-wizard"
      >
        <Wizard
          wizardConfig={ApplicationUploadWizardConfig}
          wizardType="ApplicationUpload"
          store={ApplicationUploadStore}
          onSubmit={this.onSubmit.bind(this)}
          successInfo={this.successInfo}
          onClose={this.toggleWizard.bind(this)}/>
      </WizardModal>
    );
  }
}

ApplicationUploadWizard.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  input: PropTypes.any
};
