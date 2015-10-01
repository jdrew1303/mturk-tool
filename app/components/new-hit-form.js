import React from 'react';
import MTurk from '../services/mturk';
import fs from 'fs';

import sampleQuestions from '../resources/sample-questions';
let sampleTemplate = fs.readFileSync(__dirname + '/../resources/sample-template.html');

export default class NewHITForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hitTemplate: sampleTemplate,
      hitId: null,
      isCreatingHIT: false
    };
  }
  onSubmit() {
    this.setState({
      isCreatingHIT: true
    });

    MTurk.createHIT(this.state.hitTemplate, sampleQuestions).then(doc => {
      let hitId = doc.querySelector('HITId').textContent;
      this.setState({
        hitId: hitId,
        isCreatingHIT: false
      });
      this.props.onHITCreate(hitId);
    });
  }
  hitTemplateChange(e) {
    this.setState({
      hitTemplate: e.target.value
    });
  }
  render() {
    let url = `https://workersandbox.mturkcontent.com/dynamic/hit?assignmentId=ASSIGNMENT_ID_NOT_AVAILABLE&hitId=${this.state.hitId}`;
    return (
      <div id="new-hit-form">
        <h2>Create New HIT</h2>
        <div className="form-section">
          <label>New HIT Template</label>
          <textarea id="new-hit-template" onChange={this.hitTemplateChange.bind(this)} defaultValue={this.state.hitTemplate}></textarea>
        </div>
        <div className="form-section">
          <label></label>
          <input type="submit" value="Create New HIT" onClick={this.onSubmit.bind(this)}
            disabled={this.state.isCreatingHIT || this.state.isWaitingForHIT} />
        </div>
        { this.state.hitId && <p><a href={url}>{url}</a></p> }
      </div>
    );
  }
}
