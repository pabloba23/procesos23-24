const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GoogleOneTapStrategy =
  require("passport-google-one-tap").GoogleOneTapStrategy;

const LocalStrategy = require('passport-local').Strategy;
passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(user, done) {
 done(null, user);
});
passport.use(new GoogleStrategy({
 clientID: "440901487-9qrj7gfd8iqfedce30jml2r3ukh8eees.apps.googleusercontent.com",
 //clientID: "440901487-q172mab1vr7fsu18qbm1up3rogrsgjtr.apps.googleusercontent.com",
 clientSecret: "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",
 //clientSecret : "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",
 callbackURL: "http://localhost:3005/google/callback"
//callbackURL: "https://arquitecturabaseprocesos-6bnn4osd7q-ew.a.run.app/google/callback"
},
 function(accessToken, refreshToken, profile, done) {
 return done(null, profile);
 }
));

passport.use(
    new GoogleOneTapStrategy(
      {
       /*  clientID: "440901487-mcubd2k2don88i6bl8f72kujb4fjlcfc.apps.googleusercontent.com", // your google client ID
        clientSecret: "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", // your google client secret */ /*local*/

        clientID: "440901487-8m6hbgqs4lmk79cs1q1li45d8fnvisj2.apps.googleusercontent.com", // your google client ID
        clientSecret: "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", // your google client secret

        verifyCsrfToken: false, // whether to validate the csrf token or not
      },
      function (profile, done) {
        return done(null, profile);
        // Here your app code, for example:
      /*   User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return done(err, user);
        }); */
      }
    )
  );
