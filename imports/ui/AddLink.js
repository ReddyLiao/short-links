import React from "react";
import Modal from "react-modal";
import { Meteor } from "meteor/meteor";

export default class AddLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      isOpen: false,
      error: "",
    };
  }
  onSubmit(e) {
    const url = this.state.url;
    // const { url } = this.state; 同上

    e.preventDefault();

    Meteor.call("links.insert", url, (err, res) => {
      if (!err) {
        this.handleModalclose();
      } else {
        this.setState({ error: err.reason });
      }
    });
  }
  onChange(e) {
    this.setState({
      url: e.target.value.trim(),
    });
  }
  handleModalclose() {
    this.setState({ isOpen: false, url: "", error: "" });
  }

  render() {
    return (
      <div>
        <button
          className="button"
          onClick={() => this.setState({ isOpen: true })}
        >
          + Add Link
        </button>
        <Modal
          onAfterOpen={() => {
            this.refs.url.focus();
          }}
          isOpen={this.state.isOpen}
          contentLable="Add link"
          onRequestClose={this.handleModalclose.bind(this)}
          className="boxed-view_box"
          overlayClassName="boxed-view boxed-view--modal"
        >
          <p>AddLink</p>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
          <form onSubmit={this.onSubmit.bind(this)} className="boxed-view_form">
            <input
              type="text"
              ref="url"
              placeholder="URL"
              value={this.state.url}
              onChange={this.onChange.bind(this)}
            />
            <button className="button">Add Link</button>
            <button
              type="button"
              className="button button--secondary"
              onClick={this.handleModalclose.bind(this)}
            >
              Cancel
            </button>
          </form>
        </Modal>
      </div>
    );
  }
}
