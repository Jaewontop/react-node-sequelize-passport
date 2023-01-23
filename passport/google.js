const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const db = require("../models");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // 구글 로그인에서 발급받은 REST API 키
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback", // 구글 로그인 Redirect URI 경로
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("google profile : ", profile);
      try {
        const hashedPassword = await bcrypt.hash(profile.displayName, 11);
        const exUser = await db.User.findOne({
          // 구글 플랫폼에서 로그인 했고 & snsId필드에 구글 아이디가 일치할경우
          where: { email: profile?.email[0].value, password: hashedPassword },
        });
        // 이미 가입된 구글 프로필이면 성공
        if (exUser) {
          done(null, exUser); // 로그인 인증 완료
        } else {
          // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다

          const newUser = await db.User.create({
            firstName: profile.id,
            lasName: profile.disaplayName,
            email: profile?.email[0].value,
            password: hashedPassword,
          });
          done(null, newUser); // 회원가입하고 로그인 인증 완료
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

module.exports = passport;
