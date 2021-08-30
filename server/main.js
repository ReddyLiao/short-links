import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";

import "../imports/api/users";
import { Links } from "../imports/api/links";
import "../imports/startup/simple-schema-configuration.js";

Meteor.startup(() => {
  const uri = process.env.MONGO_URL;

  WebApp.connectHandlers.use((req, res, next) => {
    const _id = req.url.slice(1);
    const link = Links.findOne({ _id });
    if (link) {
      res.statusCode = 302;
      res.setHeader("Location", link.url);
      res.end();
      Meteor.call("links.trackVisit", _id);
    } else {
      next();
    }
  });
  // WebApp.connectHandlers.use((req, res, next) => {
  //   console.log("This is from my custom middlewware !");
  //   console.log(req.url, req.method, req.headers, req.query);
  //   next();
  // });
});
