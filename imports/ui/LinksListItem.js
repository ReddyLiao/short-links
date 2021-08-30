import React from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import Clipboard from "clipboard";
import moment from "moment";

export default class LinksListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      justCpoied: false,
    };
  }
  componentDidMount() {
    this.clipboard = new Clipboard(this.refs.copy);
    this.clipboard
      .on("success", () => {
        this.setState({ justCpoied: true });
        setTimeout(() => {
          this.setState({ justCpoied: false });
        }, 2000);
      })
      .on("error", () => {
        alert("Unable to copy .Please manually copy the link.");
      });
  }
  componentWillUnmount() {
    this.clipboard.destroy();
  }
  renderState() {
    const visitMessage = this.props.visitedCount === 1 ? "visit" : "visits";
    let visitedMessage = null;
    if (typeof this.props.lastVisitedAt === "number") {
      visitedMessage = `(visited ${moment(
        this.props.lastVisitedAt
      ).fromNow()})`;
    }
    return (
      <p className="item_message">
        {this.props.visitedCount} {visitMessage}
        {visitedMessage}
      </p>
    );
  }
  render() {
    return (
      <div className="item">
        <h2>{this.props.url}</h2>
        <p className="item_message">{this.props.shortUrl}</p>
        {/* <p>{this.props.visible.toString()}</p> */}
        <p>{this.renderState()}</p>
        <a
          className="button button--pill button--link"
          href={this.props.shortUrl}
          target="_blank"
        >
          Visit
        </a>
        <button
          className="button button--pill"
          ref="copy"
          data-clipboard-text={this.props.shortUrl}
        >
          {this.state.justCpoied ? "Copied" : "Copy"}
        </button>
        <button
          className="button button--pill"
          onClick={() =>
            Meteor.call(
              "links.setVisibility",
              this.props._id,
              !this.props.visible
            )
          }
        >
          {this.state.visible ? "Hide" : "Unhide"}
        </button>
      </div>
    );
  }
}
LinksListItem.propTypes = {
  _id: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  shortUrl: PropTypes.string.isRequired,
  visitedCount: PropTypes.number.isRequired,
  lastVisitedAt: PropTypes.number,
};
